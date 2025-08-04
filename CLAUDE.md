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
// ✅ CORRECT - Standard section title pattern
h1.hero-title
  | #{$i18n.hero.title.line1}
  br
  span.accent-text #{$i18n.hero.title.line2}

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