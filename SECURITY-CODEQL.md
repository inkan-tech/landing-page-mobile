# CodeQL Security Analysis for Sealfie Landing Page

## Overview

This document outlines the CodeQL security analysis implementation for the Sealfie landing page, a cybersecurity product's web presence built with Grunt, Pug templates, and JavaScript.

## 🎯 Security Goals

Our CodeQL implementation focuses on:

1. **Input Validation**: Detecting XSS vulnerabilities in contact forms
2. **Analytics Security**: Preventing PII exposure in tracking code  
3. **DOM Manipulation**: Identifying unsafe client-side operations
4. **CSP Compliance**: Ensuring Content Security Policy adherence
5. **Supply Chain**: Monitoring third-party script dependencies

## 📁 File Structure

```
.github/workflows/
├── codeql.yml              # Main CodeQL workflow
└── security-scan.yml       # Comprehensive security scan

codeql-custom-queries-javascript/
├── codeql-pack.yml         # Query pack configuration
├── unsafe-dom-manipulation.ql      # XSS detection
├── analytics-data-exposure.ql     # PII in analytics  
├── contact-form-validation.ql     # Input validation
├── csp-violations.ql             # CSP compliance
└── example.ql                    # Third-party scripts

scripts/
└── run-codeql-local.sh     # Local analysis script
```

## 🚀 Quick Start

### Option 1: Automated (GitHub Actions)
CodeQL runs automatically on:
- Push to `main`/`master` branches
- Pull requests
- Weekly schedule (Mondays 2:30 AM)

### Option 2: Local Analysis
```bash
# Install CodeQL CLI first: https://github.com/github/codeql-cli-binaries
npm run security:scan
```

### Option 3: Dependency Audit Only
```bash
npm run security:audit
```

### Option 4: Full Security Check
```bash
npm run security:check  # Runs both audit and CodeQL scan
```

## 🔍 Custom Queries Explained

### 1. Unsafe DOM Manipulation (`unsafe-dom-manipulation.ql`)
**Purpose**: Detects potential XSS through innerHTML, document.write, eval
**Severity**: ⚠️ Warning (7.5/10)
**Targets**: Contact forms, dynamic content injection

### 2. Analytics Data Exposure (`analytics-data-exposure.ql`)  
**Purpose**: Prevents PII/sensitive data being sent to Matomo analytics
**Severity**: 🚨 Error (8.0/10)
**Targets**: Matomo _paq.push() calls, tracking functions

### 3. Contact Form Validation (`contact-form-validation.ql`)
**Purpose**: Ensures all form inputs have proper validation
**Severity**: ⚠️ Warning (6.0/10)  
**Targets**: FormData access, getElementById, form submissions

### 4. CSP Violations (`csp-violations.ql`)
**Purpose**: Identifies code violating Content Security Policy
**Severity**: 🚨 Error (7.0/10)
**Targets**: eval(), inline handlers, data: URIs

### 5. Third-party Scripts (`example.ql`)
**Purpose**: Monitors external script loading for supply chain security
**Severity**: 💡 Recommendation
**Targets**: External CDN scripts, dynamic script creation

## 📊 Interpreting Results

### SARIF Files
- `standard-results.sarif`: GitHub's standard security queries
- `custom-results.sarif`: Our web-specific security queries

### CSV Reports  
- `standard-results.csv`: Human-readable standard results
- `custom-results.csv`: Human-readable custom results

### Result Priorities
1. **🚨 Error (8.0+)**: Fix immediately before deployment
2. **⚠️ Warning (6.0-7.9)**: Address in current sprint  
3. **💡 Recommendation**: Address in next release

## 🛠️ Maintenance

### Weekly Tasks
- Review GitHub Security tab for new alerts
- Check automated scan results in Actions tab
- Update query pack dependencies if needed

### Monthly Tasks
- Review and tune custom query effectiveness
- Update severity thresholds based on findings
- Check for new CodeQL query packs from GitHub

### Per Release Tasks
- Run full local scan before deployment
- Review any new third-party dependencies
- Update security documentation if architecture changes

## 🔧 Customization

### Adding New Queries
1. Create `.ql` file in `codeql-custom-queries-javascript/`
2. Follow existing pattern with proper metadata
3. Test locally with `npm run security:scan`
4. Update this documentation

### Adjusting Severity
Edit the `@security-severity` annotation in query files:
- `9.0-10.0`: Critical - Block deployment
- `7.0-8.9`: High - Fix urgently  
- `4.0-6.9`: Medium - Fix in sprint
- `1.0-3.9`: Low - Fix when convenient

### Excluding False Positives
Add exclusions to queries using `not exists()` conditions targeting specific file patterns or code structures.

## 🔒 Security-Specific Considerations

### For Cybersecurity Product
As a cybersecurity company, our landing page must be exemplary:
- Zero tolerance for XSS vulnerabilities
- Strict CSP implementation
- Minimal third-party dependencies
- Comprehensive audit trails

### Privacy Compliance
- Analytics tracking must not expose PII
- Contact forms require input sanitization
- Service worker must handle offline data securely

## 📈 Metrics & KPIs

Track these security metrics:
- **Time to Resolution**: Average time to fix critical issues
- **False Positive Rate**: % of flagged issues that are false positives
- **Coverage**: % of JavaScript files analyzed
- **Trend**: Month-over-month security posture improvement

## 🆘 Troubleshooting

### Common Issues

**"CodeQL CLI not found"**
- Install from: https://github.com/github/codeql-cli-binaries
- Add to PATH: `export PATH=$PATH:/path/to/codeql`

**"No results found"**  
- Verify queries compile: `codeql query compile [query-file]`
- Check database creation succeeded
- Ensure build completed without errors

**"Permission denied"**
- Make script executable: `chmod +x scripts/run-codeql-local.sh`
- Check GitHub Actions permissions in repository settings

### Getting Help
- CodeQL Documentation: https://codeql.github.com/docs/
- GitHub Security Lab: https://securitylab.github.com/
- Internal Security Team: security@inkan.link

## 📞 Contact

**Security Team**: security@inkan.link  
**Development Team**: dev@inkan.link  
**Documentation Owner**: Nicolas Thomas

---

*Last Updated: $(date)*  
*Version: 1.0.0*  
*Next Review: Monthly*