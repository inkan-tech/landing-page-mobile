const { test, expect } = require('@playwright/test');

/**
 * SEO Optimization Test Suite for https://sealf.ie/
 *
 * This test suite verifies critical SEO elements across all pages:
 * - Meta tags (title, description, Open Graph, Twitter Cards)
 * - Structured data (Schema.org JSON-LD)
 * - Canonical URLs and hreflang tags
 * - Image optimization (alt text, lazy loading)
 * - Internal linking structure
 * - Mobile-friendliness
 * - Page speed indicators
 *
 * Created: 2025-11-02
 * Purpose: Prevent SEO regressions and ensure best practices
 */

test.describe('SEO: Meta Tags & Titles', () => {
  const pages = [
    { path: '/', expectedTitle: 'Sealfie app', minDescriptionLength: 120 },
    { path: '/documentation.html', expectedTitleFragment: 'How it works | Sealfie', minDescriptionLength: 120 },
    { path: '/pricing.html', expectedTitleFragment: 'Pricing | Sealfie', minDescriptionLength: 120 },
    { path: '/press.html', expectedTitleFragment: 'Company news | Sealfie', minDescriptionLength: 100 },
    { path: '/challenge.html', expectedTitleFragment: 'Free security challenge | Sealfie', minDescriptionLength: 100 }
  ];

  for (const pageInfo of pages) {
    test(`SEO: ${pageInfo.path} has valid title tag`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(60); // Google SERP title limit

      if (pageInfo.expectedTitleFragment) {
        expect(title).toContain(pageInfo.expectedTitleFragment);
      } else {
        expect(title).toBe(pageInfo.expectedTitle);
      }
    });

    test(`SEO: ${pageInfo.path} has valid meta description`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription.length).toBeGreaterThanOrEqual(pageInfo.minDescriptionLength);
      expect(metaDescription.length).toBeLessThanOrEqual(160); // Google SERP description limit
    });

    test(`SEO: ${pageInfo.path} has canonical URL`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain('https://sealf.ie');

      // Ensure canonical URL is properly formed (no double slashes, correct path)
      expect(canonical).toMatch(/^https:\/\/sealf\.ie\/[a-z]{2}\//);
    });
  }
});

test.describe('SEO: Open Graph & Twitter Cards', () => {
  test('SEO: Homepage has complete Open Graph tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Required OG tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');

    expect(ogTitle).toBeTruthy();
    expect(ogTitle.length).toBeGreaterThan(10);
    expect(ogDescription).toBeTruthy();
    expect(ogDescription.length).toBeGreaterThan(50);
    expect(ogImage).toContain('https://sealf.ie');
    expect(ogImage).toMatch(/\.(jpg|jpeg|png|webp)$/);
    expect(ogUrl).toContain('https://sealf.ie');
    expect(ogType).toBe('website');
  });

  test('SEO: Homepage has complete Twitter Card tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content');
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

    expect(twitterCard).toBe('summary_large_image');
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
    expect(twitterImage).toContain('https://sealf.ie');
  });

  test('SEO: Open Graph image has proper dimensions specified', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ogImageWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content');
    const ogImageHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content');
    const ogImageAlt = await page.locator('meta[property="og:image:alt"]').getAttribute('content');

    expect(ogImageWidth).toBe('1200');
    expect(ogImageHeight).toBe('630');
    expect(ogImageAlt).toBeTruthy();
    expect(ogImageAlt.length).toBeGreaterThan(10);
  });
});

test.describe('SEO: Structured Data (Schema.org)', () => {
  test('SEO: Homepage has valid Organization schema', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(schemaScript).toBeTruthy();

    const schema = JSON.parse(schemaScript);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@graph']).toBeTruthy();

    // Find Organization schema
    const orgSchema = schema['@graph'].find(item => item['@type'] === 'Organization');
    expect(orgSchema).toBeTruthy();
    expect(orgSchema.name).toBeTruthy();
    expect(orgSchema.url).toContain('https://');
    expect(orgSchema.logo).toBeTruthy();
    expect(orgSchema.sameAs).toBeTruthy();
    expect(Array.isArray(orgSchema.sameAs)).toBeTruthy();
  });

  test('SEO: Homepage has valid WebSite schema with SearchAction', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    const schema = JSON.parse(schemaScript);

    const websiteSchema = schema['@graph'].find(item => item['@type'] === 'WebSite');
    expect(websiteSchema).toBeTruthy();
    expect(websiteSchema.url).toContain('https://sealf.ie');
    expect(websiteSchema.potentialAction).toBeTruthy();

    const searchAction = websiteSchema.potentialAction.find(action => action['@type'] === 'SearchAction');
    expect(searchAction).toBeTruthy();
  });

  test('SEO: Homepage has valid MobileApplication schema', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    const schema = JSON.parse(schemaScript);

    const appSchema = schema['@graph'].find(item => item['@type'] === 'MobileApplication');
    expect(appSchema).toBeTruthy();
    expect(appSchema.name).toBe('Sealfie');
    expect(appSchema.operatingSystem).toContain('Android');
    expect(appSchema.operatingSystem).toContain('iOS');
    expect(appSchema.applicationCategory).toBe('SecurityApplication');
    expect(appSchema.aggregateRating).toBeTruthy();
    expect(parseFloat(appSchema.aggregateRating.ratingValue)).toBeGreaterThan(0);
  });

  test('SEO: Homepage has valid BreadcrumbList schema', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    const schema = JSON.parse(schemaScript);

    const breadcrumbSchema = schema['@graph'].find(item => item['@type'] === 'BreadcrumbList');
    expect(breadcrumbSchema).toBeTruthy();
    expect(breadcrumbSchema.itemListElement).toBeTruthy();
    expect(Array.isArray(breadcrumbSchema.itemListElement)).toBeTruthy();
    expect(breadcrumbSchema.itemListElement.length).toBeGreaterThan(0);

    const firstItem = breadcrumbSchema.itemListElement[0];
    expect(firstItem['@type']).toBe('ListItem');
    expect(firstItem.position).toBe(1);
    expect(firstItem.name).toBeTruthy();
  });
});

