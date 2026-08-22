"""
Jan-EPF AI: Visual Passbook & Compounding Growth Forecaster Route (Agent 2).
"""
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from src.core.data_store import mock_store
from src.core.engine import calculate_passbook_growth_forecast

router = APIRouter(prefix="/passbook", tags=["Passbook"])


class ForecastRequest(BaseModel):
    current_age: int = Field(default=35, ge=18, le=58)
    monthly_employee_contrib: float = Field(default=2500.0, ge=0)
    monthly_employer_contrib: float = Field(default=2500.0, ge=0)
    retirement_age: int = Field(default=58, ge=50, le=65)
    interest_rate: float = Field(default=8.25, ge=5.0, le=12.0)


@router.get("/{uan}")
async def get_passbook(uan: str):
    citizen = mock_store.get_citizen(uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {uan} not found."
        )

    summary = citizen.get("passbook_summary", {})
    insurance = citizen.get("insurance_details", {"edli_coverage_amount": 700000.0, "status": "ACTIVE_COVERED"})

    return {
        "uan": uan,
        "full_name": citizen["full_name"],
        "passbook_summary": summary,
        "triple_split": {
            "employee_share_12_percent": summary.get("employee_share", 0.0),
            "employer_share_3_67_percent": summary.get("employer_share", 0.0),
            "pension_fund_share_8_33_percent": summary.get("pension_fund_share", 0.0)
        },
        "insurance_card": insurance
    }


@router.post("/{uan}/forecast", response_model=List[Dict[str, Any]])
async def forecast_passbook_growth(uan: str, req: ForecastRequest):
    citizen = mock_store.get_citizen(uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {uan} not found."
        )

    current_balance = citizen.get("passbook_summary", {}).get("total_balance", 0.0)

    forecast_curve = calculate_passbook_growth_forecast(
        current_balance=current_balance,
        monthly_employee_contrib=req.monthly_employee_contrib,
        monthly_employer_contrib=req.monthly_employer_contrib,
        current_age=req.current_age,
        retirement_age=req.retirement_age,
        annual_interest_rate=req.interest_rate
    )

    return forecast_curve
