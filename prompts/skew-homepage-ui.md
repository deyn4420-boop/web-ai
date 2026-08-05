# Skew Homepage UI Implementation

## Goal

Implement the biasly skew homepage from `C:\Users\Nayan\Downloads\02-homepage.png` as a static, responsive Next.js homepage.

## Skills read

- None of the repo-approved task skills apply directly. This is a static homepage UI task only.
- Read local Next.js 16 CSS docs from `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.
- Attempted to read local Next.js image docs; exact file is `12-images.md` and should be read before implementation if using `next/image`.

## Existing code inspected

- `AGENTS.md`
- `package.json`
- `app/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `prompts/design-system-theme.md`

## Decisions and assumptions

- Use a single server component in `app/page.tsx` with local mock article data, because no Supabase data layer exists in this repository yet.
- Use remote image URLs in regular `img` elements to avoid adding Next image remote host configuration.
- Keep the UI static: navigation, chips, theme controls, subscribe, login, cards, and footer are visual only.
- Preserve the existing Poppins and Tailwind v4 design-token setup.
- Match the screenshot proportions, typography, color palette, card density, and footer as closely as possible within the current minimal app.

## Visual interpretation

- Page has a thin black utility bar with browser extension text, theme options, date, location, and edition controls.
- Main navigation is light, horizontal, and compact with a hamburger icon, `biasly News` wordmark, nav links, and right-aligned subscribe/login buttons.
- Topic chips sit in a horizontally scrollable rail with compact rounded gray pills and plus icons.
- Content uses a constrained container, a `Top News` heading, and a three-column desktop grid of cards.
- News cards have 8px or smaller radius, a large image, an info icon overlay, category/location metadata, bold headline, left/center/right bias bar, and source count.
- Footer is a dark band with brand copy, link columns, social glyphs, and copyright.

## Layout requirements

1. Replace the placeholder `page` component with a complete `HomePage` implementation.
2. Build reusable internal helpers only if they reduce clear repetition, such as `NewsCard`, `BiasBar`, and small icon components.
3. Use a responsive grid: one column on mobile, two on medium screens, three on desktop.
4. Keep the page max width close to the reference and centered with consistent horizontal padding.
5. Ensure the topic rail scrolls horizontally on smaller screens without breaking layout.
6. Keep all buttons and card text within their containers at mobile and desktop sizes.
7. Avoid client-side JavaScript unless required; this can remain a server component.

## Typography, spacing, and colors

1. Use existing Poppins font via `app/layout.tsx`.
2. Use black/near-black text, off-white background, pale gray borders, red left-bias segments, light gray center segments, and blue right-bias segments from the existing theme tokens.
3. Keep cards compact and editorial, not oversized marketing panels.
4. Use 8px or smaller card radius.
5. Avoid decorative gradient/orb backgrounds.

## Responsiveness

- Desktop: utility bar, full nav, chip rail, three-column card grid, multi-column footer.
- Tablet: card grid reduces to two columns.
- Mobile: nav compresses by hiding less important links/actions as needed, topic chips remain scrollable, cards stack to one column, footer columns wrap.

## Files likely to change

- `app/page.tsx`
- `app/globals.css` only if a tiny global reset adjustment is required.

## Security requirements

- No server secrets, API routes, data mutations, scraping, AI calls, Supabase access, or auth logic are introduced.
- Mock article data must remain local to the UI component.

## Acceptance criteria

- Homepage visually resembles the provided screenshot: header bars, topic chips, top news grid, bias bars, and footer.
- The placeholder `page` text is gone.
- The implementation is TypeScript-safe and uses no `any`.
- Layout remains usable across mobile, tablet, and desktop.
- No new dependencies are added.

## Checks to run

- `npm run lint`
- `npm run build`

## Manual test steps

1. Run `npm run dev`.
2. Open the local Next.js URL.
3. Compare the homepage against `C:\Users\Nayan\Downloads\02-homepage.png`.
4. Resize from mobile to desktop and confirm no card, button, chip, or footer text overlaps.
