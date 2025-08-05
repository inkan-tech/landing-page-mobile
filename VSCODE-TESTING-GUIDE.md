# VS Code Testing Guide - Japanese Redesign Verification

## 🚀 Quick Start - Running Tests in VS Code

### Method 1: Command Palette (Fastest)
1. **Open Command Palette**: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
2. **Type**: `Tasks: Run Task`
3. **Select from available tasks**:
   - `Japanese Redesign Tests` - **Run all redesign verification tests**
   - `Mobile Navigation Tests` - Test mobile menu functionality
   - `Visual Regression Tests` - Screenshot comparisons
   - `Security & CSP Tests` - Content Security Policy validation
   - `Interactive Playwright UI` - **Visual test runner**

### Method 2: Terminal (Most Control)
**Open integrated terminal**: `Ctrl+`` (backtick)

```bash
# Test Japanese redesign implementation
npm run test:redesign-full

# Individual test suites
npm run test:redesign      # Color system, design principles
npm run test:cultural      # Cultural authenticity, Japanese elements  
npm run test:theme         # Theme switching, CSS variables

# Mobile-specific tests
npm run test:mobile        # Mobile navigation, responsive design

# Visual testing
npm run test:visual        # Screenshot comparisons
npm run test:ui            # Interactive test runner (recommended)
```

### Method 3: Using Tasks (VS Code UI)
1. **Open Tasks Panel**: `Terminal > Run Task...`
2. **Select task** from the dropdown
3. **Watch output** in the terminal panel

### Method 4: Debug Mode (Step-through Testing)
1. **Go to Debug Panel**: `Cmd+Shift+D` (Mac) or `Ctrl+Shift+D` (Windows)
2. **Select debug configuration**:
   - `Debug Japanese Redesign Tests`
   - `Debug Cultural Authenticity Tests`
   - `Debug Theme System Tests`
   - `Debug Mobile Navigation`
3. **Press F5** or click the green play button
4. **Set breakpoints** in test files for detailed debugging

## 📋 Available Test Commands

### Core Redesign Verification
```bash
# Complete redesign verification (recommended first run)
npm run test:redesign-full

# Individual redesign aspects
npm run test:redesign      # Core Japanese design implementation
npm run test:cultural      # Cultural authenticity verification
npm run test:theme         # Theme system compliance
```

### Specialized Testing
```bash
# Mobile & Responsive
npm run test:mobile        # Mobile navigation, responsive design

# Visual & Performance  
npm run test:visual        # Screenshot comparisons, visual regression
npm run test:performance   # Page load, Core Web Vitals
npm run test:accessibility # ARIA compliance, keyboard navigation

# Security & Infrastructure
npm run test:security      # CSP validation, Bootstrap loading
npm test                   # All tests
```

### Interactive & Reporting
```bash
# Best for development workflow
npm run test:ui            # Interactive browser-based test runner
npm run test:headed        # Run tests with visible browser windows
npm run test:report        # View detailed HTML test reports
```

## 🎯 What Each Test Suite Verifies

### 1. Japanese Redesign Verification (`test:redesign`)
- **Traditional Colors**: Shu-iro (#FF3500), Enji-iro (#C93338), Sango-iro (#F8674F)
- **Design Principles**: Ma (spacing), Kanso (simplicity), Mono no Aware (subtle interactions)
- **Typography**: Japanese-inspired hierarchy, readable line heights
- **Component Library**: Button styles, card designs, hover effects
- **Mobile-First**: Responsive breakpoints, mobile typography

### 2. Cultural Authenticity (`test:cultural`)
- **Color Symbolism**: Red for authority and trust (traditional Japanese)
- **Negative Space**: Ma principle implementation in layouts
- **Elegant Simplicity**: Kanso principle in visual hierarchy  
- **Subtle Beauty**: Mono no Aware in transitions and interactions
- **Brand Connection**: Inkan.link cultural references, authenticity over generic design

### 3. Theme System Compliance (`test:theme`)
- **Light Theme**: CSS custom properties, color specifications
- **Dark Theme**: Adapted colors, proper contrast ratios
- **Theme Toggle**: JavaScript functionality, accessibility
- **Theme Manager**: Global availability, persistence, event system
- **Component Adaptation**: Buttons, cards, text adapt correctly

### 4. Mobile Navigation (`test:mobile`)
- **Bootstrap Loading**: CSP compliance, JavaScript execution
- **Menu Functionality**: Toggle behavior, collapse/expand
- **Accessibility**: ARIA labels, keyboard navigation
- **Responsive Design**: Mobile-first implementation

## 🔧 VS Code Setup for Optimal Testing

### Required Extensions
```json
// Install via Extensions panel (Cmd+Shift+X)
{
  "recommendations": [
    "ms-playwright.playwright",     // Official Playwright extension
    "bradlc.vscode-tailwindcss",   // CSS IntelliSense
    "ms-vscode.vscode-json",       // JSON support
    "ms-vscode.live-server"        // Live preview
  ]
}
```

### Playwright Extension Features
- **Run individual tests** with ▶️ button next to test cases
- **Debug with breakpoints** directly in test files
- **View test results** inline with pass/fail indicators
- **Generate tests** by recording browser interactions
- **Trace viewer** for failed tests with timeline and screenshots

### Workspace Settings
The project includes optimized VS Code settings:
- **Auto-save** on file changes
- **Integrated terminal** opens in project root
- **Test discovery** automatically finds Playwright tests
- **Debug configurations** pre-configured for all test suites

## 🛡️ Security Verification - Website Configuration

### ✅ Secure Development Setup
The project follows security best practices:

```bash
# Verify secure server configuration
npm start                    # Starts development server on localhost:3000
```

#### What This Serves:
- **Static Build Files**: Serves `/docs` directory (build output)
- **No Source Code Access**: `/src`, `/tests`, `/node_modules` are NOT exposed
- **Content Security Policy**: Prevents XSS, restricts resource loading
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.

#### Security Verification Commands:
```bash
# Check what directories are exposed
curl -I http://localhost:3000/src/          # Should return 404/403
curl -I http://localhost:3000/node_modules/ # Should return 404/403  
curl -I http://localhost:3000/tests/        # Should return 404/403

