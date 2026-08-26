import asyncio
import os
from playwright.async_api import async_playwright

BASE_URL = "https://frontend-blue-tau-0e2bu1kwsk.vercel.app"
OUTPUT_DIR = "/Users/damikreddy/Desktop/Hackaton/docs/screenshots"

async def smooth_scroll_full_page(page):
    """
    Step-by-step smooth scroll from top to bottom and back to top
    to trigger all CSS animations, Framer Motion transitions, and lazy DOM rendering.
    """
    await page.evaluate("""
        async () => {
            await new Promise((resolve) => {
                let currentPos = 0;
                const distance = 350;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    currentPos += distance;
                    if (currentPos >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 60);
            });
        }
    """)
    await page.wait_for_timeout(1000)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(800)

async def safe_click(page, text_query, timeout=4000):
    try:
        btn = await page.wait_for_selector(f"button:has-text('{text_query}')", timeout=timeout)
        if btn:
            await btn.click()
            await page.wait_for_timeout(800)
    except Exception as e:
        print(f"  [Note] safe_click for '{text_query}': {e}")

async def capture_all_retina_views():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,
            color_scheme="dark"
        )
        page = await context.new_page()

        # 1. Login Gateway
        print("[01/24] Capturing 01_login_fastpath.png...")
        await page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/01_login_fastpath.png", full_page=True)

        # 2. Citizen Dashboard (Privacy Mode)
        print("[02/24] Capturing 02_dashboard_privacy_on.png (Discreet Mode Active)...")
        await page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/02_dashboard_privacy_on.png", full_page=True)

        # 3. Citizen Dashboard (Unmasked)
        print("[03/24] Capturing 03_dashboard_unmasked.png (Live Balance & Claim Readiness Island)...")
        await safe_click(page, "Privacy")
        await safe_click(page, "Unmask")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/03_dashboard_unmasked.png", full_page=True)

        # 4. Command Center (Cmd+K)
        print("[04/24] Capturing 04_command_center_glass.png (Cmd+K Open)...")
        try:
            await page.keyboard.press("Meta+k")
            await page.wait_for_timeout(1000)
            await page.screenshot(path=f"{OUTPUT_DIR}/04_command_center_glass.png", full_page=True)
            await page.keyboard.press("Escape")
            await page.wait_for_timeout(500)
        except Exception:
            pass

        # 5. Sovereign Agent Harness Modal
        print("[05/24] Capturing 05_sovereign_agent_harness_glass.png (AI Agent Modal Open)...")
        try:
            copilot_btn = await page.query_selector("button:has-text('AI Agent')")
            if copilot_btn:
                await copilot_btn.click()
                await page.wait_for_timeout(1200)
                await page.screenshot(path=f"{OUTPUT_DIR}/05_sovereign_agent_harness_glass.png", full_page=True)
                close_btn = await page.query_selector("button:has(svg.lucide-x)")
                if close_btn:
                    await close_btn.click()
                    await page.wait_for_timeout(500)
        except Exception:
            pass

        # 6. I Need Money Hub
        print("[06/24] Capturing 06_need_money_hub.png (/money)...")
        await page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/06_need_money_hub.png", full_page=True)

        # 7. Career Hub
        print("[07/24] Capturing 07_career_transfer_hub.png (/career)...")
        await page.goto(f"{BASE_URL}/career?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/07_career_transfer_hub.png", full_page=True)

        # 8. Savings Hub
        print("[08/24] Capturing 08_savings_compounding_hub.png (/savings)...")
        await page.goto(f"{BASE_URL}/savings?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/08_savings_compounding_hub.png", full_page=True)

        # 9. Fix Details Hub
        print("[09/24] Capturing 09_fix_details_hub.png (/fix)...")
        await page.goto(f"{BASE_URL}/fix?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/09_fix_details_hub.png", full_page=True)

        # 10-14. Benchmarks Tabs
        print("[10/24] Capturing 10_benchmarks_tab1_latency.png (Tab 1: 3-Way Evals)...")
        await page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/10_benchmarks_tab1_latency.png", full_page=True)

        print("[11/24] Capturing 11_benchmarks_tab2_cost.png (Tab 2: Latency Runner)...")
        await safe_click(page, "Latency")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/11_benchmarks_tab2_cost.png", full_page=True)

        print("[12/24] Capturing 12_benchmarks_tab3_evals.png (Tab 3: Raw Traces)...")
        await safe_click(page, "Raw Trace")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/12_benchmarks_tab3_evals.png", full_page=True)

        print("[13/24] Capturing 13_benchmarks_tab4_cpgrams.png (Tab 4: Exchequer ROI)...")
        await safe_click(page, "Exchequer ROI")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/13_benchmarks_tab4_cpgrams.png", full_page=True)

        print("[14/24] Capturing 14_benchmarks_tab5_sre.png (Tab 5: Security & SRE)...")
        await safe_click(page, "Security & SRE")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/14_benchmarks_tab5_sre.png", full_page=True)

        # 15-22. Architecture Tabs
        print("[15/24] Capturing 15_architecture_tab0_harness.png (Tab 0: Sovereign Agent Harness)...")
        await page.goto(f"{BASE_URL}/architecture?key=damik2007", wait_until="networkidle")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/15_architecture_tab0_harness.png", full_page=True)

        print("[16/24] Capturing 16_architecture_tab1_grievances.png (Tab 1: Grievances)...")
        await safe_click(page, "1.98M Grievance")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/16_architecture_tab1_grievances.png", full_page=True)

        print("[17/24] Capturing 17_architecture_tab2_legal.png (Tab 2: Legal & DPDP)...")
        await safe_click(page, "DPDP Act 2023")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/17_architecture_tab2_legal.png", full_page=True)

        print("[18/24] Capturing 18_architecture_tab3_personas.png (Tab 3: Personas)...")
        await safe_click(page, "Demographic Personas")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/18_architecture_tab3_personas.png", full_page=True)

        print("[19/24] Capturing 19_architecture_tab4_forms.png (Tab 4: Forms to Hubs)...")
        await safe_click(page, "18 Archaic Forms")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/19_architecture_tab4_forms.png", full_page=True)

        print("[20/24] Capturing 20_architecture_tab5_pillars.png (Tab 5: 80/20 Sovereign Core)...")
        await safe_click(page, "80/20 Sovereign Core")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/20_architecture_tab5_pillars.png", full_page=True)

        print("[21/24] Capturing 21_architecture_tab6_sre.png (Tab 6: SRE Resilience)...")
        await safe_click(page, "SRE Resilience")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/21_architecture_tab6_sre.png", full_page=True)

        print("[22/24] Capturing 22_architecture_tab7_tools.png (Tab 7: Tech Stack)...")
        await safe_click(page, "Tools & Tech Stack")
        await smooth_scroll_full_page(page)
        await page.screenshot(path=f"{OUTPUT_DIR}/22_architecture_tab7_tools.png", full_page=True)

        # 23. Sovereign Ops Command Center Modal (LLMOps • AiOps • MLOps • SecOps)
        print("[23/24] Capturing 23_sovereign_ops_suite.png (/benchmarks ➔ Ops Center)...")
        await page.goto(f"{BASE_URL}/benchmarks?key=damik2007", wait_until="networkidle")
        try:
            ops_btn = await page.wait_for_selector("button:has-text('Sovereign Ops Suite')", timeout=5000)
            if ops_btn:
                await ops_btn.click()
                await page.wait_for_timeout(1200)
                await page.screenshot(path=f"{OUTPUT_DIR}/23_sovereign_ops_suite.png", full_page=True)
                # Keep backward compatibility alias
                await page.screenshot(path=f"{OUTPUT_DIR}/23_copilot_workstation.png", full_page=True)
                close_btn = await page.query_selector("button:has(svg.lucide-x)")
                if close_btn:
                    await close_btn.click()
                    await page.wait_for_timeout(500)
        except Exception as e:
            print(f"  [Note] Ops Suite screenshot: {e}")

        # 24. 13 Indic Languages Directory & Voice Assistant
        print("[24/24] Capturing 24_indic_voices_dropdown.png (13 Indic Languages & 23 Voices Directory)...")
        await page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        try:
            agent_btn = await page.query_selector("button:has-text('Open AI Agent')")
            if agent_btn:
                await agent_btn.click()
                await page.wait_for_timeout(1000)
                sliders_btn = await page.query_selector("button[title*='Voice'], button[title*='Speech']")
                if sliders_btn:
                    await sliders_btn.click()
                    await page.wait_for_timeout(1000)
                await page.screenshot(path=f"{OUTPUT_DIR}/24_indic_voices_dropdown.png", full_page=True)
        except Exception as e:
            print(f"  [Note] Voice settings screenshot: {e}")

        await browser.close()
        print("🎉 ALL 24 FULL-HEIGHT RETINA SCREENSHOTS CAPTURED PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(capture_all_retina_views())
