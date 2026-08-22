import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("./docs/screenshots");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const routes = [
    { name: "01_homepage_hero.png", url: "http://localhost:3000" },
    { name: "02_vendor_overview.png", url: "http://localhost:3000/vendor/overview" },
    { name: "03_campaign_builder.png", url: "http://localhost:3000/vendor/create-campaign" },
    { name: "04_research_studio.png", url: "http://localhost:3000/vendor/research-studio" },
    { name: "05_sampling_operations.png", url: "http://localhost:3000/vendor/sampling" },
    { name: "06_content_studio.png", url: "http://localhost:3000/vendor/content-studio" },
    { name: "07_participant_discover.png", url: "http://localhost:3000/participant/discover" },
    { name: "08_participant_wallet.png", url: "http://localhost:3000/participant/wallet" },
    { name: "09_admin_operations_hub.png", url: "http://localhost:3000/admin/operations-hub" },
    { name: "10_pricing_calculator.png", url: "http://localhost:3000/pricing-calculator" },
    { name: "11_vendor_pilot_application.png", url: "http://localhost:3000/vendor-application" },
    { name: "12_early_access_onboarding.png", url: "http://localhost:3000/early-access" }
  ];

  for (const item of routes) {
    console.log(`Capturing ${item.name} from ${item.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(item.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, item.name), fullPage: false });
      console.log(`Saved ${item.name}`);
    } catch (e) {
      console.error(`Failed ${item.name}: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("All screenshots captured successfully.");
}

capture();
