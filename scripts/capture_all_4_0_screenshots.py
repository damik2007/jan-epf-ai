"""
High-Resolution 4.0 Full-Page Screenshot Capture Suite for Jan-EPF AI
Captures complete, pixel-perfect, full-height (scroll down to bottom) retina screenshots of EVERY page, hub, and tab.
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://frontend-blue-tau-0e2bu1kwsk.vercel.app"
OUTPUT_DIR = "/Users/damikreddy/Desktop/Hackaton/docs/screenshots"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def scroll_full_page(page):
    """Scroll down to trigger all animations and lazy components, then scroll back to top."""
    page.evaluate("""async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 80);
        });
    }""")
    time.sleep(1.2)

def capture_all():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use 1440px wide viewport with 2x retina device scale factor
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2
        )
        page = context.new_page()

        print("[1/17] Capturing Full-Page FastPath Login Gateway...")
        page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/01_login_fastpath.png", full_page=True)

        print("[2/17] Capturing Full-Page Citizen Dashboard (Discreet Privacy Mode ON)...")
        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_privacy_on.png", full_page=True)

        print("[3/17] Capturing Full-Page Citizen Dashboard (Unmasked State)...")
        eye_btn = page.locator("button[title*='Show full details'], button[title*='Show balances'], button[title*='Hide balances'], button[title*='⌘P']").first
        if eye_btn.is_visible():
            eye_btn.click()
            time.sleep(0.8)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/03_dashboard_unmasked.png", full_page=True)

        print("[4/17] Capturing Full-Page Ultra-Luxury Transparent Glassmorphic Voice Copilot Modal...")
        voice_btn = page.locator("button[title*='Speak to Jan-EPF Voice Copilot'], button:has-text('Voice Copilot'), button:has-text('Speak')").first
        if voice_btn.is_visible():
            voice_btn.click()
            time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/04_voice_copilot_glass.png", full_page=True)

        # Close voice modal for subsequent captures
        close_voice = page.locator("button[title*='Minimize voice copilot']").first
        if close_voice.is_visible():
            close_voice.click()
            time.sleep(0.5)

        print("[5/17] Capturing Full-Page I Need Money Hub (Para 68 Advance & Pre-Flight Diff Card)...")
        page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/05_need_money_hub.png", full_page=True)

        print("[6/17] Capturing Full-Page I Changed Jobs Hub (Form 13 & ECR Auto-Exit)...")
        page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/06_career_transfer_hub.png", full_page=True)

        print("[7/17] Capturing Full-Page My Savings Hub (Triple-Split Passbook & 8.25% Forecaster)...")
        page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/07_savings_compounding_hub.png", full_page=True)

        print("[8/17] Capturing Full-Page Fix Details Hub (Fuzzy Match, Penny Drop & Joint Dec)...")
        page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/08_fix_details_hub.png", full_page=True)

        print("[9/17] Capturing Full-Page Benchmarks Tab 1 (1,000-Run Microsecond Latency Runner)...")
        page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        tab1_btn = page.locator("button:has-text('Latency Runner')").first
        if tab1_btn.is_visible():
            tab1_btn.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/09_benchmarks_tab1_latency.png", full_page=True)

        print("[10/17] Capturing Full-Page Benchmarks Tab 2 (Micro-Cost & Net Exchequer Savings)...")
        tab2_btn = page.locator("button:has-text('Cost Economics')").first
        if tab2_btn.is_visible():
            tab2_btn.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/10_benchmarks_tab2_cost.png", full_page=True)

        print("[11/17] Capturing Full-Page Benchmarks Tab 3 (3-Part OpenAI Benchmark Evals)...")
        tab3_btn = page.locator("button:has-text('Statutory & Hallucination Evals')").first
        if tab3_btn.is_visible():
            tab3_btn.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/11_benchmarks_tab3_evals.png", full_page=True)

        print("[12/17] Capturing Full-Page Benchmarks Tab 4 (1.98M CPGRAMS Rejection Taxonomy)...")
        tab4_btn = page.locator("button:has-text('Grievance Taxonomy')").first
        if tab4_btn.is_visible():
            tab4_btn.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/12_benchmarks_tab4_cpgrams.png", full_page=True)

        print("[13/17] Capturing Full-Page Benchmarks Tab 5 (SRE Chaos & Upstream Resilience)...")
        tab5_btn = page.locator("button:has-text('SRE Chaos & Upstream Resilience')").first
        if tab5_btn.is_visible():
            tab5_btn.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/13_benchmarks_tab5_sre.png", full_page=True)

        print("[14/17] Capturing Full-Page Architecture Tab 1 (4 Sovereign DPI Pillars)...")
        page.goto(f"{BASE_URL}/architecture?key=damik2007", wait_until="networkidle")
        tab_arch1 = page.locator("button:has-text('4 Sovereign Pillars')").first
        if tab_arch1.is_visible():
            tab_arch1.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/14_architecture_tab1_pillars.png", full_page=True)

        print("[15/17] Capturing Full-Page Architecture Tab 2 (80/20 Sovereign Core)...")
        tab_arch2 = page.locator("button:has-text('80/20 Sovereign Core')").first
        if tab_arch2.is_visible():
            tab_arch2.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/15_architecture_tab2_core.png", full_page=True)

        print("[16/17] Capturing Full-Page Architecture Tab 4 (Zero-Trust Security & PII Vault)...")
        tab_arch4 = page.locator("button:has-text('Security & DPDP')").first
        if tab_arch4.is_visible():
            tab_arch4.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/16_architecture_tab4_security.png", full_page=True)

        print("[17/17] Capturing Full-Page Architecture Tab 7 (Full 18-Tool Tech Stack Matrix)...")
        tab_arch7 = page.locator("button:has-text('Tech Stack Matrix')").first
        if tab_arch7.is_visible():
            tab_arch7.click()
            time.sleep(1.0)
        scroll_full_page(page)
        page.screenshot(path=f"{OUTPUT_DIR}/17_architecture_tab7_tools.png", full_page=True)

        browser.close()
        print("\nAll 17 Full-Page High-Resolution Retina Screenshots successfully captured in docs/screenshots/!")

if __name__ == "__main__":
    capture_all()
