"""
Jan-EPF AI: SRE Observability & Prometheus Telemetry Watchdog (Agent 5).
Tracks golden signals (latency, traffic, errors, saturation), circuit breakers, and structured JSON logs.
"""
import json
import logging
import sys
from typing import Any, Dict
from prometheus_client import Counter, Histogram, generate_latest
from src.core.security import PresidioPIISanitizer

# Prometheus Metrics Definitions
REQUEST_LATENCY_HISTOGRAM = Histogram(
    "jan_epf_http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint", "status_code"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)

CLAIMS_TOTAL_COUNTER = Counter(
    "jan_epf_claims_total",
    "Total number of EPFO claims processed",
    ["claim_type", "status"]
)

CIRCUIT_BREAKER_TRIPS = Counter(
    "jan_epf_resilience_circuit_trips_total",
    "Total number of times a subsystem switched to hot substitute",
    ["subsystem"]
)

PII_REDACTION_COUNTER = Counter(
    "jan_epf_pii_redacted_entities_total",
    "Total number of PII entities scrubbed before persistence or logging",
    ["entity_type"]
)


class StructuredJSONFormatter(logging.Formatter):
    """
    Format logs as JSON with automatic PII sanitization and SRE trace headers.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": PresidioPIISanitizer.sanitize_text(record.getMessage()),
            "module": record.module,
            "line": record.lineno
        }
        if hasattr(record, "trace_id"):
            log_entry["trace_id"] = record.trace_id
        if hasattr(record, "uan"):
            log_entry["uan"] = PresidioPIISanitizer.mask_aadhaar(str(record.uan))
        return json.dumps(log_entry)


def setup_telemetry_logger(name: str = "jan_epf_sre") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredJSONFormatter())
        logger.addHandler(handler)
    return logger


sre_logger = setup_telemetry_logger()


def get_prometheus_metrics_payload() -> bytes:
    """
    Renders Prometheus /metrics endpoint content.
    """
    return generate_latest()
