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
cd "$REPORT_DIR/$TIMESTAMP"

echo ""
echo "1️⃣ Building the website..."
cd ../..
 npm run build

echo ""
echo "2️⃣ Starting local server..."

# Check if server is already running on port 8000
EXISTING_PID=$(timeout 2 lsof -ti:8000 2>/dev/null || true)

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
echo "3️⃣ Running performance analysis..."

# Lighthouse audit (desktop)
echo "   📊 Desktop performance..."
npx lighthouse "$SITE_URL" \
  --output json \
  --output html \
  --output-path lighthouse-desktop \
  --preset desktop \
  --quiet \
  --chrome-flags="--headless" || echo "   ⚠️  Lighthouse desktop audit failed"

# Lighthouse audit (mobile)
echo "   📱 Mobile performance..."
npx lighthouse "$SITE_URL" \
  --output json \
  --output html \
  --output-path lighthouse-mobile \
  --form-factor mobile \
  --screenEmulation.mobile \
  --quiet \
  --chrome-flags="--headless" || echo "   ⚠️  Lighthouse mobile audit failed"

echo ""
echo "4️⃣ Taking screenshots..."

# Screenshots at different viewports
npx playwright screenshot --viewport-size "320,568" "$SITE_URL" mobile-small.png
npx playwright screenshot --viewport-size "375,812" "$SITE_URL" mobile-large.png
npx playwright screenshot --viewport-size "768,1024" "$SITE_URL" tablet.png
npx playwright screenshot --viewport-size "1920,1080" "$SITE_URL" desktop.png

# Full page screenshots
npx playwright screenshot --full-page --viewport-size "375,812" "$SITE_URL" mobile-fullpage.png
npx playwright screenshot --full-page --viewport-size "1920,1080" "$SITE_URL" desktop-fullpage.png

echo ""
echo "5️⃣ Running accessibility audits..."

# Axe accessibility testing
echo "   ♿ Running axe-core audit..."
axe "$SITE_URL" --save axe-results.json --timeout 30000 || echo "   ⚠️  Axe audit completed with issues"

# Pa11y accessibility testing
echo "   ♿ Running pa11y audit..."
pa11y "$SITE_URL" --reporter json > pa11y-results.json 2>/dev/null || echo "Pa11y completed with warnings"

echo ""
echo "6️⃣ Analyzing page structure..."

# Use curl to get page content for analysis
curl -s "$SITE_URL" > page-source.html

# Extract key metrics using built-in tools
echo "   📏 Page metrics:"
echo "     HTML size: $(wc -c < page-source.html) bytes"
echo "     HTML lines: $(wc -l < page-source.html)"

# Count images, links, scripts
echo "     Images: $(grep -o '<img[^>]*>' page-source.html | wc -l)"
echo "     Links: $(grep -o '<a[^>]*>' page-source.html | wc -l)"
echo "     Scripts: $(grep -o '<script[^>]*>' page-source.html | wc -l)"
echo "     Stylesheets: $(grep -o '<link[^>]*stylesheet[^>]*>' page-source.html | wc -l)"

echo ""
echo "7️⃣ Creating analysis summary..."

# Create a summary report
cat > analysis-summary.md << EOF
# Website Analysis Report
**Generated:** $(date)
**URL Analyzed:** $SITE_URL

## Files Generated
- \`lighthouse-desktop.html\` - Desktop performance report
- \`lighthouse-mobile.html\` - Mobile performance report
- \`lighthouse-desktop.json\` - Desktop performance data
- \`lighthouse-mobile.json\` - Mobile performance data
- \`axe-results.json\` - Accessibility issues (axe-core)
- \`pa11y-results.json\` - Accessibility issues (pa11y)
- \`mobile-small.png\` - Screenshot (320x568)
- \`mobile-large.png\` - Screenshot (375x812)
- \`tablet.png\` - Screenshot (768x1024)
- \`desktop.png\` - Screenshot (1920x1080)
- \`mobile-fullpage.png\` - Full mobile page
- \`desktop-fullpage.png\` - Full desktop page
- \`page-source.html\` - Raw HTML source

## Quick Actions
1. Open \`lighthouse-desktop.html\` for performance insights
2. Check \`axe-results.json\` for accessibility issues
3. Review screenshots for visual consistency
4. Compare mobile vs desktop performance

## Analysis Tips
- Focus on Core Web Vitals scores in Lighthouse
- Address any accessibility violations found
- Check image optimization opportunities
- Verify mobile responsiveness in screenshots
EOF

echo ""
echo "8️⃣ Cleaning up..."
cd ../../..

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
