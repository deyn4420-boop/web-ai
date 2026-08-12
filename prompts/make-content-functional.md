# Make News Content Functional

## Goal

Make the static biasly news content functional by allowing every homepage news card to open a corresponding news details page.

## Skills read

- `browser:control-in-app-browser` because local frontend verification may use browser interaction.
- No repo-approved product skills apply directly because this is static UI routing, not Clerk, Supabase, Oxylabs, or AI implementation.

## Existing code inspected

- `AGENTS.md`
- `app/page.tsx`
- `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`
- `app/globals.css`
- `package.json`
- `prompts/news-details-page-ui.md`

## Decisions and assumptions

- Interpret "make all content functional" as making all story content navigable.
- Add shared mock news data so the homepage and details pages use the same article records.
- Replace the one-off details route with a dynamic details route for all article slugs.
- Keep the app static and server-rendered; no backend, database, auth, scraping, or AI calls are introduced.
- Keep visual behavior close to the current homepage and details page.

## Files likely to change

- `app/data/news.ts`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`

## Implementation requirements

1. Create shared typed article data with slugs, images, metadata, body copy, summaries, source counts, and bias values.
2. Update homepage cards to link to `/news/<slug>` for every article.
3. Create a dynamic `app/news/[slug]/page.tsx` route.
4. Use `generateStaticParams` so all mock articles can be statically generated.
5. Use `notFound()` for unknown slugs.
6. Populate details page sections from the selected article.
7. Keep related stories functional by linking them to their details pages.
8. Remove or replace the old one-off details route if needed to avoid routing duplication.

## Security requirements

- Do not add secrets, API routes, server mutations, scraping, OpenAI calls, Supabase access, or client-side storage.

## Acceptance criteria

- Every homepage card opens a details page.
- Every related story in a details page links to another details page.
- Unknown `/news/<slug>` routes render a 404.
- `npm run lint` and `npm run build` pass.

## Manual test steps

1. Run `npm run dev`.
2. Open `/`.
3. Click several different news cards and confirm each opens a populated details page.
4. Click related stories and confirm they navigate to other populated details pages.
5. Open `/news/not-real` and confirm the app renders not found.
