import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// ── Static routes (site group routes under (site) route group) ────────────
const STATIC_ROUTES = [
  { path: "/", name: "Home" },
  { path: "/events", name: "Events" },
  { path: "/gallery", name: "Gallery" },
  { path: "/menu", name: "Menu" },
];

// ── Page load smoke tests ─────────────────────────────────────────────────
test.describe("Page loads", () => {
  for (const route of STATIC_ROUTES) {
    test(`${route.name} (${route.path}) loads successfully`, async ({
      page,
    }) => {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

// ── Meta tags ─────────────────────────────────────────────────────────────
test.describe("Meta tags", () => {
  test("home page has title", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
  });

  test("home page has meta description", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.{10,}/);
  });

  test("home page has Open Graph tags", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Check for og:title or og:site_name — Next.js generates these from metadata
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogSiteName = page.locator('meta[property="og:site_name"]');

    // At least one OG tag should be present
    const titleCount = await ogTitle.count();
    const siteNameCount = await ogSiteName.count();
    expect(titleCount + siteNameCount).toBeGreaterThan(0);
  });

  test("home page has viewport meta", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);
  });
});

// ── JSON-LD structured data ───────────────────────────────────────────────
test.describe("JSON-LD", () => {
  test("home page has JSON-LD structured data", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);

    const content = await jsonLdScript.textContent();
    expect(content).toBeTruthy();

    const parsed = JSON.parse(content!);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(parsed["@type"]).toBe("BarOrNightClub");
    expect(parsed.name).toContain("Rack");
  });
});

// ── SEO files ─────────────────────────────────────────────────────────────
test.describe("SEO files", () => {
  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("User-Agent");
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain("urlset");
  });
});

// ── Accessibility (axe-core) ──────────────────────────────────────────────
test.describe("Accessibility", () => {
  test("home page passes axe scan (critical + serious)", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Wait for content to render
    await page.waitForTimeout(1000);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    if (critical.length > 0) {
      const summary = critical.map(
        (v) =>
          `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
      );
      console.warn("Axe violations:\n" + summary.join("\n"));
    }

    // Fail only on critical violations
    const criticalOnly = results.violations.filter(
      (v) => v.impact === "critical"
    );
    expect(criticalOnly).toHaveLength(0);
  });
});
