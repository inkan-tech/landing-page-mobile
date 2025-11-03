# Sealfie Landing Page - Claude Code Development Context

## 🚨 CRITICAL Development Requirements

### ⚠️ **MANDATORY FOR EVERY CHANGE** ⚠️

#### **1. Japanese Design System Compliance**
**NEVER create components without Japanese design principles:**
- ✅ **ALWAYS** use Ma (間) - generous negative space
- ✅ **ALWAYS** follow Kanso (簡素) - elegant simplicity
- ✅ **ALWAYS** implement Mono no Aware (物の哀れ) - subtle beauty
- ✅ **ALWAYS** use traditional Japanese colors: `--shu-primary`, `--enji-secondary`, `--sango-accent`
- ✅ **ALWAYS** support light/dark theme with `[data-theme="dark"]`

```scss
// ✅ CORRECT - Japanese design principles
.new-component {
  // Ma - generous spacing
  padding: 40px 24px;
  margin-bottom: 48px;
  
  // Kanso - simple colors
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  
  // Mono no Aware - subtle interactions
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 53, 0, 0.15);
  }
}
```

#### **2. Title Capitalization Requirements**
**MUST use sentence case (not Title Case) for all titles:**
- ✅ **CORRECT**: "Current threat landscape"
- ✅ **CORRECT**: "How Sealfie works" 
- ❌ **WRONG**: "Current Threat Landscape"
- ❌ **WRONG**: "How It Works"

**Keep capitalized**: Proper nouns (Sealfie, Inkan), acronyms (AI, BEC), first word of sentence

#### **3. Page Title Consistency Requirements**
**MUST use consistent title format exactly like existing pages:**

**Homepage (index.pug)**:
```pug
title #{$i18n.title}
```

**All other pages must follow these exact patterns**:
```pug
// Pricing page pattern (CORRECT)
title #{$i18n.banner.pricing} | #{$i18n.title}

// Press page pattern (CORRECT) 
title #{$i18n.press.title} | #{$i18n.title}

// Documentation page pattern (CORRECT)
title #{$i18n.banner.docs} | #{$i18n.title}

// Challenge page pattern (CORRECT)
title #{$i18n.challenge.title} | #{$i18n.title}
```

**❌ WRONG PATTERNS:**
- `title #{$i18n.documentation.meta.title}` (missing site branding)
- `title "Hardcoded Text | #{$i18n.title}"` (hardcoded text)
- `title #{$i18n.page.title} | #{$i18n.title}` (generic path - use specific path)

**✅ REQUIRED APPROACH:**
1. Find the specific i18n path for your page (e.g., `$i18n.challenge.title`, `$i18n.press.title`)
2. Use format: `title #{$i18n.SPECIFIC_PATH.title} | #{$i18n.title}`
3. If page doesn't have i18n title, use `$i18n.banner.PAGENAME` (e.g., `$i18n.banner.docs`, `$i18n.banner.pricing`)

#### **4. i18n (Internationalization) Compliance**
**NEVER hardcode text - ALWAYS use i18n variables:**

```pug
// ✅ CORRECT - i18n compliant
h2.section-title #{$i18n.carousel.title}
p.section-subtitle #{$i18n.carousel.subtitle}

// ❌ INCORRECT - Hardcoded text
h2.section-title Current Threat Landscape
```

**Required locale file updates for new content:**
```json
// locales/en.json
{
  "carousel": {
    "title": "Current Threat Landscape",
    "subtitle": "Latest intelligence from August 2025"
  }
}

// locales/fr.json  
{
  "carousel": {
    "title": "Paysage des Menaces Actuelles",
    "subtitle": "Renseignements récents d'août 2025"
  }
}
```

#### **5. Section Title Styling Requirements**
**MUST use `<span>` wrapper for section titles to get Japanese border styling:**

```pug
// ✅ CORRECT - Creates bordered rectangle with Japanese gradient
h2.section-title
  span #{$i18n.section.title}

// ❌ WRONG - No border styling, plain text only
h2.section-title #{$i18n.section.title}
```

