# UX/UI Review – Portfolio Page
Date: 2026-02-03
Scope: `portfolio.html`, project cards, filters, modal, imagery

## Summary
Overall the page looks modern and confident, with a strong high‑tech vibe and clear structure. The biggest UX gap right now is how portrait screenshots render inside wide card frames, which makes real project images look cropped or awkward. Fixing image handling and a few interaction/accessibility details will make the portfolio feel significantly more polished.

## What Works Well
1. Strong visual identity with neon gradients and dark glass styling.
2. Clear hierarchy: hero → filters → grid → detail modal.
3. Interaction cues: hover effects, shadows, and reveal animations add energy.
4. Project metadata is easy to scan (year, status, tags).
5. Modal gives richer detail without leaving the page.

## Issues / Opportunities
P0
1. Portrait screenshots in card image slots are heavily cropped, which can make real work look worse than it is.

P1
1. Focus states for keyboard users are minimal or missing on buttons and links.
2. Modal close relies mostly on the X icon; there is no ESC close or focus trap.
3. “View details” is icon‑only on cards, which reduces clarity for first‑time visitors.

P2
1. Cards and modal use separate data sources in `portfolio.html`, which can drift over time.
2. Filter state has no visible count of results.
3. Some text is low-contrast gray on dark backgrounds, especially in smaller sizes.

## Recommendations (Prioritized)
1. Image handling for real screenshots
   Option A: Keep `cover.png` for cards and use real screenshots only in the modal/gallery.
   Option B: Use `object-position: top` or `object-contain` with a subtle frame so portrait screens look intentional.
2. Improve interaction clarity
   Add a small “View details” label next to the icon on hover or always visible.
   Add result counts after filter click (e.g., “3 projects”).
3. Accessibility + UX polish
   Add `:focus-visible` outlines for buttons and links.
   Add ESC key to close modal and trap focus while open.
4. Reduce data duplication
   Source card + modal data from a single JSON to avoid mismatches.
5. Contrast tuning
   Slightly brighten small gray text for readability in long sections.

## Suggested Quick Wins (Low Effort, High Impact)
1. Use real screenshots in modal only, keep cards with a consistent cover ratio.
2. Add focus styles to `.filter-btn`, `.view-details-btn`, and nav links.
3. Add `object-position: top;` to `.project-card img` when using tall screenshots.

## Proposed Next Step
Tell me which option you want for Care for Mom image handling:
1. Keep real screenshot only in modal, keep cover image on card.
2. Use real screenshot on card but adjust layout to display it cleanly.
