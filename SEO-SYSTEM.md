# SEO Optimization System

**Complete open-source SEO audit and optimization system for https://sealf.ie/**

---

## 🎯 System Overview

We've implemented a comprehensive, **100% open-source** SEO optimization system that:

1. ✅ **Audits** all pages with Google Lighthouse (performance, accessibility, SEO, best practices)
2. ✅ **Triages** issues by priority (P0-P3) with detailed fix instructions
3. ✅ **Generates** Playwright tests automatically to validate fixes
4. ✅ **Prevents** regressions with continuous testing
5. ✅ **Monitors** SEO health over time

**No expensive tools required** - Everything runs locally using:
- Google Lighthouse (free, open-source)
- Playwright (free, open-source testing framework)
- Bun scripts (custom automation)

---

## 🚀 Quick Start

### Run Complete SEO Workflow

```bash
# Full automated workflow:
# 1. Audit production site with Lighthouse
# 2. Triage issues and generate fix tests
# 3. Run all SEO validation tests
bun run seo:full
```

### Individual Commands

```bash
# 1. Audit production site
bun run seo:audit

# 2. Audit local development server
bun run seo:audit:local

# 3. Analyze issues and get fix recommendations
bun run seo:triage

# 4. Generate Playwright tests for fixes
bun run seo:triage:tests

# 5. Run existing comprehensive SEO tests
bun run test:seo
```

---

## 📁 What Was Created

### 1. Lighthouse Audit Automation
**Location:** `scripts/seo/run-lighthouse-audit.js`

**Features:**
- Audits all pages (homepage EN/FR, documentation, pricing, press, challenge)
- Generates desktop + mobile reports
- Produces JSON and HTML reports
- Creates aggregated summary with scores and issues

**Output:**
```
reports/seo/
├── homepage-desktop.json       # Detailed Lighthouse results
├── homepage-desktop.html       # Visual HTML report (open in browser)
├── homepage-mobile.json        # Mobile audit results
├── summary.json                # Aggregated summary across all pages
└── ...
```

### 2. SEO Issue Triage System
**Location:** `scripts/seo/triage-and-fix.js`

**Features:**
- Analyzes Lighthouse results
- Categorizes issues by priority (P0-P3)
- Provides step-by-step fix instructions with code examples
- Maps issues to SEO impact
- Identifies auto-fixable issues
- Generates Playwright test stubs

**Knowledge Base Includes:**
- Meta tags (title, description)
- Technical SEO (canonical, hreflang, robots.txt)
- Content & accessibility (link text, image alt)
- Structured data (Schema.org)
- Each with priority, impact, fix steps, and examples

**Output:**
```
reports/seo/triage/
└── triage-report.json          # Detailed triage with fix recommendations

tests/seo/
├── homepage-seo-fixes.spec.js  # Auto-generated validation tests
└── pricing-seo-fixes.spec.js   # Tests for each page's issues
```

### 3. SEO Expert Agent
**Location:** `.claude/agents/seo-expert.md`

**Capabilities:**
- Acts as an autonomous SEO specialist
- Runs audits, triages issues, implements fixes
- Creates Playwright tests for each fix
- Provides before/after reports
- Ensures compliance with Japanese design system and i18n

**How to Use:**
```javascript
// Activate via Task tool
Task({
  subagent_type: "general-purpose",
  description: "SEO audit and optimization",
  prompt: "Act as the SEO expert agent. Run a full Lighthouse audit, triage issues, fix P0/P1 issues, and create tests."
})
```

### 4. Comprehensive Documentation

**Project Documentation:** `CLAUDE.md`
- Complete SEO workflow documentation
- Integration with Japanese design system
- i18n compliance requirements
- Common SEO issues and fixes
- Monitoring schedule

**Tool Documentation:** `scripts/seo/README.md`
- Detailed tool usage guide
- Workflow examples
- Troubleshooting
- Best practices
- CI/CD integration examples

**This Document:** `SEO-SYSTEM.md`
- System overview
- Quick reference
- Example outputs

### 5. Bun Scripts

Added to `package.json`:
```json
{
  "scripts": {
    "seo:audit": "bun scripts/seo/run-lighthouse-audit.js",
    "seo:audit:local": "bun scripts/seo/run-lighthouse-audit.js --local",
    "seo:triage": "bun scripts/seo/triage-and-fix.js",
    "seo:triage:tests": "bun scripts/seo/triage-and-fix.js --generate-tests",
    "seo:full": "bun run seo:audit && bun run seo:triage:tests && bun run test:seo",
    "test:seo": "bun x playwright test tests/seo/"
  }
}
```