# Verify CSP headers
curl -I http://localhost:3000/ | grep -i content-security-policy

# Test proper file serving
curl -I http://localhost:3000/              # Should return 200 (index.html)
curl -I http://localhost:3000/css/styles.css # Should return 200
```

### 🔒 Security Test Verification
```bash
# Run security tests to verify setup
npm run test:security

# Checks performed:
# ✓ CSP allows required resources (Bootstrap, fonts)
# ✓ CSP blocks unauthorized domains  
# ✓ Security headers are present
# ✓ No mixed content warnings
# ✓ External resources load from whitelisted domains only
```

### ⚠️ What's Protected
- **Source files**: `/src` directory with templates and SCSS
- **Test files**: `/tests` directory with Playwright specs  
- **Dependencies**: `/node_modules` not accessible via web
- **Configuration**: Build scripts, package.json, etc.
- **Git history**: `.git` directory blocked from web access

### ✅ What's Served Publicly
- **Built static files**: `/docs` directory contents
- **Assets**: Images, CSS, JavaScript (optimized & minified)
- **HTML pages**: Generated from templates (no source templates)
- **Fonts & icons**: Bootstrap icons, Google Fonts (via CDN)

## 📊 Test Results & Reporting

### HTML Reports (Best for Analysis)
```bash
npm run test:report         # Opens interactive HTML report
```

**Features:**
- **Test timeline** with execution duration
- **Screenshots** of failed tests with before/after comparisons
- **Error details** with stack traces and context
- **Filtering** by browser, test file, pass/fail status
- **Retry history** for flaky tests

### Visual Diff Reports (Design Verification)
```bash
npm run test:visual         # Generates visual regression report
```

**What it captures:**
- **Hero section** across all browsers
- **Mobile navigation** expanded state
- **Technical verification** section layout
- **Full page screenshots** for comprehensive visual testing
- **Cross-browser** comparison (Chrome, Firefox, Safari)

### Console Output (Quick Feedback)
```bash
# Real-time test results in terminal
npm run test:redesign-full

# Shows:
# ✓ Passed tests with execution time
# ✗ Failed tests with specific error details  
# 📊 Summary statistics (total, passed, failed, skipped)
# 🖼️ Screenshot/video paths for failed tests
```

## 🏃‍♂️ Recommended Development Workflow

### 1. First-Time Setup
```bash
# Install dependencies and run initial verification
npm install
npm run test:redesign-full    # Verify current implementation status
npm run test:ui              # Interactive exploration of test results
```

### 2. Daily Development
```bash
# Start development server
npm start                    # Keep running in one terminal

# Run specific tests while developing
npm run test:cultural        # After changing Japanese design elements
npm run test:theme          # After modifying theme system
npm run test:mobile         # After mobile navigation changes
```

### 3. Before Committing Changes
```bash
# Full verification suite
npm run test:redesign-full   # All redesign verification
npm run test:mobile         # Mobile functionality
npm run test:security       # Security compliance
npm run test:visual         # Visual regression check
```

### 4. Debugging Failed Tests
1. **Use VS Code Debug**: Select debug configuration → F5
2. **Check Screenshots**: Failed tests automatically capture screenshots  
3. **Use Interactive UI**: `npm run test:ui` for visual debugging
4. **Check HTML Report**: `npm run test:report` for detailed analysis

## 🎨 Japanese Design Implementation Status

The tests verify implementation of the complete Japanese design system:

### ✅ Currently Verified
- **Traditional Colors**: Shu-iro, Enji-iro, Sango-iro implementation
- **CSS Custom Properties**: Theme-aware color system
- **Design Principles**: Ma, Kanso, Mono no Aware in layouts
- **Cultural Authenticity**: Inkan branding, red symbolism
- **Theme System**: Light theme with Japanese aesthetic
- **Component Library**: Button styles, card designs
- **Mobile Responsiveness**: Japanese design on mobile
- **Accessibility**: WCAG compliance with cultural design

### 📋 Test Coverage
- **Color System**: 100% traditional color verification
- **Spacing**: Ma (negative space) implementation
- **Typography**: Japanese-inspired hierarchy
- **Interactions**: Subtle transitions (Mono no Aware)
- **Cultural Elements**: Authenticity vs generic cybersecurity
- **Theme Switching**: CSS variable system
- **Security Integration**: CSP with Japanese CDN resources

This comprehensive testing ensures your Japanese Inkan-inspired redesign maintains cultural authenticity while meeting modern web standards and security requirements.