**The `<span>` wrapper enables**:
- Japanese gradient border effect around title
- Proper padding (`16px 32px`) for visual balance
- Consistent styling with pricing page and other sections

#### **6. Component Structure Requirements**
**ALWAYS follow this structure for new components:**

```pug
// ✅ REQUIRED PATTERN
section.component-name-section
  .container.px-5
    .row.justify-content-center
      .col-lg-10
        .text-center.mb-5
          h2.section-title
            span #{$i18n.section.title}
          p.section-subtitle #{$i18n.section.subtitle}
        
        // Component content with i18n
        .component-content
          // All text via #{$i18n.section.content}
```

#### **7. Mandatory Checks Before Implementation**
**For EVERY new component or change:**

1. ✅ **Design Check**: Uses Japanese color variables
2. ✅ **Spacing Check**: Implements Ma (negative space) patterns  
3. ✅ **Theme Check**: Works in both light and dark modes
4. ✅ **i18n Check**: No hardcoded text, all content via `#{$i18n.*}`
5. ✅ **Title Check**: Section titles use `<span>` wrapper for Japanese border styling
6. ✅ **Locale Check**: Content added to both EN and FR locale files
7. ✅ **Responsive Check**: Mobile-first design with proper breakpoints
8. ✅ **Accessibility Check**: ARIA labels, keyboard navigation, screen readers

### **⚠️ IMPORTANT: Test Content Updates**

