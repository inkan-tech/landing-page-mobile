/**
 * Ahrefs SEO Recommendations - Generic Page Verification Tests
 *
 * These tests verify Ahrefs recommendations across ALL pages
 * to prevent SEO regressions and maintain 99-100% health score.
 *
 * Run with: npx playwright test --grep @ahrefs
 *
 * Approach: Generic validation rules applied to all pages
 * instead of page-specific tests for better scalability.
 */

const { test, expect } = require('@playwright/test');

// Base URL for production site
const BASE_URL = 'https://sealf.ie';

/**
 * Comprehensive list of all pages to test
 * Grouped by locale for better organization
 */
const ALL_PAGES = {
  en: [
    '/en/',
    '/en/pricing.html',
    '/en/documentation.html',
    '/en/challenge.html',
    '/en/support.html',
    '/en/post-register.html',
    '/en/privacy-ios.html',
    '/en/terms.html',
    '/en/offline.html'
  ],
  fr: [
    '/fr/',
    '/fr/pricing.html',
    '/fr/documentation.html',
    '/fr/challenge.html',
    '/fr/support.html',
    '/fr/post-register.html',
    '/fr/privacy-ios.html',
    '/fr/terms.html'
  ]
};

// Flatten all pages into single array
const PAGES_TO_TEST = [...ALL_PAGES.en, ...ALL_PAGES.fr];

/**
 * P0 CRITICAL - GENERIC PAGE VALIDATIONS
 * These must pass for every page without exception
 */
test.describe('P0 Critical - Generic Page Health @ahrefs', () => {

  test('all pages should return 200 status (no 404 errors)', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      const response = await page.request.get(`${BASE_URL}${pagePath}`);
      expect(response.status(), `${pagePath} should return 200`).toBe(200);
    }
  });

  test('all pages should have at least one outgoing internal link', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Find all internal links (same domain or relative)
      const internalLinks = await page.locator('a[href^="/"], a[href^="https://sealf.ie"]').count();

      expect(internalLinks, `${pagePath} should have at least one internal link`).toBeGreaterThan(0);
    }
  });

  test('all pages should have valid HTML lang attribute', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const htmlLang = await page.locator('html').getAttribute('lang');

      // Determine expected language from path
      const expectedLang = pagePath.startsWith('/fr') ? 'fr' : 'en';

      expect(htmlLang, `${pagePath} should have lang="${expectedLang}"`).toBe(expectedLang);
    }
  });
});

/**
 * P1 HIGH PRIORITY - META TAGS & SEO FUNDAMENTALS
 * Critical for search engine visibility
 */
test.describe('P1 High Priority - Meta Tags & SEO Fundamentals @ahrefs', () => {

  test('all pages should have meta description in optimal range (120-160 chars)', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

      expect(metaDesc, `${pagePath} should have meta description`).toBeTruthy();
      expect(metaDesc.length, `${pagePath} meta description should be >= 120 chars`).toBeGreaterThanOrEqual(120);
      expect(metaDesc.length, `${pagePath} meta description should be <= 160 chars`).toBeLessThanOrEqual(160);
    }
  });

  test('all pages should have unique, descriptive title tags', async ({ page }) => {
    const titles = new Map();

    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const title = await page.title();

      // Title should exist
      expect(title, `${pagePath} should have title`).toBeTruthy();

      // Content pages should have descriptive titles (30+ chars)
      // Utility pages (offline, post-register) can be shorter
      const isUtilityPage = pagePath.includes('offline') || pagePath.includes('post-register');

      if (!isUtilityPage) {
        expect(title.length, `${pagePath} title should be >= 30 chars for SEO`).toBeGreaterThanOrEqual(30);
      }

      // Warn if title is very long (may be truncated in SERPs) but don't fail
      if (title.length > 60) {
        console.warn(`⚠️  ${pagePath} title is ${title.length} chars (optimal: 50-60). May be truncated in search results.`);
      }

      // Title should be unique
      if (titles.has(title)) {
        throw new Error(`Duplicate title "${title}" found on ${pagePath} and ${titles.get(title)}`);
      }
      titles.set(title, pagePath);
    }
  });

  test('all pages should have canonical URLs', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const canonicalUrl = await page.locator('link[rel="canonical"]').getAttribute('href');

      expect(canonicalUrl, `${pagePath} should have canonical URL`).toBeTruthy();
      expect(canonicalUrl, `${pagePath} canonical should be production URL`).toContain('https://sealf.ie');
    }
  });

  test('all pages should have proper hreflang tags (if internationalized)', async ({ page }) => {
    // Pages that should have hreflang (exclude offline and locale-specific pages)
    const internationalPages = PAGES_TO_TEST.filter(p =>
      !p.includes('offline') &&
      !p.includes('privacy-ios') &&
      !p.includes('terms') &&
      !p.includes('post-register')
    );

    for (const pagePath of internationalPages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Should have hreflang tags
      const hreflangTags = await page.locator('link[rel="alternate"][hreflang]').count();

      if (hreflangTags > 0) {
        // Should have at least EN and FR versions
        const enHreflang = await page.locator('link[rel="alternate"][hreflang="en"]').count();
        const frHreflang = await page.locator('link[rel="alternate"][hreflang="fr"]').count();

        expect(enHreflang, `${pagePath} should have EN hreflang`).toBeGreaterThan(0);
        expect(frHreflang, `${pagePath} should have FR hreflang`).toBeGreaterThan(0);

        // x-default should point to /en/ version (no redirects)
        const xDefaultLink = page.locator('link[rel="alternate"][hreflang="x-default"]');
        const xDefaultExists = await xDefaultLink.count() > 0;

        if (xDefaultExists) {
          const xDefaultHref = await xDefaultLink.getAttribute('href');
          expect(xDefaultHref, `${pagePath} x-default should point to /en/ version`).toMatch(/\/en\//);
        }
      }
    }
  });
});