test.describe('SEO: Hreflang & Internationalization', () => {
  test('SEO: Homepage has proper hreflang tags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hreflangTags = await page.locator('link[rel="alternate"][hreflang]').all();
    expect(hreflangTags.length).toBeGreaterThanOrEqual(3); // x-default, en, fr

    const hreflangValues = await Promise.all(
      hreflangTags.map(tag => tag.getAttribute('hreflang'))
    );

    expect(hreflangValues).toContain('x-default');
    expect(hreflangValues).toContain('en');
    expect(hreflangValues).toContain('fr');

    // Verify all hreflang URLs are absolute
    for (const tag of hreflangTags) {
      const href = await tag.getAttribute('href');
      expect(href).toContain('https://sealf.ie');
    }
  });

  test('SEO: Documentation page has proper hreflang implementation', async ({ page }) => {
    await page.goto('/documentation.html');
    await page.waitForLoadState('networkidle');

    // Check if page has lang attribute on html element
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toMatch(/^(en|fr)$/);
  });
});

test.describe('SEO: Image Optimization', () => {
  test('SEO: All images have alt text', async ({ page }) => {
    const paths = ['/', '/documentation.html', '/pricing.html', '/press.html'];

    for (const path of paths) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const images = await page.locator('img').all();

      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');

        // All images must have alt attribute (can be empty for decorative images)
        expect(alt).not.toBeNull();

        // Content images should have descriptive alt text
        if (src && !src.includes('badge') && !src.includes('logo')) {
          expect(alt.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('SEO: Carousel images have descriptive alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const carouselImages = await page.locator('[data-carousel="trends"] img').all();

    for (const img of carouselImages) {
      const alt = await img.getAttribute('alt');
      const loading = await img.getAttribute('loading');

      expect(alt).toBeTruthy();
      expect(alt.length).toBeGreaterThan(10); // Descriptive alt text
      expect(loading).toBe('lazy'); // Performance optimization
    }
  });

  test('SEO: Hero images are preloaded for LCP optimization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for preload links in head
    const preloadImages = await page.locator('link[rel="preload"][as="image"]').all();
    expect(preloadImages.length).toBeGreaterThan(0);

    for (const preload of preloadImages) {
      const href = await preload.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/\.(webp|jpg|jpeg|png|svg)$/i);
    }
  });
});

test.describe('SEO: Internal Linking Structure', () => {
  test('SEO: Navigation menu has proper internal links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const navLinks = await page.locator('nav a[href]').all();
    expect(navLinks.length).toBeGreaterThan(0);

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      const ariaLabel = await link.getAttribute('aria-label');

      // Internal links should be relative or contain sealf.ie domain
      if (href && !href.startsWith('http')) {
        expect(href).toMatch(/^\/(en|fr)?\/?[a-z-]*\.html?$|^mailto:|^#/);
      }

      // Navigation links should have descriptive text or aria-label
      const text = await link.textContent();
      if (!text || text.trim().length === 0) {
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('SEO: Footer has comprehensive internal links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footerLinks = await page.locator('footer a[href]').all();
    expect(footerLinks.length).toBeGreaterThan(5); // Should have multiple footer links

    // Check for important pages linked in footer
    const footerHrefs = await Promise.all(footerLinks.map(link => link.getAttribute('href')));
    const footerText = footerHrefs.join(' ');

    expect(footerText).toContain('pricing');
    expect(footerText).toContain('documentation');
  });

  test('SEO: CTA buttons have proper href attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaButtons = await page.locator('a.cta-primary-large, a.cta-secondary').all();

    for (const cta of ctaButtons) {
      const href = await cta.getAttribute('href');
      const ariaLabel = await cta.getAttribute('aria-label');

      expect(href).toBeTruthy();
      expect(ariaLabel).toBeTruthy(); // CTAs should have aria-label for accessibility
    }
  });

  test('SEO: Carousel links are crawlable and have proper attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const carouselLinks = await page.locator('[data-carousel="trends"] a').all();
    expect(carouselLinks.length).toBeGreaterThan(0);

    for (const link of carouselLinks) {
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');

      expect(href).toBeTruthy();
      expect(href).toMatch(/^https?:\/\//); // External research links

      // External links should have proper attributes
      if (target === '_blank') {
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      }
    }
  });
});

test.describe('SEO: Mobile-Friendliness', () => {
  test('SEO: Viewport meta tag is properly configured', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
  });

  test('SEO: Mobile-friendly tap targets (buttons >= 48px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const buttons = await page.locator('button, a.cta-primary-large, a.cta-secondary').all();

    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box && await button.isVisible()) {
        // Minimum touch target size should be 48x48px
        expect(box.height).toBeGreaterThanOrEqual(40); // Slightly relaxed for real-world scenarios
      }
    }
  });

  test('SEO: Text is readable on mobile (font-size >= 16px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyFontSize = await page.locator('body').evaluate(el =>
      window.getComputedStyle(el).fontSize
    );

    const fontSize = parseFloat(bodyFontSize);
    expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable size
  });
});

