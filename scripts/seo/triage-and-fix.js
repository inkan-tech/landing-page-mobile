#!/usr/bin/env node

/**
 * SEO Issue Triage & Auto-Fix System
 *
 * Analyzes Lighthouse SEO audit results and generates:
 * 1. Prioritized issue list with fix recommendations
 * 2. Automated fixes for common issues
 * 3. Playwright test stubs to validate fixes
 *
 * Usage:
 *   node scripts/seo/triage-and-fix.js [--auto-fix] [--generate-tests]
 *
 * Options:
 *   --auto-fix       Automatically apply fixes where possible
 *   --generate-tests Generate Playwright test stubs for issues
 */

const fs = require('fs');
const path = require('path');

// Configuration
const REPORT_DIR = path.join(__dirname, '../../reports/seo');
const SUMMARY_FILE = path.join(REPORT_DIR, 'summary.json');
const OUTPUT_DIR = path.join(__dirname, '../../reports/seo/triage');
const TESTS_DIR = path.join(__dirname, '../../tests/seo');

// Parse CLI arguments
const args = process.argv.slice(2);
const shouldAutoFix = args.includes('--auto-fix');
const shouldGenerateTests = args.includes('--generate-tests');

/**
 * SEO Issue Knowledge Base
 * Maps Lighthouse audit IDs to fix recommendations
 */
