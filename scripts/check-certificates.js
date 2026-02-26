#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const certificatesPath = path.join(rootDir, 'certificates.json');
const certificateAssetsDir = path.join(rootDir, 'assets', 'certificates');
const args = new Set(process.argv.slice(2));
const shouldFixOrder = args.has('--fix-order');
const strictWarnings = args.has('--strict-warnings');

const errors = [];
const warnings = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function note(message) {
  notes.push(message);
}

function isValidISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;
  return date.toISOString().slice(0, 10) === value;
}

function issuedTimestamp(value) {
  const time = new Date(`${value || ''}T00:00:00Z`).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function normalizeAssetPath(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/^\.?\//, '');
}

function readCertificatesJSON() {
  try {
    const raw = fs.readFileSync(certificatesPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    fail(`Unable to parse certificates.json: ${error.message}`);
    return null;
  }
}

const certificates = readCertificatesJSON();
if (!Array.isArray(certificates)) {
  if (certificates !== null) fail('certificates.json must contain a top-level JSON array.');
}

const referencedAssets = new Set();
const fileToIds = new Map();

if (Array.isArray(certificates)) {
  const seenIds = new Set();

  certificates.forEach((cert, index) => {
    const row = index + 1;
    const prefix = `Entry #${row}`;

    if (!cert || typeof cert !== 'object') {
      fail(`${prefix}: must be an object.`);
      return;
    }

    if (typeof cert.id !== 'string' || !cert.id.trim()) {
      fail(`${prefix}: missing non-empty "id".`);
    } else if (seenIds.has(cert.id)) {
      fail(`${prefix}: duplicate id "${cert.id}".`);
    } else {
      seenIds.add(cert.id);
    }

    if (typeof cert.title !== 'string' || !cert.title.trim()) {
      fail(`${prefix}: missing non-empty "title".`);
    }

    if (typeof cert.issuer !== 'string' || !cert.issuer.trim()) {
      fail(`${prefix}: missing non-empty "issuer".`);
    }

    if (!isValidISODate(cert.issued)) {
      fail(`${prefix}: "issued" must be YYYY-MM-DD (received "${cert.issued || ''}").`);
    }

    if (typeof cert.category !== 'string' || !cert.category.trim()) {
      fail(`${prefix}: missing non-empty "category".`);
    }

    if (!cert.image || typeof cert.image !== 'object') {
      fail(`${prefix}: missing "image" object.`);
      return;
    }

    if (typeof cert.image.alt !== 'string' || !cert.image.alt.trim()) {
      warn(`${prefix}: image.alt is empty.`);
    }

    const src = cert.image.src;
    if (typeof src !== 'string' || !src.trim()) {
      fail(`${prefix}: image.src is missing.`);
      return;
    }

    const normalizedPath = normalizeAssetPath(src);
    if (!normalizedPath.startsWith('assets/certificates/')) {
      warn(`${prefix}: image.src should point to assets/certificates/ (received "${src}").`);
    }

    const absolutePath = path.resolve(rootDir, normalizedPath);
    if (!absolutePath.startsWith(certificateAssetsDir + path.sep)) {
      fail(`${prefix}: image.src resolves outside assets/certificates ("${src}").`);
      return;
    }

    referencedAssets.add(path.basename(absolutePath));

    if (!fs.existsSync(absolutePath)) {
      fail(`${prefix}: image file not found at "${src}".`);
      return;
    }

    const ids = fileToIds.get(absolutePath) || [];
    ids.push(cert.id);
    fileToIds.set(absolutePath, ids);
  });

  const sorted = [...certificates].sort((a, b) => {
    const timeDiff = issuedTimestamp(b?.issued) - issuedTimestamp(a?.issued);
    if (timeDiff !== 0) return timeDiff;
    return String(a?.title || '').localeCompare(String(b?.title || ''), 'en', { sensitivity: 'base' });
  });

  const currentOrder = certificates.map((item) => item?.id).join('|');
  const expectedOrder = sorted.map((item) => item?.id).join('|');

  if (currentOrder !== expectedOrder) {
    if (shouldFixOrder) {
      fs.writeFileSync(certificatesPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
      note('Reordered certificates.json by newest issued date first, then title A-Z.');
    } else {
      warn('certificates.json is not sorted by newest issued date first. Run: node scripts/check-certificates.js --fix-order');
    }
  }

  const hashToFiles = new Map();
  for (const [filePath, ids] of fileToIds.entries()) {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    const bucket = hashToFiles.get(hash) || [];
    bucket.push({ file: path.basename(filePath), ids });
    hashToFiles.set(hash, bucket);
  }

  for (const [hash, group] of hashToFiles.entries()) {
    if (group.length <= 1) continue;
    const mapped = group.map((item) => `${item.file} (${item.ids.join(', ')})`).join(' | ');
    warn(`Duplicate image content detected [${hash.slice(0, 12)}...]: ${mapped}`);
  }

  if (fs.existsSync(certificateAssetsDir)) {
    const assetFiles = fs.readdirSync(certificateAssetsDir)
      .filter((fileName) => /\.(png|jpe?g|webp)$/i.test(fileName));
    const unreferenced = assetFiles.filter((fileName) => !referencedAssets.has(fileName));
    if (unreferenced.length) {
      warn(`Unreferenced files in assets/certificates/: ${unreferenced.join(', ')}`);
    }
  }
}

if (notes.length) {
  console.log('Notes:');
  for (const message of notes) console.log(`- ${message}`);
}

if (warnings.length) {
  console.log('Warnings:');
  for (const message of warnings) console.log(`- ${message}`);
}

if (errors.length) {
  console.error('Errors:');
  for (const message of errors) console.error(`- ${message}`);
}

const hasBlockingErrors = errors.length > 0 || (strictWarnings && warnings.length > 0);
if (!hasBlockingErrors) {
  console.log(`Certificate check passed (${Array.isArray(certificates) ? certificates.length : 0} items).`);
}

process.exit(hasBlockingErrors ? 1 : 0);
