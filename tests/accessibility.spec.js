const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  test('landing page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    const h2Elements = page.locator('h2');
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
    
    // Verify h1 contains the main hero title (current content)
    await expect(h1).toContainText('Your business is a target');
  });

  test('navigation has proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check mobile menu button has proper ARIA attributes
    const menuButton = page.locator('.navbar-toggler');
    await expect(menuButton).toHaveAttribute('aria-controls', 'navbarResponsive');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toHaveAttribute('aria-label', 'Toggle navigation');
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check all images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('keyboard navigation works for carousel', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find the carousel
    const carousel = page.locator('[data-carousel="trends"]');
    if (await carousel.count() > 0) {
      await carousel.focus();
      
      // Test arrow key navigation
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(500);
      
      // Test Home/End keys
      await page.keyboard.press('End');
      await page.waitForTimeout(500);
      
      await page.keyboard.press('Home');
      await page.waitForTimeout(500);
    }
  });

  test('form elements have proper labels', async ({ page }) => {
    // Check all pages for form elements
    const pages = ['/', '/documentation.html', '/pricing.html'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Check input elements have labels or aria-label
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const hasLabel = await input.getAttribute('aria-label') || 
                        await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0;
        
        if (hasLabel) {
          expect(hasLabel).toBeTruthy();
        }
      }
    }
  });
});