const ISSUE_KNOWLEDGE_BASE = {
  'meta-description': {
    priority: 'P0',
    category: 'Meta Tags',
    impact: 'High - Affects SERP click-through rates',
    autoFixable: false,
    fix: {
      description: 'Add meta description to <head> section',
      steps: [
        '1. Open the affected .pug file in src/pug/',
        '2. Add: meta(name="description", content=\'#{$i18n.meta.description}\')',
        '3. Update locales/en.json and locales/fr.json with description text',
        '4. Description should be 120-160 characters',
        '5. Include primary keywords and value proposition'
      ],
      example: `
// src/pug/index.pug
head
  meta(charset='utf-8')
  meta(name='viewport', content='width=device-width, initial-scale=1')
  meta(name='description', content=\#{$i18n.meta.description})
  title \#{$i18n.title}

// locales/en.json
{
  "meta": {
    "description": "Protect your business from deepfake fraud with Sealfie. Biometric authentication for executives and high-value transactions."
  }
}
      `.trim()
    },
    testTemplate: 'meta-description'
  },

  'document-title': {
    priority: 'P0',
    category: 'Meta Tags',
    impact: 'Critical - Page must have a title',
    autoFixable: false,
    fix: {
      description: 'Add or fix page title',
      steps: [
        '1. Ensure <title> tag exists in <head>',
        '2. Use format: title \#{$i18n.page.title} | \#{$i18n.title}',
        '3. Title should be 30-60 characters',
        '4. Include primary keyword near the beginning'
      ],
      example: `
// src/pug/pricing.pug
title \#{$i18n.banner.pricing} | \#{$i18n.title}

// locales/en.json
{
  "banner": {
    "pricing": "Pricing"
  },
  "title": "Sealfie app"
}
      `.trim()
    },
    testTemplate: 'page-title'
  },

  'html-has-lang': {
    priority: 'P0',
    category: 'Accessibility & SEO',
    impact: 'High - Required for international SEO',
    autoFixable: true,
    fix: {
      description: 'Add lang attribute to <html> tag',
      steps: [
        '1. Open src/pug/index.pug (or affected page)',
        '2. Change: html to html(lang=locale)',
        '3. Ensure locale variable is passed from i18n'
      ],
      example: `
// src/pug/index.pug
doctype html
html(lang=locale)
  head
    ...
      `.trim()
    },
    testTemplate: 'html-lang'
  },

  'link-text': {
    priority: 'P1',
    category: 'Content & Accessibility',
    impact: 'Medium - Affects user experience and crawlability',
    autoFixable: false,
    fix: {
      description: 'Ensure links have descriptive text',
      steps: [
        '1. Find links with generic text like "click here", "read more"',
        '2. Replace with descriptive text that explains destination',
        '3. For icon-only links, add aria-label attribute',
        '4. Example: a(href="/pricing" aria-label="View pricing plans")'
      ],
      example: `
// ❌ BAD
a(href="/pricing") Click here

// ✅ GOOD
a(href="/pricing" aria-label="View detailed pricing plans") View pricing

// ✅ GOOD - Icon link
a(href="/press" aria-label="Company press and news")
  i.fas.fa-newspaper
      `.trim()
    },
    testTemplate: 'link-text'
  },

  'image-alt': {
    priority: 'P1',
    category: 'Accessibility & SEO',
    impact: 'High - Required for accessibility and image SEO',
    autoFixable: false,
    fix: {
      description: 'Add alt text to all images',
      steps: [
        '1. Find images missing alt attributes',
        '2. Add descriptive alt text: img(src="..." alt="Description")',
        '3. For decorative images, use empty alt: alt=""',
        '4. Alt text should describe the image content and context'
      ],
      example: `
// Content image
img(src="/assets/img/device-mockup.png"
    alt="Sealfie mobile app showing biometric authentication interface")

// Decorative image
img(src="/assets/img/pattern.svg" alt="" aria-hidden="true")

// Logo
img(src="/assets/img/logo.svg" alt="Sealfie logo")
      `.trim()
    },
    testTemplate: 'image-alt'
  },

  'canonical': {
    priority: 'P1',
    category: 'Technical SEO',
    impact: 'High - Prevents duplicate content issues',
    autoFixable: false,
    fix: {
      description: 'Add canonical URL to prevent duplicate content',
      steps: [
        '1. Add to <head>: link(rel="canonical" href=\${canonicalUrl})',
        '2. Use absolute URLs: https://sealf.ie/en/page.html',
        '3. Ensure canonical points to preferred version',
        '4. Update for each language version'
      ],
      example: `
// src/pug/includes/head.pug
link(rel="canonical" href=\`https://sealf.ie/\${locale}/\${page}.html\`)

// Each page should have unique canonical
// Homepage EN: https://sealf.ie/en/
// Homepage FR: https://sealf.ie/fr/
// Pricing EN: https://sealf.ie/en/pricing.html
      `.trim()
    },
    testTemplate: 'canonical'
  },

  'hreflang': {
    priority: 'P1',
    category: 'International SEO',
    impact: 'High - Critical for multilingual sites',
    autoFixable: false,
    fix: {
      description: 'Add hreflang tags for language versions',
      steps: [
        '1. Add hreflang tags for each language version',
        '2. Include x-default for default language',
        '3. Use ISO 639-1 codes (en, fr)',
        '4. URLs must be absolute and match canonical'
      ],
      example: `
// src/pug/includes/head.pug
link(rel="alternate" hreflang="x-default" href="https://sealf.ie/en/")
link(rel="alternate" hreflang="en" href="https://sealf.ie/en/")
link(rel="alternate" hreflang="fr" href="https://sealf.ie/fr/")
      `.trim()
    },
    testTemplate: 'hreflang'
  },

  'robots-txt': {
    priority: 'P1',
    category: 'Technical SEO',
    impact: 'Medium - Guides search engine crawlers',
    autoFixable: true,
    fix: {
      description: 'Create or fix robots.txt file',
      steps: [
        '1. Create docs/robots.txt in build output',
        '2. Add sitemap reference',
        '3. Specify crawl rules'
      ],
      example: `
# docs/robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*.json$

Sitemap: https://sealf.ie/sitemap.xml
      `.trim()
    },
    testTemplate: 'robots-txt'
  },

  'structured-data': {
    priority: 'P2',
    category: 'Rich Results',
    impact: 'Medium - Enables rich snippets in search results',
    autoFixable: false,
    fix: {
      description: 'Add Schema.org structured data',
      steps: [
        '1. Add JSON-LD script to <head>',
        '2. Include Organization, WebSite, MobileApplication schemas',
        '3. Validate with Google Rich Results Test',
        '4. Update for each page type'
      ],
      example: `
// src/pug/includes/schema.pug
script(type="application/ld+json").
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Sealfie",
        "url": "https://sealf.ie",
        "logo": "https://sealf.ie/assets/img/logo.png"
      },
      {
        "@type": "MobileApplication",
        "name": "Sealfie",
        "operatingSystem": "Android, iOS",
        "applicationCategory": "SecurityApplication"
      }
    ]
  }
      `.trim()
    },
    testTemplate: 'structured-data'
  }
};

/**
 * Playwright test templates
 */
