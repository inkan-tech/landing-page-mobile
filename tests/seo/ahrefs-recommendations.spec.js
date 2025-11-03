/**
 * Ahrefs SEO Recommendations - Regression Prevention Tests
 *
 * These tests verify fixes for issues identified in Ahrefs Site Audit
 * to prevent regressions and maintain 99-100% health score.
 *
 * Run with: npx playwright test --grep @ahrefs
 *
 * Priority Levels:
 * - P0: Critical errors that must never occur
 * - P1: High priority warnings affecting SEO performance
 * - P2: Medium priority optimizations for better rankings
 */

const { test, expect } = require('@playwright/test');

// Base URL for production site
const BASE_URL = 'https://sealf.ie';

/**
 * P0 CRITICAL ISSUES - Must always pass
 * These are blocking SEO issues that severely impact crawlability
 */
test.describe('P0 Critical - Orphan Pages @ahrefs', () => {

  test('offline.html should have incoming internal links', async ({ page }) => {
    // Navigate to offline page
    await page.goto(`${BASE_URL}/en/offline.html`);

    // Verify the page has at least one internal link back to the site
    const homepageLink = page.locator('a[href="/en/"]');
    await expect(homepageLink).toBeVisible();

    // Verify link text is user-friendly
    const linkText = await homepageLink.textContent();
    expect(linkText).toContain('Homepage');
  });

  test('all pages should have at least one outgoing internal link', async ({ page }) => {
    const pages = [
      '/en/offline.html',
      '/en/',
      '/en/pricing.html',
      '/en/documentation.html',
      '/en/challenge.html',
      '/en/support.html',
      '/fr/',
      '/fr/pricing.html'
    ];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Find all internal links (same domain)
      const internalLinks = await page.locator('a[href^="/"], a[href^="https://sealf.ie"]').count();

      expect(internalLinks, `${pagePath} should have at least one internal link`).toBeGreaterThan(0);
    }
  });
});

test.describe('P0 Critical - Redirect Chains @ahrefs', () => {

  test('hreflang x-default should point to final destination (no redirects)', async ({ page }) => {
    const pagesWithHreflang = [
      '/en/',
      '/en/pricing.html',
      '/en/documentation.html',
      '/en/challenge.html',
      '/en/support.html',
      '/fr/',
      '/fr/pricing.html'
    ];

    for (const pagePath of pagesWithHreflang) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Get x-default hreflang link (with timeout to handle missing tags)
      const xDefaultLink = page.locator('link[rel="alternate"][hreflang="x-default"]');
      const exists = await xDefaultLink.count() > 0;

      if (!exists) {
        // Skip pages that don't have x-default hreflang
        continue;
      }

      const xDefaultHref = await xDefaultLink.getAttribute('href');

      // Verify it points to /en/ version (not root which redirects)
      expect(xDefaultHref, `${pagePath} x-default hreflang should point to /en/ version`).toMatch(/\/en\//);

      // Verify the URL doesn't cause a redirect
      const response = await page.request.get(xDefaultHref);
      expect(response.status(), `${xDefaultHref} should return 200, not redirect`).toBe(200);
    }
  });

  test('press page x-default should point to /en/press.html (not /press.html)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/press.html`);

    const xDefaultLink = page.locator('link[rel="alternate"][hreflang="x-default"]');
    const exists = await xDefaultLink.count() > 0;

    if (!exists) {
      // Skip if press page doesn't have hreflang yet
      test.skip();
      return;
    }

    const xDefaultHref = await xDefaultLink.getAttribute('href');

    // Should point to /en/press.html (final destination)
    expect(xDefaultHref).toBe('https://sealf.ie/en/press.html');

    // Verify it returns 200 (not 301/302 redirect)
    const response = await page.request.get(xDefaultHref);
    expect(response.status()).toBe(200);
  });
});

/**
 * P1 HIGH PRIORITY - Affects SEO Performance
 * These issues impact rankings and crawlability
 */
