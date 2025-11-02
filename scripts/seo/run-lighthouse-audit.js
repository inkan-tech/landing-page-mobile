#!/usr/bin/env node

/**
 * Lighthouse SEO Audit Runner
 *
 * Runs comprehensive Lighthouse audits on all pages of sealf.ie
 * Generates detailed reports for SEO analysis and tracking
 *
 * Usage:
 *   node scripts/seo/run-lighthouse-audit.js [--local] [--url=URL]
 *
 * Options:
 *   --local    Run against local dev server (http://localhost:3000)
 *   --url=URL  Run against specific URL
 */

const lighthouseModule = require('lighthouse');
const lighthouse = lighthouseModule.default || lighthouseModule;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL_PROD = 'https://sealf.ie';
const BASE_URL_LOCAL = 'http://localhost:3000';
const REPORT_DIR = path.join(__dirname, '../../reports/seo');

// Parse CLI arguments
const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const customUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];

const BASE_URL = customUrl || (isLocal ? BASE_URL_LOCAL : BASE_URL_PROD);

// Pages to audit
const PAGES = [
  { path: '/', name: 'homepage' },
  { path: '/en/', name: 'homepage-en' },
  { path: '/fr/', name: 'homepage-fr' },
  { path: '/en/documentation.html', name: 'documentation' },
  { path: '/en/pricing.html', name: 'pricing' },
  { path: '/en/challenge.html', name: 'challenge' }
];

// Lighthouse configuration
const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: ['redirects-http'], // Skip if testing locally
    throttlingMethod: 'simulate',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    },
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1
    }
  }
};

// Mobile configuration
const LIGHTHOUSE_CONFIG_MOBILE = {
  ...LIGHTHOUSE_CONFIG,
  settings: {
    ...LIGHTHOUSE_CONFIG.settings,
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    }
  }
};

/**
 * Ensure report directory exists
 */
function ensureReportDir() {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

/**
 * Launch Chrome and run Lighthouse audit
 */
async function runLighthouse(url, config, outputName) {
  console.log(`\n🔍 Auditing: ${url}`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });

  try {
    const options = {
      logLevel: 'info',
      output: ['json', 'html'],
      port: chrome.port
    };

    const runnerResult = await lighthouse(url, options, config);

    // Save JSON report
    const jsonPath = path.join(REPORT_DIR, `${outputName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(runnerResult.lhr, null, 2));

    // Save HTML report
    const htmlPath = path.join(REPORT_DIR, `${outputName}.html`);
    fs.writeFileSync(htmlPath, runnerResult.report[1]);

    console.log(`✅ Report saved: ${outputName}`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}`);

    return runnerResult.lhr;
  } finally {
    await chrome.kill();
  }
}

/**
 * Extract SEO-specific issues from Lighthouse results
 */
function extractSEOIssues(lhr) {
  const seoCategory = lhr.categories.seo;
  const issues = {
    critical: [],
    high: [],
    medium: [],
    low: []
  };

  // Analyze each SEO audit
  for (const auditRef of seoCategory.auditRefs) {
    const audit = lhr.audits[auditRef.id];

    if (audit.score !== null && audit.score < 1) {
      const issue = {
        id: audit.id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        displayValue: audit.displayValue
      };

      // Categorize by severity
      if (audit.score === 0) {
        issues.critical.push(issue);
      } else if (audit.score < 0.5) {
        issues.high.push(issue);
      } else if (audit.score < 0.9) {
        issues.medium.push(issue);
      } else {
        issues.low.push(issue);
      }
    }
  }

  return issues;
}

/**
 * Generate summary report
 */