### 6. Installed Dependencies

```json
{
  "devDependencies": {
    "lighthouse": "^12.8.0",
    "chrome-launcher": "^1.1.2"
  }
}
```

---

## 📊 Example Output

### Lighthouse Audit Summary

```
================================================================================
📊 LIGHTHOUSE SEO AUDIT SUMMARY
================================================================================
Audit Date: 2025-11-02T10:30:00.000Z
Base URL: https://sealf.ie
Pages Audited: 7
================================================================================

📄 HOMEPAGE
   URL: https://sealf.ie/
   Scores:
     Performance:   85/100
     Accessibility: 92/100
     Best Practices: 96/100
     SEO:           78/100
   Issues:
     🔴 Critical: 2
     🟠 High:     5
     🟡 Medium:   3
     🟢 Low:      1

   🔴 CRITICAL ISSUES:
      - Document does not have a meta description
      - Page is missing structured data

   🟠 HIGH PRIORITY ISSUES:
      - Links do not have descriptive text
      - Image elements do not have [alt] attributes
      - Document does not have a valid hreflang

================================================================================
🎯 OVERALL SEO HEALTH
================================================================================
Average SEO Score: 82/100
Total Critical Issues: 3
Total High Priority Issues: 12

⚠️  ACTION REQUIRED: Fix critical issues immediately!
================================================================================
```

### Triage Report

```
================================================================================
🔍 SEO ISSUE TRIAGE REPORT
================================================================================
Generated: 2025-11-02T10:35:00.000Z

📊 ISSUE SUMMARY:
   🔴 P0 (Critical):       3
   🟠 P1 (High):           12
   🟡 P2 (Medium):         8
   🟢 P3 (Low):            4
   📝 Total Issues:        27

🔴 P0 ISSUES (3):
────────────────────────────────────────────────────────────────────────────────

📄 Page: homepage
   Issue: Document does not have a meta description
   Category: Meta Tags
   Impact: High - Affects SERP click-through rates
   Auto-Fixable: ❌ No

   Fix Steps:
      1. Open the affected .pug file in src/pug/
      2. Add: meta(name="description", content='#{$i18n.meta.description}')
      3. Update locales/en.json and locales/fr.json with description text
      4. Description should be 120-160 characters
      5. Include primary keywords and value proposition

   Example:
      // src/pug/index.pug
      head
        meta(charset='utf-8')
        meta(name='viewport', content='width=device-width, initial-scale=1')
        meta(name='description', content=#{$i18n.meta.description})
        title #{$i18n.title}

      // locales/en.json
      {
        "meta": {
          "description": "Protect your business from deepfake fraud with Sealfie. Biometric authentication for executives and high-value transactions."
        }
      }

================================================================================
💡 RECOMMENDATIONS
================================================================================
⚠️  URGENT: Fix P0 (Critical) issues immediately!
   These issues directly impact SEO rankings and user experience.

📋 PRIORITY: Address P1 (High) issues this week.
   These issues affect search visibility and should be fixed soon.

📖 Next Steps:
   1. Review triage report: reports/seo/triage/triage-report.json
   2. Implement fixes following the provided steps
   3. Run tests to validate fixes: bun run test:seo
   4. Re-run audit to verify improvements: bun run seo:audit
================================================================================
```

### Auto-Generated Tests

```javascript
// tests/seo/homepage-seo-fixes.spec.js
const { test, expect } = require('@playwright/test');

/**
 * SEO Fix Validation Tests for homepage
 *
 * Auto-generated from Lighthouse audit results
 * Generated: 2025-11-02T10:35:00.000Z
 *
 * These tests validate that SEO issues have been fixed and prevent regressions.
 */

test.describe('SEO Fixes: homepage', () => {

  // Fix: Document does not have a meta description
  test('has valid meta description on /', async ({ page }) => {
    await page.goto('/');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc.length).toBeGreaterThanOrEqual(120);
    expect(metaDesc.length).toBeLessThanOrEqual(160);
  });

  // Fix: Page is missing canonical URL
  test('has canonical URL on /', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('https://sealf.ie');
  });

});
```

---

## 🔄 Complete Workflow Example

### Scenario: Fix All SEO Issues on Homepage

#### Step 1: Audit Current State
```bash
bun run seo:audit
```

**Result:** Homepage has SEO score of 78/100 with 2 critical issues

#### Step 2: Triage Issues
```bash
bun run seo:triage:tests
```

**Result:**
- Generates detailed fix instructions for each issue
- Creates `tests/seo/homepage-seo-fixes.spec.js` with validation tests

#### Step 3: Implement Fixes

Follow the triage report instructions:

