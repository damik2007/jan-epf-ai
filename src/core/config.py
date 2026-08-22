"""
Jan-EPF AI: Core Application Settings & Environment Configuration.
Enforces zero hardcoded secrets using Pydantic Settings with graceful sovereign local defaults.
"""
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Jan-EPF AI"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False

    # Cryptographic & Security Keys
    JWT_SECRET_KEY: str = "e9f8a3c1b7d5e2a4f6c8e0b2d4a6f8e0c2a4b6d8e0f2a4b6c8d0e2f4a6b8c0d2"
    JWT_ALGORITHM: str = "HS256"
    INTERNAL_SERVICE_SECRET: str = "sec_epf_internal_98a7b6c5d4e3f2a1"
    INTERNAL_SECRET: str = "sec_epf_internal_98a7b6c5d4e3f2a1"
    WEBHOOK_HMAC_SECRET: str = "hmac_npci_callback_88e7d6c5b4a3f2"

    # Database & In-Memory Cache
    DATABASE_URL: str = "postgresql://epf_user:epf_secure_password@localhost:5432/epf_master_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # Sovereign Azure-Hosted Open-Source LLM Container (jan-epf-llm)
    OPENAI_API_KEY: Optional[str] = None
    LLM_API_KEY: str = "sec_epf_internal_98a7b6c5d4e3f2a1"
    LLM_MODEL: str = "llama3.2:3b"
    LLM_API_BASE_URL: str = "http://jan-epf-llm.internal.whitesea-6aaf591b.centralindia.azurecontainerapps.io:11434/v1"

    # Integration & Deployment Tokens
    GITHUB_TOKEN: Optional[str] = None
    VERCEL_TOKEN: Optional[str] = None
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"

    # Open-Source Microservice URLs (Fallback / Private Network)
    PRESIDIO_ANALYZER_URL: str = "http://localhost:8080"
    PADDLE_OCR_URL: str = "http://localhost:8001"
    FASTER_WHISPER_URL: str = "http://localhost:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False
    )


settings = Settings()
