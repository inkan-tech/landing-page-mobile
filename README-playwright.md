# Playwright Testing Setup for Sealfie Landing Page

## Overview

Playwright is now configured for comprehensive testing and visual analysis of the Sealfie landing page. The test suite includes mobile navigation testing, visual regression testing, accessibility checks, performance monitoring, and security validation.

## Installation

Playwright is already installed. If you need to reinstall browsers:

```bash
bun x playwright install
```

## Available Test Commands

### Basic Testing
```bash
# Run all tests
bun test

# Run tests with browser UI (interactive)
bun run test:ui

# Run tests in headed mode (see browser)
bun run test:headed

# Show test report
bun run test:report
```

### Specialized Test Suites
```bash
# Mobile-specific tests (iPhone, Android)
bun run test:mobile

# Visual regression tests (screenshots)
bun run test:visual

# Accessibility compliance tests
bun run test:accessibility

# Performance benchmarking
bun run test:performance

# Security & CSP validation
bun run test:security
```

## Test Suites Included

### 1. Mobile Navigation Tests (`mobile-navigation.spec.js`)
- ✅ **Bootstrap Loading**: Verifies Bootstrap JS loads correctly
- ✅ **Mobile Menu Toggle**: Tests hamburger menu functionality
- ✅ **Menu Visibility**: Validates menu show/hide states
- ✅ **Navigation Links**: Checks mobile menu link accessibility

### 1.1. Accessibility Tests (`accessibility.spec.js`)
- ✅ **Heading Hierarchy**: Validates proper H1-H6 structure with current hero content
- ✅ **Current Hero**: Tests H1 contains "Your business is a target" (updated content)
- ✅ **ARIA Labels**: Navigation accessibility compliance
- ✅ **Alt Text**: Image accessibility verification
- ✅ **Keyboard Navigation**: Carousel and form accessibility

### 2. Visual Regression Tests (`visual-regression.spec.js`)
- 📸 **Hero Section Screenshots**: Cross-browser visual comparison
- 📸 **Mobile Menu Screenshots**: Mobile navigation UI validation
- 📸 **Technical Verification Section**: New section visual testing
- 📸 **Full Page Screenshots**: Complete page visual regression
- 🎯 **Supports**: Chrome, Firefox, Safari, Mobile browsers

### 3. Accessibility Tests (`accessibility.spec.js`)
- ♿ **Heading Hierarchy**: Proper H1-H6 structure validation
- ♿ **ARIA Labels**: Navigation accessibility compliance
- ♿ **Alt Text**: Image accessibility verification
- ♿ **Keyboard Navigation**: Carousel keyboard controls
- ♿ **Form Labels**: Input accessibility validation

### 4. Performance Tests (`performance.spec.js`)
- ⚡ **Load Time Monitoring**: Page load under 5 seconds
- ⚡ **Critical Resources**: CSS/JS loading validation
- ⚡ **JavaScript Errors**: Runtime error detection
- ⚡ **Core Web Vitals**: FCP, LCP measurement
- ⚡ **Image Optimization**: Efficient image loading checks

### 5. Security & CSP Tests (`csp-security.spec.js`)
- 🔒 **CSP Compliance**: Content Security Policy validation
- 🔒 **Bootstrap Loading**: CDN security verification
- 🔒 **Resource Whitelisting**: External resource validation
- 🔒 **Security Headers**: Meta tag security compliance
- 🔒 **Mixed Content**: HTTPS/HTTP mixed content detection

## Configuration

### Playwright Config (`playwright.config.js`)
- **Base URL**: `http://localhost:3000`
- **Auto-server**: Starts `bun start` automatically
- **Screenshots**: Taken on failure
- **Videos**: Recorded on failure
- **Traces**: Available for debugging

### Browser Coverage
- ✅ **Desktop**: Chrome, Firefox, Safari
- ✅ **Mobile**: iPhone 12, Pixel 5
- ✅ **Tablet**: iPad Pro

## Visual Testing Features

### Screenshot Comparison
- Automatic baseline creation on first run
- Cross-browser visual comparison
- Mobile vs desktop visual validation
- Pixel-level difference detection

### Dynamic Content Handling
- Video/animation freeze for consistent screenshots
- Carousel auto-advance disabled during testing
- Font loading wait for visual consistency

## Running Tests

### Development Workflow
1. **Start dev server**: `bun start` (runs on :3000)
2. **Run specific test**: `bun run test:mobile`
3. **Review results**: `bun run test:report`
4. **Update baselines**: Delete `/test-results/` and re-run

### CI/CD Integration
```bash
# Headless testing (perfect for CI)
bun test

# Generate JSON report for processing
# Results in: test-results/results.json
```

## Test Results & Reports

### HTML Reports
- Interactive test results with screenshots
- Timeline view of test execution
- Error details with stack traces
- Access via: `bun run test:report`

### Visual Diff Reports
- Before/after screenshot comparison
- Highlighted pixel differences
- Cross-browser visual variance detection

## Debugging Failed Tests

### Interactive Debugging
```bash
# Debug specific test interactively
bun x playwright test mobile-navigation.spec.js --debug

# Run with browser visible
bun run test:headed
```

### Screenshots & Videos
- Screenshots: `/test-results/[test-name]/test-failed-1.png`
- Videos: `/test-results/[test-name]/video.webm`
- Traces: `/test-results/[test-name]/trace.zip`

## Japanese Design System Validation

The visual regression tests specifically validate:
- ✅ **Ma (Negative Space)**: Proper spacing compliance
- ✅ **Traditional Colors**: Shu-iro, Enji-iro color verification
- ✅ **Mobile Responsiveness**: Japanese aesthetic on mobile
- ✅ **Component Consistency**: Design system adherence

## Integration with VS Code

With the Playwright VS Code extension:
- **Run tests**: Click ▶️ beside test cases
- **Debug tests**: Set breakpoints in test files
- **View results**: Inline test result display
- **Screenshot comparison**: Built-in diff viewer

## Best Practices

### Writing New Tests
1. **Use descriptive test names**
2. **Wait for `networkidle`** before assertions
3. **Handle dynamic content** (videos, animations)
4. **Test mobile-first** for responsive validation
5. **Include accessibility checks** in new tests

### Visual Testing Tips
1. **Freeze animations** for consistent screenshots
2. **Hide dynamic timestamps** or counters
3. **Use `fullPage: true`** for complete page captures
4. **Test across all browser projects**

This comprehensive testing setup ensures the Sealfie landing page maintains quality, accessibility, and visual consistency across all devices and browsers while validating the Japanese design system implementation.