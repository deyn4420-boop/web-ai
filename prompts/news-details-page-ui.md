# News Details Page UI Implementation

## Goal

Implement the biasly news details page from `C:\Users\Nayan\Downloads\03-news-details-page (1).png` as a static, responsive Next.js route.

## Skills read

- None of the repo-approved task skills apply directly. This is a static UI task only.
- Read local Next.js 16 CSS docs from `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.
- Attempted to locate local routing docs under `node_modules/next/dist/docs/01-app`; route file conventions should be followed using the App Router `app/<segment>/page.tsx` pattern already present in the project.

## Existing code inspected

- `AGENTS.md`
- `package.json`
- `app/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `prompts/skew-homepage-ui.md`

## Decisions and assumptions

- Add a static route at `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`.
- Use local mock article, analysis, source, and related-story data inside the route because no Supabase data layer exists yet.
- Keep the UI static and server-rendered; buttons, save/share controls, newsletter form, and source links are visual only.
- Reuse the visual language from the implemented homepage: same top utility/nav header, off-white background, card borders, Poppins typography, bias colors, and footer.
- Use the Wikimedia Trump image URL already working on the homepage for the lead article image.
- Optionally make the matching homepage card link to this details route if needed.

## Visual interpretation

- The page has the same thin black utility bar and main navigation as the homepage.
- Main content uses a two-column desktop layout: article body on the left and stacked analysis cards on the right.
- Article header includes category/region, large headline, byline, date, read time, and compact save/share controls.
- Lead image is large and rounded slightly, followed by a small caption.
- Bias distribution appears as a bordered horizontal module under the image.
- Article body is a readable single-column text stream with generous paragraph spacing.
- Related stories appear as a compact two-column grid with thumbnails and metadata.
- Right rail contains `Bias Analysis`, `AI Summary`, and `Source Breakdown` cards.
- A newsletter callout sits above the shared footer.

## Layout requirements

1. Create `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`.
2. Build small local helper components only when useful: header, footer, bias bar, side card, related story item, and source row.
3. Keep desktop content constrained around the screenshot width, with a main column and right sidebar.
4. Stack the sidebar below the article on tablet/mobile.
5. Ensure cards use 8px or smaller radius and no nested-card visual clutter.
6. Keep all text, controls, source rows, and bias bars from overlapping at mobile and desktop widths.
7. Use only static JSX and TypeScript-safe data.

## Content requirements

1. Use the headline: `Trump Sends Iran Revised Peace Proposal With Tougher Terms: Report`.
2. Include byline, publication date, read time, image caption, the full article body shown in the screenshot, and a related stories section.
3. Show bias analysis with Left 20%, Center 31%, Right 49%, and `Right 49%` as the overall bias.
4. Show AI summary bullets, disclaimer text, and feedback button.
5. Show source breakdown with total source count and top source bias labels.
6. Show newsletter signup callout: `Stay Informed. Stay Balanced.`

## Typography, spacing, and colors

- Use existing Poppins font and theme tokens.
- Use near-black text, white cards, off-white page background, gray borders, red left-bias bars, light gray center bars, and blue right-bias bars.
- Article body should be around 18px with readable line-height on desktop.
- Sidebar cards should use compact headings and dense but legible rows.

## Responsiveness

- Desktop: two-column article/sidebar layout.
- Tablet: content remains comfortable, sidebar can stack after body.
- Mobile: header compresses, article title scales down, image remains full width, related stories stack, newsletter input stacks with button.

## Files likely to change

- `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`
- `app/page.tsx` only if adding a link from the homepage card to the new route.

## Security requirements

- No server secrets, API routes, data mutations, scraping, AI calls, Supabase access, or auth logic are introduced.
- Mock article and analysis data must remain local to the UI route.

## Acceptance criteria

- Visiting `/news/trump-sends-iran-revised-peace-proposal` shows a page closely matching the attached news details UI.
- The page includes the article body, lead image, bias module, related stories, sidebar analysis cards, newsletter section, and footer.
- The implementation is TypeScript-safe and uses no `any`.
- The layout remains usable across mobile, tablet, and desktop.
- No new dependencies are added.

## Checks to run

- `npm run lint`
- `npm run build`

## Manual test steps

1. Run `npm run dev`.
2. Open `/news/trump-sends-iran-revised-peace-proposal`.
3. Compare the page against `C:\Users\Nayan\Downloads\03-news-details-page (1).png`.
4. Resize from mobile to desktop and confirm no article, sidebar, source row, or newsletter content overlaps.
