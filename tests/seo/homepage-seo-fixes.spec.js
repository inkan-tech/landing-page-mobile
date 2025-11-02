const { test, expect } = require('@playwright/test');

/**
 * SEO Fix Validation Tests for homepage
 *
 * Auto-generated from Lighthouse audit results
 * Generated: 2025-11-02T16:24:30.818Z
 *
 * These tests validate that SEO issues have been fixed and prevent regressions.
 */

test.describe('SEO Fixes: homepage', () => {

  // Fix: Document does not have a valid `rel=canonical`
  test('has canonical URL on /', async ({ page }) => {
  await page.goto('/');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy();
  expect(canonical).toContain('https://sealf.ie');
});

});