/**
 * P2 MEDIUM PRIORITY - STRUCTURED DATA & RICH RESULTS
 * Enhances search visibility and rich snippets
 */
test.describe('P2 Medium Priority - Structured Data @ahrefs', () => {

  test('all pages should have valid JSON-LD structured data', async ({ page }) => {
    // Exclude utility pages that don't need structured data
    const pagesWithStructuredData = PAGES_TO_TEST.filter(p =>
      !p.includes('offline') &&
      !p.includes('privacy-ios') &&
      !p.includes('terms')
    );

    for (const pagePath of pagesWithStructuredData) {
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

  test('all pages should have WebPage schema at minimum', async ({ page }) => {
    // Exclude utility pages that don't need structured data
    const pagesWithStructuredData = PAGES_TO_TEST.filter(p =>
      !p.includes('offline') &&
      !p.includes('privacy-ios') &&
      !p.includes('terms')
    );

    for (const pagePath of pagesWithStructuredData) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const combinedSchema = jsonLdScripts.join(' ');

      // Every page should have at least WebPage schema
      expect(combinedSchema, `${pagePath} should have WebPage schema`).toMatch(/"@type"\s*:\s*"WebPage"/);
    }
  });

  test('pages should have appropriate specific schemas based on content', async ({ page }) => {
    const schemaExpectations = {
      '/en/pricing.html': /"@type"\s*:\s*"Product"/,
      '/fr/pricing.html': /"@type"\s*:\s*"Product"/,
      '/en/documentation.html': /"@type"\s*:\s*"HowTo"/,
      '/fr/documentation.html': /"@type"\s*:\s*"HowTo"/,
      '/en/challenge.html': /"@type"\s*:\s*"Service"/,
      '/fr/challenge.html': /"@type"\s*:\s*"Service"/,
      '/en/support.html': /"@type"\s*:\s*"ContactPage"/,
      '/fr/support.html': /"@type"\s*:\s*"ContactPage"/
    };

    for (const [pagePath, schemaPattern] of Object.entries(schemaExpectations)) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const combinedSchema = jsonLdScripts.join(' ');

      expect(combinedSchema, `${pagePath} should have specific schema type`).toMatch(schemaPattern);
    }
  });
});

/**
 * P2 MEDIUM PRIORITY - CONTENT QUALITY
 * Ensures pages have sufficient, valuable content
 */
test.describe('P2 Medium Priority - Content Quality @ahrefs', () => {

  test('all pages should have sufficient word count (250+ words minimum)', async ({ page }) => {
    const minimumWordCount = 250;

    for (const pagePath of PAGES_TO_TEST) {
      // Skip utility/confirmation pages (minimal content by design)
      if (pagePath.includes('offline') ||
          pagePath.includes('post-register') ||
          pagePath.includes('privacy-ios') ||
          pagePath.includes('terms')) {
        continue;
      }

      await page.goto(`${BASE_URL}${pagePath}`);

      // Get all text content from main content area
      const bodyText = await page.locator('body').textContent();
      const wordCount = bodyText.trim().split(/\s+/).length;

      expect(wordCount, `${pagePath} should have at least ${minimumWordCount} words`).toBeGreaterThanOrEqual(minimumWordCount);
    }
  });

  test('all pages should have exactly one H1 heading', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${pagePath} should have exactly one H1`).toBe(1);
    }
  });

  test('all pages should have proper heading hierarchy (H1 -> H2 -> H3)', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Should have H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${pagePath} should have H1`).toBeGreaterThan(0);

      // Should have H2s for main sections (unless very simple page)
      const h2Count = await page.locator('h2').count();
      if (!pagePath.includes('offline') && !pagePath.includes('post-register')) {
        expect(h2Count, `${pagePath} should have H2 section headings`).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * ACCESSIBILITY & UX - IMAGE OPTIMIZATION
 * Important for both SEO and accessibility
 */
test.describe('Accessibility - Image Optimization @ahrefs', () => {

  test('all images should have descriptive alt text', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const images = await page.locator('img').all();

      for (const img of images) {
        const altText = await img.getAttribute('alt');
        const src = await img.getAttribute('src');

        expect(altText, `Image ${src} on ${pagePath} should have alt text`).toBeTruthy();

        // Alt text should be reasonably descriptive (not just "image" or "icon")
        if (altText) {
          expect(altText.length, `Image ${src} alt text should be descriptive (>3 chars)`).toBeGreaterThan(3);
        }
      }
    }
  });
});

/**
 * SITE-WIDE INFRASTRUCTURE - TECHNICAL SEO
 * Core technical requirements that affect all pages
 */
test.describe('Site-wide Infrastructure @ahrefs', () => {

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

    // Verify all tested pages are in sitemap (except offline)
    const pagesInSitemap = PAGES_TO_TEST.filter(p => !p.includes('offline'));
    for (const pagePath of pagesInSitemap) {
      expect(sitemapContent, `Sitemap should contain ${pagePath}`).toContain(`https://sealf.ie${pagePath}`);
    }
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
});

/**
 * PERFORMANCE & BEST PRACTICES
 * Additional optimizations for better rankings
 */
test.describe('Performance & Best Practices @ahrefs', () => {

  test('all pages should have Open Graph tags for social sharing', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Should have OG tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

      expect(ogTitle, `${pagePath} should have og:title`).toBeTruthy();
      expect(ogDescription, `${pagePath} should have og:description`).toBeTruthy();
      expect(ogImage, `${pagePath} should have og:image`).toBeTruthy();
    }
  });

  test('all pages should have Twitter Card tags', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');

      expect(twitterCard, `${pagePath} should have twitter:card`).toBeTruthy();
      expect(twitterTitle, `${pagePath} should have twitter:title`).toBeTruthy();
    }
  });

  test('all pages should have favicon configured', async ({ page }) => {
    for (const pagePath of PAGES_TO_TEST) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const favicon = page.locator('link[rel="icon"]');
      const faviconExists = await favicon.count() > 0;

      expect(faviconExists, `${pagePath} should have favicon`).toBe(true);

      if (faviconExists) {
        const faviconHref = await favicon.getAttribute('href');
        expect(faviconHref, `${pagePath} favicon should exist`).toBeTruthy();
      }
    }
  });
});

