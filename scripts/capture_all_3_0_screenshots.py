"""
High-Resolution 3.0 Screenshot Capture Suite for Jan-EPF AI
Captures pixel-perfect screenshots of EVERY page, hub, benchmark tab, architecture tab, and transparent glassmorphic voice assistant.
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
        # Use 1280x860 viewport with 2x device scale for high-DPI retina sharpness
        context = browser.new_context(
            viewport={"width": 1280, "height": 860},
            device_scale_factor=2
        )
        page = context.new_page()

        print("[1/17] Capturing FastPath Login Gateway...")
        page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/01_login_fastpath.png", full_page=False)

        print("[2/17] Capturing Citizen Dashboard (Discreet Privacy Mode ON)...")
        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        ramesh_btn = page.locator("text=Ramesh Kumar").first
        if ramesh_btn.is_visible():
            ramesh_btn.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_privacy_on.png", full_page=False)

        print("[3/17] Capturing Citizen Dashboard (Unmasked State)...")
        eye_btn = page.locator("button[title*='Show balances'], button[title*='Hide balances'], button[title*='⌘P']").first
        if eye_btn.is_visible():
            eye_btn.click()
            time.sleep(0.8)
        page.screenshot(path=f"{OUTPUT_DIR}/03_dashboard_unmasked.png", full_page=False)

        print("[4/17] Capturing Ultra-Luxury Transparent Glassmorphic Voice Copilot Modal...")
        voice_btn = page.locator("button[title*='Speak to Jan-EPF Voice Copilot'], button:has-text('Voice Copilot'), button:has-text('Speak')").first
        if voice_btn.is_visible():
            voice_btn.click()
            time.sleep(1.2)
        page.screenshot(path=f"{OUTPUT_DIR}/04_voice_copilot_glass.png", full_page=False)

        # Close voice modal for remaining captures
        close_voice = page.locator("button[title*='Minimize voice copilot']").first
        if close_voice.is_visible():
            close_voice.click()
            time.sleep(0.5)

        print("[5/17] Capturing I Need Money Hub (Para 68 Advance & Cheque OCR)...")
        page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/05_need_money_hub.png", full_page=False)

        print("[6/17] Capturing I Changed Jobs Hub (Form 13 & ECR Auto-Exit)...")
        page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/06_career_transfer_hub.png", full_page=False)

        print("[7/17] Capturing My Savings Hub (Triple-Split Passbook & 8.25% Forecaster)...")
        page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/07_savings_compounding_hub.png", full_page=False)

        print("[8/17] Capturing Fix Details Hub (Fuzzy Match, Penny Drop & Joint Dec)...")
        page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/08_fix_details_hub.png", full_page=False)

        print("[9/17] Capturing Benchmarks Tab 1: 3-Way Evals Matrix...")
        page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/09_benchmarks_evals_matrix.png", full_page=False)

        print("[10/17] Capturing Benchmarks Tab 2: 1,000-Run Latency Runner...")
        latency_tab = page.locator("text=1,000-Run Latency").first
        if latency_tab.is_visible():
            latency_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/10_benchmarks_latency_runner.png", full_page=False)

        print("[11/17] Capturing Benchmarks Tab 3: Trace & Token Receipts...")
        trace_tab = page.locator("text=Raw Trace").first
        if trace_tab.is_visible():
            trace_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/11_benchmarks_trace_console.png", full_page=False)

        print("[12/17] Capturing Benchmarks Tab 4: National Exchequer ROI Calculator...")
        roi_tab = page.locator("text=National Exchequer ROI").first
        if roi_tab.is_visible():
            roi_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/12_benchmarks_roi_calculator.png", full_page=False)

        print("[13/17] Capturing Benchmarks Tab 5: Security & SRE Audit...")
        sec_tab = page.locator("text=Security & SRE Audit").first
        if sec_tab.is_visible():
            sec_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/13_benchmarks_security_audit.png", full_page=False)

        print("[14/17] Capturing Architecture Tab 1: 1.98M Grievance Root Causes...")
        page.goto(f"{BASE_URL}/architecture?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/14_architecture_grievances.png", full_page=False)

        print("[15/17] Capturing Architecture Tab 2: DPDP Act 2023 Blueprint...")
        dpdp_tab = page.locator("text=DPDP Act 2023").first
        if dpdp_tab.is_visible():
            dpdp_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/15_architecture_dpdp_blueprint.png", full_page=False)

        print("[16/17] Capturing Architecture Tab 3: Demographic Personas...")
        cohort_tab = page.locator("text=Demographic Personas").first
        if cohort_tab.is_visible():
            cohort_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/16_architecture_demographics.png", full_page=False)

        print("[17/17] Capturing Architecture Tab 7: Tools & Tech Stack Matrix...")
        tech_tab = page.locator("text=Tools & Tech Stack").first
        if tech_tab.is_visible():
            tech_tab.click()
            time.sleep(1.0)
        page.screenshot(path=f"{OUTPUT_DIR}/17_architecture_tech_stack.png", full_page=False)

        browser.close()
        print(f"\n🎉 Successfully captured all 17 screenshots into {OUTPUT_DIR}/")

if __name__ == "__main__":
    capture_all()
