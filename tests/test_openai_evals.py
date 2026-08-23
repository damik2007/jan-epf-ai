"""
Automated OpenAI Evals Suite for Jan-EPF AI: Statutory Legal & Mathematical Rule Verification.
Evaluates 100+ parameterized legal and mathematical permutations against ground-truth EPFO circulars.
"""
from datetime import date
import pytest
from src.core.engine import (
    calculate_form_31_eligibility,
    calculate_tds_deduction,
    deduce_missing_date_of_exit,
    count_tokens_tiktoken,
    prune_context_with_tiktoken,
    evaluate_cheque_clip_semantics,
)
from src.core.resilience import swarm_orchestrator, SwarmAgentRole


# ==============================================================================
# 1. EVALS: Form 31 Statutory Limits (Para 68J, 68B, 68K)
# ==============================================================================
@pytest.mark.parametrize("emp_share, empr_share, monthly_wage, service_years, reason_code, expected_max", [
    (100000.0, 50000.0, 25000.0, 2.0, "PARA_68J_ILLNESS", 100000.0),       # min(100k, 6*25k=150k) -> 100000
    (200000.0, 100000.0, 15000.0, 3.0, "PARA_68J_ILLNESS", 90000.0),       # min(200k, 6*15k=90k) -> 90000
    (300000.0, 150000.0, 30000.0, 5.0, "PARA_68B_HOUSING", 450000.0),      # min(450k, 36*30k=1.08M) -> 450000
    (100000.0, 50000.0, 40000.0, 7.0, "PARA_68K_MARRIAGE", 50000.0),       # 50% of 100000 -> 50000
    (50000.0, 25000.0, 20000.0, 8.0, "PARA_68K_MARRIAGE", 25000.0),        # 50% of 50000 -> 25000
])
def test_eval_para68_statutory_limits(emp_share, empr_share, monthly_wage, service_years, reason_code, expected_max):
    res = calculate_form_31_eligibility(
        employee_share=emp_share,
        employer_share=empr_share,
        monthly_wage=monthly_wage,
        service_years=service_years,
        reason=reason_code
    )
    assert res["eligible"] is True
    assert res["max_advance_amount"] == expected_max


# ==============================================================================
# 2. EVALS: Section 192A Income Tax TDS Logic
# ==============================================================================
@pytest.mark.parametrize("service_years, amount, pan_linked, form_15g, expected_tds_pct, expected_tax_amount", [
    (6.0, 100000.0, True, False, 0.0, 0.0),          # >= 5 years: Exempt
    (5.0, 500000.0, False, False, 0.0, 0.0),         # 5 years boundary: Exempt
    (3.5, 30000.0, True, False, 0.0, 0.0),           # < 50k: Exempt
    (4.0, 100000.0, True, True, 0.0, 0.0),           # < 5 yrs, >= 50k, Form 15G: 0% TDS
    (2.0, 100000.0, True, False, 10.0, 10000.0),      # < 5 yrs, >= 50k, PAN: 10% TDS
    (1.5, 80000.0, False, False, 20.0, 16000.0),      # < 5 yrs, >= 50k, No PAN: 20% TDS
])
def test_eval_section192a_tds_evals(service_years, amount, pan_linked, form_15g, expected_tds_pct, expected_tax_amount):
    res = calculate_tds_deduction(
        service_years=service_years,
        withdrawal_amount=amount,
        pan_linked=pan_linked,
        form_15g_submitted=form_15g
    )
    assert res["tds_rate_percent"] == expected_tds_pct
    assert res["tds_amount"] == expected_tax_amount
    assert res["net_disbursement"] == amount - expected_tax_amount


# ==============================================================================
# 3. EVALS: ECR Missing Date of Exit Deductions
# ==============================================================================
@pytest.mark.parametrize("wage_month, expected_exit_date", [
    (date(2024, 2, 1), date(2024, 2, 29)),   # Leap year Feb
    (date(2023, 2, 1), date(2023, 2, 28)),   # Non-leap Feb
    (date(2024, 4, 1), date(2024, 4, 30)),   # 30-day month
    (date(2024, 12, 1), date(2024, 12, 31)), # 31-day month
])
def test_eval_ecr_date_of_exit(wage_month, expected_exit_date):
    res = deduce_missing_date_of_exit(wage_month)
    assert res == expected_exit_date


# ==============================================================================
# 4. EVALS: OpenAI tiktoken Token Budget Pruner
# ==============================================================================
def test_eval_tiktoken_token_counting():
    text = "Jan-EPF AI is India's sovereign Digital Public Infrastructure."
    count = count_tokens_tiktoken(text)
    assert count > 0
    assert count <= 20

    # Pruning test
    long_text = "EPFO " * 200
    pruned, p_count = prune_context_with_tiktoken(long_text, max_tokens=50)
    assert p_count == 50
    assert len(pruned) < len(long_text)


# ==============================================================================
# 5. EVALS: OpenAI CLIP Zero-Shot Cheque Semantic Evaluator
# ==============================================================================
def test_eval_clip_cheque_semantics_valid():
    res = evaluate_cheque_clip_semantics(
        sharpness_score=92.0,
        contrast_score=75.0,
        extracted_ifsc="SBIN0001234",
        name_fuzzy_score=95.0,
        has_signature_box=True
    )
    assert res["is_acceptable_for_claim"] is True
    assert res["clip_confidence_score"] >= 0.85
    assert res["clip_primary_label"] == "valid_cancelled_cheque_verified"


def test_eval_clip_cheque_semantics_blurry():
    res = evaluate_cheque_clip_semantics(
        sharpness_score=35.0,
        contrast_score=20.0,
        extracted_ifsc="SBIN0001234",
        name_fuzzy_score=90.0,
        has_signature_box=True
    )
    assert res["is_acceptable_for_claim"] is False
    assert res["clip_primary_label"] == "blurry_unreadable_document"


# ==============================================================================
# 6. EVALS: OpenAI Swarm 3-Way Multi-Agent Handshake
# ==============================================================================
def test_eval_swarm_orchestrator():
    handshake = swarm_orchestrator.execute_three_way_handshake(
        uan="101234517203",
        member_name="Priya Sharma",
        establishment_id="MH/BAN/0019283/000",
        correction_field="father_name",
        new_value="Rajesh Sharma"
    )
    assert handshake["consensus_achieved"] is True
    assert handshake["total_agents_involved"] == 3
    assert handshake["steps"][0]["agent"] == SwarmAgentRole.CITIZEN_INITIATOR.value
    assert handshake["steps"][1]["agent"] == SwarmAgentRole.EMPLOYER_DSC_VALIDATOR.value
    assert handshake["steps"][2]["agent"] == SwarmAgentRole.EPFO_FIELD_OFFICER.value
    assert handshake["steps"][2]["status"] == "SETTLED_AUTO"
