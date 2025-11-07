const { test, expect } = require('@playwright/test');

/**
 * Answer Engine Optimization (AEO) Test Suite for https://sealf.ie/
 *
 * This test suite verifies AEO implementation for AI platforms:
 * - robots.txt: AI crawler allowances and no Crawl-delay
 * - llms.txt: Mobile-focused content for AI platforms
 * - FAQPage schema: Structured Q&A for ChatGPT, Perplexity, Claude, Gemini
 * - Mobile app information: iOS & Android download links
 *
 * Created: 2025-11-06
 * Purpose: Ensure AI platforms can discover and cite Sealfie mobile app
 * Reference: AEO Strategic Guide (Stobo.app, Nov 2025)
 */

test.describe('AEO: robots.txt - AI Crawler Configuration', () => {
  test('robots.txt is accessible and returns 200', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('robots.txt contains all 11 required AI crawlers', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    // OpenAI crawlers (3)
    expect(content).toContain('User-agent: GPTBot');
    expect(content).toContain('User-agent: ChatGPT-User');
    expect(content).toContain('User-agent: OAI-SearchBot');

    // Anthropic crawlers (2)
    expect(content).toContain('User-agent: Claude-Web');
    expect(content).toContain('User-agent: anthropic-ai');

    // Other AI platform crawlers (6)
    expect(content).toContain('User-agent: PerplexityBot');
    expect(content).toContain('User-agent: GoogleOther');
    expect(content).toContain('User-agent: CCBot');
    expect(content).toContain('User-agent: Applebot-Extended');
    expect(content).toContain('User-agent: Meta-ExternalAgent');
    expect(content).toContain('User-agent: Bytespider');
  });

  test('robots.txt has AI crawlers listed BEFORE User-agent: *', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    const gptBotIndex = content.indexOf('User-agent: GPTBot');
    const wildcardIndex = content.indexOf('User-agent: *');

    expect(gptBotIndex).toBeGreaterThan(-1);
    expect(wildcardIndex).toBeGreaterThan(-1);
    expect(gptBotIndex).toBeLessThan(wildcardIndex);
  });

  test('robots.txt does NOT contain Crawl-delay directive', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    // Check for actual directive (not comments)
    const lines = content.split('\n');
    const crawlDelayDirectives = lines.filter(line =>
      line.trim().match(/^Crawl-delay:\s*\d+$/i)
    );

    expect(crawlDelayDirectives.length).toBe(0);
  });

  test('robots.txt does NOT contain comments (clean public file)', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    // Verify no comment lines (lines starting with #)
    const lines = content.split('\n');
    const commentLines = lines.filter(line => line.trim().startsWith('#'));
    expect(commentLines.length).toBe(0);
  });

  test('robots.txt allows all major paths for AI crawlers', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    // Check GPTBot section as representative
    const gptBotSection = content.substring(
      content.indexOf('User-agent: GPTBot'),
      content.indexOf('User-agent: ChatGPT-User')
    );

    expect(gptBotSection).toContain('Allow: /');
  });

  test('robots.txt contains sitemap directive', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    expect(content).toContain('Sitemap: https://sealf.ie/sitemap.xml');
  });
});

test.describe('AEO: llms.txt - Mobile App Content', () => {
  test('llms.txt is accessible and returns 200', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');
  });

  test('llms.txt has sufficient content length (1,350+ words)', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    const wordCount = content.split(/\s+/).length;
    expect(wordCount).toBeGreaterThanOrEqual(1350);
  });

  test('llms.txt contains mobile app branding and tagline', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('Sealfie');
    expect(content).toContain('mobile-first');
    expect(content).toContain('Business Email Compromise');
    expect(content).toContain('BEC');
  });

  test('llms.txt contains iOS download link', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('https://apps.apple.com/app/id1635309517');
    expect(content).toContain('iOS');
    expect(content).toContain('App Store');
  });

  test('llms.txt contains Android download link', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('https://play.google.com/store/apps/details?id=link.inkan.sealfie');
    expect(content).toContain('Android');
    expect(content).toContain('Google Play');
  });

  test('llms.txt contains pricing information', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    // Check for both pricing options (flexible with euro symbol encoding)
    expect(content).toMatch(/95.*month/i);
    expect(content).toContain('$195');
    expect(content).toMatch(/year.*executive/i);
  });

  test('llms.txt contains at least 10 FAQ sections', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    // Count question headers (###)
    const faqCount = (content.match(/###\s+/g) || []).length;
    expect(faqCount).toBeGreaterThanOrEqual(10);
  });

  test('llms.txt contains mobile system requirements', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('iOS 14');
    expect(content).toContain('Android 8');
    expect(content).toContain('biometric');
    expect(content).toMatch(/Face ID|Touch ID|fingerprint/);
  });

  test('llms.txt contains BEC fraud statistics', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('$5 billion');
    expect(content).toContain('$25 million');
    expect(content).toMatch(/Hong Kong/i);
  });

  test('llms.txt contains contact information', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('https://sealf.ie');
    expect(content).toContain('contact@inkan.link');
    expect(content).toContain('+33 1 83 64 39 71');
  });

  test('llms.txt contains use cases section', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    expect(content).toContain('Use Cases');
    expect(content).toMatch(/Wire Transfer/i);
    expect(content).toMatch(/Credential/i);
    expect(content).toMatch(/Remote Team/i);
  });

  test('llms.txt has answer-first format (direct responses)', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    // Check for direct answer patterns in FAQ section
    const faqSection = content.substring(content.indexOf('## FAQs'));

    // Should have question headers followed by immediate answers
    expect(faqSection).toMatch(/###[^\n]+\n[A-Z][^#]+/);
  });

  test('llms.txt does NOT contain metadata comments (clean public file)', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response.text();

    // Verify no metadata footer comments
    expect(content).not.toContain('Last updated:');
    expect(content).not.toContain('optimized for AI language models');

    // But still has mobile app content
    expect(content).toContain('iOS');
    expect(content).toContain('Android');
  });
});

