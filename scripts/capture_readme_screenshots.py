"""
Capture pixel-perfect screenshots of Jan-EPF AI for GitHub README.md.
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
            viewport={"width": 1280, "height": 820},
            device_scale_factor=2
        )
        page = context.new_page()

        print("1. Capturing Login / Evaluator Gateway...")
        page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/01_login_gateway.png", full_page=False)

        print("2. Authenticating as Ramesh Kumar and capturing Dashboard...")
        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        # If evaluator login gate or persona selector is visible, click Ramesh Kumar
        ramesh_btn = page.locator("text=Ramesh Kumar").first
        if ramesh_btn.is_visible():
            ramesh_btn.click()
            time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_overview.png", full_page=False)

        print("3. Capturing I Need Money Hub (Para 68 Advance)...")
        page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/03_need_money_hub.png", full_page=False)

        print("4. Capturing I Changed Jobs Hub (Form 13 Transfer & ECR Deducer)...")
        page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/04_career_transfer_hub.png", full_page=False)

        print("5. Capturing My Savings Hub (8.25% Compounding Forecaster)...")
        page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/05_savings_compounding_hub.png", full_page=False)

        print("6. Capturing Fix Details Hub (Fuzzy Match & Penny Drop)...")
        page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        time.sleep(1.5)
        page.screenshot(path=f"{OUTPUT_DIR}/06_fix_details_hub.png", full_page=False)

        browser.close()
        print(f"All screenshots successfully saved to {OUTPUT_DIR}/")

if __name__ == "__main__":
    capture_all()
