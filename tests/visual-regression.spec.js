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
        video, [data-carousel="trends"] {
          animation: none !important;
          transition: none !important;
          animation-duration: 0s !important;
          animation-delay: 0s !important;
        }
        .video-timer-container video {
          display: none !important;
        }
        .carousel-track {
          transition: none !important;
          transform: translateX(0%) !important;
        }
        * {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
    
    // Take screenshot of hero section (updated for Tailwind implementation)
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toHaveScreenshot(`hero-section-${browserName}.png`, {
      timeout: 10000
    });
  });

  test('mobile navigation menu visual comparison', async ({ page, browserName, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu (updated for Tailwind implementation)
    await page.locator('#navbarToggler').click();
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
          video, .carousel-auto-advancing, [data-carousel="trends"] {
            animation: none !important;
            transition: none !important;
            animation-duration: 0s !important;
            animation-delay: 0s !important;
          }
          .video-timer-container video {
            display: none !important;
          }
          .carousel-track {
            transition: none !important;
            transform: translateX(0%) !important;
          }
          * {
            animation-duration: 0s !important;
            animation-delay: 0s !important;
            transition-duration: 0s !important;
            transition-delay: 0s !important;
          }
        `
      });
      
      await expect(page).toHaveScreenshot(`${pageInfo.name}-full-${browserName}.png`, {
        fullPage: true,
        timeout: 15000
      });
    }
  });
});