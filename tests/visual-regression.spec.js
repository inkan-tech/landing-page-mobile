const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test('landing page hero section visual comparison', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for fonts to load
    await page.waitForTimeout(2000);
    
    // Hide dynamic elements that might cause flaky tests
    await page.addStyleTag({
      content: `
        .carousel-auto-advancing,
        video {
          animation: none !important;
          transition: none !important;
        }
      `
    });
    
    // Take screenshot of hero section
    const heroSection = page.locator('.masthead');
    await expect(heroSection).toHaveScreenshot(`hero-section-${browserName}.png`);
  });

  test('mobile navigation menu visual comparison', async ({ page, browserName, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu
    await page.locator('.navbar-toggler').click();
    await page.waitForTimeout(500);
    
    // Screenshot of mobile menu expanded
    const navbar = page.locator('#mainNav');
    await expect(navbar).toHaveScreenshot(`mobile-menu-expanded-${browserName}.png`);
  });

  test('technical verification section visual comparison', async ({ page, browserName }) => {
    await page.goto('/documentation.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Scroll to technical verification section
    const techSection = page.locator('.technical-verification-section');
    await techSection.scrollIntoViewIfNeeded();
    
    // Take screenshot of the section
    await expect(techSection).toHaveScreenshot(`technical-verification-${browserName}.png`);
  });

  test('full page screenshots for all major pages', async ({ page, browserName }) => {
    const pages = [
      { path: '/', name: 'homepage' },
      { path: '/documentation.html', name: 'documentation' },
      { path: '/pricing.html', name: 'pricing' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Hide dynamic content for consistent screenshots
      await page.addStyleTag({
        content: `
          video, .carousel-auto-advancing {
            animation: none !important;
            transition: none !important;
          }
        `
      });
      
      await expect(page).toHaveScreenshot(`${pageInfo.name}-full-${browserName}.png`, {
        fullPage: true
      });
    }
  });
});