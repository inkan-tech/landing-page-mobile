# Ahrefs Site Audit via BrowserMCP - Complete Workflow

This workflow uses Playwright browser automation (browsermcp) to navigate Ahrefs Site Audit and extract SEO issues systematically.

## Prerequisites

- Browser must be authenticated with Ahrefs account
- Site audit must be configured for sealf.ie (audit ID: 22469918)
- BrowserMCP tools available: `mcp__playwright__browser_*`

## Quick Reference: Ahrefs URLs

```
Dashboard:       https://app.ahrefs.com/site-audit/22469918/index
Indexability:    https://app.ahrefs.com/site-audit/22469918/index/indexability
Content Quality: https://app.ahrefs.com/site-audit/22469918/index/content-quality
Structured Data: https://app.ahrefs.com/site-audit/22469918/index/structured-data
Localization:    https://app.ahrefs.com/site-audit/22469918/index/localization
Performance:     https://app.ahrefs.com/site-audit/22469918/index/performance
Links:           https://app.ahrefs.com/site-audit/22469918/index/links
```

## Complete Workflow

### Step 1: Navigate to Dashboard

```javascript
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index"
})
```

**Expected Result**: Ahrefs dashboard loads with overview of all issues categorized by type (Errors, Warnings, Notices).

### Step 2: Capture Overview Snapshot

```javascript
mcp__playwright__browser_snapshot()
```

**What to Look For in Snapshot:**
- Total number of issues by severity (Errors, Warnings, Notices)
- Issue categories with high counts
- Overall health score
- Navigation menu showing available categories

### Step 3: Navigate to Specific Category

Example: Indexability Issues

```javascript
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/indexability"
})
```

**Then take snapshot:**

```javascript
mcp__playwright__browser_snapshot()
```

**What to Look For:**
- List of specific issues (e.g., "404 page", "Non-canonical page in sitemap")
- Number of affected pages for each issue
- Severity indicator (red for errors, yellow for warnings)

### Step 4: Click on Specific Issue

From the snapshot, identify the issue you want to investigate. Click on it:

```javascript
mcp__playwright__browser_click({
  element: "Non-canonical page in sitemap",
  ref: "[exact ref from snapshot]"
})
```

**Note**: The `ref` must be the exact element reference from the previous snapshot.

### Step 5: Extract Affected Pages

```javascript
mcp__playwright__browser_snapshot()
```

**What to Extract:**
- List of all affected page URLs
- Specific issue details for each page
- Recommended fix actions
- Priority/impact information

### Step 6: Document Findings

Create structured notes:

```markdown
## Issue: [Issue Name]
- **Category**: Indexability/Content Quality/etc.
- **Severity**: Error/Warning/Notice
- **Affected Pages**: [Count]
- **URLs**:
  - https://sealf.ie/page1.html
  - https://sealf.ie/page2.html
- **Fix**: [Recommended action]
```

### Step 7: Repeat for Other Categories

Navigate to other categories and repeat steps 3-6:

#### Content Quality Issues

```javascript
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/content-quality"
})
mcp__playwright__browser_snapshot()
```

#### Structured Data Issues

```javascript
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/structured-data"
})
mcp__playwright__browser_snapshot()
```

#### Localization Issues

```javascript
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/localization"
})
mcp__playwright__browser_snapshot()
```

## Common Issue Categories

### Indexability
- 404 errors
- Redirect chains
- Orphan pages
- Non-canonical pages in sitemap
- Pages with noindex
- Blocked by robots.txt

### Content Quality
- Duplicate content
- Thin content (low word count)
- Missing H1 tags
- Multiple H1 tags
- Missing meta descriptions
- Duplicate meta descriptions

### Structured Data
- JSON-LD validation errors
- Missing required properties
- Invalid property values
- Deprecated schema types

### Localization
- Hreflang errors
- Missing hreflang tags
- Hreflang to non-canonical
- Incorrect language codes

