#!/bin/bash

# Local CodeQL Analysis Script for Sealfie Landing Page
# Requires CodeQL CLI to be installed: https://github.com/github/codeql-cli-binaries


set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CODEQL_DB_PATH="$PROJECT_ROOT/codeql-database"
RESULTS_DIR="$PROJECT_ROOT/codeql-results"

echo "🔍 Starting local CodeQL security analysis for Sealfie landing page..."

# Check if CodeQL CLI is available
if ! command -v codeql &> /dev/null; then
    echo "❌ CodeQL CLI not found. Please install from: https://github.com/github/codeql-cli-binaries"
    exit 1
fi

# Clean previous results
if [ -d "$CODEQL_DB_PATH" ]; then
    echo "🧹 Cleaning previous database..."
    rm -rf "$CODEQL_DB_PATH"
fi

if [ -d "$RESULTS_DIR" ]; then
    echo "🧹 Cleaning previous results..."
    rm -rf "$RESULTS_DIR"
fi

mkdir -p "$RESULTS_DIR"

# Build the project first
echo "🔨 Building project..."
cd "$PROJECT_ROOT"
bun install --silent
bun run build

# Create CodeQL database
echo "📊 Creating CodeQL database..."
codeql database create "$CODEQL_DB_PATH" \
    --language=javascript \
    --source-root="$PROJECT_ROOT" \
    --overwrite

# Run standard security queries
echo "🔍 Running standard security queries..."
codeql database analyze "$CODEQL_DB_PATH" \
    --format=sarif-latest \
    --output="$RESULTS_DIR/standard-results.sarif" \
    codeql/javascript-queries:codeql-suites/javascript-security-extended.qls

# Run custom queries
echo "🎯 Running custom web security queries..."
codeql database analyze "$CODEQL_DB_PATH" \
    --format=sarif-latest \
    --output="$RESULTS_DIR/custom-results.sarif" \
    "$PROJECT_ROOT/codeql-custom-queries-javascript/"

# Generate human-readable reports
echo "📄 Generating readable reports..."
codeql database analyze "$CODEQL_DB_PATH" \
    --format=csv \
    --output="$RESULTS_DIR/standard-results.csv" \
    codeql/javascript-queries:codeql-suites/javascript-security-extended.qls

codeql database analyze "$CODEQL_DB_PATH" \
    --format=csv \
    --output="$RESULTS_DIR/custom-results.csv" \
    "$PROJECT_ROOT/codeql-custom-queries-javascript/"

# Count results
STANDARD_ISSUES=$(wc -l < "$RESULTS_DIR/standard-results.csv" | xargs)
CUSTOM_ISSUES=$(wc -l < "$RESULTS_DIR/custom-results.csv" | xargs)

echo ""
echo "✅ CodeQL analysis complete!"
echo "📊 Results summary:"
echo "   - Standard security queries: $((STANDARD_ISSUES - 1)) issues found"
echo "   - Custom web security queries: $((CUSTOM_ISSUES - 1)) issues found"
echo "   - Database location: $CODEQL_DB_PATH"
echo "   - Results location: $RESULTS_DIR"
echo ""
echo "📖 View results:"
echo "   - CSV reports: $RESULTS_DIR/*.csv"
echo "   - SARIF reports: $RESULTS_DIR/*.sarif"
echo ""

# Display high-level summary if any issues found
if [ $((STANDARD_ISSUES + CUSTOM_ISSUES)) -gt 2 ]; then
    echo "⚠️  Security issues detected. Review the reports above."
    echo "🔧 Consider addressing high-severity issues before deployment."
else
    echo "🎉 No security issues detected in static analysis!"
fi