test.describe('P1 High Priority - HTML Lang Attributes @ahrefs', () => {

  test('privacy-ios page should use correct lang attribute syntax', async ({ page }) => {
    // Test English version
    await page.goto(`${BASE_URL}/en/privacy-ios.html`);
    const htmlLangEN = await page.locator('html').getAttribute('lang');
    expect(htmlLangEN).toBe('en');

    // Test French version
    await page.goto(`${BASE_URL}/fr/privacy-ios.html`);
    const htmlLangFR = await page.locator('html').getAttribute('lang');
    expect(htmlLangFR).toBe('fr');
  });

  test('all pages should have valid lang attribute matching content', async ({ page }) => {
    const enPages = ['/en/', '/en/pricing.html', '/en/challenge.html'];
    const frPages = ['/fr/', '/fr/pricing.html', '/fr/challenge.html'];

    // Test English pages
    for (const pagePath of enPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, `${pagePath} should have lang="en"`).toBe('en');
    }

    // Test French pages
    for (const pagePath of frPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, `${pagePath} should have lang="fr"`).toBe('fr');
    }
  });
});

test.describe('P1 High Priority - Meta Descriptions @ahrefs', () => {

  test('challenge page meta description should be 120-160 characters', async ({ page }) => {
    // Test English version
    await page.goto(`${BASE_URL}/en/challenge.html`);
    const metaDescEN = await page.locator('meta[name="description"]').getAttribute('content');

    expect(metaDescEN.length, 'EN meta description should be 120-160 chars').toBeGreaterThanOrEqual(120);
    expect(metaDescEN.length, 'EN meta description should be 120-160 chars').toBeLessThanOrEqual(160);

    // Test French version
    await page.goto(`${BASE_URL}/fr/challenge.html`);
    const metaDescFR = await page.locator('meta[name="description"]').getAttribute('content');

    expect(metaDescFR.length, 'FR meta description should be 120-160 chars').toBeGreaterThanOrEqual(120);
    expect(metaDescFR.length, 'FR meta description should be 120-160 chars').toBeLessThanOrEqual(160);
  });

  test('all pages should have meta descriptions in optimal range', async ({ page }) => {
    const pages = [
      '/en/',
      '/en/pricing.html',
      '/en/documentation.html',
      '/en/challenge.html',
      '/en/support.html',
      '/fr/',
      '/fr/pricing.html'
    ];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

      expect(metaDesc, `${pagePath} should have meta description`).toBeTruthy();
      expect(metaDesc.length, `${pagePath} meta description should be 120-160 chars`).toBeGreaterThanOrEqual(120);
      expect(metaDesc.length, `${pagePath} meta description should not exceed 160 chars`).toBeLessThanOrEqual(160);
    }
  });
});

/**
 * P2 MEDIUM PRIORITY - Optimization & Enhancement
 * These improve search visibility and rich results
 */
