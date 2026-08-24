import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3000"
OUTPUT_DIR = "/Users/damikreddy/Desktop/Hackaton/docs/screenshots"

async def scroll_and_settle(page):
    """Gradually scroll down to trigger all animations, then return to top."""
    await page.evaluate("""
        async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 350;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 80);
            });
        }
    """)
    await page.wait_for_timeout(1500)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(1000)

async def capture_all():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,
            color_scheme="dark"
        )
        page = await context.new_page()

        print("[1/22] Capturing FastPath Login Gateway...")
        await page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/01_login_fastpath.png", full_page=True)

        print("[2/22] Capturing Citizen Dashboard (Discreet Mode Active)...")
        await page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_privacy_on.png", full_page=True)

        print("[3/22] Capturing Citizen Dashboard (Unmasked State)...")
        # Click unmask / eye toggle if present
        try:
            eye_btn = await page.query_selector("button:has-text('Unmask'), button:has-text('Privacy')")
            if eye_btn:
                await eye_btn.click()
                await page.wait_for_timeout(1000)
        except Exception:
            pass
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/03_dashboard_unmasked.png", full_page=True)

        print("[4/22] Capturing Command Center Modal...")
        try:
            # Trigger Cmd+K
            await page.keyboard.press("Meta+k")
            await page.wait_for_timeout(1000)
            await page.screenshot(path=f"{OUTPUT_DIR}/04_command_center_glass.png", full_page=True)
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(500)
        except Exception:
            pass

        print("[5/22] Capturing Sovereign Agent Harness Copilot Modal...")
        try:
            copilot_btn = await page.query_selector("button:has-text('Sovereign Agent Copilot')")
            if copilot_btn:
                await copilot_btn.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path=f"{OUTPUT_DIR}/05_sovereign_agent_harness_glass.png", full_page=True)
                # Close modal
                close_btn = await page.query_selector("button:has(svg.lucide-x)")
                if close_btn:
                    await close_btn.click()
                    await page.wait_for_timeout(500)
        except Exception:
            pass

        print("[6/22] Capturing I Need Money Hub (/money)...")
        await page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/06_need_money_hub.png", full_page=True)

        print("[7/22] Capturing I Changed Jobs Hub (/career)...")
        await page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/07_career_transfer_hub.png", full_page=True)

        print("[8/22] Capturing My Savings Hub (/savings)...")
        await page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/08_savings_compounding_hub.png", full_page=True)

        print("[9/22] Capturing Fix Details Hub (/fix)...")
        await page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/09_fix_details_hub.png", full_page=True)

        print("[10/22] Capturing Benchmarks Tab 1 (Latency Runner)...")
        await page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/10_benchmarks_tab1_latency.png", full_page=True)

        print("[11/22] Capturing Benchmarks Tab 2 (Micro-Cost & Economics)...")
        tab2 = await page.query_selector("button:has-text('Micro-Cost')")
        if tab2:
            await tab2.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/11_benchmarks_tab2_cost.png", full_page=True)

        print("[12/22] Capturing Benchmarks Tab 3 (OpenAI Evals & Tool Latency)...")
        tab3 = await page.query_selector("button:has-text('OpenAI Benchmark')")
        if tab3:
            await tab3.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/12_benchmarks_tab3_evals.png", full_page=True)

        print("[13/22] Capturing Benchmarks Tab 4 (1.98M CPGRAMS Rejection Taxonomy)...")
        tab4 = await page.query_selector("button:has-text('CPGRAMS')")
        if tab4:
            await tab4.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/13_benchmarks_tab4_cpgrams.png", full_page=True)

        print("[14/22] Capturing Benchmarks Tab 5 (SRE Chaos & Circuit Breakers)...")
        tab5 = await page.query_selector("button:has-text('SRE Chaos')")
        if tab5:
            await tab5.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/14_benchmarks_tab5_sre.png", full_page=True)

        print("[15/22] Capturing Architecture Tab 0 (Sovereign Agent Harness Showcase)...")
        await page.goto(f"{BASE_URL}/architecture?key=damik2007", wait_until="networkidle")
        await scroll_and_settle(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/15_architecture_tab0_harness.png", full_page=True)

        print("[16/22] Capturing Architecture Tab 1 (1.98M Grievance Root Causes)...")
        atab1 = await page.query_selector("button:has-text('Grievance Root Causes')")
        if atab1:
            await atab1.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/16_architecture_tab1_grievances.png", full_page=True)

        print("[17/22] Capturing Architecture Tab 2 (DPDP Act 2023 & Legal Compliance)...")
        atab2 = await page.query_selector("button:has-text('DPDP Act 2023')")
        if atab2:
            await atab2.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/17_architecture_tab2_legal.png", full_page=True)

        print("[18/22] Capturing Architecture Tab 3 (Demographic Personas)...")
        atab3 = await page.query_selector("button:has-text('Demographic Personas')")
        if atab3:
            await atab3.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/18_architecture_tab3_personas.png", full_page=True)

        print("[19/22] Capturing Architecture Tab 4 (18 Archaic Forms vs 4 Hubs)...")
        atab4 = await page.query_selector("button:has-text('18 Archaic Forms')")
        if atab4:
            await atab4.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/19_architecture_tab4_forms.png", full_page=True)

        print("[20/22] Capturing Architecture Tab 5 (80/20 Sovereign Core Blueprint)...")
        atab5 = await page.query_selector("button:has-text('80/20 Sovereign Core')")
        if atab5:
            await atab5.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/20_architecture_tab5_pillars.png", full_page=True)

        print("[21/22] Capturing Architecture Tab 6 (SRE Resilience & Circuit Breakers)...")
        atab6 = await page.query_selector("button:has-text('SRE Resilience')")
        if atab6:
            await atab6.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/21_architecture_tab6_sre.png", full_page=True)

        print("[22/22] Capturing Architecture Tab 7 (Tools & Tech Stack Matrix)...")
        atab7 = await page.query_selector("button:has-text('Tools & Tech Stack')")
        if atab7:
            await atab7.click()
            await scroll_and_settle(page)
            await page.screenshot(path=f"{OUTPUT_DIR}/22_architecture_tab7_tools.png", full_page=True)

        await browser.close()
        print("\n🎉 Successfully captured all 22 Full-Page Retina Screenshots in docs/screenshots/!")

if __name__ == "__main__":
    asyncio.run(capture_all())
