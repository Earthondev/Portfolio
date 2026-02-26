# Certificate Assets

Place certificate image files in this folder.

Recommended naming convention:
- Use lowercase
- Use hyphen-separated file names
- Match `certificates.json` image paths exactly

Examples:
- `datarockie-data-science-bootcamp-2025.png`
- `chatgpt-for-developers.png`
- `essential-sql-for-everyone.png`

Accepted formats:
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Preview source on website:
- Certificate cards and preview modal read image path from `certificates.json`.
- Source field used directly: `image.src`
- Example: `"image": { "src": "./assets/certificates/your-file.jpg", ... }`

Validation commands:
```bash
npm run check:certificates
```

Auto-sort by latest issue date:
```bash
npm run fix:certificates-order
```
