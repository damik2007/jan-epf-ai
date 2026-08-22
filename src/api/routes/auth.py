"""
Jan-EPF AI: Stateless Authentication & Magic Link / OTP Route (Agent 2).
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from src.core.data_store import mock_store
from src.core.security import SecurityTokenManager, PresidioPIISanitizer

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    uan: str = Field(..., pattern=r"^\d{12}$", description="12-digit UAN")
    otp: Optional[str] = "123456"  # Mock OTP for test ease


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    uan: str
    full_name: str
    masked_phone: str


@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    citizen = mock_store.get_citizen(req.uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"UAN {req.uan} not found in EPFO national database."
        )

    # Issue JWT token
    token_data = {
        "sub": req.uan,
        "name": citizen["full_name"],
        "phone": citizen["phone"]
    }
    access_token = SecurityTokenManager.create_access_token(token_data)

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        uan=citizen["uan"],
        full_name=citizen["full_name"],
        masked_phone=PresidioPIISanitizer.mask_phone(citizen["phone"])
    )


@router.get("/verify-token")
async def verify_token(token: str):
    try:
        payload = SecurityTokenManager.verify_access_token(token)
        return {"valid": True, "payload": payload}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
