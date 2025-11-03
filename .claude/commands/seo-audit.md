<command name="seo-audit">
  <role>SEO expert specializing in technical SEO audits and optimization for the Sealfie landing page</role>
  <mission>Run comprehensive SEO audits using Lighthouse, triage issues by priority, implement fixes following Japanese design principles, and create Playwright tests to prevent regressions</mission>

  <tools>
    <automated-auditing>
      <tool name="lighthouse-audit" command="npm run seo:audit">Run full production audit</tool>
      <tool name="local-audit" command="npm run seo:audit:local">Audit development build</tool>
      <tool name="issue-triage" command="npm run seo:triage">Categorize and prioritize issues</tool>
      <tool name="test-generation" command="npm run seo:triage:tests">Generate Playwright tests</tool>
      <tool name="seo-test-suite" command="npm run test:seo">Validate all SEO requirements</tool>
      <tool name="full-workflow" command="npm run seo:full">Complete audit → triage → test cycle</tool>
    </automated-auditing>

    <ahrefs-browsermcp>
      <description>⚠️ ALWAYS use BrowserMCP to navigate Ahrefs and extract comprehensive SEO issues. BrowserMCP controls your actual Chrome browser with the Ahrefs session already logged in.</description>
      <setup>
        <requirement>BrowserMCP package: @browsermcp/mcp@latest</requirement>
        <requirement>Chrome extension installed from https://docs.browsermcp.io/setup-server</requirement>
        <requirement>VS Code MCP server must be running (restart with: MCP: Restart All Servers)</requirement>
      </setup>
      <workflow>
        <step>mcp__browsermcp__browser_navigate({ url: "https://app.ahrefs.com/site-audit/22469918/index" })</step>
        <step>mcp__browsermcp__browser_snapshot()</step>
        <step>Navigate to specific issue category</step>
      </workflow>
      <categories>
        <category path="/index/indexability">Indexability issues</category>
        <category path="/index/content-quality">Content Quality issues</category>
        <category path="/index/structured-data">Structured Data issues</category>
        <category path="/index/localization">Localization issues</category>
      </categories>
      <use-cases>
        <use-case>Comprehensive site crawl data</use-case>
        <use-case>Duplicate content detection</use-case>
        <use-case>Redirect chain analysis</use-case>
        <use-case>Orphan page identification</use-case>
        <use-case>Backlink analysis</use-case>
        <use-case>Competitor insights</use-case>
      </use-cases>
    </ahrefs-browsermcp>
  </tools>

  <workflow>
    <step name="initial-audit" order="1">
      <option name="lighthouse" type="automated">
        <command>npm run seo:audit</command>
        <command>Read reports/seo/summary.json</command>
      </option>
      <option name="ahrefs" type="browsermcp">
        <note>⚠️ Use BrowserMCP (not Playwright MCP) - it controls your actual Chrome browser where you're already logged into Ahrefs</note>
        <actions>
          <action>mcp__browsermcp__browser_navigate({ url: "https://app.ahrefs.com/site-audit/22469918/index" })</action>
          <action>mcp__browsermcp__browser_snapshot()</action>
          <action>mcp__browsermcp__browser_navigate({ url: "https://app.ahrefs.com/site-audit/22469918/index/indexability" })</action>
          <action>mcp__browsermcp__browser_click({ element: "issue name", ref: "[from snapshot]" })</action>
          <action>mcp__browsermcp__browser_snapshot()</action>
        </actions>
      </option>
    </step>

    <step name="triage-issues" order="2">
      <lighthouse-triage>
        <command>npm run seo:triage</command>
        <command>Read reports/seo/triage-report.json</command>
      </lighthouse-triage>
      <ahrefs-triage>
        <task>Review snapshot data to identify affected pages</task>
        <task>Categorize by priority based on issue severity</task>
        <task>Document issue details and page URLs</task>
      </ahrefs-triage>
    </step>

    <step name="fix-issues" order="3">
      <priorities>
        <priority level="P0" severity="critical">Fix immediately (missing titles, meta descriptions)</priority>
        <priority level="P1" severity="high">Fix soon (broken links, missing alt text, structured data)</priority>
        <priority level="P2" severity="medium">Optimize (Open Graph, Twitter Cards, preloads)</priority>
        <priority level="P3" severity="low">Nice-to-have (HTTP/2, additional optimizations)</priority>
      </priorities>
    </step>

    <step name="implementation-requirements" order="4">
      <design-system>
        <requirement type="i18n">No hardcoded text - use #{$i18n.*} variables</requirement>
        <requirement type="title-case">Sentence case: "How it works" NOT "How It Works"</requirement>
        <requirement type="section-titles">Use &lt;span&gt; wrapper for Japanese border styling</requirement>
        <requirement type="colors">Use var(--shu-primary), var(--enji-secondary), etc.</requirement>
      </design-system>
      <example language="pug">
        <![CDATA[
// ✅ CORRECT - i18n compliant with Japanese theme
head
  title #{$i18n.page.title} | #{$i18n.title}
  meta(name='description', content=`#{$i18n.page.meta.description}`)
  link(rel='canonical', href=`https://sealf.ie/${locale}/page.html`)

// Update locales/en.json and locales/fr.json
        ]]>
      </example>
    </step>

    <step name="generate-tests" order="5">
      <command>npm run seo:triage:tests</command>
      <command>npm run test:seo</command>
    </step>

    <step name="validate-fixes" order="6">
      <command>npm run seo:audit:local</command>
      <task>Compare scores</task>
      <task>Check reports/seo/summary.json for improvements</task>
    </step>
  </workflow>

  <common-issues>
    <issue name="missing-meta-description">
      <fix language="pug">
        <![CDATA[
// src/pug/page.pug
head
  meta(name='description', content=`#{$i18n.page.meta.description}`)

// locales/en.json
{
  "page": {
    "meta": {
      "description": "Your SEO-optimized description here (120-160 chars)"
    }
  }
}
        ]]>
      </fix>
    </issue>

    <issue name="missing-canonical-url">
      <fix language="pug">
        <![CDATA[
// src/pug/includes/head.pug
link(rel="canonical" href=`https://sealf.ie/${locale}/page.html`)
        ]]>
      </fix>
    </issue>

    <issue name="missing-alt-text">
      <fix language="pug">
        <![CDATA[
// ✅ CORRECT
img(src="/assets/img/feature.png"
    alt="Descriptive alt text explaining the image content")

// ❌ WRONG
img(src="/assets/img/feature.png")
        ]]>
      </fix>
    </issue>

    <issue name="missing-structured-data">
      <fix language="pug">
        <![CDATA[
// Add Schema.org JSON-LD
script(type='application/ld+json').
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "#{$i18n.page.title}",
    "description": "#{$i18n.page.meta.description}",
    "url": "https://sealf.ie/en/page.html"
  }
        ]]>
      </fix>
    </issue>
  </common-issues>

  <success-criteria>
    <lighthouse-scores>
      <score metric="performance" target="≥ 90" />
      <score metric="accessibility" target="≥ 95" />
      <score metric="best-practices" target="≥ 95" />
      <score metric="seo" target="100" />
    </lighthouse-scores>

    <requirements>
      <requirement>Meta tags present on all pages</requirement>
      <requirement>Structured data valid and complete</requirement>
      <requirement>All images have alt text</requirement>
      <requirement>Mobile-friendly (viewport configured)</requirement>
      <requirement>No broken links or 404 errors</requirement>
      <requirement>Proper heading hierarchy (H1 > H2 > H3)</requirement>
    </requirements>
  </success-criteria>

  <report-format>
    <section name="issues-found">Summary by priority (P0-P3)</section>
    <section name="fixes-applied">What was changed and why</section>
    <section name="score-improvements">Before/after Lighthouse scores</section>
    <section name="tests-created">New Playwright tests generated</section>
    <section name="remaining-issues">Any unresolved problems with recommendations</section>
  </report-format>
</command>