**Updated Accessibility Tests (December 2024):**
- ✅ **Hero Content**: Tests now verify H1 contains "Your business is a target"
- ✅ **Ma Spacing**: Tests verify 48px-64px section margins (Japanese negative space)
- ✅ **Focus States**: Tests verify Shu-iro (#FF3500) focus indicators
- ❌ **OLD**: Tests previously checked for "executives" content (outdated)

**Current Hero Structure:**
```pug
h1.hero-title
  | Your business is a target           // Line 1 (updated)
  br
  span.accent-text Protect it with a simple selfie  // Line 2 (current)
```

## Website & SEO Optimization

### **Production Website**
- 🌐 **Live URL**: https://sealf.ie/
- 📊 **SEO Tools**: Google Lighthouse (local), Playwright tests
- 🎯 **Primary Goal**: Cybersecurity awareness and lead generation

### **Local SEO Audit System (Lighthouse + Playwright)**

**We use open-source tools for continuous SEO monitoring:**

#### **1. Google Lighthouse - Automated SEO Auditing**
```bash
# Run full SEO audit on production
npm run seo:audit

# Run audit on local development server
npm run seo:audit:local

# Run audit on custom URL
node scripts/seo/run-lighthouse-audit.js --url=https://sealf.ie/en/pricing.html
```

**What Lighthouse Audits:**
- ✅ Meta tags (title, description, Open Graph, Twitter Cards)
- ✅ Structured data (Schema.org JSON-LD)
- ✅ Mobile-friendliness and viewport configuration
- ✅ Image optimization (alt text, lazy loading)
- ✅ Performance metrics (LCP, CLS, FID)
- ✅ Accessibility compliance
- ✅ Best practices (HTTPS, canonical URLs, hreflang)

**Audit Output:**
- `reports/seo/[page]-desktop.json` - Detailed JSON results
- `reports/seo/[page]-desktop.html` - Visual HTML report
- `reports/seo/summary.json` - Aggregated summary across all pages

#### **2. SEO Issue Triage System**
```bash
# Analyze audit results and generate fix recommendations
npm run seo:triage

# Generate Playwright test stubs for found issues
npm run seo:triage:tests
```

**Triage Output:**
- **P0 (Critical)**: Issues requiring immediate fix (missing title, no meta description)
- **P1 (High)**: Important issues affecting rankings (broken links, missing alt text)
- **P2 (Medium)**: Optimization opportunities (structured data, Open Graph tags)
- **P3 (Low)**: Nice-to-have improvements (preload hints, HTTP/2 optimization)

**For each issue, the triage system provides:**
- ✅ Priority level and impact assessment
- ✅ Step-by-step fix instructions with code examples
- ✅ Auto-generated Playwright test to validate fix
- ✅ Links to relevant documentation

#### **3. SEO Validation Tests (Playwright)**
```bash
# Run existing comprehensive SEO test suite
npm run test:seo

# Run generated fix validation tests
npx playwright test tests/seo/*-seo-fixes.spec.js
```

**Existing Test Coverage (`tests/seo-optimization.spec.js`):**
- ✅ Meta tags (title, description, canonical, robots)
- ✅ Open Graph and Twitter Card tags
- ✅ Structured data (Organization, WebSite, MobileApplication, BreadcrumbList)
- ✅ Hreflang and internationalization
- ✅ Image optimization (alt text, lazy loading, preload)
- ✅ Internal linking structure
- ✅ Mobile-friendliness (viewport, tap targets, readable text)
- ✅ Performance indicators (preload, DNS prefetch, lazy loading)
- ✅ Content quality (word count, H1 uniqueness, heading hierarchy, keywords)
- ✅ Robots and crawlability (sitemap.xml, robots.txt, no broken links)

#### **4. Complete SEO Workflow**
```bash
# Full automated workflow:
# 1. Run Lighthouse audit
# 2. Triage issues and generate tests
# 3. Run all SEO validation tests
npm run seo:full
```

### **SEO Expert Agent**

**Agent Location:** `.claude/agents/seo-expert.md`

**Agent Capabilities:**
1. 🔍 **Audit**: Run Lighthouse on all pages (desktop + mobile)
2. 📋 **Triage**: Categorize issues by priority (P0-P3)
3. 🔧 **Fix**: Apply SEO best practices to fix identified issues
4. 🧪 **Test**: Generate Playwright tests to prevent regressions
5. 📊 **Report**: Provide detailed before/after comparisons

**Activating the Agent:**
```bash
# Use the Task tool to launch the SEO expert agent
Task(
  subagent_type="general-purpose",
  description="SEO audit and optimization",
  prompt="Act as the SEO expert agent. Run a full Lighthouse audit on https://sealf.ie/,
          triage all issues, fix critical (P0) and high (P1) priority issues,
          and create Playwright tests for each fix."
)
```

### **Required SEO Optimization Workflow**

#### **Before Making Content Changes:**
1. ✅ **Baseline Audit**: Run `npm run seo:audit` to capture current state
2. ✅ **Review Issues**: Check `reports/seo/summary.json` for existing problems
3. ✅ **Plan Fixes**: Use `npm run seo:triage` for prioritized fix recommendations

#### **When Implementing Fixes:**
1. ✅ **Follow Triage**: Use step-by-step instructions from triage report
2. ✅ **Test Locally**: Run `npm run seo:audit:local` during development
3. ✅ **Generate Tests**: Run `npm run seo:triage:tests` to create validation tests
4. ✅ **Validate**: Run `npm run test:seo` to ensure fixes work

#### **After Deploying Changes:**
1. ✅ **Re-Audit**: Run `npm run seo:audit` on production
2. ✅ **Compare Scores**: Check improvement in Lighthouse scores
3. ✅ **Check Ahrefs**: Use BrowserMCP to access Ahrefs Site Audit dashboard

### **Accessing Ahrefs Site Audit with BrowserMCP**

**⚠️ IMPORTANT:** Always use BrowserMCP to access and review Ahrefs Site Audit data.

**Ahrefs Project URL:** https://app.ahrefs.com/site-audit/22469918/index

**Required MCP Setup:**
1. Ensure BrowserMCP is configured in VS Code MCP settings
2. BrowserMCP package: `@browsermcp/mcp@latest`
3. Chrome extension must be installed from https://docs.browsermcp.io/setup-server

**Usage in SEO Audits:**
```javascript
// Navigate to Ahrefs dashboard
mcp__browsermcp__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index"
})

// Take snapshot of dashboard
mcp__browsermcp__browser_snapshot()

// Navigate to specific issue category
mcp__browsermcp__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/indexability"
})

// Click on specific issue
mcp__browsermcp__browser_click({
  element: "issue name",
  ref: "[from snapshot]"
})
```

**Common Ahrefs Issue Categories:**
- `/index/indexability` - Indexability issues (canonical, duplicates, crawl errors)
- `/index/content-quality` - Content quality issues (thin content, duplicate content)
- `/index/structured-data` - Structured data issues (Schema.org errors)
- `/index/localization` - Localization issues (hreflang, language tags)
- `/index/performance` - Performance issues (page speed, Core Web Vitals)
- `/index/links` - Link issues (broken links, redirect chains)
3. ✅ **Verify Tests**: Ensure all SEO tests pass
4. ✅ **Monitor**: Schedule weekly audits to catch regressions

### **Priority SEO Fixes**

**Technical:**
- Fix broken links and 404 errors
- Ensure all pages have valid canonical URLs
- Implement proper hreflang for EN/FR versions
- Optimize Core Web Vitals (LCP < 2.5s, CLS < 0.1, FID < 100ms)

**Content:**
- Every page must have unique title (30-60 chars)
- Every page must have meta description (120-160 chars)
- Use sentence case for titles ("How it works" not "How It Works")
- Maintain proper heading hierarchy (H1 > H2 > H3)

**Authority:**
- Implement complete Schema.org structured data
- Add Open Graph and Twitter Card tags
- Ensure internal linking structure is logical

**UX:**
- All images must have descriptive alt text
- Mobile viewport must be configured correctly
- Tap targets must be >= 48x48px on mobile
- Text must be readable (>= 14px font size)

### **Common SEO Issues and Fixes**

#### **Missing Meta Description**
```pug
// src/pug/index.pug
head
  meta(name='description', content=`#{$i18n.meta.description}`)

// locales/en.json
{
  "meta": {
    "description": "Protect your business from deepfake fraud with Sealfie. Biometric authentication for executives."
  }
}
```

#### **Missing Canonical URL**
```pug
// src/pug/includes/head.pug
link(rel="canonical" href=`https://sealf.ie/${locale}/`)
```

#### **Missing Alt Text**
```pug
// ✅ CORRECT
img(src="/assets/img/mockup.png"
    alt="Sealfie mobile app showing biometric authentication interface")

// ❌ WRONG
img(src="/assets/img/mockup.png")
```

### **SEO Monitoring Schedule**

- **Weekly**: Run `npm run seo:audit` on production
- **Before Deploy**: Run `npm run seo:audit:local` on staging
- **After Content Changes**: Run `npm run seo:full` to validate
- **Monthly**: Review trend in Lighthouse scores and fix regressions

## Japanese Color System

### **Traditional Japanese Colors (Current Implementation)**

```scss
// Light Theme - Traditional Inkan Colors
:root {
  // Primary Brand Colors - Based on Traditional Inkan Red
  --shu-primary: #FF3500;      // Traditional Vermillion (Shu-iro)
  --enji-secondary: #C93338;   // Crimson (Enji-iro) for secondary actions
  --sango-accent: #F8674F;     // Coral (Sango-iro) for highlights

  // Background Colors
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;     // Subtle gray for sections
  --bg-surface: #FFFFFF;       // Cards and elevated surfaces
  --bg-device-screen: #000000; // Device screen background
}

// Dark Theme - Adapted for Dark Backgrounds
[data-theme="dark"] {
  --shu-primary: #E34234;      // Muted Shu-iro for better contrast
  --enji-secondary: #B91C1C;   // Deeper crimson
  --sango-accent: #F87171;     // Lighter coral for dark contrast
  --bg-primary: #0F0F23;       // Deep navy-black
  --bg-secondary: #1E1E2E;     // Primary surface
  --bg-surface: #313244;       // Cards and elevated surfaces
}
```

## Technical Architecture

### **Key Directories**
```
src/
├── pug/
│   ├── index.pug                 # Main landing page
│   ├── documentation.pug         # How-it-works page
│   ├── press.pug                 # Press & recognition page
│   └── includes/
│       ├── navbar.pug            # Navigation with press link
│       └── footer.pug            # Expanded footer with full menu
├── scss/
│   ├── variables/
│   │   └── _themes.scss          # Japanese color system
│   ├── sections/
│   │   ├── _footer.scss          # Expanded footer with pattern
│   │   └── _features.scss        # Unified device mockups
│   └── components/
└── js/
    └── scripts.js                # Theme manager
```

### **Protected Elements**
- 📱 **Phone mockup with video demo** - CONVERSION CRITICAL
- 🎥 **Professional video content** - PROTECTED FOR UX
- 🎌 **Japanese theme colors** - BRAND IDENTITY CORE
- 📐 **Ma (negative space) patterns** - CULTURAL AUTHENTICITY

## Current Implementation Status

### **Completed Features**
- ✅ **Japanese Theme System**: Fully implemented with traditional colors
- ✅ **Device Mockup Unification**: Single reusable `.device-mockup` component
- ✅ **ITU-T Authority Integration**: Founder credentials with UN presentation
- ✅ **Streamlined Landing Page**: Removed 40% low-impact content
- ✅ **Expanded Footer**: 4-column navigation with pattern background
- ✅ **Press Page**: Complete press & recognition infrastructure

### **Current Page Flow**
```
Hero + Video Demo → BEC Trends Carousel → Enhanced Founder Authority → [Visual Break] → Streamlined Features → Pioneer Program → Footer Navigation
```

## Development Workflow

### **Build Commands**
```bash
# Development with watch
npm start

# Production build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### **Git Workflow**
- **Main Branch**: `master`
- **Current Branch**: `redesign`
- **Commit Style**: Conventional commits

### **Testing Requirements (iOS)**
- ❌ **No simulators** - Hardware features required
- 📱 **Physical device mandatory** - iPhone with Face ID/Touch ID
- 🔧 **Tools Required**: IDB (iOS Device Bridge)

### **Bundle ID Configuration**
```
Main App: link.inkan.sealfie
Test Runner: link.inkan.sealfie.RunnerUITests.xctrunner
```

## Critical File Locations

### **Templates**
- `src/pug/index.pug` - Main landing page with hero section
- `src/pug/press.pug` - Press & recognition page
- `src/pug/includes/navbar.pug` - Navigation with press link
- `src/pug/includes/footer.pug` - Expanded footer navigation

### **Styling**
- `src/scss/variables/_themes.scss` - **CORE** Japanese color system
- `src/scss/sections/_footer.scss` - Expanded footer with pattern
- `src/scss/sections/_features.scss` - Unified device mockup system

### **Localization**
- `locales/en.json` - English translations with ITU-T content
- `locales/fr.json` - French translations with ITU-T content

### **Never Edit Directly**
- `/docs/` - Build output directory
- Generated CSS/JS in `/docs/assets/`

## Common Mistakes to Avoid

❌ **NEVER hardcode text:**
```pug
h2 Current Threat Landscape  // WRONG
```

❌ **NEVER use non-Japanese colors:**
```scss
.bad-component {
  background: #blue;  // WRONG - use var(--shu-primary)
}
```

❌ **NEVER skip theme support:**
```scss
.component {
  color: #000;  // WRONG - use var(--text-primary)
}
```

❌ **NEVER use Title Case for every word:**
```json
"title": "Current Threat Landscape"  // WRONG - Title Case
"title": "Current threat landscape"  // CORRECT - Sentence case
```

✅ **ALWAYS follow proper patterns:**
```pug
h2.section-title #{$i18n.section.title}  // CORRECT
```

```scss
.component {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--shu-primary);
}
```

## **Design Pattern Standards - Always Follow These**

### **Title Hierarchy (Consistent Across All Pages)**
```pug
// ✅ CORRECT - Standard hero title pattern (current content)
h1.hero-title
  | #{$i18n.hero.title.line1}  // "Your business is a target"
  br
  span.accent-text #{$i18n.hero.title.line2}  // "Protect it with a simple selfie"

h2.section-title #{$i18n.section.title}
p.section-subtitle #{$i18n.section.subtitle}
```

**Title Styling Requirements:**
- **Hero titles**: Use `.hero-title` with `.accent-text` span for second line
- **Section titles**: Always use `.section-title` class (never custom classes)
- **Sentence case**: "Current threat landscape" NOT "Current Threat Landscape" 
- **Font scaling**: `clamp(1.75rem, 3vw, 2.5rem)` for responsive sizing
- **Japanese spacing**: 16px margin-bottom, letter-spacing: -0.02em

### **Button System (Must Match Index Page)**
```pug
// ✅ CORRECT - Primary CTA (featured actions)
a.cta-primary-large(href="url" aria-label="text")
  | #{$i18n.section.cta}

// ✅ CORRECT - Secondary CTA (supporting actions)  
a.cta-secondary(href="url" aria-label="text")
  | #{$i18n.section.cta}

// ✅ CORRECT - Compact CTA (small spaces)
a.cta-compact(href="url" aria-label="text")
  | #{$i18n.section.cta}
```

**Button Styling Standards:**
- **Primary**: `.cta-primary-large` - Shu-iro red background, white text, box-shadow
- **Secondary**: `.cta-secondary` - Outlined, transforms to filled on hover
- **Compact**: `.cta-compact` - Smaller padding, same primary styling
- **Never use**: Bootstrap `.btn` classes - always use Japanese button system
- **Hover effects**: translateY(-2px) with enhanced box-shadow
- **Accessibility**: Always include aria-label attributes

### **Section Layout Pattern (Required Structure)**
```pug
// ✅ CORRECT - Standard section pattern
section.section-name-section
  .container.px-5
    .row.justify-content-center
      .col-lg-10
        .text-center.mb-5
          h2.section-title #{$i18n.section.title}
          p.section-subtitle #{$i18n.section.subtitle}
        
        // Section content with proper spacing
        .section-content
          // Content with i18n variables
```

### **Color Usage (Traditional Japanese)**
- **Primary brand**: `var(--shu-primary)` (#FF3500) - Traditional vermillion
- **Secondary**: `var(--enji-secondary)` (#C93338) - Crimson for accents  
- **Accent highlights**: `var(--sango-accent)` (#F8674F) - Coral for features
- **Backgrounds**: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-surface)`
- **Text hierarchy**: `var(--text-primary)`, `var(--text-secondary)`

### **Spacing System (Ma - Negative Space)**
- **Section padding**: 80px vertical, 120px for hero sections
- **Card internal padding**: 40px for large cards, 32px for standard
- **Element margins**: 16px, 24px, 32px, 48px (increments of 8px)
- **Mobile adjustments**: Reduce by 25-30% for mobile breakpoints

### **Never Deviate From These Patterns**
❌ **Don't create custom button classes** - Use existing Japanese button system  
❌ **Don't hardcode colors** - Always use CSS custom properties  
❌ **Don't skip section structure** - Follow container → row → col pattern  
❌ **Don't use Bootstrap buttons** - They break the Japanese aesthetic  
❌ **Don't ignore spacing system** - Ma (negative space) is core to design

---

**For detailed project planning and timeline, see: [PROJECT-PLAN.md](./PROJECT-PLAN.md)**

*Last Updated: August 2025 - Design Pattern Documentation & Standards*
*Project: Sealfie Landing Page - Japanese Inkan-Inspired Design System*