#!/usr/bin/env bun

/**
 * Critical CSS Extraction for Japanese Landing Page
 * Extracts above-the-fold CSS for optimal LCP performance
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

// Critical selectors for Japanese design system
const CRITICAL_SELECTORS = [
  // Core layout
  'html', 'body', 'main', 'header', 'nav', 'section',
  // Japanese design system
  '.hero-section', '.hero-title', '.hero-subtitle', '.accent-text',
  '.section-title', '.section-subtitle', 
  '.cta-primary-large', '.btn-japanese-primary',
  // Navigation
  '.navbar', '.nav-link', '.navbar-brand',
  // Japanese spacing (Ma)
  '.section-ma', '.section-ma-hero', '.container', '.px-5',
  // Theme variables (critical for FOUC prevention)
  ':root', '[data-theme="dark"]',
  // Typography
  '.text-center', '.mb-5', '.text-white',
  // Layout utilities (above fold)
  '.row', '.justify-content-center', '.col-lg-10', '.col-lg-8',
  // Japanese colors
  '.bg-shu-primary', '.text-shu-primary', '.border-shu-primary'
];

// Critical CSS patterns (regex)
const CRITICAL_PATTERNS = [
  /^\.hero-/, // All hero-related styles
  /^\.section-title/, // Section titles
  /^\.cta-/, // Call-to-action buttons
  /^\.nav/, // Navigation styles
  /^--shu-/, // Japanese color variables
  /^--enji-/, // Japanese color variables
  /^--sango-/, // Japanese color variables
  /^--spacing-ma/, // Ma spacing system
  /^\.btn-japanese/, // Japanese button system
  /^\.card-japanese/, // Japanese card system
];

async function extractCriticalCSS() {
  console.log('🎌 Extracting critical CSS for Japanese design system...');
  
  const tailwindCSS = fs.readFileSync(
    path.join(__dirname, '../docs/css/tailwind.css'), 
    'utf8'
  );
  
  const stylesCSS = fs.readFileSync(
    path.join(__dirname, '../docs/css/styles.css'), 
    'utf8'
  );
  
  const combinedCSS = tailwindCSS + '\n' + stylesCSS;
  
  try {
    const result = await postcss([
      // Extract critical styles
      {
        postcssPlugin: 'extract-critical',
        Once(root) {
          const criticalRules = [];
          
          root.walkRules(rule => {
            const selector = rule.selector;
            
            // Check if selector is critical
            const isCritical = 
              CRITICAL_SELECTORS.some(s => selector.includes(s)) ||
              CRITICAL_PATTERNS.some(pattern => pattern.test(selector));
            
            if (isCritical) {
              criticalRules.push(rule.clone());
            }
          });
          
          // Clear root and add only critical rules
          root.removeAll();
          criticalRules.forEach(rule => root.append(rule));
        }
      }
    ]).process(combinedCSS, { from: undefined });
    
    // Write critical CSS
    const criticalCSS = result.css;
    fs.writeFileSync(
      path.join(__dirname, '../docs/css/critical.css'),
      criticalCSS
    );
    
    // Calculate size savings
    const originalSize = (combinedCSS.length / 1024).toFixed(1);
    const criticalSize = (criticalCSS.length / 1024).toFixed(1);
    const savings = ((1 - criticalCSS.length / combinedCSS.length) * 100).toFixed(1);
    
    console.log('✅ Critical CSS extracted successfully');
    console.log(`📊 Size: ${originalSize}KB → ${criticalSize}KB (${savings}% reduction)`);
    console.log('📁 Output: docs/css/critical.css');
    
    return criticalCSS;
  } catch (error) {
    console.error('❌ Critical CSS extraction failed:', error);
    process.exit(1);
  }
}

// Run extraction
if (require.main === module) {
  extractCriticalCSS();
}

module.exports = { extractCriticalCSS, CRITICAL_SELECTORS };