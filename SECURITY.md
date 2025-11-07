# Security Policy

## Known Security Issues

### npm Audit Vulnerabilities (Build-Time Only)

**Status**: Accepted Risk
**Last Updated**: November 7, 2025

#### Current Vulnerabilities

```
4 moderate severity vulnerabilities in grunt-pug-i18n dependencies
```

**Affected Packages**:
- `pug` (<=3.0.2) - CVE-2024-XXXXX, CVE-2024-YYYYY
- `pug-code-gen` (<=3.0.2) - CVE-2024-XXXXX

**Issues**:
1. Pug allows JavaScript code execution if application accepts untrusted input
2. Remote code execution via the `pretty` option

**Risk Assessment**: **LOW**

**Reasoning**:
- These vulnerabilities only affect **build-time** operations
- The project is a **static site generator** - templates are compiled during build, not at runtime
- No user input reaches Pug templates
- The deployed site is pure static HTML/CSS/JS with no Pug execution
- Vulnerabilities require accepting untrusted user input to templates (not applicable here)

**Mitigation**:
- Build environment is controlled and trusted
- No external/user input is processed by Pug templates
- Production site serves pre-compiled static HTML
- Regular monitoring for updates to `grunt-pug-i18n` package

**Fix Availability**: No fix currently available
- `grunt-pug-i18n@1.0.1` has no patched version
- Transitive dependencies cannot be easily upgraded
- Waiting for upstream package maintainers

**Future Action**:
- Monitor for `grunt-pug-i18n` updates quarterly
- Consider migrating to modern build tools (Vite, Astro, 11ty) in future refactoring

## Reporting Security Issues

If you discover a security vulnerability in the deployed application (not build tools), please report it by emailing:

**security@inkan.link**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested fixes (optional)

We will respond to security reports within **48 hours** and aim to issue fixes within **7 days** for critical issues.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Security Best Practices

This project follows these security practices:

- **Static Site Generation**: No server-side code execution in production
- **Content Security Policy**: Implemented via meta tags
- **HTTPS Only**: All production traffic uses TLS
- **Dependency Scanning**: Regular npm audit checks
- **Code Review**: All changes reviewed before merge
- **Secrets Management**: No credentials in repository
- **Minimal Attack Surface**: Static HTML reduces vulnerability scope

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Advisories](https://github.com/advisories)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
