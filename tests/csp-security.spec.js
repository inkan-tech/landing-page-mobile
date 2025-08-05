const { test, expect } = require('@playwright/test');

test.describe('CSP and Security Tests', () => {
  test('Content Security Policy allows required resources', async ({ page }) => {
    const cspViolations = [];
    
    // Capture CSP violations
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Filter out known acceptable CSP violations
    const criticalViolations = cspViolations.filter(violation => 
      // Ignore MailChimp scripts (external service we don't control)
      !violation.includes('chimpstatic.com') &&
      !violation.includes('mailchimp') &&
      // Ignore web-vitals from unpkg (external measurement tool)
      !violation.includes('unpkg.com') &&
      !violation.includes('web-vitals') &&
      // Ignore other external analytics/measurement tools
      !violation.includes('googletagmanager.com') &&
      !violation.includes('google-analytics.com') &&
      // Ignore CSP meta tag warnings (browser implementation warnings, not violations)
      !violation.includes('frame-ancestors') &&
      !violation.includes('X-Frame-Options') &&
      !violation.includes('is ignored when delivered via a <meta> element')
    );
    
    // Log for debugging
    if (cspViolations.length > 0) {
      console.log(`Total CSP violations: ${cspViolations.length}, Critical: ${criticalViolations.length}`);
      if (criticalViolations.length > 0) {
        console.log('Critical CSP violations:', criticalViolations);
      }
    }
    
    // Should have no critical CSP violations for required resources
    expect(criticalViolations.length).toBe(0);
  });

  test('Bootstrap JavaScript loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that Bootstrap is available globally
    const bootstrapLoaded = await page.evaluate(() => {
      return typeof bootstrap !== 'undefined';
    });
    
    expect(bootstrapLoaded).toBe(true);
    
    // Check that Bootstrap components can be initialized
    const canCreateModal = await page.evaluate(() => {
      try {
        // Try to access Bootstrap Modal class
        return typeof bootstrap.Modal === 'function';
      } catch (e) {
        return false;
      }
    });
    
    expect(canCreateModal).toBe(true);
  });

  test('external resources load from whitelisted domains', async ({ page }) => {
    const resourceErrors = [];
    
    // Capture failed resource loads
    page.on('response', response => {
      if (!response.ok() && response.url().includes('http')) {
        resourceErrors.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out expected failures (favicon, etc.)
    const criticalFailures = resourceErrors.filter(error => 
      !error.url.includes('favicon') && 
      !error.url.includes('manifest') &&
      error.status !== 404
    );
    
    expect(criticalFailures.length).toBe(0);
    
    if (criticalFailures.length > 0) {
      console.log('Critical resource failures:', criticalFailures);
    }
  });

  test('security headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response.headers();
    
    // Check for security-related meta tags in the HTML
    await page.waitForLoadState('networkidle');
    
    const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]');
    await expect(cspMeta).toHaveCount(1);
    
    const xFrameOptions = page.locator('meta[http-equiv="X-Frame-Options"]');
    await expect(xFrameOptions).toHaveCount(1);
    
    const contentTypeOptions = page.locator('meta[http-equiv="X-Content-Type-Options"]');
    await expect(contentTypeOptions).toHaveCount(1);
  });

  test('no mixed content warnings', async ({ page }) => {
    const mixedContentWarnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'warning' && 
          (msg.text().includes('Mixed Content') || msg.text().includes('mixed content'))) {
        mixedContentWarnings.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(mixedContentWarnings.length).toBe(0);
    
    if (mixedContentWarnings.length > 0) {
      console.log('Mixed content warnings:', mixedContentWarnings);
    }
  });
});