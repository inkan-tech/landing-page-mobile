# SEO Optimization Tools

Automated SEO audit and optimization system using Google Lighthouse and Playwright.

## Quick Start

```bash
# Run full SEO workflow (audit → triage → test)
bun run seo:full

# Or run each step individually:
bun run seo:audit              # 1. Audit production site
bun run seo:triage:tests       # 2. Analyze issues and generate tests
bun run test:seo               # 3. Validate with Playwright
```

## Tools Overview

### 1. Lighthouse Audit Runner (`run-lighthouse-audit.js`)

Runs comprehensive Lighthouse audits on all pages of sealf.ie, generating detailed reports.

**Usage:**
```bash
# Audit production site
bun run seo:audit

# Audit local development server
bun run seo:audit:local

# Audit custom URL
bun scripts/seo/run-lighthouse-audit.js --url=https://sealf.ie/en/pricing.html
```

**Output:**
- `reports/seo/[page]-desktop.json` - Detailed JSON results
- `reports/seo/[page]-desktop.html` - Visual HTML report
- `reports/seo/[page]-mobile.json` - Mobile audit results
- `reports/seo/summary.json` - Aggregated summary

**Audited Pages:**
- Homepage (EN, FR)
- Documentation
- Pricing
- Press
- Challenge

**Metrics:**
- ✅ Performance (LCP, CLS, FID)
- ✅ Accessibility
- ✅ Best Practices
- ✅ SEO

### 2. Issue Triage System (`triage-and-fix.js`)

Analyzes Lighthouse results and provides prioritized fix recommendations.

**Usage:**
```bash
# Generate triage report
bun run seo:triage

# Generate triage report + Playwright test stubs
bun run seo:triage:tests
```

**Issue Priority Levels:**

- **P0 (Critical)** 🔴 - Fix immediately
  - Missing title tags
  - Missing meta descriptions
  - No HTML lang attribute
  - Broken canonical URLs

- **P1 (High)** 🟠 - Fix this week
  - Missing image alt text
  - Poor link text ("click here")
  - Missing hreflang tags
  - Broken internal links

- **P2 (Medium)** 🟡 - Fix this month
  - Missing structured data
  - Incomplete Open Graph tags
  - Suboptimal performance

- **P3 (Low)** 🟢 - Nice to have
  - Minor optimizations
  - Advanced features

**Output:**
- `reports/seo/triage/triage-report.json` - Detailed triage report
- `tests/seo/[page]-seo-fixes.spec.js` - Generated Playwright tests

**For Each Issue:**
- ✅ Priority level and impact assessment
- ✅ Step-by-step fix instructions
- ✅ Code examples
- ✅ Auto-generated test to validate fix

### 3. SEO Validation Tests

Comprehensive Playwright test suite to ensure SEO best practices.

**Existing Tests (`tests/seo-optimization.spec.js`):**
- Meta tags (title, description, canonical, robots)
- Open Graph and Twitter Cards
- Structured data (Schema.org JSON-LD)
- Hreflang and internationalization
- Image optimization
- Internal linking structure
- Mobile-friendliness
- Performance indicators
- Content quality
- Crawlability

**Generated Tests (`tests/seo/*-seo-fixes.spec.js`):**
- Auto-generated based on triage results
- Validate specific fixes
- Prevent regressions

**Usage:**
```bash
# Run all SEO tests
bun run test:seo

# Run specific test file
bun x playwright test tests/seo/homepage-seo-fixes.spec.js

# Run with UI
bun x playwright test tests/seo/ --ui
```

## Complete Workflow Example

### Scenario: Fix SEO Issues on Homepage

**Step 1: Audit Production**
```bash
bun run seo:audit
```

**Output:**
```
🚀 Starting Lighthouse SEO Audit
Target: https://sealf.ie

🔍 Auditing: https://sealf.ie/
✅ Report saved: homepage-desktop

📊 LIGHTHOUSE SEO AUDIT SUMMARY
─────────────────────────────────────
📄 HOMEPAGE
   Scores:
     Performance:   85/100
     Accessibility: 92/100
     Best Practices: 96/100
     SEO:           78/100
   Issues:
     🔴 Critical: 2
     🟠 High:     5
     🟡 Medium:   3
```

**Step 2: Triage Issues**
```bash
bun run seo:triage:tests
```

**Output:**
```
🔍 SEO ISSUE TRIAGE REPORT
─────────────────────────────────────

📊 ISSUE SUMMARY:
   🔴 P0 (Critical):       2
   🟠 P1 (High):           5
   🟡 P2 (Medium):         3
   📝 Total Issues:        10

🔴 P0 ISSUES (2):
────────────────────────────────────

📄 Page: homepage
   Issue: Document does not have a meta description
   Category: Meta Tags
   Impact: High - Affects SERP click-through rates
   Auto-Fixable: ❌ No

   Fix Steps:
      1. Open src/pug/index.pug
      2. Add: meta(name="description", content='#{$i18n.meta.description}')
      3. Update locales/en.json and locales/fr.json
      4. Description should be 120-160 characters

   Example:
      // src/pug/index.pug
      head
        meta(name='description', content=#{$i18n.meta.description})

🧪 GENERATING PLAYWRIGHT TESTS
────────────────────────────────────
✅ Generated: homepage-seo-fixes.spec.js
✅ Generated: pricing-seo-fixes.spec.js

📁 Generated 2 test files in: tests/seo/
```

