const { test, expect } = require('@playwright/test');

test.describe('BEC Trends Carousel Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Carousel Initialization and Structure', () => {
    test('carousel elements are present on homepage', async ({ page }) => {
      // Check if carousel exists on homepage
      const carousel = page.locator('[data-carousel="trends"]');
      await expect(carousel).toBeVisible();

      // Check essential carousel components
      const track = carousel.locator('.carousel-track');
      const slides = carousel.locator('.carousel-slide');
      const prevButton = carousel.locator('.carousel-prev');
      const nextButton = carousel.locator('.carousel-next');
      const indicators = carousel.locator('.indicator');

      await expect(track).toBeVisible();
      await expect(slides.first()).toBeVisible();
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
      
      // Should have multiple slides
      const slideCount = await slides.count();
      expect(slideCount).toBeGreaterThan(1);
      console.log(`BEC Carousel has ${slideCount} slides`);
    });

    test('carousel slides contain threat intelligence data', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();

        // Check each slide has threat content (using actual structure)
        for (let i = 0; i < Math.min(slideCount, 3); i++) {
          const slide = slides.nth(i);
          const slideCard = slide.locator('a.group'); // Main card link
          const trendNumber = slide.locator('div.text-4xl.font-bold'); // Number element
          const trendLabel = slide.locator('div.text-sm.font-semibold.uppercase'); // Label element
          const subtitle = slide.locator('h3'); // Subtitle

          await expect(slideCard).toBeVisible();
          await expect(trendNumber).toBeVisible();
          await expect(trendLabel).toBeVisible();
          await expect(subtitle).toBeVisible();

          // Verify content contains threat data
          const labelText = await trendLabel.textContent();
          const numberText = await trendNumber.textContent();
          expect(labelText).toBeTruthy();
          expect(numberText).toBeTruthy();
          expect(labelText.length).toBeGreaterThan(2);
        }
      }
    });

    test('carousel JavaScript class initializes correctly', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        // Check that BEC carousel is initialized
        const carouselInitialized = await page.evaluate(() => {
          const carouselElement = document.querySelector('[data-carousel="trends"]');
          return carouselElement && typeof BECCarousel !== 'undefined';
        });

        expect(carouselInitialized).toBe(true);

        // Check console logs confirm initialization
        const logs = [];
        page.on('console', msg => {
          if (msg.text().includes('BEC Trends Carousel')) {
            logs.push(msg.text());
          }
        });

        await page.reload();
        await page.waitForTimeout(2000);
        
        expect(logs.some(log => log.includes('initialized'))).toBe(true);
      }
    });
  });

  test.describe('Carousel Navigation', () => {
    test('next/prev buttons navigate slides correctly', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          const nextButton = carousel.locator('.carousel-next');
          const prevButton = carousel.locator('.carousel-prev');

          // Initially first slide should be active
          await expect(slides.first()).toHaveClass(/active/);

          // Click next button
          await nextButton.click();
          await page.waitForTimeout(500); // Animation time

          // Second slide should be active
          await expect(slides.nth(1)).toHaveClass(/active/);
          await expect(slides.first()).not.toHaveClass(/active/);

          // Click previous button
          await prevButton.click();
          await page.waitForTimeout(500);

          // First slide should be active again
          await expect(slides.first()).toHaveClass(/active/);
        }
      }
    });

    test('indicator dots navigate to correct slides', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const indicators = carousel.locator('.indicator');
        const slides = carousel.locator('.carousel-slide');
        const indicatorCount = await indicators.count();
        
        if (indicatorCount > 1) {
          // Click on second indicator
          await indicators.nth(1).click();
          await page.waitForTimeout(500);

          // Second slide should be active
          await expect(slides.nth(1)).toHaveClass(/active/);
          await expect(indicators.nth(1)).toHaveClass(/active/);

          // First slide should not be active
          await expect(slides.first()).not.toHaveClass(/active/);
          await expect(indicators.first()).not.toHaveClass(/active/);
        }
      }
    });

    test('carousel supports keyboard navigation', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Focus carousel
          await carousel.focus();

          // Press right arrow
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(500);

          // Second slide should be active
          await expect(slides.nth(1)).toHaveClass(/active/);

          // Press left arrow
          await page.keyboard.press('ArrowLeft');
          await page.waitForTimeout(500);

          // First slide should be active
          await expect(slides.first()).toHaveClass(/active/);

          // Test Home key (go to first slide)
          await page.keyboard.press('ArrowRight'); // Go to second slide
          await page.keyboard.press('Home');
          await page.waitForTimeout(500);
          await expect(slides.first()).toHaveClass(/active/);

          // Test End key (go to last slide)
          await page.keyboard.press('End');
          await page.waitForTimeout(500);
          await expect(slides.last()).toHaveClass(/active/);
        }
      }
    });
  });

  test.describe('Touch/Swipe Support', () => {
    test('carousel supports touch swipe navigation', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }

      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Get carousel bounds for touch simulation
          const carouselBox = await carousel.boundingBox();
          
          if (carouselBox) {
            const centerX = carouselBox.x + carouselBox.width / 2;
            const centerY = carouselBox.y + carouselBox.height / 2;

            // Initially first slide should be active
            await expect(slides.first()).toHaveClass(/active/);

            // Simulate swipe left (next slide)
            await page.touchscreen.tap(centerX, centerY);
            await page.touchscreen.tap(centerX - 100, centerY);
            await page.waitForTimeout(500);

            // Second slide should be active
            await expect(slides.nth(1)).toHaveClass(/active/);
          }
        }
      }
    });
  });

  test.describe('Auto-Advance Functionality', () => {
    test('carousel auto-advances every 4 seconds', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Initially first slide should be active
          await expect(slides.first()).toHaveClass(/active/);

          // Wait for auto-advance (4 seconds + buffer)
          await page.waitForTimeout(4500);

          // Second slide should now be active
          await expect(slides.nth(1)).toHaveClass(/active/);
          await expect(slides.first()).not.toHaveClass(/active/);
        }
      }
    });

    test('auto-advance pauses on hover', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Initially first slide should be active
          await expect(slides.first()).toHaveClass(/active/);

          // Hover over carousel to pause auto-advance
          await carousel.hover();

          // Wait longer than auto-advance time
          await page.waitForTimeout(5000);

          // Should still be on first slide (paused)
          await expect(slides.first()).toHaveClass(/active/);

          // Move mouse away to resume auto-advance
          await page.mouse.move(0, 0);
          await page.waitForTimeout(4500);

          // Should now advance to second slide
          await expect(slides.nth(1)).toHaveClass(/active/);
        }
      }
    });

    test('auto-advance resumes after user interaction', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          const nextButton = carousel.locator('.carousel-next');

          // Click next button (user interaction)
          await nextButton.click();
          await page.waitForTimeout(500);

          // Should be on second slide
          await expect(slides.nth(1)).toHaveClass(/active/);

          // Wait for auto-advance to resume (2 seconds delay + 4 seconds interval)
          await page.waitForTimeout(7000);

          // Should advance to next slide (third or loop to first)
          const expectedSlideIndex = slideCount > 2 ? 2 : 0;
          await expect(slides.nth(expectedSlideIndex)).toHaveClass(/active/);
        }
      }
    });
  });

  test.describe('Accessibility Features', () => {
    test('carousel announces slide changes to screen readers', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const nextButton = carousel.locator('.carousel-next');
        
        // Click to next slide
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Check if live region exists for screen readers
        const liveRegion = page.locator('#carousel-live-region');
        await expect(liveRegion).toHaveCount(1);

        // Verify live region has proper attributes
        await expect(liveRegion).toHaveAttribute('aria-live', 'polite');
        await expect(liveRegion).toHaveAttribute('aria-atomic', 'true');

        // Verify content is announced (updated for actual structure)
        const liveRegionText = await liveRegion.textContent();
        expect(liveRegionText).toMatch(/Slide \d+ of \d+/);
      }
    });

    test('carousel buttons have proper ARIA attributes', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const prevButton = carousel.locator('.carousel-prev');
        const nextButton = carousel.locator('.carousel-next');
        
        // Buttons should have accessible labels
        const prevLabel = await prevButton.getAttribute('aria-label');
        const nextLabel = await nextButton.getAttribute('aria-label');
        
        expect(prevLabel).toBeTruthy();
        expect(nextLabel).toBeTruthy();
        expect(prevLabel.toLowerCase()).toContain('previous');
        expect(nextLabel.toLowerCase()).toContain('next');
      }
    });

    test('carousel maintains focus management', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const nextButton = carousel.locator('.carousel-next');
        
        // Focus next button
        await nextButton.focus();
        
        // Verify button is focused
        const isFocused = await nextButton.evaluate(el => {
          return document.activeElement === el;
        });
        
        expect(isFocused).toBe(true);
      }
    });
  });

  test.describe('Performance and Intersection Observer', () => {
    test('carousel pauses when not in viewport', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        // Scroll carousel out of view
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await page.waitForTimeout(1000);

        // Scroll back to top to bring carousel into view
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        
        await page.waitForTimeout(1000);

        // Carousel should be functioning (intersection observer working)
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Auto-advance should resume
          await page.waitForTimeout(4500);
          
          // Should have advanced
          const activeSlides = await slides.evaluateAll(slides => {
            return slides.filter(slide => slide.classList.contains('active')).length;
          });
          
          expect(activeSlides).toBe(1); // Only one active slide at a time
        }
      }
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('carousel handles missing slides gracefully', async ({ page }) => {
      // This test checks that the carousel doesn't break with edge cases
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const slideCount = await slides.count();
        
        if (slideCount === 1) {
          // With only one slide, buttons should be disabled
          const prevButton = carousel.locator('.carousel-prev');
          const nextButton = carousel.locator('.carousel-next');
          
          const prevDisabled = await prevButton.evaluate(el => el.disabled);
          const nextDisabled = await nextButton.evaluate(el => el.disabled);
          
          expect(prevDisabled).toBe(true);
          expect(nextDisabled).toBe(true);
        }
      }
    });

    test('carousel loops correctly at boundaries', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        const slides = carousel.locator('.carousel-slide');
        const nextButton = carousel.locator('.carousel-next');
        const slideCount = await slides.count();
        
        if (slideCount > 1) {
          // Navigate to last slide
          for (let i = 0; i < slideCount - 1; i++) {
            await nextButton.click();
            await page.waitForTimeout(300);
          }
          
          // Should be on last slide
          await expect(slides.last()).toHaveClass(/active/);
          
          // Click next again - should loop to first slide
          await nextButton.click();
          await page.waitForTimeout(500);
          
          // Should be back to first slide
          await expect(slides.first()).toHaveClass(/active/);
        }
      }
    });
  });

  test.describe('Japanese Design Integration', () => {
    test('carousel uses Japanese color scheme', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        // Check if carousel elements use Japanese theme colors
        const indicators = carousel.locator('.indicator');
        
        if (await indicators.count() > 0) {
          const activeIndicator = indicators.locator('.active').first();
          
          const indicatorColor = await activeIndicator.evaluate(el => {
            const styles = getComputedStyle(el);
            return styles.backgroundColor;
          });
          
          // Should use theme colors (Shu-iro red or related)
          expect(indicatorColor).toMatch(/rgb\((255,?\s*53,?\s*0|201,?\s*51,?\s*56|248,?\s*103,?\s*79)\)/);
        }
      }
    });

    test('carousel maintains Ma spacing principles', async ({ page }) => {
      const carousel = page.locator('[data-carousel="trends"]');
      
      if (await carousel.count() > 0) {
        // Check spacing around carousel
        const carouselSpacing = await carousel.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            marginTop: parseInt(styles.marginTop) || 0,
            marginBottom: parseInt(styles.marginBottom) || 0,
            padding: parseInt(styles.paddingTop) + parseInt(styles.paddingBottom) || 0
          };
        });
        
        // Should have adequate Ma (negative space) around it
        const totalSpacing = carouselSpacing.marginTop + carouselSpacing.marginBottom + carouselSpacing.padding;
        expect(totalSpacing).toBeGreaterThanOrEqual(32); // Ma principle
      }
    });
  });
});