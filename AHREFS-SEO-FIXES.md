# Ahrefs SEO Issues - Fix Plan for sealf.ie

**Date**: November 3, 2025
**Audit Date**: October 29, 2025
**Total Issues**: 30 unique issues across 7 categories

---

## Executive Summary

The Ahrefs Site Audit identified **30 SEO issues** affecting sealf.ie. This document provides a prioritized action plan organized by impact and urgency.

**Priority Breakdown**:

- **P0 (Critical)**: 16 issues - Immediate fix required
- **P1 (High)**: 14 issues - Fix within 1 week
- **P2 (Medium)**: 13 issues - Fix within 2 weeks
- **P3 (Low)**: 9 issues - Fix when capacity allows

---

## P0 - CRITICAL PRIORITY (Fix Immediately)

### 1. Content Quality Issues - Indexable Pages

#### Issue: H1 tag missing or empty

- **Affected Pages**: 6 pages
- **SEO Impact**: Critical - H1 is primary heading signal for search engines
- **Fix Required**:

  ```pug
  // Add unique, descriptive H1 to each page
  h1.hero-title #{$i18n.page.heading}
  ```

- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ch1%2Ch1Length%2CnrH1%2Ccompliant&current=29-10-2025T103128P0100&filterId=1337ec32524c0ae0a368c1dc8c7031c8&issueId=c64d9d0b-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Meta description tag missing or empty

