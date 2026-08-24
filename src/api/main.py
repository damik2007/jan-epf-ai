"""
Jan-EPF AI: Main FastAPI Gateway Application (Agent 2 & Agent 5).
Stateless, sovereign API gateway for 70 million Indian citizens.
"""
import time
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.core.resilience import resilience_orchestrator
from src.core.telemetry import (
    REQUEST_LATENCY_HISTOGRAM,
    get_prometheus_metrics_payload,
    sre_logger
)

# Route Imports
from src.api.routes.auth import router as auth_router
from src.api.routes.citizens import router as citizens_router
from src.api.routes.claims import router as claims_router
from src.api.routes.passbook import router as passbook_router
from src.api.routes.kyc import router as kyc_router
from src.api.routes.ocr import router as ocr_router
from src.api.routes.joint_declaration import router as jd_router
from src.api.routes.grievances import router as grievances_router
from src.api.routes.voice import router as voice_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Rebuilding India's Provident Fund (EPFO) Digital Public Infrastructure for 70 Million Citizens",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production safe with stateless JWT headers
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_and_telemetry_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    # Record Prometheus metrics
    endpoint = request.url.path
    REQUEST_LATENCY_HISTOGRAM.labels(
        method=request.method,
        endpoint=endpoint,
        status_code=str(response.status_code)
    ).observe(duration)

    # Sovereign DPI Security Headers (OWASP & DPDP Act 2023 Compliance)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    return response


# Include Subsystem Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(citizens_router, prefix="/api/v1")
app.include_router(claims_router, prefix="/api/v1")
app.include_router(passbook_router, prefix="/api/v1")
app.include_router(kyc_router, prefix="/api/v1")
app.include_router(ocr_router, prefix="/api/v1")
app.include_router(jd_router, prefix="/api/v1")
app.include_router(grievances_router, prefix="/api/v1")
app.include_router(voice_router, prefix="/api/v1")


@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["System"])
async def health_check():
    """
    Returns system status, sovereign mode state, and resilience matrix.
    """
    return {
        "status": "HEALTHY",
        "app_name": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "sovereign_mode": settings.OPENAI_API_KEY is None or settings.OPENAI_API_KEY == "",
        "resilience_matrix": resilience_orchestrator.get_status_matrix()
    }


@app.get("/metrics", tags=["SRE & Observability"])
async def prometheus_metrics():
    """
    Prometheus scraping endpoint for SRE observability dashboards.
    """
    return Response(
        content=get_prometheus_metrics_payload(),
        media_type="text/plain"
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