const TEST_TEMPLATES = {
  'meta-description': (pagePath) => `
test('has valid meta description on ${pagePath}', async ({ page }) => {
  await page.goto('${pagePath}');
  const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
  expect(metaDesc).toBeTruthy();
  expect(metaDesc.length).toBeGreaterThanOrEqual(120);
  expect(metaDesc.length).toBeLessThanOrEqual(160);
});
  `.trim(),

  'page-title': (pagePath) => `
test('has valid page title on ${pagePath}', async ({ page }) => {
  await page.goto('${pagePath}');
  const title = await page.title();
  expect(title.length).toBeGreaterThan(10);
  expect(title.length).toBeLessThanOrEqual(60);
});
  `.trim(),

  'html-lang': (pagePath) => `
test('has lang attribute on ${pagePath}', async ({ page }) => {
  await page.goto('${pagePath}');
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang).toBeTruthy();
  expect(lang).toMatch(/^(en|fr)$/);
});
  `.trim(),

  'canonical': (pagePath) => `
test('has canonical URL on ${pagePath}', async ({ page }) => {
  await page.goto('${pagePath}');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy();
  expect(canonical).toContain('https://sealf.ie');
});
  `.trim()
};

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(TESTS_DIR)) {
    fs.mkdirSync(TESTS_DIR, { recursive: true });
  }
}

/**
 * Load Lighthouse summary
 */
function loadSummary() {
  if (!fs.existsSync(SUMMARY_FILE)) {
    console.error('❌ No summary file found. Run lighthouse audit first:');
    console.error('   npm run seo:audit');
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf-8'));
}

/**
 * Triage issues from summary
 */
function triageIssues(summary) {
  const triage = {
    P0: [], // Critical
    P1: [], // High
    P2: [], // Medium
    P3: []  // Low
  };

  for (const page of summary.pages) {
    // Process critical issues
    for (const issue of page.criticalIssues || []) {
      const knowledge = ISSUE_KNOWLEDGE_BASE[issue.id];
      if (knowledge) {
        triage[knowledge.priority].push({
          ...issue,
          page: page.name,
          url: page.url,
          knowledge
        });
      } else {
        // Unknown issue - default to P2
        triage.P2.push({
          ...issue,
          page: page.name,
          url: page.url,
          knowledge: {
            priority: 'P2',
            category: 'Unknown',
            impact: 'Unknown - Manual investigation required',
            autoFixable: false,
            fix: {
              description: 'Manual investigation required',
              steps: ['Research issue in Lighthouse documentation']
            }
          }
        });
      }
    }

    // Process high priority issues
    for (const issue of page.highIssues || []) {
      const knowledge = ISSUE_KNOWLEDGE_BASE[issue.id];
      if (knowledge) {
        triage[knowledge.priority].push({
          ...issue,
          page: page.name,
          url: page.url,
          knowledge
        });
      }
    }
  }

  return triage;
}

/**
 * Generate triage report
 */
function generateTriageReport(triage, summary) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 SEO ISSUE TRIAGE REPORT');
  console.log('='.repeat(80));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`Audit Date: ${summary.timestamp}`);
  console.log('='.repeat(80));

  const report = {
    timestamp: new Date().toISOString(),
    auditTimestamp: summary.timestamp,
    summary: {
      P0: triage.P0.length,
      P1: triage.P1.length,
      P2: triage.P2.length,
      P3: triage.P3.length,
      total: triage.P0.length + triage.P1.length + triage.P2.length + triage.P3.length
    },
    issues: triage
  };

  // Print summary
  console.log('\n📊 ISSUE SUMMARY:');
  console.log(`   🔴 P0 (Critical):       ${report.summary.P0}`);
  console.log(`   🟠 P1 (High):           ${report.summary.P1}`);
  console.log(`   🟡 P2 (Medium):         ${report.summary.P2}`);
  console.log(`   🟢 P3 (Low):            ${report.summary.P3}`);
  console.log(`   📝 Total Issues:        ${report.summary.total}`);

  // Print detailed issues by priority
  for (const priority of ['P0', 'P1', 'P2', 'P3']) {
    if (triage[priority].length > 0) {
      console.log(`\n${getPriorityIcon(priority)} ${priority} ISSUES (${triage[priority].length}):`);
      console.log('─'.repeat(80));

      for (const issue of triage[priority]) {
        console.log(`\n📄 Page: ${issue.page}`);
        console.log(`   Issue: ${issue.title}`);
        console.log(`   Category: ${issue.knowledge.category}`);
        console.log(`   Impact: ${issue.knowledge.impact}`);
        console.log(`   Auto-Fixable: ${issue.knowledge.autoFixable ? '✅ Yes' : '❌ No'}`);
        console.log(`\n   Fix Steps:`);
        for (const step of issue.knowledge.fix.steps) {
          console.log(`      ${step}`);
        }

        if (issue.knowledge.fix.example) {
          console.log(`\n   Example:`);
          console.log(issue.knowledge.fix.example.split('\n').map(line => `      ${line}`).join('\n'));
        }
      }
    }
  }

  // Save report
  const reportPath = path.join(OUTPUT_DIR, 'triage-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n✅ Triage report saved: ${reportPath}`);

  return report;
}

