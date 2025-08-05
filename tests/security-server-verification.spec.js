const { test, expect } = require('@playwright/test');

test.describe('Security Server Configuration Verification', () => {
  test.beforeEach(async ({ page }) => {
    // These tests verify the development server security
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Server Directory Security', () => {
    test('development server only serves docs directory', async ({ page }) => {
      // Test that only the docs directory is served, not the project root
      const response = await page.goto('/');
      expect(response.status()).toBe(200);
      
      // Verify we're getting the built HTML, not source files
      const content = await page.content();
      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<title>');
      
      // Should not contain Pug template syntax
      expect(content).not.toContain('#{$i18n');
      expect(content).not.toContain('include ../');
    });

    test('source directories are not accessible via web', async ({ page }) => {
      // Test that source code directories return 404 or are not accessible
      const protectedPaths = [
        '/src/',
        '/src/pug/',
        '/src/scss/',
        '/tests/',
        '/node_modules/',
        '/package.json',
        '/.git/',
        '/Gruntfile.js',
        '/src/pug/index.pug'
      ];

      for (const path of protectedPaths) {
        try {
          const response = await page.goto(path, { 
            waitUntil: 'networkidle',
            timeout: 5000 
          });
          
          // Should return 404 or 403 (not 200)
          expect(response.status()).not.toBe(200);
          
          // Common server responses for protected paths
          expect([403, 404, 500].includes(response.status())).toBe(true);
        } catch (error) {
          // Network errors are also acceptable (path doesn't exist)
          expect(error.message).toContain('net::ERR');
        }
      }
    });

    test('only built assets are accessible', async ({ page }) => {
      // Test that legitimate build assets are accessible
      const legitimatePaths = [
        '/css/styles.css',
        '/js/scripts.js',
        '/assets/favicon.svg'
      ];

      for (const path of legitimatePaths) {
        const response = await page.goto(path, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        
        // Built assets should be accessible
        expect(response.status()).toBe(200);
        
        // Verify content type is appropriate
        const contentType = response.headers()['content-type'] || '';
        if (path.endsWith('.css')) {
          expect(contentType).toContain('text/css');
        } else if (path.endsWith('.js')) {
          expect(contentType).toContain('javascript');
        } else if (path.endsWith('.svg')) {
          expect(contentType).toContain('image/svg');
        }
      }
    });

    test('server serves from docs directory not project root', async ({ page }) => {
      // Verify server configuration by checking what's actually served
      await page.goto('/');
      
      // Check that we get processed HTML, not raw Pug templates
      const htmlContent = await page.content();
      
      // Should contain processed HTML elements
      expect(htmlContent).toContain('<meta charset="utf-8">');
      expect(htmlContent).toContain('<link href="/css/styles.css"');
      
      // Should NOT contain any Pug template syntax
      expect(htmlContent).not.toContain('doctype html');
      expect(htmlContent).not.toContain('#{$i18n');
      expect(htmlContent).not.toContain('include includes/');
      expect(htmlContent).not.toContain('.pug');
      
      // Should not contain SCSS imports
      expect(htmlContent).not.toContain('@import');
      expect(htmlContent).not.toContain('.scss');
    });
  });

  test.describe('Content Security Policy Verification', () => {
    test('CSP headers protect against unauthorized scripts', async ({ page }) => {
      // Navigate to homepage and check CSP
      const response = await page.goto('/');
      
      // Find CSP meta tag or header
      const cspMeta = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
      
      expect(cspMeta).toBeTruthy();
      expect(cspMeta).toContain("script-src 'self'");
      expect(cspMeta).toContain("default-src 'self'");
      
      // Should allow required CDNs
      expect(cspMeta).toContain('https://cdn.jsdelivr.net');
      expect(cspMeta).toContain('https://cdnjs.cloudflare.com');
    });

    test('CSP prevents unauthorized external resources', async ({ page }) => {
      const cspViolations = [];
      
      // Listen for CSP violations
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
          cspViolations.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForTimeout(2000);

      // Should not have CSP violations for legitimate resources
      const blockedLegitimate = cspViolations.filter(violation => 
        violation.includes('cdn.jsdelivr.net') || 
        violation.includes('cdnjs.cloudflare.com') ||
        violation.includes('fonts.googleapis.com')
      );

      expect(blockedLegitimate.length).toBe(0);
    });

    test('security headers are properly configured', async ({ page }) => {
      const response = await page.goto('/');
      
      // Check for security meta tags in HTML
      const securityHeaders = await page.evaluate(() => {
        const headers = {};
        
        // Check meta tags for security headers
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (cspMeta) headers.csp = cspMeta.getAttribute('content');
        
        const xFrameMeta = document.querySelector('meta[http-equiv="X-Frame-Options"]');
        if (xFrameMeta) headers.xFrame = xFrameMeta.getAttribute('content');
        
        const xContentTypeMeta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
        if (xContentTypeMeta) headers.xContentType = xContentTypeMeta.getAttribute('content');
        
        return headers;
      });

      // Verify security headers are present
      expect(securityHeaders.csp).toBeTruthy();
      expect(securityHeaders.xFrame).toBe('DENY');
      expect(securityHeaders.xContentType).toBe('nosniff');
    });
  });

  test.describe('Build Process Security', () => {
    test('no development dependencies exposed in production build', async ({ page }) => {
      await page.goto('/');
      
      const pageContent = await page.content();
      
      // Should not expose development tools
      expect(pageContent).not.toContain('webpack');
      expect(pageContent).not.toContain('grunt');
      expect(pageContent).not.toContain('browsersync');
      expect(pageContent).not.toContain('sourcemap');
      
      // Should not contain development comments
      expect(pageContent).not.toContain('TODO');
      expect(pageContent).not.toContain('FIXME');
      expect(pageContent).not.toContain('DEBUG');
    });

    test('CSS and JS are minified in production build', async ({ page }) => {
      // Check if CSS is minified
      const cssResponse = await page.goto('/css/styles.css');
      const cssContent = await cssResponse.text();
      
      // Minified CSS should not have excessive whitespace/comments
      const hasExcessiveWhitespace = cssContent.includes('\n\n\n') || 
                                   cssContent.includes('    ') || // 4+ spaces
                                   cssContent.includes('/* ');
      
      // In production, CSS should be optimized
      expect(hasExcessiveWhitespace).toBe(false);
      
      // Check JS minification
      const jsResponse = await page.goto('/js/scripts.js');
      const jsContent = await jsResponse.text();
      
      // Should contain actual JavaScript code
      expect(jsContent.length).toBeGreaterThan(100);
      expect(jsContent).toContain('function');
    });

    test('sensitive configuration files are not accessible', async ({ page }) => {
      const sensitiveFiles = [
        '/.env',
        '/.env.local', 
        '/.env.production',
        '/package-lock.json',
        '/yarn.lock',
        '/.gitignore',
        '/README.md',
        '/Gruntfile.js',
        '/playwright.config.js'
      ];

      for (const file of sensitiveFiles) {
        try {
          const response = await page.goto(file, { 
            waitUntil: 'networkidle',
            timeout: 5000 
          });
          
          // These files should not be accessible
          expect(response.status()).not.toBe(200);
        } catch (error) {
          // Network errors are expected for protected files
          expect(error.message).toContain('net::ERR');
        }
      }
    });
  });

  test.describe('Server Configuration Validation', () => {
    test('server serves static files only from docs directory', async ({ page }) => {
      // Verify the server is configured correctly
      await page.goto('/');
      
      // Check that index.html is served from docs, not src
      const response = await page.goto('/');
      expect(response.status()).toBe(200);
      
      // The HTML should be processed (not source Pug)
      const html = await page.content();
      expect(html).toContain('<html lang="en">');
      expect(html).not.toContain('html(lang=$localeName)');
    });

    test('no directory listing is enabled', async ({ page }) => {
      // Test that directory listing is disabled
      try {
        const response = await page.goto('/assets/', { 
          waitUntil: 'networkidle',
          timeout: 5000 
        });
        
        // Should either redirect or show 403/404, not directory listing
        const content = await page.content();
        expect(content).not.toContain('Index of');
        expect(content).not.toContain('Parent Directory');
        
      } catch (error) {
        // Network errors are acceptable (directory doesn't exist or is protected)
        expect(error.message).toContain('net::ERR');
      }
    });

    test('HTTPS redirect or secure headers in production setup', async ({ page }) => {
      // While we can't test HTTPS in local dev, we can verify security headers
      await page.goto('/');
      
      const securityHeaders = await page.evaluate(() => {
        const metas = Array.from(document.querySelectorAll('meta[http-equiv]'));
        return metas.map(meta => ({
          httpEquiv: meta.getAttribute('http-equiv'),
          content: meta.getAttribute('content')
        }));
      });

      // Should have security-related meta tags
      const hasSecurityHeaders = securityHeaders.some(header => 
        header.httpEquiv === 'Content-Security-Policy' ||
        header.httpEquiv === 'X-Frame-Options' ||
        header.httpEquiv === 'X-Content-Type-Options'
      );

      expect(hasSecurityHeaders).toBe(true);
    });
  });

  test.describe('Japanese Design Security Integration', () => {
    test('external Japanese resources load securely', async ({ page }) => {
      await page.goto('/');
      
      // Test that external resources (fonts, etc.) load over HTTPS
      const networkRequests = [];
      
      page.on('request', request => {
        networkRequests.push(request.url());
      });

      await page.waitForLoadState('networkidle');
      
      // Filter external requests
      const externalRequests = networkRequests.filter(url => 
        url.includes('googleapis.com') || 
        url.includes('gstatic.com') ||
        url.includes('jsdelivr.net') ||
        url.includes('cloudflare.com')
      );

      // All external requests should be HTTPS
      const insecureRequests = externalRequests.filter(url => url.startsWith('http:'));
      expect(insecureRequests.length).toBe(0);

      // Should have at least some external requests (fonts, CDNs)
      expect(externalRequests.length).toBeGreaterThan(0);
    });

    test('Japanese theme system does not expose sensitive data', async ({ page }) => {
      await page.goto('/');
      
      // Check that theme system doesn't expose internal paths
      const themeManager = await page.evaluate(() => {
        return window.sealfieTheme ? Object.keys(window.sealfieTheme) : [];
      });

      // Theme manager should not expose file paths or sensitive info
      const exposedMethods = themeManager.filter(method => 
        method.includes('path') || 
        method.includes('file') || 
        method.includes('secret') ||
        method.includes('key')
      );

      expect(exposedMethods.length).toBe(0);
    });
  });
});

test.describe('Development vs Production Security', () => {
  test('production build removes development artifacts', async ({ page }) => {
    await page.goto('/');
    
    const pageSource = await page.content();
    
    // Should not contain development-only elements
    expect(pageSource).not.toContain('webpack-dev-server');
    expect(pageSource).not.toContain('livereload');
    expect(pageSource).not.toContain('hot-reload');
    expect(pageSource).not.toContain('browsersync');
    
    // Should not contain source maps in production
    expect(pageSource).not.toContain('sourceMappingURL');
    expect(pageSource).not.toContain('.map');
  });

  test('error pages do not expose server information', async ({ page }) => {
    try {
      // Try to access a non-existent page
      const response = await page.goto('/non-existent-page-test-404', {
        waitUntil: 'networkidle',
        timeout: 5000
      });
      
      if (response.status() === 404) {
        const errorContent = await page.content();
        
        // Should not expose server details
        expect(errorContent).not.toContain('Apache');
        expect(errorContent).not.toContain('nginx');
        expect(errorContent).not.toContain('Node.js');
        expect(errorContent).not.toContain('/Users/');
        expect(errorContent).not.toContain('C:\\');
        expect(errorContent).not.toContain('stack trace');
      }
    } catch (error) {
      // Network errors are expected for non-existent pages
      expect(error.message).toContain('net::ERR');
    }
  });
});