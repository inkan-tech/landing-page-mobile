# VS Code Playwright Testing Troubleshooting Guide

## Common Issues & Solutions

### 1. Tests Fail When Running from VS Code

**Symptoms:**
- Tests pass from command line but fail in VS Code
- Connection errors or timeouts
- "Cannot connect to localhost:3002" errors

**Solutions:**

#### Check Environment Configuration
1. Ensure `.env.test` exists and contains correct configuration
2. Verify VS Code settings point to correct config files
3. Make sure dev server is running on correct port (3000)

#### VS Code Extension Settings
In `.vscode/settings.json`:
```json
{
  "playwright.envFile": ".env.test",
  "playwright.testDir": "./tests",
  "playwright.configFile": "playwright.config.js"
}
```

#### Debug Configuration
Use the pre-configured debug launchers:
- "Debug Playwright Tests" - For general debugging
- "Debug Japanese Redesign Tests" - For redesign testing
- "Debug Cultural Authenticity Tests" - For cultural validation
- "Debug Theme System Tests" - For theme testing
- "Debug Mobile Navigation" - For mobile-specific tests

### 2. Port Configuration Issues

**Current Configuration:**
- Dev Server: `http://localhost:3000` (BrowserSync)
- Tests: `http://localhost:3000` (configured in Playwright)

**If ports conflict:**
1. Check what's running on port 3000: `lsof -i :3000`
2. Update `.env.test` with different port if needed
3. Restart VS Code after configuration changes

### 3. Firefox Tests Disabled

Firefox has been disabled in Playwright configuration for faster execution.
Active browsers: Chrome, Safari, Mobile Chrome, Mobile Safari, iPad

### 4. Working Directory Issues

All VS Code launch configurations now include:
```json
{
  "cwd": "${workspaceFolder}",
  "envFile": "${workspaceFolder}/.env.test"
}
```

### 5. Test Commands Reference

**From VS Code Terminal:**
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:accessibility
npm run test:mobile
npm run test:visual
npm run test:security
npm run test:redesign-full

# Debug mode
npm run test:headed
npm run test:ui

# View results
npm run test:report
```

**From Command Line with Environment:**
```bash
# Load environment variables
set -o allexport; source .env.test; set +o allexport

# Run tests
npm test -- tests/accessibility.spec.js
```

### 6. Playwright Extension Issues

**If VS Code Playwright extension doesn't work:**

1. **Reload Window**: Cmd+Shift+P → "Developer: Reload Window"
2. **Reinstall Extension**: Disable/Enable Playwright extension
3. **Clear Extension Cache**: 
   ```bash
   rm -rf ~/.vscode/extensions/ms-playwright.*
   ```
4. **Use Command Line**: As fallback, use terminal commands

### 7. Environment Variables

**Key Variables in `.env.test`:**
```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_WORKERS=4
```

### 8. Quick Diagnostics

**Test configuration:**
```bash
npx playwright test --list | head -10
```

**Check server:**
```bash
curl http://localhost:3000/
```

**Verify Playwright installation:**
```bash
npx playwright --version
```

## Still Having Issues?

1. **Restart VS Code** after making configuration changes
2. **Check Terminal Output** for specific error messages  
3. **Use Debug Mode** with breakpoints for detailed investigation
4. **Fallback to Command Line** for critical testing needs

## Working Configuration Summary

✅ **Port**: 3000 (BrowserSync)  
✅ **Browsers**: Chrome, Safari, Mobile Chrome, Mobile Safari, iPad  
✅ **Environment**: `.env.test` file configured  
✅ **Debug**: All launch configurations updated  
✅ **Extensions**: Playwright VS Code extension supported  

Last Updated: After Tailwind v4 migration & Firefox removal