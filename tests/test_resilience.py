"""
Jan-EPF AI: Substitute Employee Resilience & Circuit Breaker Test Suite (Agent 7).
"""
from src.core.resilience import (
    ComponentResilienceOrchestrator,
    SubsystemType,
    resilience_orchestrator
)


def test_resilience_matrix_initial_state():
    matrix = resilience_orchestrator.get_status_matrix()
    assert SubsystemType.VOICE_INGEST.value in matrix
    assert SubsystemType.CHEQUE_OCR.value in matrix
    assert SubsystemType.DATABASE.value in matrix
    assert SubsystemType.QUEUE_WORKER.value in matrix

    for k, v in matrix.items():
        assert v["healthy"] is True
        assert v["circuit_state"] == "CLOSED"


def test_circuit_breaker_trip_and_recovery():
    orch = ComponentResilienceOrchestrator()

    # Subsystem initially healthy
    assert not orch.is_substitute_active(SubsystemType.CHEQUE_OCR)

    # Trigger 3 failures to trip circuit
    orch.record_failure(SubsystemType.CHEQUE_OCR)
    orch.record_failure(SubsystemType.CHEQUE_OCR)
    orch.record_failure(SubsystemType.CHEQUE_OCR)

    # Now substitute should be active
    assert orch.is_substitute_active(SubsystemType.CHEQUE_OCR)

    # Record success to recover
    orch.record_success(SubsystemType.CHEQUE_OCR)
    assert not orch.is_substitute_active(SubsystemType.CHEQUE_OCR)
