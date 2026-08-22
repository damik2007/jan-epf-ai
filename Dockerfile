# ==============================================================================
# Jan-EPF AI: Production Multi-Stage Dockerfile
# Target: Sovereign Microservice API Gateway & Business Engine
# Hardened: Non-root user (appuser), minimal attack surface, multi-stage cache
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: Builder & Dependency Compiler
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS builder

# Prevent python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# Install build dependencies for C-extensions and cryptography packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment to isolate installed dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python requirements
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install -r requirements.txt

# ------------------------------------------------------------------------------
# STAGE 2: Distroless / Slim Production Runtime
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner

# Labels & OCI Metadata
LABEL org.opencontainers.image.title="Jan-EPF AI API Service" \
      org.opencontainers.image.description="Sovereign Digital Infrastructure for EPFO Modernization" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Jan-EPF AI Squad" \
      org.opencontainers.image.source="https://github.com/damik2007/jan-epf-ai"

# Runtime Environment Variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    PORT=8000 \
    APP_HOME="/app" \
    PYTHONPATH="/app"

WORKDIR /app

# Install minimal runtime libraries (libpq for PostgreSQL, curl for health probes)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create dedicated non-root user and group for security compliance
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

# Copy virtual environment from builder stage
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy application source code and data assets
COPY --chown=appuser:appgroup src/ /app/src/
COPY --chown=appuser:appgroup data/ /app/data/

# Verify permissions
RUN chmod -R 755 /app

# Switch to non-root execution context
USER appuser:appgroup

# Expose internal API port
EXPOSE 8000

# Container Healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production Entrypoint using Uvicorn ASGI Server
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]