**Fix 1: Add Meta Description**
```pug
// src/pug/index.pug
head
  meta(name='description', content=`#{$i18n.meta.description}`)
```

```json
// locales/en.json
{
  "meta": {
    "description": "Protect your business from deepfake fraud and BEC attacks with Sealfie. Biometric authentication for executives and high-value transactions."
  }
}
```

**Fix 2: Add Structured Data**
```pug
// src/pug/includes/schema.pug
script(type="application/ld+json").
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sealfie",
    "url": "https://sealf.ie"
  }
```

#### Step 4: Validate Fixes Locally
```bash
bun run build
bun start
bun run seo:audit:local
bun run test:seo
```

**Result:** All generated tests pass ✅

#### Step 5: Deploy and Re-Audit
```bash
# Deploy to production
bun run build
# ... deploy process ...

# Re-audit production
bun run seo:audit
```

**Result:**
- Homepage SEO score: 78/100 → 95/100 ✅
- Critical issues: 2 → 0 ✅
- High priority issues: 5 → 1 ✅

#### Step 6: Monitor for Regressions
```bash
# Schedule weekly audits
bun run seo:audit

# Run before each deploy
bun run seo:audit:local

# Run tests in CI/CD
bun run test:seo
```

---

## 🎯 Key Benefits

### 1. **100% Open Source**
- No expensive SaaS subscriptions
- No API rate limits
- Full control and customization
- Runs entirely locally

### 2. **Automated Testing**
- Auto-generate tests from audit results
- Prevent SEO regressions
- Continuous validation
- Integration with existing Playwright tests

### 3. **Detailed Fix Instructions**
- Step-by-step guidance for each issue
- Code examples in Pug + JSON
- Follows project conventions (Japanese design system, i18n)
- Links to documentation

### 4. **Complete Visibility**
- JSON reports for programmatic analysis
- HTML reports for visual review
- Aggregated summaries across all pages
- Trend tracking over time

### 5. **CI/CD Integration**
- Run audits on every deploy
- Block PRs with SEO regressions
- Schedule weekly audits
- Archive historical reports

---

## 📅 Recommended Workflow

### Weekly Monitoring
```bash
# Every Monday
bun run seo:audit
bun run seo:triage
# Review reports and plan fixes
```

### Before Every Deploy
```bash
# On staging/local
bun run seo:audit:local
bun run test:seo
# Fix any issues before production
```

### After Content Changes
```bash
# Full workflow
bun run seo:full
# Ensure no regressions
```

### Monthly Review
```bash
# Compare historical reports
# Identify trends
# Plan long-term optimizations
```

---

## 🔧 Integration with Existing Systems

### Japanese Design System
- All SEO fixes follow Ma (negative space) principles
- Use traditional colors (--shu-primary, --enji-secondary)
- Support light/dark themes

### i18n Compliance
- Never hardcode text (always use #{$i18n.*})
- Update both EN and FR locales
- Use sentence case for titles

### Existing Tests
- SEO tests integrate with existing Playwright test suite
- Run alongside accessibility, performance, and visual tests
- Same reporting and CI/CD workflows

---

## 📚 Resources

### Documentation
- [CLAUDE.md](./CLAUDE.md) - Complete project documentation with SEO section
- [scripts/seo/README.md](./scripts/seo/README.md) - Detailed tool documentation
- [.claude/agents/seo-expert.md](./.claude/agents/seo-expert.md) - SEO expert agent guide

### Tools
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Playwright](https://playwright.dev/)
- [Schema.org](https://schema.org/)

### Existing Infrastructure
- [tests/seo-optimization.spec.js](./tests/seo-optimization.spec.js) - Comprehensive SEO test suite (576 lines)
- [lighthouse-config.js](./lighthouse-config.js) - Lighthouse configuration

---

## ✅ What's Next

### Immediate Actions
1. ✅ Run first audit: `bun run seo:audit`
2. ✅ Review triage report: `bun run seo:triage`
3. ✅ Fix P0 (critical) issues
4. ✅ Validate with tests: `bun run test:seo`

### Ongoing Maintenance
- Schedule weekly audits
- Fix P0/P1 issues promptly
- Monitor score trends
- Expand knowledge base as needed

### Future Enhancements
- Add more SEO issue definitions to knowledge base
- Create automated PR comments with SEO scores
- Implement historical trend tracking dashboard
- Add competitive analysis features

---

**System Created:** 2025-11-02
**Status:** ✅ Fully Operational
**Cost:** $0 (100% open-source)
**Dependencies:** Google Lighthouse 12.8.0, Chrome Launcher 1.1.2