test.describe('P2 Medium Priority - Structured Data @ahrefs', () => {

  test('pricing page should have Product schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing.html`);

    // Get all JSON-LD scripts
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const combinedSchema = jsonLdScripts.join(' ');

    // Verify Product schema exists (flexible JSON formatting)
    expect(combinedSchema).toMatch(/"@type"\s*:\s*"Product"/);
    expect(combinedSchema).toContain('Sealfie');
    expect(combinedSchema).toMatch(/"offers"\s*:/);
  });

  test('documentation page should have HowTo schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/documentation.html`);

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const combinedSchema = jsonLdScripts.join(' ');

    // Verify HowTo schema exists (flexible JSON formatting)
    expect(combinedSchema).toMatch(/"@type"\s*:\s*"HowTo"/);
    expect(combinedSchema).toMatch(/"step"\s*:/);
  });

  test('challenge page should have Service schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/challenge.html`);

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const combinedSchema = jsonLdScripts.join(' ');

    // Verify Service schema exists (flexible JSON formatting)
    expect(combinedSchema).toMatch(/"@type"\s*:\s*"Service"/);
    expect(combinedSchema).toMatch(/"serviceType"\s*:/);
  });

  test('support page should have ContactPage schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/support.html`);

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const combinedSchema = jsonLdScripts.join(' ');

    // Verify ContactPage schema exists (flexible JSON formatting)
    expect(combinedSchema).toMatch(/"@type"\s*:\s*"ContactPage"/);
  });

  test('post-register page should have WebPage schema', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/post-register.html`);

    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const combinedSchema = jsonLdScripts.join(' ');

    // Verify WebPage schema exists (flexible JSON formatting)
    expect(combinedSchema).toMatch(/"@type"\s*:\s*"WebPage"/);
  });

  test('all pages with structured data should have valid JSON-LD', async ({ page }) => {
    const pagesWithSchema = [
      '/en/pricing.html',
      '/en/documentation.html',
      '/en/challenge.html',
      '/en/support.html',
      '/en/post-register.html'
    ];

    for (const pagePath of pagesWithSchema) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();

      expect(jsonLdScripts.length, `${pagePath} should have JSON-LD structured data`).toBeGreaterThan(0);

      // Verify each JSON-LD block is valid JSON
      for (const script of jsonLdScripts) {
        expect(() => {
          const parsed = JSON.parse(script);
          expect(parsed['@context']).toBe('https://schema.org');
        }, `${pagePath} JSON-LD should be valid`).not.toThrow();
      }
    }
  });
});

test.describe('P2 Medium Priority - Content Quality @ahrefs', () => {

  test('pricing page should have sufficient word count (300+ words)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing.html`);

    // Get all text content from main content area
    const bodyText = await page.locator('body').textContent();
    const wordCount = bodyText.trim().split(/\s+/).length;

    expect(wordCount, 'Pricing page should have at least 300 words').toBeGreaterThanOrEqual(300);
  });

  test('pricing page should have FAQ section for content depth', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing.html`);

    // Verify FAQ section exists
    const faqSection = page.locator('.pricing-faq-section, section:has-text("Frequently asked questions")');
    await expect(faqSection).toBeVisible();

    // Verify FAQ has multiple questions
    const faqQuestions = await page.locator('h3, .faq-question, [class*="question"]').count();
    expect(faqQuestions, 'FAQ should have multiple questions').toBeGreaterThanOrEqual(3);
  });
});

/**
 * GENERAL AHREFS HEALTH - Overall Site Quality
 * Ensures overall health score remains high
 */
test.describe('General Ahrefs Health Checks @ahrefs', () => {

  test('sitemap.xml should be accessible and valid', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/sitemap.xml`);

    expect(response.status()).toBe(200);

    const sitemapContent = await response.text();

    // Verify XML structure
    expect(sitemapContent).toContain('<?xml version="1.0"');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');

    // Verify contains production URLs
    expect(sitemapContent).toContain('https://sealf.ie/en/');
    expect(sitemapContent).toContain('https://sealf.ie/fr/');
  });

  test('IndexNow verification file should be accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/c3f8b2d0e3b24d9d48250bbf9b6bbe58b81c398b6b11e23b24b5e8799a061ee5.txt`);

    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content.trim()).toBe('c3f8b2d0e3b24d9d48250bbf9b6bbe58b81c398b6b11e23b24b5e8799a061ee5');
  });

  test('robots.txt should allow crawling and reference sitemap', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/robots.txt`);

    expect(response.status()).toBe(200);

    const robotsContent = await response.text();

    // Should reference sitemap
    expect(robotsContent).toContain('Sitemap:');
    expect(robotsContent).toContain('sitemap.xml');
  });

  test('all key pages should return 200 status (no 404s)', async ({ page }) => {
    const keyPages = [
      '/',
      '/en/',
      '/fr/',
      '/en/pricing.html',
      '/en/documentation.html',
      '/en/challenge.html',
      '/en/support.html',
      '/en/offline.html',
      '/fr/pricing.html',
      '/fr/challenge.html'
    ];

    for (const pagePath of keyPages) {
      const response = await page.request.get(`${BASE_URL}${pagePath}`);
      expect(response.status(), `${pagePath} should return 200`).toBe(200);
    }
  });
});

/**
 * AHREFS RECOMMENDATIONS - Best Practices
 * Additional optimizations from Ahrefs best practices
 */
test.describe('Ahrefs Best Practices @ahrefs', () => {

  test('all pages should have canonical URLs to prevent duplicates', async ({ page }) => {
    const pages = ['/en/', '/en/pricing.html', '/fr/', '/fr/pricing.html'];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');

      expect(canonicalUrl, `${pagePath} should have canonical URL`).toBeTruthy();
      expect(canonicalUrl, `${pagePath} canonical should be production URL`).toContain('https://sealf.ie');
    }
  });

  test('all images should have alt text for accessibility and SEO', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`);

    const images = await page.locator('img').all();

    for (const img of images) {
      const altText = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      expect(altText, `Image ${src} should have alt text`).toBeTruthy();
      expect(altText.length, `Image ${src} alt text should be descriptive`).toBeGreaterThan(0);
    }
  });

  test('pages should have proper heading hierarchy (H1 -> H2 -> H3)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/`);

    // Should have exactly one H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count, 'Page should have exactly one H1').toBe(1);

    // Should have H2s for main sections
    const h2Count = await page.locator('h2').count();
    expect(h2Count, 'Page should have multiple H2 section headings').toBeGreaterThan(0);
  });
});
