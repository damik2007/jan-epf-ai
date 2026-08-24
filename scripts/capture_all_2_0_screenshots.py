"""
High-Resolution 2.0 Screenshot Capture Suite for Jan-EPF AI
Captures pixel-perfect screenshots of EVERY page, hub, benchmark tab, architecture tab, and privacy state.
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://frontend-blue-tau-0e2bu1kwsk.vercel.app"
OUTPUT_DIR = "/Users/damikreddy/Desktop/Hackaton/docs/screenshots"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use 1280x820 viewport with 2x device scale for high-DPI retina sharpness
        context = browser.new_context(
            viewport={"width": 1280, "height": 860},
            device_scale_factor=2
        )
        page = context.new_page()

        print("[1/16] Capturing Login / FastPath Gateway...")
        page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/01_login_fastpath.png", full_page=False)

        print("[2/16] Capturing Citizen Dashboard (Discreet Privacy Mode ON)...")
        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        # Select Ramesh Kumar if on welcome gate
        ramesh_btn = page.locator("text=Ramesh Kumar").first
        if ramesh_btn.is_visible():
            ramesh_btn.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_privacy_on.png", full_page=False)

        print("[3/16] Capturing Citizen Dashboard (Unmasked Reveal State)...")
        # Toggle privacy mode via Eye icon
        eye_btn = page.locator("button[title*='Show balances'], button[title*='Hide balances'], button[title*='⌘P']").first
        if eye_btn.is_visible():
            eye_btn.click()
            time.sleep(0.8)
        page.screenshot(path=f"{OUTPUT_DIR}/03_dashboard_unmasked.png", full_page=False)

        print("[4/16] Capturing I Need Money Hub (Para 68 Advance & Cheque OCR)...")
        page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/04_need_money_hub.png", full_page=False)

        print("[5/16] Capturing I Changed Jobs Hub (Form 13 & ECR Auto-Exit)...")
        page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/05_career_transfer_hub.png", full_page=False)

        print("[6/16] Capturing My Savings Hub (Triple-Split Passbook & 8.25% Forecaster)...")
        page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/06_savings_compounding_hub.png", full_page=False)

        print("[7/16] Capturing Fix Details Hub (Fuzzy Match, Penny Drop & Joint Dec)...")
        page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/07_fix_details_hub.png", full_page=False)

        print("[8/16] Capturing Benchmarks Tab 1: 3-Way Evals Matrix...")
        page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/08_benchmarks_evals_matrix.png", full_page=False)

        print("[9/16] Capturing Benchmarks Tab 2: 1,000-Run Latency Runner...")
        latency_tab = page.locator("text=1,000-Run Latency").first
        if latency_tab.is_visible():
            latency_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/09_benchmarks_latency_runner.png", full_page=False)

        print("[10/16] Capturing Benchmarks Tab 3: Trace & Token Receipts...")
        trace_tab = page.locator("text=Raw Trace").first
        if trace_tab.is_visible():
            trace_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/10_benchmarks_trace_console.png", full_page=False)

        print("[11/16] Capturing Benchmarks Tab 4: National Exchequer ROI Calculator...")
        roi_tab = page.locator("text=National Exchequer ROI").first
        if roi_tab.is_visible():
            roi_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/11_benchmarks_roi_calculator.png", full_page=False)

        print("[12/16] Capturing Benchmarks Tab 5: Security & SRE Audit...")
        sec_tab = page.locator("text=Security & SRE Audit").first
        if sec_tab.is_visible():
            sec_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/12_benchmarks_security_audit.png", full_page=False)

        print("[13/16] Capturing Architecture Tab 1: 1.98M Grievance Root Causes...")
        page.goto(f"{BASE_URL}/architecture?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/13_architecture_grievances.png", full_page=False)

        print("[14/16] Capturing Architecture Tab 2: DPDP Act 2023 Blueprint...")
        dpdp_tab = page.locator("text=DPDP Act 2023").first
        if dpdp_tab.is_visible():
            dpdp_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/14_architecture_dpdp_blueprint.png", full_page=False)

        print("[15/16] Capturing Architecture Tab 3: Demographic Personas...")
        cohort_tab = page.locator("text=Demographic Personas").first
        if cohort_tab.is_visible():
            cohort_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/15_architecture_demographics.png", full_page=False)

        print("[16/16] Capturing Architecture Tab 7: Tools & Tech Stack Matrix...")
        tech_tab = page.locator("text=Tools & Tech Stack").first
        if tech_tab.is_visible():
            tech_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/16_architecture_tech_stack.png", full_page=False)

        browser.close()
        print(f"\n🎉 Successfully captured all 16 screenshots into {OUTPUT_DIR}/")

if __name__ == "__main__":
    capture_all()