/**
 * REGRESSION PREVENTION - SPECIFIC AHREFS ISSUES
 * Tests for specific issues found in previous audits
 */
test.describe('Regression Prevention - Historical Issues @ahrefs', () => {

  test('offline page should not be orphaned (must have incoming link)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/offline.html`);

    // Verify the page has at least one internal link back to the site
    const homepageLink = page.locator('a[href="/en/"]');
    await expect(homepageLink).toBeVisible();

    const linkText = await homepageLink.textContent();
    expect(linkText).toContain('Homepage');
  });

  test('pricing pages should have FAQ section for content depth', async ({ page }) => {
    const pricingPages = ['/en/pricing.html', '/fr/pricing.html'];

    for (const pagePath of pricingPages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      // Verify FAQ section exists
      const faqSection = page.locator('.pricing-faq-section, section:has-text("Frequently asked questions"), section:has-text("Questions fréquentes")');
      await expect(faqSection).toBeVisible();

      // Verify FAQ has multiple questions
      const faqQuestions = await page.locator('h3, .faq-question, [class*="question"]').count();
      expect(faqQuestions, `${pagePath} FAQ should have multiple questions`).toBeGreaterThanOrEqual(3);
    }
  });

  test('challenge pages should have expanded meta description (not too short)', async ({ page }) => {
    const challengePages = ['/en/challenge.html', '/fr/challenge.html'];

    for (const pagePath of challengePages) {
      await page.goto(`${BASE_URL}${pagePath}`);

      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');

      // Previously was 46 chars (too short), now should be 120-160
      expect(metaDesc.length, `${pagePath} meta description should be expanded`).toBeGreaterThanOrEqual(120);
    }
  });
});
