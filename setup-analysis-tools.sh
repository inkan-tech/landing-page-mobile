#!/bin/bash
# Website Analysis Tools Setup - Homebrew + npm hybrid approach
# Run with: chmod +x setup-analysis-tools.sh && ./setup-analysis-tools.sh

set -e  # Exit on any error

echo "🍺 Setting up website analysis tools..."
echo "📋 Using Homebrew (preferred) + npm (essential only)"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Please install from https://brew.sh"
    exit 1
fi

echo ""
echo "1️⃣ Installing core tools via Homebrew..."

# Core tools available via Homebrew
brew install node
brew install lighthouse  
brew install python3
brew install jq          # For JSON processing
brew install curl        # For API testing
brew install imagemagick # For image analysis

echo ""
echo "2️⃣ Installing essential npm tools (minimal set)..."

# Essential tools not available via Homebrew
npm install -g @axe-core/cli
npm install -g pa11y
npm install -g browser-sync
npm install -g playwright

echo ""
echo "3️⃣ Setting up browser binaries..."

# Install only Chromium to save space
playwright install chromium

echo ""
echo "4️⃣ Installing project-specific analysis tools locally..."

# Add to your project's package.json for local use
npm install --save-dev backstopjs
npm install --save-dev webpack-bundle-analyzer

echo ""
echo "✅ Installation complete!"
echo ""
echo "🧪 Testing installations..."

# Test each tool
echo "Testing lighthouse: $(lighthouse --version 2>/dev/null || echo 'FAILED')"
echo "Testing axe: $(axe --version 2>/dev/null || echo 'FAILED')"
echo "Testing pa11y: $(pa11y --version 2>/dev/null || echo 'FAILED')"
echo "Testing playwright: $(playwright --version 2>/dev/null || echo 'FAILED')"
echo "Testing browser-sync: $(browser-sync --version 2>/dev/null || echo 'FAILED')"

echo ""
echo "🎯 Next steps:"
echo "1. Run: ./analyze-website.sh (I'll create this next)"
echo "2. Check the generated reports in ./analysis-reports/"
echo ""