- **Affected Pages**: 2 pages
- **SEO Impact**: Critical - Affects click-through rate in search results
- **Fix Required**:

  ```pug
  // In head section
  meta(name='description', content=`#{$i18n.meta.description}`)
  ```

- **Character Limit**: 120-160 characters
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2CmetaDescription%2CmetaDescriptionLength%2CnrMetaDescription%2Ccompliant&current=29-10-2025T103128P0100&filterId=c2374462d9d0ef63ad879d0f2dd819fc&issueId=c64d31f0-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Meta description too short

- **Affected Pages**: 2 pages
- **SEO Impact**: High - Underutilizes search result snippet space
- **Fix Required**: Expand descriptions to 120-160 characters
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2CmetaDescription%2CmetaDescriptionLength%2CnrMetaDescription%2Ccompliant&current=29-10-2025T103128P0100&filterId=9edec11a67a2ebde68902cbf437af7b4&issueId=c64d5156-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Title too long

- **Affected Pages**: 1 page
- **SEO Impact**: High - Title truncated in search results
- **Fix Required**: Shorten to 30-60 characters
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ctitle%2CtitlesLength%2CnrTitles%2Ccompliant&current=29-10-2025T103128P0100&filterId=0f7e22d4a95d6f7840cd16096f4006c1&issueId=c64dac3a-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Title too short

- **Affected Pages**: 1 page
- **SEO Impact**: High - Weak SEO signal
- **Fix Required**: Expand to 30-60 characters
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ctitle%2CtitlesLength%2CnrTitles%2Ccompliant&current=29-10-2025T103128P0100&filterId=5f1232a91e2a3af9df7cd191f8244533&issueId=c64d3bf4-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Multiple H1 tags

- **Affected Pages**: 2 pages
- **SEO Impact**: Medium - Dilutes primary heading signal
- **Fix Required**: Keep only one H1 per page, demote others to H2
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ch1%2Ch1Length%2CnrH1%2Ccompliant&current=29-10-2025T103128P0100&filterId=377676a0df737bc09d40ffe8c8f9e699&issueId=c64d52ef-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Low word count

- **Affected Pages**: 2 pages
- **SEO Impact**: Medium - Thin content may not rank well
- **Fix Required**: Add substantive content (aim for 300+ words)
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2Cdepth%2CcontentNrWord%2Ctitle%2CmetaDescription%2Ch1%2Ccompliant&current=29-10-2025T103128P0100&filterId=3604ed6f568d52b8fd7719accafad897&issueId=c64da01e-d0f4-11e7-8ed1-001e67ed4656)

### 2. Social Sharing Tags (All Pages)

#### Issue: Open Graph tags missing

- **Affected Pages**: 16 pages (ALL pages)
- **SEO Impact**: Critical - Poor social media sharing experience
- **Fix Required**:

  ```pug
  // In head section - REQUIRED for ALL pages
  meta(property='og:title', content=`#{$i18n.meta.ogTitle}`)
  meta(property='og:description', content=`#{$i18n.meta.ogDescription}`)
  meta(property='og:image', content='https://sealf.ie/assets/img/og-image.png')
  meta(property='og:url', content=`https://sealf.ie/${locale}/`)
  meta(property='og:type', content='website')
  meta(property='og:site_name', content='Sealfie')
  ```

- **Image Requirements**: 1200x630px minimum
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2CogTagsValid%2CogTagsAttributes%2CogTagsValue%2Cdepth%2Ccompliant%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=59059220d63b27a6771b60073e634d2c&issueId=c64d413f-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: X (Twitter) card missing

- **Affected Pages**: 16 pages (ALL pages)
- **SEO Impact**: Critical - No Twitter preview cards
- **Fix Required**:

  ```pug
  // In head section - REQUIRED for ALL pages
  meta(name='twitter:card', content='summary_large_image')
  meta(name='twitter:title', content=`#{$i18n.meta.twitterTitle}`)
  meta(name='twitter:description', content=`#{$i18n.meta.twitterDescription}`)
  meta(name='twitter:image', content='https://sealf.ie/assets/img/twitter-card.png')
  meta(name='twitter:site', content='@sealfie')
  ```

- **Image Requirements**: 1200x675px for large card
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2CmetaTwitterTagsValid%2CmetaTwitterTagsAttributes%2CmetaTwitterTagsValues%2Cdepth%2Ccompliant%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=c3aa38dc537cac26150b98cce4ad7146&issueId=c64d3dbd-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

---

## P1 - HIGH PRIORITY (Fix Within 1 Week)

### 3. Internal Linking Issues

#### Issue: Orphan page (has no incoming internal links) - Indexable

- **Affected Pages**: 3 pages
- **SEO Impact**: High - Pages are isolated, hard for search engines to discover
- **Fix Required**: Add internal links from related pages
- **Best Practice**: Every page should have 2-5 internal links pointing to it
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cfound_in_sitemaps%2CincomingLinks%2CincomingRedirect%2CincomingCanonical%2CincomingHreflang%2CincomingPagination%2CincomingCss%2CincomingImage%2CincomingJs&current=29-10-2025T103128P0100&filterId=342fd29001af244aeba4d481197e58ac&issueId=c64d7e96-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: Page has links to broken page - Indexable

- **Affected Pages**: 2 pages
- **SEO Impact**: High - Broken links harm user experience and SEO
- **Fix Required**: Remove or replace broken links with valid URLs
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2ClinksInternal4xx%2ClinksCountInternal4xx%2ClinksExternal4xx%2ClinksCountExternal4xx&current=29-10-2025T103128P0100&filterId=ef910605970b081acfca3ff161170299&issueId=c64daf06-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: Page has no outgoing links

- **Affected Pages**: 2 pages
- **SEO Impact**: Medium - Dead ends in navigation
- **Fix Required**: Add relevant internal or external links
- **Best Practice**: Every page should link to at least 1-3 related pages
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2ClinksCountInternal%2ClinksCountExternal&current=29-10-2025T103128P0100&filterId=406c6993b9ffe65d6605a9a455e1e868&issueId=c64d86f0-d0f4-11e7-8ed1-001e67ed4656)

#### Issue: Canonical URL has no incoming internal links

- **Affected Pages**: 1 page
- **SEO Impact**: High - Canonical page is isolated
- **Fix Required**: Add internal links to the canonical URL, not its duplicates
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2CincomingCanonical%2CincomingLinks%2Ccanonical&current=29-10-2025T103128P0100&filterId=9870dcb5d2a3a1e25df12475807c63a4&issueId=c64d3d21-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: Page has links to redirect - Indexable

- **Affected Pages**: 16 pages
- **SEO Impact**: Medium - Slows page load, wastes crawl budget
- **Fix Required**: Update links to point directly to final destination
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2ClinksInternal3xx%2ClinksCountInternal3xx%2ClinksExternal3xx%2ClinksCountExternal3xx&current=29-10-2025T103128P0100&filterId=7ed0cf8c771d1d42fde3ba1a35506fb9&issueId=c64d3aa7-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

### 4. Redirect Issues

#### Issue: 3XX redirect

- **Affected Pages**: 5 pages
- **SEO Impact**: Medium - Redirects should be permanent (301) or removed
- **Fix Required**:
  - If permanent: Ensure using 301 redirect
  - If temporary: Consider removing redirect
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Credirect%2CredirectChainUrls%2CisRedirectLoop%2CincomingAllLinks%2CincomingRedirect%2Corigin&current=29-10-2025T103128P0100&filterId=7b5c5e948c52d203dc64227a029b145f&issueId=c64d12c1-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: HTTP to HTTPS redirect

- **Affected Pages**: 2 pages
- **SEO Impact**: Medium - Links should point directly to HTTPS
- **Fix Required**: Update links to use HTTPS:// instead of HTTP://
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CredirectChainUrls%2CisRedirectLoop%2CincomingAllLinks%2CincomingRedirect%2Corigin&current=29-10-2025T103128P0100&filterId=a14dc6b2d77b0ec4138ad1112570bc63&issueId=c64d5080-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

---

## P2 - MEDIUM PRIORITY (Fix Within 2 Weeks)

### 5. Localization Issues

#### Issue: Hreflang to non-canonical

- **Affected Pages**: 2 pages
- **SEO Impact**: Medium - Language targeting issues
- **Fix Required**: Ensure hreflang tags point to canonical URLs only
- **Example**:

  ```pug
  // Point to canonical, not duplicate
  link(rel='alternate', hreflang='en', href='https://sealf.ie/en/')
  link(rel='alternate', hreflang='fr', href='https://sealf.ie/fr/')
  ```

- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2Ccompliant%2ChreflangLink%2ChreflangIssues%2ChreflangGroupHash%2CincomingHreflang%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=d27718cad4cc65aa1844dbce48169b1c&issueId=c64d5765-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: HTML lang attribute missing

- **Affected Pages**: 3 pages
- **SEO Impact**: Medium - Accessibility and SEO issue
- **Fix Required**:

  ```pug
  // Add to <html> tag
  html(lang=`${locale}`)
  ```

- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2Ccompliant%2ChtmlLang%2CselfHreflang%2ChtmlLangCodeIsValid%2CselfHreflangCodeIsValid%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=6b6c6c4855d013f3ac4f8ba3b1f76025&issueId=c64d7bfd-d0f4-11e7-8ed1-001e67ed4656)

### 6. Duplicate Content Issues

#### Issue: Duplicate pages without canonical

- **Affected Pages**: 2 pages
- **SEO Impact**: High - Risk of duplicate content penalty
- **Fix Required**: Add canonical tags to specify preferred version
- **Example**:

  ```pug
  // Add to head section
  link(rel='canonical', href='https://sealf.ie/en/')
  ```

- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2Cdepth%2Ccompliant%2Ccanonical%2CincomingCanonical%2ChashContent%2CduplicateContent%2Ctitle%2CmetaDescription%2Ch1&current=29-10-2025T103128P0100&filterId=f0b94dd8f12b3de78caad15a13b864b1&issueId=c64d5626-d0f4-11e7-8ed1-001e67ed4656&sorting=-hashContent)

### 7. Sitemap Issues

#### Issue: Non-canonical page in sitemap

- **Affected Pages**: 8 pages
- **SEO Impact**: Medium - Sitemap should only contain canonical URLs
- **Fix Required**: Remove non-canonical URLs from sitemap.xml
- **Best Practice**: Only include indexable, canonical pages in sitemap
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2CisInSitemap%2Ccanonical%2Cfound_in_sitemaps%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=24034b6827fbb3c0fd4e972dd7847b11&issueId=c64d87a0-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

### 8. Structured Data Issues

#### Issue: Structured data has Google rich results validation error

- **Affected Pages**: 3 pages
- **SEO Impact**: Medium - Prevents rich snippets in search results
- **Fix Required**: Fix JSON-LD structured data errors
- **Validation Tool**: <https://search.google.com/test/rich-results>
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2Cjsonld_schema_types%2Cjsonld_validation_issue_kinds%2Ccompliant&current=29-10-2025T103128P0100&filterId=502269e33fb1b28dbf7884ebe9f24e43&issueId=b35de3ae-76f2-49cc-bb8f-33bc4aaedf10&sorting=-pageRating)

---

## P3 - LOW PRIORITY (Fix When Capacity Allows)

### 9. Not Indexable Pages (Lower Priority)

#### Issue: Orphan page - Not indexable

- **Affected Pages**: 5 pages
- **SEO Impact**: Low - Pages are already not indexable
- **Fix Required**: Add internal links if pages should be indexed
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2CincomingLinks%2CincomingRedirect%2CincomingCanonical%2CincomingHreflang%2CincomingCss%2CincomingImage%2CincomingJs&current=29-10-2025T103128P0100&filterId=a08046a9252fe27591cae2f0e7ccf2e6&issueId=944b9296-00b2-11e8-aeb8-001e67ed4656&sorting=-pageRating)

#### Issue: Page has links to broken page - Not indexable

- **Affected Pages**: 1 page
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Fix broken links if page should be indexed
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2ClinksInternal4xx%2ClinksInternal5xx%2ClinksCountInternal4xx%2ClinksCountInternal5xx%2ClinksExternal4xx%2ClinksExternal5xx%2ClinksCountExternal4xx%2ClinksCountExternal5xx&current=29-10-2025T103128P0100&filterId=3b3ce0fdb57149e9cac8033914fbd913&issueId=6193420a-00b1-11e8-930a-001e67ed4656&sorting=-pageRating)

#### Issue: Page has links to redirect - Not indexable

- **Affected Pages**: 8 pages
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Update redirect links if page should be indexed
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2ClinksInternal3xx%2ClinksCountInternal3xx%2ClinksExternal3xx%2ClinksCountExternal3xx&current=29-10-2025T103128P0100&filterId=df4704d5db8cb70e20ea1a94ac82d4ec&issueId=7272a5c0-00b1-11e8-ae24-001e67ed4656&sorting=-pageRating)

#### Issue: H1 tag missing or empty - Not indexable

- **Affected Pages**: 3 pages
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Add H1 if page should be indexed
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ch1%2Ch1Length%2CnrH1%2Ccompliant&current=29-10-2025T103128P0100&filterId=e29b87ac6311cffd6273e3758dd92cd7&issueId=838c947a-001a-11e8-823b-001e67ed4656)

#### Issue: Meta description too short - Not indexable

- **Affected Pages**: 1 page
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Expand meta description if page should be indexed
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2CmetaDescription%2CmetaDescriptionLength%2CnrMetaDescription%2Ccompliant&current=29-10-2025T103128P0100&filterId=b48fb21f3fc97a0f7d1983df614c1dfb&issueId=8d785026-001c-11e8-aa34-001e67ed4656)

#### Issue: Multiple H1 tags - Not indexable

- **Affected Pages**: 1 page
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Keep only one H1 if page should be indexed
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ch1%2Ch1Length%2CnrH1%2Ccompliant&current=29-10-2025T103128P0100&filterId=60e6edcbe0e80e035ba7c2b21132a349&issueId=79ec14d4-001c-11e8-ae09-001e67ed4656)

#### Issue: Title too short - Not indexable

- **Affected Pages**: 1 page
- **SEO Impact**: Low - Page is not indexed
- **Fix Required**: Expand title if page should be indexed
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2Cdepth%2Ctitle%2CtitlesLength%2CnrTitles%2Ccompliant&current=29-10-2025T103128P0100&filterId=993357fdabfec59243b205da582fecdd&issueId=43b1d34a-001c-11e8-8bfe-001e67ed4656)

### 10. External Resource Issues

#### Issue: External 3XX redirect

- **Affected Pages**: 3 pages (1 new, 1 missing)
- **SEO Impact**: Low - External redirects detected
- **Fix Required**: Update external links to final destination if possible
- **Ahrefs Link**: [View affected pages](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2Credirect%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=b3b75b6257a370fcf9f1f73befb5deb5&issueId=c64d8847-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

#### Issue: External 4XX

- **Affected Pages**: 1 page
- **SEO Impact**: Low - External broken link
- **Fix Required**: Remove or replace broken external link
- **Ahrefs Link**: [View affected page](https://app.ahrefs.com/site-audit/8667121/data-explorer?columns=pageRating%2Curl%2Ctraffic%2ChttpCode%2CcontentType%2Cdepth%2CincomingAllLinks&current=29-10-2025T103128P0100&filterId=9b88587038fc9bb2e08e0ff143d5f328&issueId=c64d89a6-d0f4-11e7-8ed1-001e67ed4656&sorting=-pageRating)

---

## Implementation Workflow

### Phase 1: Critical Fixes (Week 1)

**Goal**: Fix all P0 issues to maximize SEO impact

1. **Day 1-2**: Social Tags Implementation
   - Create shared head include with Open Graph tags
   - Create shared head include with Twitter Card tags
   - Add OG image (1200x630px) and Twitter image (1200x675px)
   - Apply to all 16 pages via includes

2. **Day 3-4**: Content Quality Fixes
   - Fix 6 pages with missing H1 tags
   - Fix 2 pages with missing meta descriptions
   - Fix 2 pages with too-short meta descriptions
   - Fix 1 page with too-long title
   - Fix 1 page with too-short title

3. **Day 5**: Multiple H1 and Low Word Count
   - Fix 2 pages with multiple H1 tags
   - Expand content on 2 pages with low word count

### Phase 2: High Priority Fixes (Week 2)

**Goal**: Fix internal linking and redirect issues

1. **Day 6-7**: Internal Linking
   - Add internal links to 3 orphan pages
   - Fix 2 pages linking to broken pages
   - Add outgoing links to 2 pages with no links
   - Fix 1 canonical page with no incoming links

2. **Day 8-9**: Redirect Cleanup
   - Update 16 pages linking to redirects
   - Fix 5 3XX redirects
   - Update 2 HTTP to HTTPS redirects

### Phase 3: Medium Priority Fixes (Week 3)

**Goal**: Fix localization, duplicates, and structured data

1. **Day 10**: Localization
   - Fix 2 pages with hreflang to non-canonical
   - Add HTML lang attribute to 3 pages

2. **Day 11**: Duplicates and Sitemaps
   - Add canonical tags to 2 duplicate pages
   - Remove 8 non-canonical pages from sitemap.xml

3. **Day 12**: Structured Data
   - Fix 3 pages with JSON-LD validation errors
   - Test with Google Rich Results Tool

### Phase 4: Low Priority Fixes (Week 4)

**Goal**: Clean up not-indexable pages and external links

1. **Day 13-14**: Not-Indexable Pages
   - Review 5 orphan not-indexable pages
   - Fix content issues if pages should be indexed
   - Add noindex if pages should not be indexed

2. **Day 15**: External Links
   - Update 3 external redirects
   - Fix 1 external 404 link

---

## Testing and Validation

### After Each Fix Phase

1. Run Ahrefs Site Audit to verify fixes
2. Test with Google Search Console
3. Validate structured data with Rich Results Test
4. Test social sharing with:
   - Facebook Sharing Debugger: <https://developers.facebook.com/tools/debug/>
   - Twitter Card Validator: <https://cards-dev.twitter.com/validator>

### Final Validation

- Run Lighthouse SEO audit (aim for 95+ score)
- Test all pages in Screaming Frog
- Verify sitemap.xml only contains canonical URLs
- Check Google Search Console for indexing issues

---

## Monitoring

### Weekly

- Check Ahrefs for new issues
- Monitor Google Search Console performance
- Track organic traffic changes

### Monthly

- Full Ahrefs Site Audit
- Review and update content quality
- Check for new broken links

---

## Resources

- **Ahrefs Site Audit**: <https://app.ahrefs.com/site-audit/8667121>
- **Google Search Console**: <https://search.google.com/search-console>
- **Lighthouse**: `npm run seo:audit`
- **Rich Results Test**: <https://search.google.com/test/rich-results>
- **Facebook Debugger**: <https://developers.facebook.com/tools/debug/>
- **Twitter Card Validator**: <https://cards-dev.twitter.com/validator>

---

**Last Updated**: November 3, 2025
**Next Review**: December 1, 2025
