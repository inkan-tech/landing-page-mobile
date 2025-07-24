#!/bin/bash
# Comprehensive Website Analysis Script
# Run with: chmod +x analyze-website.sh && ./analyze-website.sh

set -e

# Configuration
SITE_URL="http://localhost:8000"
REPORT_DIR="./analysis-reports"
BUILD_DIR="./docs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SERVER_PID=""

# Cleanup function
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "🧹 Cleaning up server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
    fi
}

# Set trap to cleanup on exit
trap cleanup EXIT INT TERM

echo "🔍 Starting comprehensive website analysis..."
echo "📅 Timestamp: $TIMESTAMP"

# Create reports directory
mkdir -p "$REPORT_DIR/$TIMESTAMP"
REPORT_PATH="$(pwd)/$REPORT_DIR/$TIMESTAMP"
cd "$REPORT_DIR/$TIMESTAMP"

echo ""
echo "1️⃣ Building the website..."
cd ../..
 npm run build

echo ""
echo "2️⃣ Starting local server..."

# Check if server is already running on port 8000
EXISTING_PID=$(lsof -ti:8000 2>/dev/null || true)

if [ ! -z "$EXISTING_PID" ]; then
    echo "⚠️  Found existing server on port 8000 (PID: $EXISTING_PID)"
    echo "🔨 Killing existing server..."
    kill -9 $EXISTING_PID 2>/dev/null || true
    sleep 2
fi

cd "$BUILD_DIR"
python3 -m http.server 8000 &
SERVER_PID=$!
echo "🌐 Server started (PID: $SERVER_PID)"
sleep 3

# Move back to reports directory
cd "../$REPORT_DIR/$TIMESTAMP"

echo ""
echo "3️⃣ Extracting pages from sitemap..."

# Extract unique page paths from sitemap 
# Since sitemap has https://sealf.ie URLs, we'll convert them to local paths
PAGES=$(grep -o '<loc>https://sealf.ie[^<]*</loc>' "$BUILD_DIR/sitemap.xml" 2>/dev/null | \
        sed 's|<loc>https://sealf.ie||g' | \
        sed 's|</loc>||g' | \
        sort -u || echo "/")

# If sitemap parsing fails, analyze at least the main pages
if [ -z "$PAGES" ]; then
    echo "   ⚠️  Could not parse sitemap, using default pages"
    PAGES="/
/documentation.html
/pricing.html
/support.html
/terms.html
/privacy-ios.html
/en/
/fr/"
fi

# For testing, option to limit pages
if [ "$1" = "--quick" ]; then
    echo "   🚀 Quick mode: analyzing only first 3 pages"
    PAGES=$(echo "$PAGES" | head -3)
fi

echo "   📝 Found $(echo "$PAGES" | wc -l | tr -d ' ') pages to analyze"

echo ""
echo "4️⃣ Running performance analysis..."

# Create subdirectories for each page's results
mkdir -p lighthouse accessibility screenshots

# Analyze each page
for PAGE in $PAGES; do
    # Clean page name for file naming
    PAGE_NAME=$(echo "$PAGE" | sed 's|^/||' | sed 's|/$|index|' | sed 's|/|-|g' | sed 's|\.html$||')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="index"
    
    echo ""
    echo "   🔍 Analyzing page: $PAGE"
    PAGE_URL="${SITE_URL}${PAGE}"
    
    # Skip Lighthouse if --no-lighthouse flag is provided
    if [ "$2" != "--no-lighthouse" ]; then
        # Get absolute path to config
        CONFIG_PATH="$(cd ../.. && pwd)/lighthouse-config.js"
        
        # Lighthouse audit (desktop)
        echo "      📊 Desktop performance..."
        npx lighthouse "$PAGE_URL" \
          --config-path="$CONFIG_PATH" \
          --output json \
          --output html \
          --output-path "lighthouse/desktop-${PAGE_NAME}" \
          --preset desktop \
          --quiet \
          --chrome-flags="--headless" || echo "      ⚠️  Lighthouse desktop audit failed"
        
        # Lighthouse audit (mobile)
        echo "      📱 Mobile performance..."
        npx lighthouse "$PAGE_URL" \
          --config-path="$CONFIG_PATH" \
          --output json \
          --output html \
          --output-path "lighthouse/mobile-${PAGE_NAME}" \
          --form-factor mobile \
          --screenEmulation.mobile \
          --quiet \
          --chrome-flags="--headless" || echo "      ⚠️  Lighthouse mobile audit failed"
    else
        echo "      ⚠️  Skipping Lighthouse audits (--no-lighthouse flag)"
    fi
done

echo ""
echo "5️⃣ Taking screenshots..."

# Take screenshots for each page
for PAGE in $PAGES; do
    PAGE_NAME=$(echo "$PAGE" | sed 's|^/||' | sed 's|/$|index|' | sed 's|/|-|g' | sed 's|\.html$||')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="index"
    PAGE_URL="${SITE_URL}${PAGE}"
    
    echo "   📸 Screenshots for: $PAGE"
    
    # Create page-specific screenshot directory
    mkdir -p "screenshots/${PAGE_NAME}"
    
    # Screenshots at different viewports
    npx playwright screenshot --viewport-size "320,568" "$PAGE_URL" "screenshots/${PAGE_NAME}/mobile-small.png"
    npx playwright screenshot --viewport-size "375,812" "$PAGE_URL" "screenshots/${PAGE_NAME}/mobile-large.png"
    npx playwright screenshot --viewport-size "768,1024" "$PAGE_URL" "screenshots/${PAGE_NAME}/tablet.png"
    npx playwright screenshot --viewport-size "1920,1080" "$PAGE_URL" "screenshots/${PAGE_NAME}/desktop.png"
    
    # Full page screenshots (only for mobile and desktop)
    npx playwright screenshot --full-page --viewport-size "375,812" "$PAGE_URL" "screenshots/${PAGE_NAME}/mobile-fullpage.png"
    npx playwright screenshot --full-page --viewport-size "1920,1080" "$PAGE_URL" "screenshots/${PAGE_NAME}/desktop-fullpage.png"
