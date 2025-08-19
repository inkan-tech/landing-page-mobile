const { test, expect } = require('@playwright/test');

test.describe('Mobile Navigation Tests', () => {
  test('mobile menu button works correctly', async ({ page, isMobile }) => {
    // Skip desktop tests for mobile-specific functionality  
    if (!isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that Tailwind framework is properly loaded (Bootstrap-free)
    const tailwindLoaded = await page.evaluate(() => {
      return window.sealfieTheme && window.sealfieTheme.getCurrentTheme() === 'light';
    });
    expect(tailwindLoaded).toBe(true);
    
    // Find mobile menu elements
    const menuButton = page.locator('.navbar-toggler');
    const mobileMenu = page.locator('#navbarResponsive');
    
    // Verify elements exist
    await expect(menuButton).toBeVisible();
    await expect(mobileMenu).toBeAttached();
    
    // Menu should be collapsed initially
    await expect(mobileMenu).not.toHaveClass(/show/);
    
    // Click menu button to expand
    await menuButton.click();
    
    // Wait for animation and verify menu is shown
    await page.waitForTimeout(500);
    await expect(mobileMenu).toHaveClass(/show/);
    
    // Verify menu items are visible
    const menuItems = mobileMenu.locator('.nav-link');
    await expect(menuItems.first()).toBeVisible();
    
    // Click again to collapse
    await menuButton.click();
    await page.waitForTimeout(500);
    await expect(mobileMenu).not.toHaveClass(/show/);
  });

  test('mobile navigation links are accessible', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu
    await page.locator('.navbar-toggler').click();
    await page.waitForTimeout(500);
    
    // Test each navigation link
    const links = [
      { text: 'Pricing', href: 'pricing.html' },
      { text: 'How it works', href: 'documentation.html' }
    ];
    
    for (const link of links) {
      const navLink = page.locator(`.nav-link:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute('href', link.href);
    }
  });
});