function generateSummary(results) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 LIGHTHOUSE SEO AUDIT SUMMARY');
  console.log('='.repeat(80));
  console.log(`Audit Date: ${new Date().toISOString()}`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Pages Audited: ${results.length}`);
  console.log('='.repeat(80));

  const summary = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages: []
  };

  for (const result of results) {
    const { page, lhr, issues } = result;

    console.log(`\n📄 ${page.name.toUpperCase()}`);
    console.log(`   URL: ${BASE_URL}${page.path}`);
    console.log(`   Scores:`);
    console.log(`     Performance:   ${Math.round(lhr.categories.performance.score * 100)}/100`);
    console.log(`     Accessibility: ${Math.round(lhr.categories.accessibility.score * 100)}/100`);
    console.log(`     Best Practices: ${Math.round(lhr.categories['best-practices'].score * 100)}/100`);
    console.log(`     SEO:           ${Math.round(lhr.categories.seo.score * 100)}/100`);

    console.log(`   Issues:`);
    console.log(`     🔴 Critical: ${issues.critical.length}`);
    console.log(`     🟠 High:     ${issues.high.length}`);
    console.log(`     🟡 Medium:   ${issues.medium.length}`);
    console.log(`     🟢 Low:      ${issues.low.length}`);

    // Add to summary
    summary.pages.push({
      name: page.name,
      url: `${BASE_URL}${page.path}`,
      scores: {
        performance: Math.round(lhr.categories.performance.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
        seo: Math.round(lhr.categories.seo.score * 100)
      },
      issues: {
        critical: issues.critical.length,
        high: issues.high.length,
        medium: issues.medium.length,
        low: issues.low.length
      },
      criticalIssues: issues.critical,
      highIssues: issues.high
    });

    // Print critical issues
    if (issues.critical.length > 0) {
      console.log(`\n   🔴 CRITICAL ISSUES:`);
      for (const issue of issues.critical) {
        console.log(`      - ${issue.title}`);
      }
    }

    // Print high priority issues
    if (issues.high.length > 0) {
      console.log(`   🟠 HIGH PRIORITY ISSUES:`);
      for (const issue of issues.high) {
        console.log(`      - ${issue.title}`);
      }
    }
  }

  // Save summary
  const summaryPath = path.join(REPORT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n✅ Summary saved: ${summaryPath}`);

  // Calculate overall health
  const avgSeoScore = summary.pages.reduce((sum, p) => sum + p.scores.seo, 0) / summary.pages.length;
  const totalCritical = summary.pages.reduce((sum, p) => sum + p.issues.critical, 0);
  const totalHigh = summary.pages.reduce((sum, p) => sum + p.issues.high, 0);

  console.log('\n' + '='.repeat(80));
  console.log('🎯 OVERALL SEO HEALTH');
  console.log('='.repeat(80));
  console.log(`Average SEO Score: ${Math.round(avgSeoScore)}/100`);
  console.log(`Total Critical Issues: ${totalCritical}`);
  console.log(`Total High Priority Issues: ${totalHigh}`);

  if (totalCritical > 0) {
    console.log('\n⚠️  ACTION REQUIRED: Fix critical issues immediately!');
  } else if (totalHigh > 0) {
    console.log('\n⚠️  IMPROVEMENT NEEDED: Address high priority issues.');
  } else {
    console.log('\n✅ SEO HEALTH: Good! Continue monitoring and optimizing.');
  }
  console.log('='.repeat(80) + '\n');

  return summary;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Lighthouse SEO Audit');
  console.log(`Target: ${BASE_URL}`);

  ensureReportDir();

  const results = [];

  // Run audits for each page
  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;

    try {
      // Desktop audit
      const lhrDesktop = await runLighthouse(url, LIGHTHOUSE_CONFIG, `${page.name}-desktop`);
      const issues = extractSEOIssues(lhrDesktop);

      results.push({
        page,
        lhr: lhrDesktop,
        issues,
        device: 'desktop'
      });

      // Mobile audit
      const lhrMobile = await runLighthouse(url, LIGHTHOUSE_CONFIG_MOBILE, `${page.name}-mobile`);

      // We only collect detailed issues from desktop to avoid duplication
      results.push({
        page: { ...page, name: `${page.name}-mobile` },
        lhr: lhrMobile,
        issues: extractSEOIssues(lhrMobile),
        device: 'mobile'
      });

    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }

  // Generate summary
  const desktopResults = results.filter(r => r.device === 'desktop');
  generateSummary(desktopResults);

  console.log('✅ Lighthouse SEO Audit Complete!');
  console.log(`📁 Reports saved to: ${REPORT_DIR}`);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
