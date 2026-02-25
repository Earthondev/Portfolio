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
- `sgs-method-validation-chemical-testing-eurachem-2025.jpg`
- `glp-gmp-quality-systems.png`
- `firebase-for-web-apps.png`
- `power-bi-dashboard-design.png`
- `google-certified-educator-level-1.png`
- `introduction-to-cloud-computing-conicle-boston-network.png`
- `digital-risk-management-data-security-privacy-part-4-coniverse-boston-network.png`
- `digital-risk-management-data-security-privacy-part-2-coniverse-boston-network.png`
- `digital-risk-management-data-security-privacy-part-3-coniverse-boston-network.png`
- `kmitl-chemical-safety-hazardous-emergency-response-2021.jpg`
- `environmental-youth-network-sustainable-city-2020.jpg`

Quick duplicate-content check (same hash = same image content):
```bash
cd assets/certificates
shasum -a 256 *.png | sort
```

Current duplicate-content files to replace (same hash group):
- `analytical-chemistry-method-validation.png`
- `datarockie-data-science-bootcamp-2025.png`
- `firebase-for-web-apps.png`
- `glp-gmp-quality-systems.png`
- `power-bi-dashboard-design.png`

After replacing image files, verify no duplicates remain:
```bash
cd assets/certificates
shasum -a 256 *.png | sort | awk '{print $1}' | uniq -d
```
