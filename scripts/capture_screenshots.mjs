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
    { name: "07_field_operations.png", url: "http://localhost:3000/vendor/field-ops" },
    { name: "08_partner_attribution.png", url: "http://localhost:3000/vendor/partners" },
    { name: "09_sales_enablement.png", url: "http://localhost:3000/vendor/sales-enablement" },
    { name: "10_industry_benchmarks.png", url: "http://localhost:3000/vendor/benchmarks" },
    { name: "11_managed_operations.png", url: "http://localhost:3000/vendor/managed-ops" },
    { name: "12_lead_qualification.png", url: "http://localhost:3000/vendor/leads" },
    { name: "13_participant_discover.png", url: "http://localhost:3000/participant/discover" },
    { name: "14_participant_wallet.png", url: "http://localhost:3000/participant/wallet" },
    { name: "15_training_academy.png", url: "http://localhost:3000/participant/academy" },
    { name: "16_local_offers.png", url: "http://localhost:3000/participant/offers" },
    { name: "17_admin_operations_hub.png", url: "http://localhost:3000/admin/operations-hub" },
    { name: "18_supply_heatmap.png", url: "http://localhost:3000/admin/supply" },
    { name: "19_risk_intelligence.png", url: "http://localhost:3000/admin/risk-intelligence" },
    { name: "20_dispute_resolution.png", url: "http://localhost:3000/admin/disputes" },
    { name: "21_pricing_calculator.png", url: "http://localhost:3000/pricing-calculator" },
    { name: "22_vendor_pilot_application.png", url: "http://localhost:3000/vendor-application" },
    { name: "23_early_access_onboarding.png", url: "http://localhost:3000/early-access" }
  ];

  for (const item of routes) {
    console.log(`Capturing ${item.name} from ${item.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(item.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(800);
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
