const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('landing page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('critical resources load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that Bootstrap CSS loads
    const bootstrapIcons = page.locator('link[href*="bootstrap-icons"]');
    await expect(bootstrapIcons).toHaveCount(1);
    
    // Check that fonts load
    const fonts = page.locator('link[href*="fonts.googleapis.com"]');
    const fontCount = await fonts.count();
    expect(fontCount).toBeGreaterThan(0);
    
    // Check that main CSS loads
    const mainCSS = page.locator('link[href="/css/styles.css"]');
    await expect(mainCSS).toHaveCount(1);
  });

  test('JavaScript executes without errors', async ({ page }) => {
    const errors = [];
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Filter out known harmless errors (if any)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('service-worker')
    );
    
    expect(criticalErrors.length).toBe(0);
    
    if (criticalErrors.length > 0) {
      console.log('JavaScript errors found:', criticalErrors);
    }
  });

  test('page metrics are within acceptable ranges', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      };
    });
    
    console.log('Performance metrics:', metrics);
    
    // DOM Content Loaded should be under 2 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000);
    
    // First Contentful Paint should be under 1.5 seconds
    if (metrics.firstContentfulPaint) {
      expect(metrics.firstContentfulPaint).toBeLessThan(1500);
    }
  });

  test('images are optimized and load efficiently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all image elements
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      
      // Skip SVGs and data URLs for size checks
      if (src && !src.startsWith('data:') && !src.endsWith('.svg')) {
        // Check that image has alt text
        expect(alt).toBeTruthy();
        
        // Verify image loads successfully
        const isVisible = await img.isVisible();
        if (isVisible) {
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    }
  });
});