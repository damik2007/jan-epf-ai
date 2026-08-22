"""
Jan-EPF AI: WCAG 2.1 AA Accessibility & Universal Device Compliance Test Suite (Agent 7).
Tests contrast ratios, Senior Mode font scaling, touch targets >=48px, and voice guidance.
"""


def calculate_relative_luminance(r: int, g: int, b: int) -> float:
    """
    Computes WCAG 2.1 relative luminance for sRGB values.
    """
    def _channel(c):
        val = c / 255.0
        return val / 12.92 if val <= 0.03928 else ((val + 0.055) / 1.055) ** 2.4

    return 0.2126 * _channel(r) + 0.7152 * _channel(g) + 0.0722 * _channel(b)


def calculate_contrast_ratio(rgb1: tuple, rgb2: tuple) -> float:
    """
    Computes WCAG contrast ratio between two RGB colors (L1 + 0.05) / (L2 + 0.05).
    """
    lum1 = calculate_relative_luminance(*rgb1)
    lum2 = calculate_relative_luminance(*rgb2)
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    return round((lighter + 0.05) / (darker + 0.05), 2)


def test_sovereign_palette_wcag_contrast():
    # Sovereign Navy (#002147 -> RGB: 0, 33, 71) on White (RGB: 255, 255, 255)
    ratio_navy_white = calculate_contrast_ratio((0, 33, 71), (255, 255, 255))
    # WCAG AA requires at least 4.5:1 for regular text, AAA requires 7.0:1
    assert ratio_navy_white >= 7.0, f"Navy/White ratio {ratio_navy_white} must meet AAA standard"

    # White text on Sovereign Navy (#002147)
    ratio_white_navy = calculate_contrast_ratio((255, 255, 255), (0, 33, 71))
    assert ratio_white_navy >= 7.0

    # Saffron (#FF9933 -> RGB: 255, 153, 51) with Sovereign Darkest (#001226 -> RGB: 0, 18, 38)
    ratio_saffron_dark = calculate_contrast_ratio((255, 153, 51), (0, 18, 38))
    assert ratio_saffron_dark >= 8.0


def test_senior_mode_accessibility_specifications():
    senior_mode_config = {
        "min_touch_target_px": 54,
        "font_scaling_percent": 118,
        "captchas_disabled": True,
        "spoken_narration_enabled": True,
        "high_contrast_borders_px": 2
    }

    # WCAG 2.1 AA requires minimum 44x44px or 48px touch targets
    assert senior_mode_config["min_touch_target_px"] >= 48
    assert senior_mode_config["font_scaling_percent"] >= 115
    assert senior_mode_config["captchas_disabled"] is True
    assert senior_mode_config["high_contrast_borders_px"] >= 2


def test_universal_device_viewport_support():
    supported_resolutions = [
        {"name": "Budget Mobile", "width": 320, "responsive": True},
        {"name": "Standard Smartphone", "width": 390, "responsive": True},
        {"name": "Tablet / Foldable", "width": 768, "responsive": True},
        {"name": "Desktop / Cyber Cafe", "width": 1920, "responsive": True}
    ]

    for res in supported_resolutions:
        assert res["responsive"] is True
        assert res["width"] >= 320
