import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';

const PAGES = [
  '/',
  '/index.html',
  '/about.html',
  '/certificates.html',
  '/portfolio.html',
  '/contact.html',
  '/inventory-analytics-dashboard.html',
  '/case-studies/inventory-amino.html',
  '/case-studies/inventory-analytics-dashboard.html'
];

function normalizeUrl(value) {
  if (!value) return value;
  try {
    const url = new URL(value);
    url.hash = '';
    return url.toString();
  } catch {
    return value;
  }
}

function isSameOrigin(url) {
  try {
    const target = new URL(url);
    const base = new URL(BASE_URL);
    return target.origin === base.origin;
  } catch {
    return false;
  }
}

function formatIssue(issue) {
  const location = issue.location ? `${issue.location.url}:${issue.location.lineNumber}:${issue.location.columnNumber}` : '';
  const locSuffix = location ? ` (${location})` : '';
  return `${issue.type}: ${issue.text}${locSuffix}`;
}

async function run() {
  // Use locally installed Chrome to avoid bundled browser arch issues.
  // This is more reliable in constrained environments.
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext();

  const issuesByPage = new Map();
  const brokenInternalLinks = new Map(); // pagePath -> Set(link)

  for (const path of PAGES) {
    const url = `${BASE_URL}${path}`;

    const issues = [];
    const badLinks = new Set();

    const page = await context.newPage();

    page.on('console', (msg) => {
      if (['error'].includes(msg.type())) {
        issues.push({ type: 'console', text: `[${msg.type()}] ${msg.text()}`, location: msg.location?.() });
      }
    });

    page.on('pageerror', (err) => {
      issues.push({ type: 'pageerror', text: err?.stack || String(err) });
    });

    page.on('requestfailed', (request) => {
      const targetUrl = request.url();
      if (!isSameOrigin(targetUrl)) return;
      issues.push({ type: 'requestfailed', text: `${request.method()} ${targetUrl} - ${request.failure()?.errorText || 'failed'}` });
    });

    page.on('response', (response) => {
      const status = response.status();
      if (status < 400) return;
      const targetUrl = response.url();
      if (!isSameOrigin(targetUrl)) return;
      issues.push({ type: 'http', text: `${status} ${response.request().method()} ${targetUrl}` });
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForLoadState('networkidle', { timeout: 45_000 });

      // Basic client-side link verification for internal links.
      const links = await page.$$eval('a[href]', (nodes) =>
        nodes
          .map((node) => node.getAttribute('href'))
          .filter(Boolean)
          .map((href) => href.trim())
          .filter((href) => href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:'))
      );

      for (const href of links) {
        let resolved;
        try {
          resolved = new URL(href, url).toString();
        } catch {
          badLinks.add(href);
          continue;
        }

        if (!isSameOrigin(resolved)) continue;
        const normalized = normalizeUrl(resolved);
        const res = await context.request.get(normalized, { timeout: 45_000 });
        if (res.status() >= 400) {
          badLinks.add(`${href} -> ${res.status()}`);
        }
      }
    } catch (error) {
      issues.push({ type: 'navigation', text: error?.stack || String(error) });
    } finally {
      await page.close();
    }

    issuesByPage.set(path, issues);
    if (badLinks.size) brokenInternalLinks.set(path, badLinks);
  }

  await browser.close();

  const allIssueCount = Array.from(issuesByPage.values()).reduce((sum, list) => sum + list.length, 0);
  const allBadLinks = Array.from(brokenInternalLinks.values()).reduce((sum, set) => sum + set.size, 0);

  console.log(`Audit base: ${BASE_URL}`);
  console.log(`Pages checked: ${PAGES.length}`);
  console.log(`Issues: ${allIssueCount}`);
  console.log(`Broken internal links: ${allBadLinks}`);
  console.log('');

  for (const [path, issues] of issuesByPage.entries()) {
    const badLinks = brokenInternalLinks.get(path);
    if (!issues.length && (!badLinks || !badLinks.size)) continue;

    console.log(`== ${path} ==`);
    for (const issue of issues) console.log(`- ${formatIssue(issue)}`);
    if (badLinks?.size) {
      console.log('- broken links:');
      for (const link of badLinks) console.log(`  - ${link}`);
    }
    console.log('');
  }

  if (allIssueCount || allBadLinks) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

