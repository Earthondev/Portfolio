# Performance maintenance

The home and certificates pages render their main content immediately. Do not
hide the body behind a loading curtain or defer the hero until an animation ends.
Hover interactions and outgoing page transitions remain progressive enhancements.

## Images

- Keep original certificate images and PDFs unchanged for full-size preview and downloads.
- Raster certificate cards use `image.thumbnail` in `certificates.json`; cards fall
  back to `image.src` when no thumbnail is provided. Small SVG assets do not need conversion.
- For a new raster certificate, add `"thumbnail": "./assets/certificates/thumbnails/<id>.webp"`
  to its image object and run `npm run build:images` (requires `cwebp`, available via
  `brew install webp`). Commit the generated WebP with the certificate record.
- Run `npm run check:certificates` to check original images and thumbnail paths.
- Hero and dashboard WebPs are also reproducible with `npm run build:images`.

## Fonts and caching

- The two optimized pages use local WOFF2 subsets in `assets/fonts/`, with their
  SIL Open Font License files. CSS is in `assets/css/fonts.css`.
- `font-display: optional` prevents a late font swap from moving already visible
  content; a slow first visit may use the fallback font for that navigation.
- Preload only the primary Latin heading and body fonts; other subsets load as needed.
- Do not use timestamp-based stylesheet reloads. Increment an HTML asset version
  when its contents change. Certificate JSON uses `cache: no-cache` to revalidate
  updated records while allowing conditional HTTP responses.

## Release checks

1. Validate certificate paths, inline JavaScript syntax, and `git diff --check`.
2. Check both pages on desktop and mobile, including search, reset, full-size
   preview, Escape/Tab behavior, and the mobile menu.
3. After GitHub Pages finishes deploying, check public HTML, JSON and WebP files,
   then run Lighthouse on both pages with mobile and desktop presets.
4. Compare live results with live results, not localhost: the local development
   server does not model GitHub Pages compression, cache, or network latency.