done

echo ""
echo "6️⃣ Running accessibility audits..."

# Run accessibility audits for each page
for PAGE in $PAGES; do
    PAGE_NAME=$(echo "$PAGE" | sed 's|^/||' | sed 's|/$|index|' | sed 's|/|-|g' | sed 's|\.html$||')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="index"
    PAGE_URL="${SITE_URL}${PAGE}"
    
    echo "   ♿ Accessibility audit for: $PAGE"
    
    # Axe accessibility testing
    echo "      Running axe-core..."
    axe "$PAGE_URL" --save "accessibility/axe-${PAGE_NAME}.json" --timeout 30000 || echo "      ⚠️  Axe audit completed with issues"
    
    # Pa11y accessibility testing
    echo "      Running pa11y..."
    pa11y "$PAGE_URL" --reporter json > "accessibility/pa11y-${PAGE_NAME}.json" 2>/dev/null || echo "      Pa11y completed with warnings"
done

echo ""
echo "7️⃣ Analyzing page structure..."

# Create directory for page sources
mkdir -p sources

# Analyze structure for each page
for PAGE in $PAGES; do
    PAGE_NAME=$(echo "$PAGE" | sed 's|^/||' | sed 's|/$|index|' | sed 's|/|-|g' | sed 's|\.html$||')
    [ -z "$PAGE_NAME" ] && PAGE_NAME="index"
    PAGE_URL="${SITE_URL}${PAGE}"
    
    echo "   📏 Page metrics for: $PAGE"
    
    # Use curl to get page content for analysis
    curl -s "$PAGE_URL" > "sources/${PAGE_NAME}.html"
    
    # Extract key metrics using built-in tools
    echo "     HTML size: $(wc -c < "sources/${PAGE_NAME}.html") bytes"
    echo "     HTML lines: $(wc -l < "sources/${PAGE_NAME}.html")"
    echo "     Images: $(grep -o '<img[^>]*>' "sources/${PAGE_NAME}.html" | wc -l)"
    echo "     Links: $(grep -o '<a[^>]*>' "sources/${PAGE_NAME}.html" | wc -l)"
    echo "     Scripts: $(grep -o '<script[^>]*>' "sources/${PAGE_NAME}.html" | wc -l)"
    echo "     Stylesheets: $(grep -o '<link[^>]*stylesheet[^>]*>' "sources/${PAGE_NAME}.html" | wc -l)"
done

echo ""
echo "8️⃣ Creating analysis summary..."

# Create a comprehensive summary report
cat > analysis-summary.md << EOF
# Website Analysis Report - All Pages
**Generated:** $(date)
**Base URL:** $SITE_URL
**Pages Analyzed:** $(echo "$PAGES" | wc -l | tr -d ' ')

## Pages Analyzed
$(echo "$PAGES" | sed 's/^/- /')

## Directory Structure
\`\`\`
├── lighthouse/
│   ├── desktop-*.html  - Desktop performance reports
│   ├── mobile-*.html   - Mobile performance reports
│   └── *.json         - Raw performance data
├── accessibility/
│   ├── axe-*.json     - Axe accessibility results
│   └── pa11y-*.json   - Pa11y accessibility results
├── screenshots/
│   └── [page-name]/
│       ├── mobile-small.png    (320x568)
│       ├── mobile-large.png    (375x812)
│       ├── tablet.png          (768x1024)
│       ├── desktop.png         (1920x1080)
│       ├── mobile-fullpage.png (full height)
│       └── desktop-fullpage.png (full height)
└── sources/
    └── *.html         - Raw HTML source for each page
\`\`\`

## Quick Actions
1. **Performance Review**: Open \`lighthouse/desktop-index.html\` for homepage performance
2. **Accessibility Audit**: Check \`accessibility/axe-*.json\` files for violations
3. **Visual QA**: Browse \`screenshots/\` folders for each page
4. **Cross-Language Comparison**: Compare en/ vs fr/ page results

## Analysis Tips by Page Type

### Homepage (/, /en/, /fr/)
- Check hero section performance impact
- Verify video loading optimization
- Review mobile conversion elements

### Documentation Pages
- Ensure content is accessible
- Check readability scores
- Verify navigation consistency

### Legal Pages (terms, privacy)
- Focus on accessibility compliance
- Check text contrast ratios
- Ensure proper heading structure

### Support/Pricing Pages
- Verify form accessibility
- Check CTA button contrast
- Review mobile usability

## Next Steps
1. Address critical accessibility violations first
2. Optimize images for pages with poor performance
3. Review mobile experience for conversion pages
4. Compare French vs English page performance
EOF

echo ""
echo "9️⃣ Cleaning up..."
# Return to original directory
cd "$(dirname "$REPORT_PATH")"/..

echo ""
echo "✅ Analysis complete!"
echo ""
echo "📋 Reports saved to: $REPORT_DIR/$TIMESTAMP/"
echo ""
echo "🎯 Next steps:"
echo "1. Open: $REPORT_DIR/$TIMESTAMP/lighthouse-desktop.html"
echo "2. Review: $REPORT_DIR/$TIMESTAMP/analysis-summary.md"
echo "3. Share relevant files with Claude for detailed recommendations"
echo ""
echo "🔗 Quick links:"
echo "   Performance: open $REPORT_DIR/$TIMESTAMP/lighthouse-desktop.html"
echo "   Screenshots: open $REPORT_DIR/$TIMESTAMP/"
echo ""
