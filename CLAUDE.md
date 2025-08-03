# Sealfie Landing Page - Claude Code Project Context

## Table of Contents
1. [Project Overview](#project-overview)
2. [🚨 CRITICAL Development Requirements](#critical-development-requirements)
3. [Japanese Inkan-Inspired Design System](#japanese-inkan-inspired-design-system)
4. [i18n (Internationalization) Requirements](#i18n-internationalization-requirements)
5. [Recent Implementation Changes](#recent-implementation-changes)
6. [Technical Architecture](#technical-architecture)
7. [Development Workflows](#development-workflows)
8. [Communication Styles](#communication-styles)
9. [File Structure & Context](#file-structure--context)
10. [Implementation History](#implementation-history)

---

## Project Overview

### Mission Statement
Transform Sealfie's cybersecurity landing page by embracing its Japanese heritage through traditional Inkan (hanko) stamp aesthetics while maintaining modern usability and conversion optimization.

### Core Objectives
- ✅ **Cultural Authenticity**: Implement Japanese design principles (Ma, Kanso, Mono no Aware)
- ✅ **Professional Video Demo**: Maintain mandatory phone mockup with conversion-optimized video
- ✅ **Theme System**: Light/dark mode with traditional Japanese colors
- ✅ **Performance**: Optimized loading, accessibility, and mobile-first design
- ✅ **Maintainability**: Clean, reusable component system
- ✅ **Internationalization**: Full EN/FR language support

---

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

// ❌ INCORRECT - No Japanese principles
.bad-component {
  padding: 8px;
  background: #blue;
  border: 3px solid red;
}
```

#### **2. i18n (Internationalization) Compliance**
**NEVER hardcode text - ALWAYS use i18n variables:**

```pug
// ✅ CORRECT - i18n compliant
h2.section-title #{$i18n.carousel.title}
p.section-subtitle #{$i18n.carousel.subtitle}

.trend-card
  .trend-number #{$i18n.carousel.stats.attacks.number}
  .trend-label #{$i18n.carousel.stats.attacks.label}

// ❌ INCORRECT - Hardcoded text
h2.section-title Current Threat Landscape
p.section-subtitle Latest intelligence from August 2025
```

**Required locale file updates for new content:**
```json
// locales/en.json
{
  "carousel": {
    "title": "Current Threat Landscape",
    "subtitle": "Latest intelligence from August 2025",
    "stats": {
      "attacks": {
        "number": "37%",
        "label": "increase in attacks"
      }
    }
  }
}

// locales/fr.json  
{
  "carousel": {
    "title": "Paysage des Menaces Actuelles",
    "subtitle": "Renseignements récents d'août 2025",
    "stats": {
      "attacks": {
        "number": "37%",
        "label": "augmentation des attaques"
      }
    }
  }
}
```

#### **3. Component Structure Requirements**
**ALWAYS follow this structure for new components:**

```pug
// ✅ REQUIRED PATTERN
section.component-name-section
  .container.px-5
    .row.justify-content-center
      .col-lg-10
        .text-center.mb-5
          h2.section-title #{$i18n.section.title}
          p.section-subtitle #{$i18n.section.subtitle}
        
        // Component content with i18n
        .component-content
          // All text via #{$i18n.section.content}
```

#### **4. Mandatory Checks Before Implementation**
**For EVERY new component or change:**

1. ✅ **Design Check**: Uses Japanese color variables
2. ✅ **Spacing Check**: Implements Ma (negative space) patterns  
3. ✅ **Theme Check**: Works in both light and dark modes
4. ✅ **i18n Check**: No hardcoded text, all content via `#{$i18n.*}`
5. ✅ **Locale Check**: Content added to both EN and FR locale files
6. ✅ **Responsive Check**: Mobile-first design with proper breakpoints
7. ✅ **Accessibility Check**: ARIA labels, keyboard navigation, screen readers

#### **5. Forbidden Practices**
**NEVER do these - they break project requirements:**

- ❌ Hardcode any text content
- ❌ Use non-Japanese colors (blue, green, etc.)
- ❌ Create components without theme support
- ❌ Skip negative space (cramped layouts)
- ❌ Use harsh/jarring animations
- ❌ Ignore mobile-first responsive design
- ❌ Create content only in English

---

## Japanese Inkan-Inspired Design System

### Design Philosophy

#### **Ma (間) - Negative Space**
- Generous white space for focus and breathing room
- Strategic content placement with intentional gaps
- Clean, uncluttered layouts that guide user attention

#### **Kanso (簡素) - Simplicity** 
- Remove unnecessary elements for elegant simplicity
- "Less is more" approach to UI components
- Focus on essential functionality and clear hierarchy

#### **Mono no Aware (物の哀れ) - Subtle Beauty**
- Delicate animations and micro-interactions
- Subtle color transitions and hover states
- Appreciation for impermanence in design elements

### Color Palette System

#### **Traditional Japanese Colors (Current Implementation)**

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

  // Text Colors
  --text-primary: #374151;     // Primary text
  --text-secondary: #6B7280;   // Supporting text
  --text-muted: #9CA3AF;       // Muted text

  // Interactive States
  --focus-ring: var(--shu-primary);
  --hover-overlay: rgba(255, 53, 0, 0.05);
}

// Dark Theme - Adapted for Dark Backgrounds
[data-theme="dark"] {
  --shu-primary: #E34234;      // Muted Shu-iro for better contrast
  --enji-secondary: #B91C1C;   // Deeper crimson
  --sango-accent: #F87171;     // Lighter coral for dark contrast
  --bg-primary: #0F0F23;       // Deep navy-black
  --bg-secondary: #1E1E2E;     // Primary surface
  --bg-surface: #313244;       // Cards and elevated surfaces
  --bg-device-screen: #000000; // Device screen background (consistent)
}
```

#### **Color Symbolism & Usage**

**Shu-iro (朱色) - Traditional Vermillion**
- **Cultural Meaning**: Authority, trust, protection from evil
- **Usage**: Primary CTAs, important buttons, brand accents
- **Implementation**: `--shu-primary` variable throughout theme system

**Enji-iro (臙脂色) - Crimson**
- **Cultural Meaning**: Sophistication, depth, secondary authority
- **Usage**: Secondary actions, hover states, gradients
- **Implementation**: `--enji-secondary` for interactive elements

**Sango-iro (珊瑚色) - Coral**
- **Cultural Meaning**: Vitality, highlights, gentle attention
- **Usage**: Accents, notifications, gradient transitions
- **Implementation**: `--sango-accent` for highlighting elements

---

## i18n (Internationalization) Requirements

### Supported Languages
- **EN** (English) - Primary language
- **FR** (French) - Secondary language  

### Locale File Structure
```
locales/
├── en.json    # English translations
└── fr.json    # French translations
```

### i18n Implementation Patterns

#### **1. Pug Template Usage**
**ALWAYS use i18n variables for ANY text content:**

```pug
// ✅ CORRECT - All text via i18n
section.new-section
  .container.px-5
    h2.section-title #{$i18n.newSection.title}
    p.section-subtitle #{$i18n.newSection.subtitle}
    
    .content-block
      h3 #{$i18n.newSection.features.title}
      p #{$i18n.newSection.features.description}
      
      .cta-buttons
        a.cta-primary(href="mailto:contact@sealf.ie")
          | #{$i18n.newSection.cta.primary}
        a.cta-secondary(href=`/${$localeName}/documentation.html`)
          | #{$i18n.newSection.cta.secondary}

// ❌ FORBIDDEN - Hardcoded text
section.bad-section
  h2 New Section Title
  p Some description text
```

#### **2. Required Locale File Updates**
**For every new text content, update BOTH locale files:**

```json
// locales/en.json - ADD new content
{
  "newSection": {
    "title": "Section Title in English",
    "subtitle": "Descriptive subtitle for the section",
    "features": {
      "title": "Features Overview",
      "description": "Detailed description of the features and benefits"
    },
    "cta": {
      "primary": "Get Started Now",
      "secondary": "Learn More"
    }
  }
}

// locales/fr.json - ADD French translations
{
  "newSection": {
    "title": "Titre de Section en Français",
    "subtitle": "Sous-titre descriptif pour la section",
    "features": {
      "title": "Aperçu des Fonctionnalités",
      "description": "Description détaillée des fonctionnalités et avantages"
    },
    "cta": {
      "primary": "Commencer Maintenant",
      "secondary": "En Savoir Plus"
    }
  }
}
```

#### **3. Complex Content Patterns**

**Lists and Arrays:**
```json
// Locale file structure
{
  "benefits": {
    "title": "Key Benefits",
    "items": [
      "First benefit description",
      "Second benefit description", 
      "Third benefit description"
    ]
  }
}
```

```pug
// Pug template usage
h3 #{$i18n.benefits.title}
ul.benefits-list
  each item in $i18n.benefits.items
    li.benefit-item= item
```

**Nested Objects for Components:**
```json
{
  "carousel": {
    "title": "Current Threat Landscape",
    "subtitle": "Latest intelligence from August 2025",
    "slides": {
      "attacks": {
        "number": "37%",
        "label": "increase in attacks",
        "subtitle": "May-June 2025"
      },
      "ai": {
        "number": "40%", 
        "label": "AI-generated emails",
        "subtitle": "Hyper-personalized attacks"
      }
    },
    "controls": {
      "prev": "Previous trend",
      "next": "Next trend"
    }
  }
}
```

#### **4. Language-Specific Content**
**For content that differs significantly between languages:**

```pug
// Conditional content based on language
if $localeName == "en"
  .video-container
    video(src="/assets/img/demo-en.webm")
else if $localeName == "fr"  
  .video-container
    video(src="/assets/img/demo-fr.webm")

// Language-specific links
a.cta-primary(href=`/${$localeName}/documentation.html`)
  | #{$i18n.cta.learnMore}
```

#### **5. Meta Data & SEO**
**ALL meta tags must be internationalized:**

```pug
// Page head with i18n
head
  title #{$i18n.title}
  meta(name='description', content=$i18n.meta.descriptions.homepage)
  meta(property='og:title', content=$i18n.title)
  meta(property='og:description', content=$i18n.meta.description)
  link(rel='canonical', href='https://sealf.ie/'+$localeName+'/')
```

### i18n Quality Checklist

**Before implementing ANY new content:**

1. ✅ **No hardcoded text** - All text via `#{$i18n.*}` variables
2. ✅ **Both languages updated** - EN and FR locale files have new content
3. ✅ **Consistent structure** - Same JSON structure in both files
4. ✅ **Cultural adaptation** - French content adapted, not just translated
5. ✅ **URL structure** - Links use `/${$localeName}/` pattern
6. ✅ **Asset localization** - Videos/images use language-specific versions when needed
7. ✅ **Meta tags localized** - SEO content in both languages

### Common i18n Mistakes to Avoid

❌ **NEVER hardcode text:**
```pug
h2 Current Threat Landscape  // WRONG
```

❌ **NEVER update only one language:**
```json
// WRONG - Only English updated
"en.json": { "newField": "content" }
"fr.json": { } // Missing newField
```

❌ **NEVER use English text in French locale:**
```json
// WRONG - English text in French file
"fr.json": {
  "title": "Current Threat Landscape" // Should be French
}
```

✅ **ALWAYS follow proper patterns:**
```pug
h2.section-title #{$i18n.section.title}  // CORRECT
```

```json
// CORRECT - Both languages with proper translations
"en.json": { "section": { "title": "Current Threat Landscape" }}
"fr.json": { "section": { "title": "Paysage des Menaces Actuelles" }}
```

---

## Recent Implementation Changes

### Device Mockup System Refactoring (Latest - December 2024)

#### **Problem Solved**
- Eliminated ~100 lines of duplicate CSS between `.masthead-device-mockup` and `.features-device-mockup`
- Inconsistent styling across different page sections
- Hardcoded colors not respecting theme system

#### **Solution Implemented**
```scss
// NEW: Single unified class in _features.scss
.device-mockup {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // ... unified styling for all device mockups
}
```

#### **Files Modified**
- ✅ `src/pug/index.pug` - Updated to use `.device-mockup`
- ✅ `src/pug/documentation.pug` - Updated both mockups to use `.device-mockup`
- ✅ `src/scss/sections/_features.scss` - Renamed to `.device-mockup`
- ✅ `src/scss/sections/_masthead.scss` - Removed duplicate CSS
- ✅ `src/scss/_global.scss` - Added `.bg-device-screen` utility
- ✅ `src/scss/variables/_themes.scss` - Added device screen variable

#### **Theme Color Integration**
```pug
// OLD: Hardcoded gradients
.video-poster-placeholder(style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);")

// NEW: Japanese theme colors
.video-poster-placeholder(style="background: linear-gradient(135deg, var(--shu-primary) 0%, var(--sango-accent) 100%);")
```

### Grid Layout Optimization
- **Hero Section**: Changed from 50/50 split to 2/3 text, 1/3 mockup (`col-lg-8` / `col-lg-4`)
- **Device Wrapper**: Reduced size by 5% width, increased 5% height for better proportions
- **Circle Positioning**: Centered at 1/3 of phone width with 25% size increase

### Loading State Improvements
```scss
// Theme-aware loading spinners
.timer-loading .video-poster-placeholder::before {
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--shu-primary); // Japanese red accent
}
```

---

## Technical Architecture

### Build System & File Structure

#### **Primary Technologies**
- **Build Tool**: Grunt with Pug templates
- **CSS Preprocessor**: SCSS with Bootstrap 5 integration
- **Template Engine**: Pug with i18n support (EN/FR)
- **Theme System**: CSS Custom Properties for light/dark modes

#### **Key Directories**
```
src/
├── pug/
│   ├── index.pug                 # Main landing page
│   ├── documentation.pug         # How-it-works page
│   └── includes/                 # Reusable components
├── scss/
│   ├── variables/
│   │   └── _themes.scss          # Japanese color system
│   ├── sections/
│   │   ├── _masthead.scss        # Hero section styling
│   │   └── _features.scss        # Features & device mockups
│   └── components/
│       ├── _lazy-loading.scss    # Video loading states
│       ├── _japanese-buttons.scss # Themed button components
│       └── _navbar.scss          # Navigation styling
└── js/
    ├── scripts.js                # Main theme manager
    └── modules/
        └── theme-manager.js      # Theme switching logic
```

### Device Mockup System (Current Implementation)

#### **Unified Component Structure**
```pug
// Generic device mockup used across all pages
.device-mockup
  include includes/gradient-circle
  include includes/shape-1      // Decorative elements
  include includes/shape-2
  .device-wrapper
    .device(data-device='iPhoneX', data-orientation='portrait', data-color='black')
      .screen.bg-device-screen  // Theme-aware background
        .video-timer-container(data-video="...")
          .video-poster-placeholder // Theme-aware gradients
```

#### **Responsive Behavior**
```scss
// Responsive circle sizing and positioning
@media (min-width: 576px) {
  .device-mockup .circle { width: 70%; display: block; }
}
@media (min-width: 768px) {
  .device-mockup .circle { width: 60%; }
}
@media (min-width: 1024px) {
  .device-mockup .circle { width: 90%; left: -25%; }
}
```

---

## Development Workflows

### Testing & Quality Assurance

#### **iOS Testing Requirements**
- ❌ **No simulators** - Hardware features required
- 📱 **Physical device mandatory** - iPhone with Face ID/Touch ID
- 🔧 **Tools Required**: IDB (iOS Device Bridge) for advanced testing

#### **Bundle ID Configuration**
```
Main App: link.inkan.sealfie
Test Runner: link.inkan.sealfie.RunnerUITests.xctrunner
```

#### **Environment Flavors**
```bash
# Development (local blockchain)
flutter run --flavor dev lib/runners/main_dev.dart

# Staging (devnet)
flutter run --flavor staging lib/runners/main_staging.dart

# Production (mainnet)
flutter run --flavor production lib/runners/main_production.dart
```

### Build Commands
```bash
# Development with watch
npm start

# Production build
npm run build

# Clean build directories
npm run clean

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Git Workflow
- **Main Branch**: `master`
- **Current Branch**: `redesign`
- **Commit Style**: Conventional commits with emoji support

---

## Communication Styles

### LinkedIn Marketing (French Market)

#### **Optimized Messaging Style**
- ✅ **Direct & Authentic**: "Ce repos illustre parfaitement" (natural French)
- ✅ **Precise & Impactful**: "protègent proactivement vos validations importantes"
- ✅ **Subtle Brand Positioning**: "Inkan.link a développé" (enterprise credibility)
- ✅ **Emotional CTAs**: "...valent-elles le risque et le stress permanent?"
- ✅ **Optimized Hashtags**: #Sealfie (memorable), #Cybersécurité, #ProtectionNumérique

#### **Message Template**
```markdown
🚨 Quand même les experts en cybersécurité deviennent des cibles...

Ce repos illustre parfaitement une réalité alarmante : PERSONNE n'est à l'abri de l'usurpation d'identité, même pas les professionnels de la cybersécurité.

Si les criminels osent s'attaquer à ceux qui combattent quotidiennement ces menaces, imaginez les risques pour :
• Vos dirigeants
• Vos équipes finance  
• Vos clients

La leçon ? L'expertise technique ne suffit pas. Il faut des solutions qui protègent proactivement vos validations importantes.

C'est exactement pourquoi Inkan.link a développé https://sealf.ie/

💡 Votre réputation et celle de votre entreprise valent-elles le risque et le stress permanent ?

#Cybersécurité #UsurpationIdentité #ProtectionNumérique #Sealfie
```

### General Communication Preferences
- **Tone**: Direct and authentic
- **Technical Detail**: Avoid excessive jargon
- **Emotional Impact**: Prioritize psychological engagement
- **Brand Positioning**: Subtle but credible
- **Structure**: Clear, airy, human-focused

---

## File Structure & Context

### Critical Files to Monitor

#### **Templates**
- `src/pug/index.pug` - Main landing page with hero section
- `src/pug/documentation.pug` - How-it-works with step-by-step demo
- `src/pug/includes/navbar.pug` - Navigation with theme integration

#### **Styling**
- `src/scss/variables/_themes.scss` - **CORE** Japanese color system
- `src/scss/sections/_features.scss` - Unified device mockup system
- `src/scss/sections/_masthead.scss` - Hero section & legacy masthead
- `src/scss/components/_lazy-loading.scss` - Video loading states
- `src/scss/_global.scss` - Global utilities and theme classes

#### **JavaScript**
- `src/js/scripts.js` - Main theme manager initialization
- `src/js/modules/theme-manager.js` - Theme switching logic

#### **Build Output**
- `docs/` - Generated static site (never edit directly)
- `locales/` - i18n translations (EN/FR)

### Protected Elements

#### **Mandatory Design Elements**
- 📱 **Phone mockup with video demo** - CONVERSION CRITICAL
- 🎥 **Professional video content** - PROTECTED FOR UX
- 🎌 **Japanese theme colors** - BRAND IDENTITY CORE
- 📐 **Ma (negative space) patterns** - CULTURAL AUTHENTICITY

#### **Never Edit Directly**
- `/docs/` - Build output directory
- `/node_modules/` - Dependencies
- Generated CSS/JS in `/docs/assets/`

---

## Implementation History

### Major Milestones

#### **Phase 1: Japanese Theme Foundation (November 2024)**
- Created CSS custom properties system for traditional Japanese colors
- Implemented Ma (negative space) patterns with subtle backgrounds
- Added Kanso (simplicity) principles to component design
- Established Shu-iro, Enji-iro, and Sango-iro color palette

#### **Phase 2: Component Unification (December 2024)**
- Refactored duplicate `.masthead-device-mockup` and `.features-device-mockup`
- Created unified `.device-mockup` component system
- Eliminated ~100 lines of duplicate CSS
- Added theme-aware loading states and backgrounds

#### **Phase 3: Grid & Layout Optimization (December 2024)**
- Optimized hero section grid (2/3 text, 1/3 mockup)
- Refined device wrapper proportions (5% adjustments)
- Improved circle positioning and sizing
- Enhanced responsive behavior across breakpoints

### Current Status (December 2024)
- ✅ **Japanese Theme System**: Fully implemented with traditional colors
- ✅ **Device Mockup Unification**: Single reusable component
- ✅ **Theme Integration**: All UI elements respect light/dark modes
- ✅ **Performance Optimization**: Reduced CSS bundle size
- ✅ **Cultural Authenticity**: Ma, Kanso, and color symbolism preserved

### Next Priorities
- 🔄 **Conversion Analysis**: A/B testing of new Japanese design
- 📱 **Mobile Performance**: Further optimize loading states
- 🌐 **SEO Enhancement**: Theme-color meta tags and structured data
- 🎯 **User Testing**: Validate cultural design resonance

---

## Best Practices & Guidelines

#### **Critical Image URL Verification**
⚠️ **MANDATORY**: Always verify that image URLs in code match actual file paths on the system. The build process may transform paths differently than expected.

**Required Verification Steps:**
1. **Source Check**: Verify files exist in `src/assets/img/` directory
2. **Build Output**: Confirm files are copied to `docs/assets/img/` directory  
3. **URL Mapping**: Ensure locale file URLs match build output paths (e.g., `/assets/img/carousel/*.svg`)
4. **Path Consistency**: Never assume URL structure - always verify both source and build directories

**Example Verification Process:**
```bash
# Check source files exist
ls src/assets/img/carousel/
# Check build output files exist  
ls docs/assets/img/carousel/
# Verify URLs in locale files match build paths
```

### Code Style
- **SCSS**: Use theme variables (`var(--shu-primary)`) over hardcoded colors
- **Pug**: Maintain i18n structure for EN/FR content
- **JavaScript**: Prefer theme-aware solutions over static implementations

### Design Principles
- **Respect Japanese aesthetics**: Ma, Kanso, Mono no Aware
- **Maintain conversion elements**: Phone mockup, video demos
- **Theme consistency**: All new elements must support light/dark modes
- **Cultural authenticity**: Use traditional Japanese color names and symbolism

### Development Workflow
- **Branch**: Work on `redesign` branch, merge to `master`
- **Testing**: Require physical iOS device for complete validation
- **Build**: Always verify `npm run build` before commits
- **Commits**: Use conventional commit style with clear descriptions

---

*Last Updated: December 2024 - Device Mockup Refactoring & Theme Integration*
*Project: Sealfie Landing Page - Japanese Inkan-Inspired Design System*