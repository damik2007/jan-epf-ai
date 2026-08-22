"""
Jan-EPF AI: Exhaustive Substitute Employee Fault-Tolerant Resilience Test Suite (Agent 1, Agent 5 & Agent 7).
Tests all 6 subsystem pillars, circuit breaker state machine (CLOSED -> OPEN -> HALF_OPEN -> CLOSED),
hot substitution triggers, cooldown expiration, and SRE status matrix diagnostics.
"""
import time
import pytest
from src.core.resilience import (
    ComponentResilienceOrchestrator,
    FallbackMode,
    SubsystemType,
    resilience_orchestrator,
)


# ==============================================================================
# 1. SUBSYSTEM ENUM & MATRIX INTEGRITY
# ==============================================================================
def test_subsystem_types_and_fallback_modes():
    assert SubsystemType.VOICE_INGEST.value == "VOICE_INGEST"
    assert SubsystemType.CHEQUE_OCR.value == "CHEQUE_OCR"
    assert SubsystemType.DATABASE.value == "DATABASE"
    assert SubsystemType.QUEUE_WORKER.value == "QUEUE_WORKER"
    assert SubsystemType.NAME_MATCHING.value == "NAME_MATCHING"
    assert SubsystemType.CACHE_STORE.value == "CACHE_STORE"
    assert len(SubsystemType) == 6

    assert FallbackMode.PRIMARY.value == "PRIMARY"
    assert FallbackMode.HOT_SUBSTITUTE.value == "HOT_SUBSTITUTE"
    assert FallbackMode.SOVEREIGN_OFFLINE.value == "SOVEREIGN_OFFLINE"


def test_substitution_matrix_structure():
    matrix = ComponentResilienceOrchestrator.SUBSTITUTION_MATRIX
    for sub in SubsystemType:
        assert sub in matrix
        entry = matrix[sub]
        assert "primary" in entry
        assert "substitute" in entry
        assert "fallback_trigger" in entry
        assert len(entry["primary"]) > 0
        assert len(entry["substitute"]) > 0


# ==============================================================================
# 2. CIRCUIT BREAKER STATE MACHINE & TRANSITIONS
# ==============================================================================
def test_circuit_breaker_initial_healthy_state():
    orch = ComponentResilienceOrchestrator()
    status_matrix = orch.get_status_matrix()

    for sub in SubsystemType:
        sub_key = sub.value
        assert sub_key in status_matrix
        item = status_matrix[sub_key]
        assert item["healthy"] is True
        assert item["circuit_state"] == "CLOSED"
        assert item["failures"] == 0
        assert item["active_engine"] == item["primary_engine"]
        assert not orch.is_substitute_active(sub)


def test_circuit_breaker_trip_on_max_failures():
    orch = ComponentResilienceOrchestrator()

    # Subsystem initially healthy
    assert not orch.is_substitute_active(SubsystemType.CHEQUE_OCR)

    # 1st failure: Still CLOSED
    orch.record_failure(SubsystemType.CHEQUE_OCR)
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["failures"] == 1
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["state"] == "CLOSED"
    assert not orch.is_substitute_active(SubsystemType.CHEQUE_OCR)

    # 2nd failure: Still CLOSED
    orch.record_failure(SubsystemType.CHEQUE_OCR)
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["failures"] == 2
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["state"] == "CLOSED"
    assert not orch.is_substitute_active(SubsystemType.CHEQUE_OCR)

    # 3rd failure: Trips to OPEN
    orch.record_failure(SubsystemType.CHEQUE_OCR)
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["failures"] == 3
    assert orch.circuit_breakers[SubsystemType.CHEQUE_OCR.value]["state"] == "OPEN"
    assert orch.is_substitute_active(SubsystemType.CHEQUE_OCR) is True

    # Status matrix reflects OPEN state
    status = orch.get_status_matrix()[SubsystemType.CHEQUE_OCR.value]
    assert status["healthy"] is False
    assert status["circuit_state"] == "OPEN"
    assert status["active_engine"] == status["hot_substitute"]


def test_circuit_breaker_recovery_on_success():
    orch = ComponentResilienceOrchestrator()

    # Trip circuit for VOICE_INGEST
    for _ in range(3):
        orch.record_failure(SubsystemType.VOICE_INGEST)
    assert orch.is_substitute_active(SubsystemType.VOICE_INGEST) is True

    # Record success -> Restores CLOSED state immediately
    orch.record_success(SubsystemType.VOICE_INGEST)
    assert orch.circuit_breakers[SubsystemType.VOICE_INGEST.value]["failures"] == 0
    assert orch.circuit_breakers[SubsystemType.VOICE_INGEST.value]["state"] == "CLOSED"
    assert not orch.is_substitute_active(SubsystemType.VOICE_INGEST)

    status = orch.get_status_matrix()[SubsystemType.VOICE_INGEST.value]
    assert status["healthy"] is True
    assert status["circuit_state"] == "CLOSED"
    assert status["active_engine"] == status["primary_engine"]


def test_circuit_breaker_half_open_transition_on_cooldown():
    orch = ComponentResilienceOrchestrator()

    # Trip circuit for DATABASE
    for _ in range(3):
        orch.record_failure(SubsystemType.DATABASE)
    assert orch.circuit_breakers[SubsystemType.DATABASE.value]["state"] == "OPEN"

    # Artificially expire the cooldown timer
    orch.circuit_breakers[SubsystemType.DATABASE.value]["last_state_change"] = time.time() - 35

    # is_substitute_active should now transition state to HALF_OPEN and return False
    active = orch.is_substitute_active(SubsystemType.DATABASE)
    assert active is False
    assert orch.circuit_breakers[SubsystemType.DATABASE.value]["state"] == "HALF_OPEN"


def test_all_subsystems_independent_isolation():
    orch = ComponentResilienceOrchestrator()

    # Trip QUEUE_WORKER only
    for _ in range(3):
        orch.record_failure(SubsystemType.QUEUE_WORKER)

    # Verify only QUEUE_WORKER is tripped
    assert orch.is_substitute_active(SubsystemType.QUEUE_WORKER) is True
    assert orch.is_substitute_active(SubsystemType.VOICE_INGEST) is False
    assert orch.is_substitute_active(SubsystemType.CHEQUE_OCR) is False
    assert orch.is_substitute_active(SubsystemType.DATABASE) is False
    assert orch.is_substitute_active(SubsystemType.NAME_MATCHING) is False
    assert orch.is_substitute_active(SubsystemType.CACHE_STORE) is False


def test_global_resilience_orchestrator_instance():
    assert isinstance(resilience_orchestrator, ComponentResilienceOrchestrator)
    matrix = resilience_orchestrator.get_status_matrix()
    assert len(matrix) == 6
