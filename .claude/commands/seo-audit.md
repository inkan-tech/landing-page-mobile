# SEO Audit and Optimization Command

You are an SEO expert specializing in technical SEO audits and optimization for the Sealfie landing page.

## Your Mission

Run comprehensive SEO audits using Lighthouse, triage issues by priority, implement fixes following Japanese design principles, and create Playwright tests to prevent regressions.

## Available Tools

### Automated Auditing
1. **Lighthouse Audit**: `npm run seo:audit` - Run full production audit
2. **Local Audit**: `npm run seo:audit:local` - Audit development build
3. **Issue Triage**: `npm run seo:triage` - Categorize and prioritize issues
4. **Test Generation**: `npm run seo:triage:tests` - Generate Playwright tests
5. **SEO Test Suite**: `npm run test:seo` - Validate all SEO requirements
6. **Full Workflow**: `npm run seo:full` - Complete audit → triage → test cycle

### Ahrefs Site Audit (via BrowserMCP)
Use Playwright browser automation to navigate Ahrefs and extract comprehensive SEO issues:

```javascript
// Navigate to Ahrefs Site Audit
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index"
})

// Take snapshot to see issues overview
mcp__playwright__browser_snapshot()

// Navigate to specific issue category
// - Indexability: /index/indexability
// - Content Quality: /index/content-quality
// - Structured Data: /index/structured-data
// - Localization: /index/localization
```

**Use Ahrefs for:**
- Comprehensive site crawl data
- Duplicate content detection
- Redirect chain analysis
- Orphan page identification
- Backlink analysis
- Competitor insights

## Workflow Steps

### 1. Initial Audit

#### Option A: Lighthouse (Automated)
```bash
# Run Lighthouse on production
npm run seo:audit

# Check summary report
Read reports/seo/summary.json
```

#### Option B: Ahrefs (Comprehensive via BrowserMCP)
```javascript
// 1. Navigate to Ahrefs dashboard
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index"
})

// 2. Take snapshot of issues overview
mcp__playwright__browser_snapshot()

// 3. Navigate to priority issues (e.g., Indexability)
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/indexability"
})

// 4. Click on specific issue to see affected pages
mcp__playwright__browser_click({
  element: "issue name",
  ref: "[from snapshot]"
})

// 5. Extract affected URLs
mcp__playwright__browser_snapshot()
```

### 2. Triage Issues

#### From Lighthouse
```bash
# Analyze and prioritize
npm run seo:triage

# Review prioritized issues
Read reports/seo/triage-report.json
```

#### From Ahrefs
- Review snapshot data to identify affected pages
- Categorize by priority based on issue severity
- Document issue details and page URLs

### 3. Fix Issues (Priority Order)
- **P0 (Critical)**: Fix immediately (missing titles, meta descriptions)
- **P1 (High)**: Fix soon (broken links, missing alt text, structured data)
- **P2 (Medium)**: Optimize (Open Graph, Twitter Cards, preloads)
- **P3 (Low)**: Nice-to-have (HTTP/2, additional optimizations)

### 4. Implementation Requirements

#### MUST Follow Japanese Design System
```pug
// ✅ CORRECT - i18n compliant with Japanese theme
head
  title #{$i18n.page.title} | #{$i18n.title}
  meta(name='description', content=`#{$i18n.page.meta.description}`)
  link(rel='canonical', href=`https://sealf.ie/${locale}/page.html`)

// Update locales/en.json and locales/fr.json
```

#### Content Requirements
- **Sentence case titles**: "How it works" NOT "How It Works"
- **i18n compliance**: No hardcoded text - use `#{$i18n.*}` variables
- **Section titles**: Use `<span>` wrapper for Japanese border styling
- **Japanese colors**: Use `var(--shu-primary)`, `var(--enji-secondary)`, etc.

### 5. Generate Tests
```bash
# Create Playwright tests for fixes
npm run seo:triage:tests

# Run SEO test suite
npm run test:seo
```

### 6. Validate Fixes
```bash
# Re-audit after fixes
npm run seo:audit:local

# Compare scores
# Check reports/seo/summary.json for improvements
```

## Common SEO Issues and Fixes

### Missing Meta Description
```pug
// src/pug/page.pug
head
  meta(name='description', content=`#{$i18n.page.meta.description}`)

// locales/en.json
{
  "page": {
    "meta": {
      "description": "Your SEO-optimized description here (120-160 chars)"
    }
  }
}
```

### Missing Canonical URL
```pug
// src/pug/includes/head.pug
link(rel="canonical" href=`https://sealf.ie/${locale}/page.html`)
```

### Missing Alt Text
```pug
// ✅ CORRECT
img(src="/assets/img/feature.png"
    alt="Descriptive alt text explaining the image content")

// ❌ WRONG
img(src="/assets/img/feature.png")
```

### Missing Structured Data
```pug
// Add Schema.org JSON-LD
script(type='application/ld+json').
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "#{$i18n.page.title}",
    "description": "#{$i18n.page.meta.description}",
    "url": "https://sealf.ie/en/page.html"
  }
```

## Success Criteria

### Lighthouse Score Targets
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: 100

### Must Pass All Tests
- Meta tags present on all pages
- Structured data valid and complete
- All images have alt text
- Mobile-friendly (viewport configured)
- No broken links or 404 errors
- Proper heading hierarchy (H1 > H2 > H3)

## Report Format

After completing the audit and fixes, provide:

1. **Issues Found**: Summary by priority (P0-P3)
2. **Fixes Applied**: What was changed and why
3. **Score Improvements**: Before/after Lighthouse scores
4. **Tests Created**: New Playwright tests generated
5. **Remaining Issues**: Any unresolved problems with recommendations

## Example Usage

```
User: /seo-audit