**Step 3: Implement Fixes**

Follow the step-by-step instructions from the triage report:

```pug
// src/pug/index.pug
doctype html
html(lang=locale)
  head
    meta(charset='utf-8')
    meta(name='viewport', content='width=device-width, initial-scale=1')
    meta(name='description', content=`#{$i18n.meta.description}`)
    title #{$i18n.title}
```

```json
// locales/en.json
{
  "meta": {
    "description": "Protect your business from deepfake fraud and identity theft with Sealfie. Simple biometric authentication for executives and high-value transactions."
  }
}
```

**Step 4: Validate Fixes**

Build and test locally:
```bash
bun run build
bun start
bun run seo:audit:local
bun run test:seo
```

**Step 5: Deploy and Re-Audit**

After deploying:
```bash
bun run seo:audit

# Compare before/after scores
# Before: SEO 78/100
# After:  SEO 95/100 ✅
```

## SEO Knowledge Base

The triage system includes a comprehensive knowledge base for common SEO issues:

### Meta Tags Issues
- `meta-description` - Missing or poor meta descriptions
- `document-title` - Missing or duplicate titles

### Technical SEO
- `canonical` - Missing canonical URLs
- `hreflang` - Missing language alternates
- `robots-txt` - Missing or misconfigured robots.txt
- `html-has-lang` - Missing lang attribute

### Content & Accessibility
- `link-text` - Generic link text ("click here")
- `image-alt` - Missing alt text on images
- `structured-data` - Missing Schema.org markup

### Each Issue Includes:
- ✅ Priority level (P0-P3)
- ✅ Impact assessment
- ✅ Step-by-step fix instructions
- ✅ Code examples in Pug + JSON
- ✅ Auto-fixable flag
- ✅ Playwright test template

## Best Practices

### Before Making Changes
1. ✅ Run baseline audit: `bun run seo:audit`
2. ✅ Review current issues: `cat reports/seo/summary.json`
3. ✅ Plan fixes: `bun run seo:triage`

### When Implementing Fixes
1. ✅ Follow Japanese design system guidelines
2. ✅ Use i18n variables (never hardcode text)
3. ✅ Test locally: `bun run seo:audit:local`
4. ✅ Generate validation tests: `bun run seo:triage:tests`
5. ✅ Run tests: `bun run test:seo`

### After Deploying
1. ✅ Re-audit production: `bun run seo:audit`
2. ✅ Compare scores (before/after)
3. ✅ Verify all tests pass
4. ✅ Monitor for regressions

### Monitoring Schedule
- **Weekly**: Audit production (`bun run seo:audit`)
- **Before Deploy**: Audit staging (`bun run seo:audit:local`)
- **After Content Changes**: Full workflow (`bun run seo:full`)
- **Monthly**: Review trends and fix regressions

## Troubleshooting

### "Chrome launcher failed"
```bash
# Install Chrome/Chromium
brew install --cask google-chrome

# Or use system Chrome
export CHROME_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
```

### "Port already in use"
```bash
# Kill existing Chrome processes
pkill -f "chrome"
```

### "Module not found: lighthouse"
```bash
# Reinstall dependencies
bun install
```

### "No summary file found"
```bash
# Run audit first before triage
bun run seo:audit
bun run seo:triage
```

## File Structure

```
scripts/seo/
├── run-lighthouse-audit.js    # Lighthouse audit runner
├── triage-and-fix.js           # Issue triage system
└── README.md                   # This file

reports/seo/
├── homepage-desktop.json       # Lighthouse JSON results
├── homepage-desktop.html       # Lighthouse HTML report
├── summary.json                # Aggregated summary
└── triage/
    └── triage-report.json      # Triage analysis

tests/seo/
├── seo-optimization.spec.js    # Comprehensive SEO test suite
└── *-seo-fixes.spec.js         # Auto-generated fix validation tests
```

## Integration with CI/CD

Add to GitHub Actions workflow:

```yaml
name: SEO Audit

on:
  push:
    branches: [master]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  seo-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install
      - run: bun run seo:audit
      - run: bun run seo:triage
      - run: bun run test:seo
      - uses: actions/upload-artifact@v4
        with:
          name: seo-reports
          path: reports/seo/
```

## Contributing

When adding new SEO checks:

1. Add audit definition to `ISSUE_KNOWLEDGE_BASE` in `triage-and-fix.js`
2. Add test template to `TEST_TEMPLATES`
3. Update this README
4. Run full workflow to validate

## Resources

- [Google Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Lighthouse CLI GitHub](https://github.com/GoogleChrome/lighthouse)
- [Playwright Documentation](https://playwright.dev/)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

---

**Last Updated:** 2025-11-02
**Maintainer:** Inkan.link Team
**Project:** Sealfie Landing Page (https://sealf.ie/)
