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

Current file map (must match `certificates.json`):
- `datarockie-data-science-bootcamp-2025.png`
- `chatgpt-for-developers.png`
- `essential-sql-for-everyone.png`
- `gemini-certified-educator.png`
- `analytical-chemistry-method-validation.png`
- `glp-gmp-quality-systems.png`
- `firebase-for-web-apps.png`
- `power-bi-dashboard-design.png`

Quick duplicate-content check (same hash = same image content):
```bash
cd assets/certificates
shasum -a 256 *.png | sort
```
