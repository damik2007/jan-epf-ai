"""
Jan-EPF AI: Main FastAPI Application Entrypoint.
Orchestrates microservice routes, Prometheus telemetry, CORS, and health probes.
"""
import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.core.telemetry import (
    sre_logger,
    get_prometheus_metrics_payload,
    REQUEST_LATENCY_HISTOGRAM
)
from src.api.routes import (
    auth,
    citizens,
    claims,
    grievances,
    joint_declaration,
    kyc,
    ocr,
    passbook,
    voice
)

app = FastAPI(
    title=settings.APP_NAME,
    description="Sovereign Public Digital Infrastructure for EPFO Modernization",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restricted via Vercel/Reverse-Proxy in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def prometheus_telemetry_middleware(request: Request, call_next):
    """
    Tracks Golden Signal metrics: HTTP request duration, status codes, and latency histograms.
    """
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    endpoint = request.url.path
    method = request.method
    status_code = str(response.status_code)
    
    REQUEST_LATENCY_HISTOGRAM.labels(
        method=method,
        endpoint=endpoint,
        status_code=status_code
    ).observe(duration)
    
    sre_logger.info(
        f"{method} {endpoint} completed in {duration * 1000:.2f}ms with status {status_code}"
    )
    return response


# Include API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(citizens.router, prefix="/api/v1")
app.include_router(claims.router, prefix="/api/v1")
app.include_router(grievances.router, prefix="/api/v1")
app.include_router(joint_declaration.router, prefix="/api/v1")
app.include_router(kyc.router, prefix="/api/v1")
app.include_router(ocr.router, prefix="/api/v1")
app.include_router(passbook.router, prefix="/api/v1")
app.include_router(voice.router, prefix="/api/v1")


@app.get("/health", tags=["System"])
@app.get("/api/v1/health", tags=["System"])
async def health_check():
    """
    Liveness and readiness probe for Docker / Kubernetes / Azure Container Apps.
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


@app.get("/metrics", tags=["System"])
async def prometheus_metrics():
    """
    Exposes Prometheus SRE Telemetry metrics.
    """
    return Response(
        content=get_prometheus_metrics_payload(),
        media_type="text/plain; version=0.0.4; charset=utf-8"
    )


@app.get("/", tags=["System"])
async def root():
    """
    Root API health and welcome index.
    """
    return {
        "message": "Welcome to Jan-EPF AI - Sovereign Digital Provident Fund Platform",
        "docs": "/docs",
        "health": "/health",
        "metrics": "/metrics"
    }
