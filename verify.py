from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto(f"file://{os.path.abspath('app/src/main/assets/pixel_pet_game/index.html')}")
    page.wait_for_timeout(500)

    # Initial state screenshot
    page.screenshot(path="verification_start.png")

    # Click Feed
    page.get_by_role("button", name="Feed").click()
    page.wait_for_timeout(500)

    # Click Play
    page.get_by_role("button", name="Play").click()
    page.wait_for_timeout(500)

    # Final state screenshot
    page.screenshot(path="verification_end.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="."
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
