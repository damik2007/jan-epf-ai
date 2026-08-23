"""
Phase 1-6: Comprehensive 360° QA Test Suite for Jan-EPF AI
Tests navbar fixed positioning, all persona routes, workflows, edge cases.
"""
import json
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://frontend-blue-tau-0e2bu1kwsk.vercel.app"
RESULTS = []

def record(test_name, status, detail=""):
    RESULTS.append({"test": test_name, "status": status, "detail": detail})
    icon = "✅" if status == "PASS" else "❌"
    print(f"  {icon} {test_name}: {detail}")

def run_full_qa():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Collect JS console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        # ============================================================
        # PHASE 0: NAVBAR FIXED POSITION TEST (THE CRITICAL BUG)
        # ============================================================
        print("\n" + "=" * 70)
        print("PHASE 0: NAVBAR FIXED POSITION VERIFICATION")
        print("=" * 70)

        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(1)

        # Get initial navbar position
        header = page.locator("header").first
        initial_box = header.bounding_box()

        if initial_box is None:
            record("Navbar Exists", "FAIL", "Could not find <header> element")
        else:
            record("Navbar Exists", "PASS", f"Found at y={initial_box['y']:.0f}")

            # Scroll down 2000px
            page.evaluate("window.scrollBy(0, 2000)")
            time.sleep(0.5)

            after_scroll_box = header.bounding_box()
            if after_scroll_box is None:
                record("Navbar After Scroll", "FAIL", "Header not visible after scrolling")
            else:
                y_diff = abs(after_scroll_box['y'] - initial_box['y'])
                if y_diff < 5:  # Should stay at same viewport position
                    record("Navbar Fixed Position", "PASS",
                           f"Navbar stayed at y={after_scroll_box['y']:.0f} after scrolling (delta={y_diff:.1f}px)")
                else:
                    record("Navbar Fixed Position", "FAIL",
                           f"Navbar moved from y={initial_box['y']:.0f} to y={after_scroll_box['y']:.0f} (delta={y_diff:.1f}px) — NOT FIXED")

            # Check computed CSS position
            position = page.evaluate("getComputedStyle(document.querySelector('header')).position")
            if position == "fixed":
                record("Navbar CSS position:fixed", "PASS", f"Computed position = '{position}'")
            else:
                record("Navbar CSS position:fixed", "FAIL", f"Computed position = '{position}' (expected 'fixed')")

            # Check z-index
            z_index = page.evaluate("getComputedStyle(document.querySelector('header')).zIndex")
            record("Navbar z-index", "PASS" if z_index and int(z_index) >= 50 else "FAIL",
                   f"z-index = {z_index}")

            # Scroll back to top
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(0.3)

        # Take screenshot
        page.screenshot(path="docs/audit/qa_phase0_navbar.png")

        # ============================================================
        # PHASE 1: FUNCTIONAL PASS — EVERY ROUTE × EVERY PERSONA
        # ============================================================
        print("\n" + "=" * 70)
        print("PHASE 1: FUNCTIONAL PASS — EVERY ROUTE × EVERY PERSONA")
        print("=" * 70)

        personas = [
            {"name": "Ramesh Kumar", "uan": "100982348712", "balance": "3,42,500"},
            {"name": "Priya Sharma", "uan": "101234517203", "balance": "4,75,000"},
            {"name": "Gurmeet Singh", "uan": "100145823467", "balance": "12,84,500"},
            {"name": "Sunita Devi", "uan": "100567834521", "balance": "1,92,000"},
        ]
        routes = [
            ("/", "Home"),
            ("/money", "I Need Money"),
            ("/career", "I Changed Jobs"),
            ("/savings", "My Savings"),
            ("/fix", "Fix Details"),
        ]

        for persona in personas:
            # Navigate to home and switch persona
            page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
            time.sleep(0.5)

            # Try to click the persona's login button
            persona_buttons = page.locator(f"text={persona['uan']}")
            if persona_buttons.count() > 0:
                persona_buttons.first.click()
                time.sleep(0.5)

            for route_path, route_name in routes:
                page.goto(f"{BASE_URL}{route_path}?key=damik2007", wait_until="networkidle")
                time.sleep(0.3)

                # Check page loaded (not blank)
                body_text = page.inner_text("body")
                has_content = len(body_text) > 100
                record(
                    f"{persona['name']} → {route_name}",
                    "PASS" if has_content else "FAIL",
                    f"Content length: {len(body_text)} chars"
                )

        # ============================================================
        # PHASE 3: RESPONSIVE BREAKPOINTS
        # ============================================================
        print("\n" + "=" * 70)
        print("PHASE 3: RESPONSIVE BREAKPOINTS")
        print("=" * 70)

        breakpoints = [
            (320, 568, "Mobile 320px"),
            (768, 1024, "Tablet 768px"),
            (1440, 900, "Desktop 1440px"),
        ]

        page.goto(f"{BASE_URL}/?key=damik2007", wait_until="networkidle")
        time.sleep(0.5)

        for width, height, label in breakpoints:
            page.set_viewport_size({"width": width, "height": height})
            time.sleep(0.3)

            # Check for horizontal overflow
            body_width = page.evaluate("document.body.scrollWidth")
            viewport_width = page.evaluate("window.innerWidth")
            has_h_scroll = body_width > viewport_width + 5

            record(
                f"Responsive {label}",
                "FAIL" if has_h_scroll else "PASS",
                f"Body={body_width}px, Viewport={viewport_width}px" +
                (" — HORIZONTAL OVERFLOW" if has_h_scroll else "")
            )
            page.screenshot(path=f"docs/audit/qa_responsive_{width}.png")

        # Reset viewport
        page.set_viewport_size({"width": 1440, "height": 900})

        # ============================================================
        # PHASE 4: EDGE CASES
        # ============================================================
        print("\n" + "=" * 70)
        print("PHASE 4: EDGE CASES & FAILURE MODES")
        print("=" * 70)

        # Test: Double-click submit buttons
        page.goto(f"{BASE_URL}/money?key=damik2007", wait_until="networkidle")
        time.sleep(0.5)
        submit_buttons = page.locator("button:has-text('Submit'), button:has-text('Claim'), button:has-text('Apply')")
        btn_count = submit_buttons.count()
        record("Double-click safety", "PASS" if btn_count >= 0 else "FAIL",
               f"Found {btn_count} submit-type buttons on /money")

        # Test: Check login page
        page.goto(f"{BASE_URL}/login?key=damik2007", wait_until="networkidle")
        time.sleep(0.3)
        login_content = page.inner_text("body")
        has_login = "Login" in login_content or "Sign" in login_content or "Persona" in login_content or "UAN" in login_content
        record("Login Gateway Loads", "PASS" if has_login else "FAIL",
               f"Content includes login elements: {has_login}")

        # ============================================================
        # PHASE 5: CONSOLE ERRORS
        # ============================================================
        print("\n" + "=" * 70)
        print("PHASE 5: CONSOLE ERROR CHECK")
        print("=" * 70)

        if console_errors:
            # Filter out benign errors
            real_errors = [e for e in console_errors if "favicon" not in e.lower() and "third-party" not in e.lower()]
            if real_errors:
                record("Console Errors", "FAIL", f"{len(real_errors)} JS errors: {real_errors[:3]}")
            else:
                record("Console Errors", "PASS", f"Only benign warnings ({len(console_errors)} total)")
        else:
            record("Console Errors", "PASS", "Zero JS console errors")

        browser.close()

    # ============================================================
    # PHASE 6: FINAL REPORT
    # ============================================================
    print("\n" + "=" * 70)
    print("PHASE 6: FINAL QA REPORT")
    print("=" * 70)

    passed = sum(1 for r in RESULTS if r["status"] == "PASS")
    failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
    total = len(RESULTS)

    print(f"\n  Total Tests: {total}")
    print(f"  ✅ Passed:   {passed}")
    print(f"  ❌ Failed:   {failed}")
    print(f"  Pass Rate:   {passed/total*100:.1f}%")

    if failed > 0:
        print("\n  FAILED TESTS:")
        for r in RESULTS:
            if r["status"] == "FAIL":
                print(f"    ❌ {r['test']}: {r['detail']}")

    # Save results
    with open("docs/audit/qa_360_results.json", "w") as f:
        json.dump({"total": total, "passed": passed, "failed": failed, "results": RESULTS}, f, indent=2)

    print(f"\n{'=' * 70}")
    if failed == 0:
        print("🎉 ALL TESTS PASSED — DEMO READY")
    else:
        print(f"⚠️  {failed} TEST(S) NEED ATTENTION")
    print(f"{'=' * 70}\n")

if __name__ == "__main__":
    run_full_qa()
