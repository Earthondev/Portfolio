#!/usr/bin/env node

// Rebuild derived WebP assets without changing the source images or PDFs.
// Requires cwebp (brew install webp). Commit generated assets for GitHub Pages.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const certificates = require('../certificates.json');
const jobs = [
  ['assets/Profile/IMG_9526.JPG', 'assets/images/profile-600.webp', 600],
  ['assets/projects/inventory-analytics-dashboard/realistic-cover/enterprise-ops-dashboard.png', 'assets/images/enterprise-dashboard-640.webp', 640],
  ['assets/projects/inventory-analytics-dashboard/realistic-cover/enterprise-ops-dashboard.png', 'assets/images/enterprise-dashboard-960.webp', 960],
  ...certificates.filter(cert => cert.image.thumbnail).map(cert => [cert.image.src, cert.image.thumbnail, 720]),
];

for (const [source, destination, width] of jobs) {
  const input = path.resolve(root, source);
  const output = path.resolve(root, destination);
  if (!input.startsWith(root + path.sep) || !output.startsWith(root + path.sep) || input === output) {
    throw new Error('Image paths must be distinct files within the repository.');
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  execFileSync('cwebp', ['-quiet', '-q', '82', '-m', '6', '-metadata', 'none', '-resize', String(width), '0', input, '-o', output]);
  console.log(`${destination}: ${Math.round(fs.statSync(output).size / 1024)} KiB`);
}
