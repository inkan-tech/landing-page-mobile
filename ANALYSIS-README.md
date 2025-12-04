# Website Analysis Tools Setup

## Quick Start

1. **Install tools:**
   ```bash
   chmod +x setup-analysis-tools.sh
   ./setup-analysis-tools.sh
   ```

2. **Run analysis:**
   ```bash
   chmod +x analyze-website.sh  
   ./analyze-website.sh
   ```

3. **Review results:**
   ```bash
   open analysis-reports/[timestamp]/lighthouse-desktop.html
   ```

## What Gets Analyzed

### 🚀 Performance
- **Lighthouse Desktop** - Core Web Vitals, performance metrics
- **Lighthouse Mobile** - Mobile-specific performance issues
- **Bundle Analysis** - JavaScript and CSS bundle sizes

### 📱 Responsiveness  
- **Screenshots** - 4 different viewport sizes (320px to 1920px)
- **Full Page Captures** - Complete page renders for mobile and desktop

### ♿ Accessibility
- **Axe-core** - WCAG 2.1 compliance testing
- **Pa11y** - Additional accessibility validation

### 📊 Structure Analysis
- **HTML Metrics** - Page size, element counts
- **Resource Counting** - Images, scripts, stylesheets
- **Source Code** - Raw HTML for manual inspection

## Tools Installed

### Via Homebrew ✅
- `node` - JavaScript runtime
- `lighthouse` - Google's performance auditing tool
- `playwright` - Browser automation for screenshots
- `python3` - For local development server
- `jq` - JSON processing
- `curl` - HTTP requests
- `imagemagick` - Image analysis

### Via bun (minimal set) 📦
- `@axe-core/cli` - Accessibility testing
- `pa11y` - Additional accessibility testing
- `browser-sync` - Live reloading development server

### Project-specific (local) 🏠
- `backstopjs` - Visual regression testing
- `webpack-bundle-analyzer` - Bundle analysis

## Understanding Results

### Lighthouse Reports
- **Green (90-100)** - Good performance
- **Orange (50-89)** - Needs improvement  
- **Red (0-49)** - Poor performance

**Key Metrics:**
- First Contentful Paint (FCP) - Should be < 1.8s
- Time to Interactive (TTI) - Should be < 3.8s
- Cumulative Layout Shift (CLS) - Should be < 0.1

### Accessibility Results
- **Critical** - Must fix for WCAG compliance
- **Serious** - Important accessibility issues
- **Moderate** - Good to address for better UX
- **Minor** - Nice-to-have improvements

### Screenshots Analysis
- Compare visual consistency across devices
- Check text readability at different sizes
- Verify button/link touch targets (min 44px)
- Ensure content fits without horizontal scroll

## Sharing Results with Claude

For best analysis recommendations, share:

1. **Performance data:**
   ```bash
   cat analysis-reports/[timestamp]/lighthouse-mobile.json
   ```

2. **Accessibility issues:**
   ```bash
   cat analysis-reports/[timestamp]/axe-results.json  
   ```

3. **Screenshots** - Upload the PNG files

4. **Specific questions** about what you want to improve

## Troubleshooting

### Server won't start
```bash
# Kill any existing servers
lsof -ti:8000 | xargs kill -9

# Try different port
python3 -m http.server 8001
```

### Lighthouse fails
```bash
# Check if site is accessible
curl -I http://localhost:8000

# Run with debug info
lighthouse http://localhost:8000 --verbose
```

### Screenshots are blank
```bash
# Reinstall browser
playwright install chromium --force
```

### Permission errors
```bash
# Fix script permissions
chmod +x *.sh

# Fix bun global installs (if needed)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

## Advanced Usage

### Custom analysis
```bash
# Analyze specific page
lighthouse http://localhost:8000/fr/ --output html

# Different device screenshots  
playwright screenshot --device="iPhone 12" http://localhost:8000 iphone12.png

# Accessibility with specific rules
axe http://localhost:8000 --tags wcag2a,wcag2aa
```

### Automated testing
```bash
# Add to package.json scripts:
"scripts": {
  "analyze": "./analyze-website.sh",
  "test:a11y": "axe http://localhost:8000",
  "test:perf": "lighthouse http://localhost:8000 --output json"
}
```

## Next Steps After Analysis

1. **Share results** with Claude for specific recommendations
2. **Prioritize fixes** based on impact (performance → accessibility → visual)
3. **Implement changes** and re-run analysis
4. **Set up monitoring** for ongoing performance tracking