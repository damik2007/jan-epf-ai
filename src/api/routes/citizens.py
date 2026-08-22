"""
Jan-EPF AI: Citizen Profile & Persona Switcher Route (Agent 2).
"""
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, status
from src.core.data_store import mock_store
from src.core.engine import calculate_form_31_eligibility
from src.core.security import PresidioPIISanitizer

router = APIRouter(prefix="/citizens", tags=["Citizens"])


@router.get("/", response_model=List[Dict[str, Any]])
async def list_citizens():
    """
    Returns all 4 pre-seeded mock personas for high-fidelity interactive switching.
    """
    citizens = mock_store.get_all_citizens()
    return [PresidioPIISanitizer.sanitize_dict(c) for c in citizens]


@router.get("/{uan}")
async def get_citizen(uan: str):
    citizen = mock_store.get_citizen(uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {uan} not found."
        )
    return PresidioPIISanitizer.sanitize_dict(citizen)


@router.get("/{uan}/eligibility")
async def get_citizen_eligibility(uan: str):
    citizen = mock_store.get_citizen(uan)
    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Citizen with UAN {uan} not found."
        )

    passbook = citizen.get("passbook_summary", {})
    emp_share = passbook.get("employee_share", 0.0)
    empr_share = passbook.get("employer_share", 0.0)
    wage = passbook.get("monthly_wage", 0.0)

    service_years = 0.0
    if citizen.get("active_employment"):
        service_years = citizen["active_employment"].get("total_service_years", 0.0)

    medical_calc = calculate_form_31_eligibility(emp_share, empr_share, wage, service_years, "MEDICAL")
    housing_calc = calculate_form_31_eligibility(emp_share, empr_share, wage, service_years, "HOUSING")
    marriage_calc = calculate_form_31_eligibility(emp_share, empr_share, wage, service_years, "MARRIAGE")

    return {
        "uan": uan,
        "full_name": citizen["full_name"],
        "medical_advance": medical_calc,
        "housing_advance": housing_calc,
        "marriage_advance": marriage_calc,
        "total_pf_balance": passbook.get("total_balance", 0.0)
    }