### Links
- Broken internal links
- Broken external links
- Links to redirects
- Links with nofollow

## Tips for Efficient Navigation

### 1. Use Direct URLs
Instead of clicking through menus, navigate directly to category pages:

```javascript
// Fast: Direct navigation
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/indexability"
})

// Slow: Clicking through menus
// mcp__playwright__browser_click({ element: "Indexability" })
```

### 2. Batch Issue Collection
Take snapshots of all categories first, then analyze:

```javascript
// 1. Snapshot Dashboard
mcp__playwright__browser_navigate({ url: "[dashboard]" })
mcp__playwright__browser_snapshot()

// 2. Snapshot Indexability
mcp__playwright__browser_navigate({ url: "[indexability]" })
mcp__playwright__browser_snapshot()

// 3. Snapshot Content Quality
mcp__playwright__browser_navigate({ url: "[content-quality]" })
mcp__playwright__browser_snapshot()

// 4. Analyze all snapshots together
```

### 3. Filter High Priority
Focus on Errors (red) first, then Warnings (yellow), finally Notices (blue).

### 4. Export Data
If available, use Ahrefs export feature:

```javascript
// Look for "Export" button in snapshot
mcp__playwright__browser_click({
  element: "Export button",
  ref: "[from snapshot]"
})
```

## Troubleshooting

### Issue: Not Authenticated
**Symptom**: Login page appears instead of dashboard
**Solution**: Authenticate browser first, then retry navigation

### Issue: Snapshot Too Large
**Symptom**: Snapshot truncated or incomplete
**Solution**: Navigate to more specific pages with fewer elements

### Issue: Element Not Found
**Symptom**: Click fails with "element not found"
**Solution**: Retake snapshot and use updated element reference

### Issue: Page Load Timeout
**Symptom**: Navigation times out
**Solution**: Increase timeout or retry navigation

## Integration with SEO Workflow

After extracting issues via BrowserMCP:

1. **Prioritize**: Categorize by P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
2. **Document**: Add to `AHREFS-SEO-FIXES.md`
3. **Fix**: Update templates/styles following Japanese design principles
4. **Test**: Create Playwright tests for each fix
5. **Validate**: Re-audit with both Ahrefs and Lighthouse

## Example: Complete Issue Investigation

```javascript
// 1. Navigate to dashboard
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index"
})

// 2. Take overview snapshot
mcp__playwright__browser_snapshot()
// Result: See 30 total issues across all categories

// 3. Navigate to Indexability
mcp__playwright__browser_navigate({
  url: "https://app.ahrefs.com/site-audit/22469918/index/indexability"
})

// 4. Take category snapshot
mcp__playwright__browser_snapshot()
// Result: See list of issues including "Non-canonical page in sitemap (8 pages)"

// 5. Click on specific issue
mcp__playwright__browser_click({
  element: "Non-canonical page in sitemap",
  ref: "row-3"  // Example ref from snapshot
})

// 6. Take detail snapshot
mcp__playwright__browser_snapshot()
// Result: See 8 affected URLs:
// - https://sealf.ie/
// - https://sealf.ie/challenge.html
// - https://sealf.ie/documentation.html
// - etc.

// 7. Document and fix
// Update Gruntfile.js sitemap configuration to exclude non-canonical pages
```

## Best Practices

1. **Take frequent snapshots**: Capture state before and after each action
2. **Use specific element references**: Always use exact refs from snapshots
3. **Navigate directly**: Use full URLs instead of clicking through menus
4. **Document systematically**: Keep structured notes of all findings
5. **Prioritize ruthlessly**: Fix errors before warnings before notices
6. **Validate fixes**: Re-audit after implementing fixes

## Related Documentation

- SEO Expert Agent: `.claude/agents/seo-expert.md`
- SEO Audit Command: `.claude/commands/seo-audit.md`
- SEO Fixes Tracking: `AHREFS-SEO-FIXES.md`
- SEO System Overview: `SEO-SYSTEM.md`