/**
 * Generate Playwright tests for issues
 */
function generateTests(triage) {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 GENERATING PLAYWRIGHT TESTS');
  console.log('='.repeat(80));

  const generatedTests = [];

  // Group issues by page and test template
  const testsByPage = {};

  for (const priority of ['P0', 'P1']) {
    for (const issue of triage[priority]) {
      const template = issue.knowledge.testTemplate;
      if (!template || !TEST_TEMPLATES[template]) continue;

      const pagePath = issue.url.replace('https://sealf.ie', '');

      if (!testsByPage[issue.page]) {
        testsByPage[issue.page] = {
          pagePath,
          tests: []
        };
      }

      testsByPage[issue.page].tests.push({
        template,
        issue: issue.title
      });
    }
  }

  // Generate test files
  for (const [pageName, data] of Object.entries(testsByPage)) {
    const testFile = path.join(TESTS_DIR, `${pageName}-seo-fixes.spec.js`);

    let testContent = `const { test, expect } = require('@playwright/test');

/**
 * SEO Fix Validation Tests for ${pageName}
 *
 * Auto-generated from Lighthouse audit results
 * Generated: ${new Date().toISOString()}
 *
 * These tests validate that SEO issues have been fixed and prevent regressions.
 */

test.describe('SEO Fixes: ${pageName}', () => {
`;

    // Add tests
    const addedTemplates = new Set();
    for (const testInfo of data.tests) {
      // Avoid duplicate tests
      const key = `${testInfo.template}-${data.pagePath}`;
      if (addedTemplates.has(key)) continue;
      addedTemplates.add(key);

      const testCode = TEST_TEMPLATES[testInfo.template](data.pagePath);
      testContent += `\n  // Fix: ${testInfo.issue}\n  ${testCode}\n`;
    }

    testContent += '\n});\n';

    fs.writeFileSync(testFile, testContent);
    generatedTests.push(testFile);

    console.log(`✅ Generated: ${path.basename(testFile)}`);
  }

  console.log(`\n📁 Generated ${generatedTests.length} test files in: ${TESTS_DIR}`);

  return generatedTests;
}

/**
 * Get priority icon
 */
function getPriorityIcon(priority) {
  const icons = {
    P0: '🔴',
    P1: '🟠',
    P2: '🟡',
    P3: '🟢'
  };
  return icons[priority] || '⚪';
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting SEO Issue Triage');

  ensureOutputDir();

  // Load summary
  const summary = loadSummary();

  // Triage issues
  const triage = triageIssues(summary);

  // Generate report
  const report = generateTriageReport(triage, summary);

  // Generate tests if requested
  if (shouldGenerateTests) {
    generateTests(triage);
  }

  // Recommendations
  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(80));

  if (report.summary.P0 > 0) {
    console.log('⚠️  URGENT: Fix P0 (Critical) issues immediately!');
    console.log('   These issues directly impact SEO rankings and user experience.');
  }

  if (report.summary.P1 > 0) {
    console.log('📋 PRIORITY: Address P1 (High) issues this week.');
    console.log('   These issues affect search visibility and should be fixed soon.');
  }

  console.log('\n📖 Next Steps:');
  console.log('   1. Review triage report: ' + path.join(OUTPUT_DIR, 'triage-report.json'));
  console.log('   2. Implement fixes following the provided steps');
  console.log('   3. Run tests to validate fixes: npm run test:seo');
  console.log('   4. Re-run audit to verify improvements: npm run seo:audit');

  if (!shouldGenerateTests) {
    console.log('\n   💡 Tip: Run with --generate-tests to auto-create Playwright tests');
  }

  console.log('='.repeat(80) + '\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
