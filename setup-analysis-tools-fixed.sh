#!/bin/bash
# Website Analysis Tools Setup - CORRECTED VERSION
# Run with: chmod +x setup-analysis-tools-fixed.sh && ./setup-analysis-tools-fixed.sh

set -e  # Exit on any error

# Reduce Homebrew noise
export HOMEBREW_NO_INSTALL_CLEANUP=1
export HOMEBREW_NO_ENV_HINTS=1

echo "🍺 Setting up website analysis tools (CORRECTED VERSION)..."
echo "📋 Using Homebrew (preferred) + npm (essential only)"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Please install from https://brew.sh"
    exit 1
fi

echo ""
echo "1️⃣ Installing core tools via Homebrew (skipping if already installed)..."

# Function to install only if not present
install_if_missing() {
    if brew list "$1" &>/dev/null; then
        echo "   ✅ $1 already installed"
    else
        echo "   📦 Installing $1..."
        brew install "$1"
    fi
}

# Tools actually available via Homebrew
install_if_missing node
install_if_missing lighthouse
install_if_missing python3
install_if_missing jq
install_if_missing imagemagick

# curl is usually pre-installed on macOS
if command -v curl &> /dev/null; then
    echo "   ✅ curl already available"
else
    install_if_missing curl
fi

echo ""
echo "2️⃣ Installing tools via npm (skipping if already installed)..."

# Function to install npm package only if not present globally
install_npm_if_missing() {
    if npm list -g "$1" &>/dev/null; then
        echo "   ✅ $1 already installed globally"
    elif command -v "$1" &> /dev/null; then
        echo "   ✅ $1 already available (local or system)"
    else
        echo "   📦 Installing $1 globally..."
        npm install -g "$1"
    fi
}

# Playwright and other tools need npm
install_npm_if_missing playwright
install_npm_if_missing @axe-core/cli
install_npm_if_missing pa11y

# browser-sync is in your package.json devDependencies, check if we need global
if npm list -g browser-sync &>/dev/null || npx browser-sync --version &>/dev/null; then
    echo "   ✅ browser-sync already available (global or local)"
else
    echo "   📦 Installing browser-sync globally..."
    npm install -g browser-sync
fi

echo ""
echo "3️⃣ Setting up browser binaries..."

# Install only Chromium to save space
npx playwright install chromium

echo ""
echo "4️⃣ Installing project-specific analysis tools locally..."

# Check if already in package.json devDependencies
if grep -q "backstopjs" package.json; then
    echo "   ✅ backstopjs already in package.json"
else
    echo "   📦 Adding backstopjs to devDependencies..."
    npm install --save-dev backstopjs
fi

if grep -q "webpack-bundle-analyzer" package.json; then
    echo "   ✅ webpack-bundle-analyzer already in package.json"
else
    echo "   📦 Adding webpack-bundle-analyzer to devDependencies..."
    npm install --save-dev webpack-bundle-analyzer
fi

# Install local dependencies if package.json was updated
echo "   📦 Installing local dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🧪 Testing installations..."

# Test each tool
echo "Node.js: $(node --version 2>/dev/null || echo 'FAILED')"
echo "Lighthouse: $(lighthouse --version 2>/dev/null || echo 'FAILED')"
echo "Playwright: $(npx playwright --version 2>/dev/null || echo 'FAILED')"
echo "Axe: $(axe --version 2>/dev/null || echo 'FAILED')"
echo "Pa11y: $(pa11y --version 2>/dev/null || echo 'FAILED')"
echo "Browser-sync: $(browser-sync --version 2>/dev/null || echo 'FAILED')"

echo ""
echo "🔧 Checking browser installation..."
echo "Chromium: $(npx playwright install chromium --dry-run 2>/dev/null && echo 'INSTALLED' || echo 'MISSING')"

echo ""
echo "🎯 Next steps:"
echo "1. Run: ./analyze-website.sh"
echo "2. Check the generated reports in ./analysis-reports/"
echo ""
echo "💡 If you see any FAILED tests above, run:"
echo "   npm install -g [tool-name]"
echo ""