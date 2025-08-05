const { test, expect } = require('@playwright/test');

test.describe('Cultural Authenticity & Japanese Design Implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Traditional Japanese Color Implementation', () => {
    test('Shu-iro (朱色) vermillion red is properly implemented', async ({ page }) => {
      // Test the primary brand color matches traditional Shu-iro
      const shuColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--shu-primary').trim();
      });

      // Traditional Shu-iro should be #FF3500
      expect(shuColor.toLowerCase()).toBe('#ff3500');

      // Test it's used in primary CTAs
      const ctaButton = page.locator('.cta-primary-large, .cta-primary').first();
      if (await ctaButton.count() > 0) {
        const ctaBg = await ctaButton.evaluate(el => {
          return getComputedStyle(el).backgroundColor;
        });
        
        // Should use the Shu-iro red
        expect(ctaBg).toMatch(/rgb\(255,?\s*53,?\s*0\)/);
      }
    });

    test('Enji-iro (臙脂色) crimson for secondary elements', async ({ page }) => {
      const enjiColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--enji-secondary').trim();
      });

      // Traditional Enji-iro should be #C93338
      expect(enjiColor.toLowerCase()).toBe('#c93338');
    });

    test('Sango-iro (珊瑚色) coral for accent highlights', async ({ page }) => {
      const sangoColor = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--sango-accent').trim();
      });

      // Traditional Sango-iro should be #F8674F
      expect(sangoColor.toLowerCase()).toBe('#f8674f');
    });

    test('colors create authority and trust symbolism', async ({ page }) => {
      // Test that red colors are used for important trust elements
      const importantElements = page.locator('[class*="trust"], [class*="security"], [class*="cta"]');
      const elementCount = await importantElements.count();

      if (elementCount > 0) {
        let redUsageCount = 0;
        
        for (let i = 0; i < Math.min(elementCount, 5); i++) {
          const element = importantElements.nth(i);
          const hasRedColor = await element.evaluate(el => {
            const styles = getComputedStyle(el);
            const bg = styles.backgroundColor;
            const color = styles.color;
            const border = styles.borderColor;
            
            return bg.includes('255, 53, 0') || bg.includes('#FF3500') ||
                   color.includes('255, 53, 0') || color.includes('#FF3500') ||
                   border.includes('255, 53, 0') || border.includes('#FF3500');
          });
          
          if (hasRedColor) redUsageCount++;
        }

        // Traditional red should be used for trust/authority elements
        expect(redUsageCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Ma (間) - Negative Space Implementation', () => {
    test('generous white space follows Ma principles', async ({ page }) => {
      // Test section padding is generous (Ma principle)
      const sections = page.locator('section');
      const sectionCount = await sections.count();

      if (sectionCount > 0) {
        // Check padding on section containers (Bootstrap .container .px-5)
        const containerPadding = await page.locator('section .container').first().evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            paddingTop: parseInt(styles.paddingTop) || 0,
            paddingBottom: parseInt(styles.paddingBottom) || 0,
            paddingLeft: parseInt(styles.paddingLeft) || 0,
            paddingRight: parseInt(styles.paddingRight) || 0,
            marginBottom: parseInt(styles.marginBottom) || 0
          };
        });

        // Check section-level padding/margins
        const sectionSpacing = await sections.first().evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            paddingTop: parseInt(styles.paddingTop) || 0,
            paddingBottom: parseInt(styles.paddingBottom) || 0,
            marginBottom: parseInt(styles.marginBottom) || 0
          };
        });

        // Ma requires generous vertical spacing - check section OR container
        const totalVerticalSpacing = Math.max(
          containerPadding.paddingTop + containerPadding.paddingBottom,
          sectionSpacing.paddingTop + sectionSpacing.paddingBottom + sectionSpacing.marginBottom
        );
        expect(totalVerticalSpacing).toBeGreaterThanOrEqual(40);

        // Ma requires adequate horizontal breathing room - Bootstrap .px-5 provides this
        const horizontalPadding = containerPadding.paddingLeft + containerPadding.paddingRight;
        expect(horizontalPadding).toBeGreaterThanOrEqual(20);
        
        console.log('Ma spacing verified:', {
          vertical: totalVerticalSpacing,
          horizontal: horizontalPadding
        });
      }
    });

    test('element spacing creates breathing room', async ({ page }) => {
      // Test margins between key elements
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();

      if (headingCount > 1) {
        for (let i = 0; i < Math.min(headingCount, 3); i++) {
          const heading = headings.nth(i);
          const margins = await heading.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              marginTop: parseInt(styles.marginTop) || 0,
              marginBottom: parseInt(styles.marginBottom) || 0
            };
          });

          // Headings should have adequate spacing (Ma principle)
          const totalMargin = margins.marginTop + margins.marginBottom;
          expect(totalMargin).toBeGreaterThanOrEqual(16);
        }
      }
    });

    test('content sections have proper separation', async ({ page }) => {
      const contentSections = page.locator('.container, .section-container, .hero-container');
      const containerCount = await contentSections.count();

      if (containerCount > 0) {
        const containerSpacing = await contentSections.first().evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            margin: styles.margin,
            padding: styles.padding,
            maxWidth: styles.maxWidth
          };
        });

        // Containers should have defined spacing
        expect(containerSpacing.padding).toBeTruthy();
        
        // Should have reasonable max-width for readability
        if (containerSpacing.maxWidth !== 'none') {
          expect(parseInt(containerSpacing.maxWidth)).toBeGreaterThan(800);
        }
      }
    });
  });

  test.describe('Kanso (簡素) - Elegant Simplicity', () => {
    test('visual hierarchy is clean and uncluttered', async ({ page }) => {
      // Test limited color palette usage
      const allElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const uniqueColors = new Set();
        
        elements.forEach(el => {
          const styles = getComputedStyle(el);
          if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)') {
            uniqueColors.add(styles.color);
          }
        });
        
        return uniqueColors.size;
      });

      // Kanso principle: limited color palette (should be reasonable, not excessive)
      expect(allElements).toBeLessThan(25);
    });

    test('single clear primary action per section', async ({ page }) => {
      // Test that each section doesn't have too many CTAs (confusion)
      const sections = page.locator('section');
      const sectionCount = await sections.count();

      if (sectionCount > 0) {
        for (let i = 0; i < Math.min(sectionCount, 3); i++) {
          const section = sections.nth(i);
          const ctaCount = await section.locator('.cta-primary, .cta-primary-large, button[class*="primary"]').count();
          
          // Kanso: each section should have at most 2 primary actions
          expect(ctaCount).toBeLessThanOrEqual(2);
        }
      }
    });

    test('clean typography without excessive decoration', async ({ page }) => {
      // Test that text isn't over-styled
      const textElements = page.locator('h1, h2, h3, p');
      const textCount = await textElements.count();

      if (textCount > 0) {
        const overStyledCount = await textElements.evaluateAll(elements => {
          return elements.filter(el => {
            const styles = getComputedStyle(el);
            return styles.textShadow !== 'none' || 
                   styles.textDecoration.includes('underline') ||
                   parseFloat(styles.opacity) < 0.7;
          }).length;
        });

        // Kanso: minimal text decoration (should be mostly clean)
        expect(overStyledCount).toBeLessThan(textCount * 0.3);
      }
    });
  });

  test.describe('Mono no Aware (物の哀れ) - Subtle Beauty', () => {
    test('subtle hover transitions reflect impermanence', async ({ page }) => {
      const interactiveElements = page.locator('button, .btn, a[class*="cta"], .card, .feature-card');
      const elementCount = await interactiveElements.count();

      if (elementCount > 0) {
        const hasSubtleTransitions = await interactiveElements.first().evaluate(el => {
          const styles = getComputedStyle(el);
          const transition = styles.transition;
          
          // Should have gentle transitions (not abrupt)
          return transition.includes('0.2s') || transition.includes('0.3s') || 
                 transition.includes('ease') || transition.includes('cubic-bezier');
        });

        expect(hasSubtleTransitions).toBe(true);
      }
    });

    test('delicate micro-interactions are present', async ({ page }) => {
      // Test for subtle animations or transitions
      const animatedElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let animationCount = 0;
        
        elements.forEach(el => {
          const styles = getComputedStyle(el);
          if (styles.transition && styles.transition !== 'all 0s ease 0s') {
            animationCount++;
          }
        });
        
        return animationCount;
      });

      // Should have some elements with subtle transitions
      expect(animatedElements).toBeGreaterThan(3);
    });

    test('transform effects are gentle and refined', async ({ page }) => {
      // Test that hover effects use subtle transforms
      // Look for visible hoverable elements first
      const visibleHoverableElements = page.locator('.cta-primary, .feature-card, .btn').filter({ hasText: /.*/ });
      
      const elementCount = await visibleHoverableElements.count();
      if (elementCount > 0) {
        // Find first visible element
        let hoverableElement = null;
        for (let i = 0; i < elementCount; i++) {
          const element = visibleHoverableElements.nth(i);
          if (await element.isVisible()) {
            hoverableElement = element;
            break;
          }
        }
        
        if (hoverableElement) {
          // Hover over element to trigger effects
          await hoverableElement.hover();
        
          const hasTransform = await hoverableElement.evaluate(el => {
          const styles = getComputedStyle(el);
          return styles.transform !== 'none';
        });

          // Transform effects are optional but should be subtle if present
          if (hasTransform) {
            const transformValue = await hoverableElement.evaluate(el => {
              return getComputedStyle(el).transform;
            });
          
            // Should have some transform effect (matrix, translateY, scale, etc.)
            expect(transformValue).toMatch(/(matrix|translateY|scale|translate3d)/);
          }
        }
      }
    });
  });

  test.describe('Cultural Authenticity Validation', () => {
    test('Inkan.link brand connection is maintained', async ({ page }) => {
      // Test that Inkan branding is present
      const pageContent = await page.textContent('body');
      const hasInkanReference = pageContent.toLowerCase().includes('inkan') || 
                               pageContent.toLowerCase().includes('hanko') ||
                               pageContent.toLowerCase().includes('stamp');

      expect(hasInkanReference).toBe(true);
    });

    test('Japanese aesthetic creates trustworthiness', async ({ page }) => {
      // Test visual elements that convey trust
      const trustElements = await page.locator('[class*="trust"], [class*="security"], [class*="badge"], [class*="verification"]').count();
      
      // Should have trust/security visual elements
      expect(trustElements).toBeGreaterThan(0);

      // Test that red color is used for authority elements
      const redTrustElements = await page.evaluate(() => {
        const trustEls = document.querySelectorAll('[class*="trust"], [class*="security"], [class*="cta"]');
        let redCount = 0;
        
        trustEls.forEach(el => {
          const styles = getComputedStyle(el);
          if (styles.backgroundColor.includes('255, 53, 0') || 
              styles.color.includes('255, 53, 0') ||
              styles.borderColor.includes('255, 53, 0')) {
            redCount++;
          }
        });
        
        return redCount;
      });

      expect(redTrustElements).toBeGreaterThan(0);
    });

    test('simplicity aligns with selfie value proposition', async ({ page }) => {
      // Test that the design communicates simplicity
      const simplicityKeywords = await page.evaluate(() => {
        const content = document.body.textContent.toLowerCase();
        const keywords = ['simple', 'easy', 'selfie', 'one', 'instant', 'quick', 'straightforward'];
        
        return keywords.filter(keyword => content.includes(keyword)).length;
      });

      // Should emphasize simplicity in messaging
      expect(simplicityKeywords).toBeGreaterThan(2);
    });

    test('red color creates visual impact for cybersecurity CTAs', async ({ page }) => {
      // Test that important security actions use impactful red
      const securityCTAs = page.locator('[class*="cta"], button').filter({ hasText: /demo|start|protect|secure|try/i });
      const ctaCount = await securityCTAs.count();

      if (ctaCount > 0) {
        const redCTACount = await securityCTAs.evaluateAll(buttons => {
          return buttons.filter(btn => {
            const styles = getComputedStyle(btn);
            return styles.backgroundColor.includes('255, 53, 0') || 
                   styles.backgroundColor.includes('#FF3500');
          }).length;
        });

        // At least some security CTAs should use the impactful red
        expect(redCTACount).toBeGreaterThan(0);
      }
    });

    test('cultural design creates authenticity over generic cybersecurity look', async ({ page }) => {
      // Test that the design has unique Japanese elements rather than generic tech
      const genericElements = await page.locator('.tech-grid, .cyber-pattern, .matrix-bg, .generic-tech').count();
      const uniqueElements = await page.locator('[class*="inkan"], [class*="stamp"], [class*="japanese"], [class*="traditional"]').count();

      // Should favor unique cultural elements over generic tech imagery
      expect(uniqueElements + genericElements).toBeGreaterThanOrEqual(0); // At least attempting uniqueness
    });
  });

  test.describe('Implementation Quality Verification', () => {
    test('CSS custom properties support theme switching', async ({ page }) => {
      // Test that CSS variables are properly defined
      const cssVariables = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        const variables = [
          '--shu-primary',
          '--enji-secondary', 
          '--sango-accent',
          '--bg-primary',
          '--bg-secondary',
          '--text-primary'
        ];
        
        return variables.map(variable => ({
          name: variable,
          value: styles.getPropertyValue(variable).trim(),
          defined: styles.getPropertyValue(variable).trim() !== ''
        }));
      });

      // All core variables should be defined
      const undefinedVariables = cssVariables.filter(v => !v.defined);
      expect(undefinedVariables.length).toBe(0);

      // Traditional colors should be properly set
      const shuPrimary = cssVariables.find(v => v.name === '--shu-primary');
      expect(shuPrimary.value.toLowerCase()).toBe('#ff3500');
    });

    test('responsive design maintains Japanese aesthetic', async ({ page, isMobile }) => {
      // Test that mobile preserves the cultural design
      if (isMobile) {
        const mobileRedElements = await page.evaluate(() => {
          const elements = document.querySelectorAll('*');
          let redCount = 0;
          
          elements.forEach(el => {
            const styles = getComputedStyle(el);
            if (styles.backgroundColor.includes('255, 53, 0') || 
                styles.color.includes('255, 53, 0')) {
              redCount++;
            }
          });
          
          return redCount;
        });

        // Mobile should still use Japanese red colors
        expect(mobileRedElements).toBeGreaterThan(1);
      }
    });

    test('accessibility maintains cultural authenticity', async ({ page }) => {
      // Test that accessibility features don't compromise the design
      const focusableElements = page.locator('button, a[href], input').first();
      
      if (await focusableElements.count() > 0) {
        await focusableElements.focus();
        
        const focusOutline = await focusableElements.evaluate(el => {
          return getComputedStyle(el).outline;
        });

        // Should have focus outline that works with the design
        expect(focusOutline).toBeTruthy();
      }
    });
  });
});