test.describe('AEO: FAQPage Schema - Structured Q&A', () => {
  test('Homepage contains FAQPage schema in JSON-LD', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(schemaScripts.length).toBeGreaterThan(0);

    let hasFAQPage = false;
    for (const script of schemaScripts) {
      const content = await script.textContent();
      if (content.includes('FAQPage')) {
        hasFAQPage = true;
        break;
      }
    }

    expect(hasFAQPage).toBe(true);
  });

  test('FAQPage schema contains at least 8 questions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of schemaScripts) {
      const content = await script.textContent();
      if (content.includes('FAQPage')) {
        const schema = JSON.parse(content);

        // Navigate @graph if present
        let faqPage;
        if (schema['@graph']) {
          faqPage = schema['@graph'].find(item => item['@type'] === 'FAQPage');
        } else if (schema['@type'] === 'FAQPage') {
          faqPage = schema;
        }

        expect(faqPage).toBeTruthy();
        expect(faqPage.mainEntity).toBeTruthy();
        expect(faqPage.mainEntity.length).toBeGreaterThanOrEqual(8);

        // Verify first question structure
        const firstQuestion = faqPage.mainEntity[0];
        expect(firstQuestion['@type']).toBe('Question');
        expect(firstQuestion.name).toBeTruthy();
        expect(firstQuestion.acceptedAnswer).toBeTruthy();
        expect(firstQuestion.acceptedAnswer['@type']).toBe('Answer');
        expect(firstQuestion.acceptedAnswer.text).toBeTruthy();
        expect(firstQuestion.acceptedAnswer.text.length).toBeGreaterThan(40);

        break;
      }
    }
  });

  test('FAQPage schema questions are mobile app focused', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of schemaScripts) {
      const content = await script.textContent();
      if (content.includes('FAQPage')) {
        const schema = JSON.parse(content);

        let faqPage;
        if (schema['@graph']) {
          faqPage = schema['@graph'].find(item => item['@type'] === 'FAQPage');
        } else if (schema['@type'] === 'FAQPage') {
          faqPage = schema;
        }

        // Check that questions mention mobile/app/iOS/Android
        const allQuestions = faqPage.mainEntity.map(q => q.name + ' ' + q.acceptedAnswer.text).join(' ');

        const hasMobileContent =
          allQuestions.includes('Sealfie') &&
          (allQuestions.includes('iOS') ||
           allQuestions.includes('Android') ||
           allQuestions.includes('mobile') ||
           allQuestions.includes('app'));

        expect(hasMobileContent).toBe(true);
        break;
      }
    }
  });
});

test.describe('AEO: Mobile App Information Accessibility', () => {
  test('Homepage contains mobile app download links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for App Store link in schema or content
    const schemaScripts = await page.locator('script[type="application/ld+json"]').all();

    let hasAppStoreLink = false;
    let hasPlayStoreLink = false;

    for (const script of schemaScripts) {
      const content = await script.textContent();
      if (content.includes('MobileApplication')) {
        hasAppStoreLink = content.includes('apps.apple.com');
        hasPlayStoreLink = content.includes('play.google.com');
        if (hasAppStoreLink && hasPlayStoreLink) break;
      }
    }

    expect(hasAppStoreLink).toBe(true);
    expect(hasPlayStoreLink).toBe(true);
  });

  test('MobileApplication schema contains correct app IDs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const schemaScripts = await page.locator('script[type="application/ld+json"]').all();

    for (const script of schemaScripts) {
      const content = await script.textContent();
      if (content.includes('MobileApplication')) {
        expect(content).toContain('1635309517'); // iOS app ID
        expect(content).toContain('link.inkan.sealfie'); // Android package ID
        break;
      }
    }
  });
});

test.describe('AEO: Regression Prevention', () => {
  test('Sitemap is still accessible after AEO changes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/xml/);
  });

  test('robots.txt still allows traditional search engines', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    const content = await response.text();

    expect(content).toContain('User-agent: Googlebot');
    expect(content).toContain('User-agent: Bingbot');
    expect(content).toContain('Sitemap: https://sealf.ie/sitemap.xml');
  });

  test('Homepage still loads correctly after AEO implementation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check critical elements still exist
    const title = await page.title();
    expect(title).toContain('Sealfie');

    const h1 = await page.locator('h1').first();
    expect(await h1.isVisible()).toBe(true);
  });

  test('Meta description still exists on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(100);
  });
});

test.describe('AEO: Performance Impact', () => {
  test('robots.txt loads quickly (< 100ms)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/robots.txt');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(100);
  });

  test('llms.txt loads quickly (< 200ms)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/llms.txt');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(200);
  });

  test('FAQPage schema does not significantly increase page size', async ({ page }) => {
    const response = await page.goto('/');
    const content = await response.text();

    // Homepage with FAQPage schema should be under 500KB uncompressed
    expect(content.length).toBeLessThan(500000);
  });
});