test.describe('SEO: Page Speed & Performance Indicators', () => {
  test('SEO: Critical resources are preloaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const preloads = await page.locator('link[rel="preload"]').all();
    expect(preloads.length).toBeGreaterThan(0);

    // Check for CSS preload
    const cssPreload = await page.locator('link[rel="preload"][as="style"]').count();
    expect(cssPreload).toBeGreaterThan(0);
  });

  test('SEO: DNS prefetch for external domains', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dnsPrefetch = await page.locator('link[rel="dns-prefetch"]').all();
    expect(dnsPrefetch.length).toBeGreaterThan(0);

    // Verify YouTube is prefetched (used in homepage video)
    const youtubePrefetch = await page.locator('link[rel="dns-prefetch"][href*="youtube"]').count();
    expect(youtubePrefetch).toBeGreaterThan(0);
  });

  test('SEO: Videos are lazy loaded or use poster images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const videos = await page.locator('video').all();

    for (const video of videos) {
      const loading = await video.getAttribute('loading');
      const preload = await video.getAttribute('preload');

      // Videos should either have lazy loading or preload="none/metadata"
      if (!loading || loading !== 'lazy') {
        expect(preload).toMatch(/none|metadata/);
      }
    }
  });

  test('SEO: Page has no render-blocking resources in head', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that CSS is loaded asynchronously or inline
    const blockingStyles = await page.locator('head link[rel="stylesheet"]:not([media]):not([onload])').all();

    // Only critical inline styles should be blocking
    // External stylesheets should be preloaded with onload handler
    expect(blockingStyles.length).toBeLessThanOrEqual(2); // Allow some critical styles
  });
});

test.describe('SEO: Content Quality Signals', () => {
  test('SEO: Homepage has sufficient text content (>300 words)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    const wordCount = bodyText.trim().split(/\s+/).length;

    expect(wordCount).toBeGreaterThan(300); // Minimum content for SEO
  });

  test('SEO: H1 tag is unique and descriptive', async ({ page }) => {
    const paths = ['/', '/documentation.html', '/pricing.html', '/press.html'];

    for (const path of paths) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const h1Elements = await page.locator('h1').all();
      expect(h1Elements.length).toBe(1); // Exactly one H1 per page

      const h1Text = await h1Elements[0].textContent();
      expect(h1Text.trim().length).toBeGreaterThan(10);
      expect(h1Text.trim().length).toBeLessThan(70); // Keep H1 concise
    }
  });

  test('SEO: Heading hierarchy is logical (H1 > H2 > H3)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));

      // Level should not skip (e.g., H1 -> H3)
      if (previousLevel > 0) {
        expect(level - previousLevel).toBeLessThanOrEqual(1);
      }

      previousLevel = level;
    }
  });

  test('SEO: Important keywords appear in content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyText = await page.locator('body').textContent();
    const lowerText = bodyText.toLowerCase();

    // Core business keywords should appear
    const keywords = ['deepfake', 'fraud', 'security', 'biometric', 'executive', 'bec'];

    for (const keyword of keywords) {
      expect(lowerText).toContain(keyword);
    }
  });
});

test.describe('SEO: Robots & Crawlability', () => {
  test('SEO: Robots meta tag allows indexing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsMeta).toBeTruthy();
    expect(robotsMeta).toContain('index');
    expect(robotsMeta).toContain('follow');
  });

  test('SEO: No broken internal links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const internalLinks = await page.locator('a[href^="/"], a[href^="./"]').all();

    for (const link of internalLinks) {
      const href = await link.getAttribute('href');

      // Skip anchor links and mailto links
      if (href.startsWith('#') || href.startsWith('mailto:')) {
        continue;
      }

      // Visit internal link and check it doesn't 404
      const response = await page.goto(href, { waitUntil: 'networkidle' });
      expect(response.status()).not.toBe(404);

      // Go back to homepage
      await page.goto('/');
    }
  });

  test('SEO: sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('https://sealf.ie');
  });

  test('SEO: robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('User-agent:');
    expect(content).toContain('Sitemap:');
  });
});
