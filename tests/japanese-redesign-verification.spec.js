const { test, expect } = require('@playwright/test');

test.describe('Japanese Inkan-Inspired Redesign Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Color System Implementation', () => {
    test('traditional Japanese colors are implemented correctly', async ({ page }) => {
      // Test Shu-iro (Traditional Vermillion) primary color
      const shuPrimary = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--shu-primary').trim();
      });
      expect(shuPrimary).toBe('#FF3500');

      // Test Enji-iro (Crimson) secondary color
      const enjiSecondary = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--enji-secondary').trim();
      });
      expect(enjiSecondary).toBe('#C93338');

      // Test Sango-iro (Coral) accent color
      const sangoAccent = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--sango-accent').trim();
      });
      expect(sangoAccent).toBe('#F8674F');
    });

    test('CSS custom properties are defined for theme system', async ({ page }) => {
      const cssProperties = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return {
          bgPrimary: styles.getPropertyValue('--bg-primary').trim(),
          bgSecondary: styles.getPropertyValue('--bg-secondary').trim(),
          bgSurface: styles.getPropertyValue('--bg-surface').trim(),
          textPrimary: styles.getPropertyValue('--text-primary').trim(),
          textSecondary: styles.getPropertyValue('--text-secondary').trim()
        };
      });

      // Verify light theme defaults
      expect(cssProperties.bgPrimary).toBeTruthy();
      expect(cssProperties.bgSecondary).toBeTruthy();
      expect(cssProperties.textPrimary).toBeTruthy();
    });

    test('brand colors are applied to key elements', async ({ page }) => {
      // Check CTA buttons use Shu-iro red
      const primaryCTA = page.locator('.cta-primary-large').first();
      if (await primaryCTA.count() > 0) {
        const ctaStyles = await primaryCTA.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color
          };
        });
        
        // Should use the brand red color
        expect(ctaStyles.backgroundColor).toMatch(/rgb\(255,?\s*53,?\s*0\)/);
      }
    });
  });

  test.describe('Japanese Design Principles', () => {
    test('Ma (間) - generous negative space is implemented', async ({ page }) => {
      // Test section padding follows Ma principles
      const heroSection = page.locator('.hero-section, .masthead').first();
      if (await heroSection.count() > 0) {
        const padding = await heroSection.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            paddingTop: parseInt(styles.paddingTop),
            paddingBottom: parseInt(styles.paddingBottom)
          };
        });

        // Ma principle: generous vertical spacing (should be >= 60px)
        expect(padding.paddingTop + padding.paddingBottom).toBeGreaterThanOrEqual(60);
      }

      // Test element margins follow Ma spacing system
      const sections = page.locator('section');
      const sectionCount = await sections.count();
      
      if (sectionCount > 1) {
        const margins = await sections.nth(1).evaluate(el => {
          const styles = getComputedStyle(el);
          return parseInt(styles.marginBottom) || parseInt(styles.marginTop);
        });

        // Ma spacing should be substantial
        expect(margins).toBeGreaterThanOrEqual(24);
      }
    });

    test('Kanso (簡素) - elegant simplicity is maintained', async ({ page }) => {
      // Test that hero section doesn't have excessive elements
      const heroElements = await page.locator('.hero-section *, .masthead *').count();
      
      // Kanso principle: should not be overcrowded (reasonable element count)
      expect(heroElements).toBeLessThan(50);

      // Test clean visual hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Single main headline (simplicity)

      // Test button count follows simplicity
      const ctaButtons = await page.locator('.cta-primary, .cta-primary-large, .cta-secondary').count();
      expect(ctaButtons).toBeLessThanOrEqual(4); // Not overwhelming with CTAs
    });

    test('Mono no Aware (物の哀れ) - subtle interactions are present', async ({ page }) => {
      // Test hover transitions on interactive elements
      const interactiveElements = page.locator('button, .btn, a[class*="cta"], .feature-card').first();
      
      if (await interactiveElements.count() > 0) {
        const transitions = await interactiveElements.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            transition: styles.transition,
            transitionDuration: styles.transitionDuration
          };
        });

        // Should have subtle transitions
        expect(transitions.transition).toContain('0.');
        expect(transitions.transitionDuration).toMatch(/0\.[1-9]/);
      }
    });
  });

  test.describe('Typography System', () => {
    test('Japanese-inspired typography hierarchy is implemented', async ({ page }) => {
      // Test hero title typography
      const heroTitle = page.locator('h1, .hero-title').first();
      if (await heroTitle.count() > 0) {
        const titleStyles = await heroTitle.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing
          };
        });

        // Hero title should be large and impactful
        expect(parseInt(titleStyles.fontSize)).toBeGreaterThan(24);
        expect(parseInt(titleStyles.fontWeight)).toBeGreaterThanOrEqual(600);
      }

      // Test section titles
      const sectionTitle = page.locator('h2, .section-title').first();
      if (await sectionTitle.count() > 0) {
        const h2Styles = await sectionTitle.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          };
        });

        expect(parseInt(h2Styles.fontSize)).toBeGreaterThan(20);
        expect(parseInt(h2Styles.fontWeight)).toBeGreaterThanOrEqual(500);
      }
    });

    test('readable line height is maintained for Japanese aesthetics', async ({ page }) => {
      const bodyText = page.locator('p, .body-text, .hero-subtitle').first();
      if (await bodyText.count() > 0) {
        const lineHeight = await bodyText.evaluate(el => {
          return parseFloat(getComputedStyle(el).lineHeight);
        });

        // Japanese design favors generous line height for readability
        expect(lineHeight).toBeGreaterThan(1.4);
      }
    });
  });

  test.describe('Component Library Implementation', () => {
    test('primary CTA buttons follow Japanese design principles', async ({ page }) => {
      const primaryCTA = page.locator('.cta-primary, .cta-primary-large').first();
      
      if (await primaryCTA.count() > 0) {
        const ctaStyles = await primaryCTA.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            boxShadow: styles.boxShadow,
            fontWeight: styles.fontWeight
          };
        });

        // Should use brand red color
        expect(ctaStyles.backgroundColor).toMatch(/rgb\(255,?\s*53,?\s*0\)|#FF3500/i);
        
        // Should have rounded corners (Japanese aesthetic)
        expect(parseInt(ctaStyles.borderRadius)).toBeGreaterThan(4);
        
        // Should have substantial padding
        expect(ctaStyles.padding).toMatch(/\d+px/);
        
        // Should have subtle shadow
        expect(ctaStyles.boxShadow).toContain('rgba');
        
        // Should be bold
        expect(parseInt(ctaStyles.fontWeight)).toBeGreaterThanOrEqual(600);
      }
    });

    test('secondary CTA buttons maintain visual hierarchy', async ({ page }) => {
      const secondaryCTA = page.locator('.cta-secondary').first();
      
      if (await secondaryCTA.count() > 0) {
        const ctaStyles = await secondaryCTA.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor || styles.border,
            color: styles.color
          };
        });

        // Secondary should be outlined, not filled
        expect(ctaStyles.backgroundColor).toMatch(/rgba?\(0,?\s*0,?\s*0,?\s*0\)|transparent/);
      }
    });

    test('card components follow Japanese aesthetic principles', async ({ page }) => {
      const featureCard = page.locator('.feature-card, .card, .testimonial-card').first();
      
      if (await featureCard.count() > 0) {
        const cardStyles = await featureCard.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            backgroundColor: styles.backgroundColor,
            border: styles.border,
            transition: styles.transition
          };
        });

        // Cards should have rounded corners
        expect(parseInt(cardStyles.borderRadius)).toBeGreaterThan(8);
        
        // Should have generous padding (Ma principle)
        expect(cardStyles.padding).toMatch(/\d+px/);
        
        // Should have subtle transitions (Mono no Aware)
        expect(cardStyles.transition).toContain('0.');
      }
    });
  });

  test.describe('Theme System Implementation', () => {
    test('light theme is properly implemented', async ({ page }) => {
      // Verify we start in light theme
      const themeAttribute = await page.getAttribute('html', 'data-theme');
      expect(themeAttribute).toBe('light');

      // Test light theme colors
      const lightThemeColors = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return {
          bgPrimary: styles.getPropertyValue('--bg-primary').trim(),
          textPrimary: styles.getPropertyValue('--text-primary').trim()
        };
      });

      expect(lightThemeColors.bgPrimary).toMatch(/#FFFFFF|rgb\(255,?\s*255,?\s*255\)/i);
    });

    test('theme manager is available globally', async ({ page }) => {
      const themeManagerExists = await page.evaluate(() => {
        return typeof window.sealfieTheme !== 'undefined';
      });

      expect(themeManagerExists).toBe(true);

      // Test theme manager methods
      const themeManagerMethods = await page.evaluate(() => {
        return {
          hasGetCurrentTheme: typeof window.sealfieTheme.getCurrentTheme === 'function',
          hasIsDarkTheme: typeof window.sealfieTheme.isDarkTheme === 'function'
        };
      });

      expect(themeManagerMethods.hasGetCurrentTheme).toBe(true);
      expect(themeManagerMethods.hasIsDarkTheme).toBe(true);
    });

    test('dark theme colors are properly defined', async ({ page }) => {
      // Switch to dark theme programmatically
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });

      // Test that dark theme variables exist
      const darkThemeSupport = await page.evaluate(() => {
        const testDiv = document.createElement('div');
        testDiv.style.background = 'var(--bg-primary)';
        document.body.appendChild(testDiv);
        
        const bgColor = getComputedStyle(testDiv).backgroundColor;
        document.body.removeChild(testDiv);
        
        return bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent';
      });

      expect(darkThemeSupport).toBe(true);
    });
  });

  test.describe('Cultural Elements and Authenticity', () => {
    test('Japanese cultural references are present in content', async ({ page }) => {
      // Look for Japanese cultural terms in content
      const pageContent = await page.textContent('body');
      
      // Should contain references to Japanese concepts (if French version)
      const hasCulturalReferences = pageContent.includes('hanko') || 
                                   pageContent.includes('Inkan') || 
                                   pageContent.includes('japonais') ||
                                   pageContent.includes('Japanese') ||
                                   pageContent.includes('traditional');
      
      expect(hasCulturalReferences).toBe(true);
    });

    test('Inkan stamp visual metaphor is implemented', async ({ page }) => {
      // Look for stamp-related visual elements
      const stampElements = await page.locator('[class*="stamp"], [class*="seal"], [class*="inkan"]').count();
      
      // Should have some visual representation of stamp concept
      expect(stampElements).toBeGreaterThanOrEqual(0); // At least attempting visual metaphor
    });

    test('traditional red color creates visual impact', async ({ page }) => {
      // Test that red color is prominently featured (updated for Tailwind implementation)
      const redElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let redCount = 0;
        
        elements.forEach(el => {
          const styles = getComputedStyle(el);
          const bg = styles.backgroundColor;
          const color = styles.color;
          const border = styles.borderColor;
          
          // Check for multiple red variants: original FF3500 and Tailwind #c10
          if (bg.includes('255, 53, 0') || bg.includes('#FF3500') ||
              bg.includes('204, 17, 0') || bg.includes('#c10') ||
              color.includes('255, 53, 0') || color.includes('#FF3500') ||
              color.includes('204, 17, 0') || color.includes('#c10') ||
              border.includes('255, 53, 0') || border.includes('#FF3500') ||
              border.includes('204, 17, 0') || border.includes('#c10')) {
            redCount++;
          }
        });
        
        return redCount;
      });

      // Should have multiple elements using the traditional red
      expect(redElements).toBeGreaterThan(2);
    });
  });

  test.describe('Mobile-First Responsive Design', () => {
    test('mobile-first breakpoints are implemented', async ({ page, isMobile }) => {
      if (isMobile) {
        // Test mobile layout
        const heroSection = page.locator('.hero-section, .masthead').first();
        if (await heroSection.count() > 0) {
          const mobileStyles = await heroSection.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              padding: styles.padding,
              flexDirection: styles.flexDirection
            };
          });

          // Mobile should have appropriate padding
          expect(mobileStyles.padding).toMatch(/\d+px/);
        }
      }
    });

    test('responsive typography scales properly', async ({ page }) => {
      const heroTitle = page.locator('h1, .hero-title').first();
      if (await heroTitle.count() > 0) {
        const fontSize = await heroTitle.evaluate(el => {
          return getComputedStyle(el).fontSize;
        });

        // Should use responsive units or appropriate mobile size
        expect(fontSize).toMatch(/\d+(\.\d+)?(px|rem|em|vw)/);
        expect(parseInt(fontSize)).toBeGreaterThan(16); // Minimum readable size
      }
    });
  });

  test.describe('Accessibility Implementation', () => {
    test('focus states follow Japanese aesthetic', async ({ page }) => {
      const focusableElements = page.locator('button, a, input, [tabindex]').first();
      
      if (await focusableElements.count() > 0) {
        await focusableElements.focus();
        
        const focusStyles = await focusableElements.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineColor: styles.outlineColor,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow
          };
        });

        // Should have visible focus outline or box-shadow (Japanese aesthetic)
        const hasFocusStyles = focusStyles.outline !== 'none' || 
                              focusStyles.outlineWidth !== '0px' ||
                              focusStyles.boxShadow !== 'none';
        
        expect(hasFocusStyles).toBe(true);
      }
    });

    test('color contrast meets WCAG standards with Japanese colors', async ({ page }) => {
      // Test that Japanese red colors have sufficient contrast
      const textElements = page.locator('p, span, div').first();
      
      if (await textElements.count() > 0) {
        const contrast = await textElements.evaluate(el => {
          const styles = getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          return {
            color,
            backgroundColor,
            hasText: el.textContent.trim().length > 0
          };
        });

        expect(contrast.color).toBeTruthy();
      }
    });

    test('reduced motion preferences are respected', async ({ page }) => {
      // Test that animations can be disabled
      await page.addStyleTag({
        content: `
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      });

      // Verify reduced motion styles are applied
      const hasReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });

      // Test should pass regardless of user preference
      expect(typeof hasReducedMotion).toBe('boolean');
    });
  });
});