# Goal

Implement the server-side Oxylabs scraping pipeline for biasly.

# Skills Read

- `.agents/skills/supabase` from `C:\Users\Nayan\.agents\skills\supabase\SKILL.md`
- `supabase-postgres-best-practices`
- Requested Oxylabs skill path was not present locally; used the Oxylabs guidance embedded in `AGENTS.md` plus current Oxylabs docs.

# Existing Code Inspected

- `AGENTS.md`
- `package.json`
- `app/lib/supabase.ts`
- `app/lib/news-repository.ts`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `supabase/migrations/20260813000100_create_news_schema.sql`
- Next.js route handler docs in `node_modules/next/dist/docs/`

# Decisions And Assumptions

- Keep the existing `news_articles` UI schema intact.
- Add the canonical pipeline tables alongside the existing UI tables.
- Use service-role Supabase access only in server-side pipeline modules and API routes.
- Use Oxylabs Realtime API for manual homepage and article detail fetches.
- Use Oxylabs Scheduler API for hourly homepage scraping.
- Store Oxylabs schedule and job IDs as `text` to avoid JavaScript 64-bit integer precision loss.
- Use Cheerio for HTML parsing.

# Files Likely To Change

- `package.json`
- `package-lock.json`
- `.env.local.example`
- `vercel.json`
- `app/lib/supabase.ts`
- `app/lib/server-auth.ts`
- `app/lib/oxylabs.ts`
- `app/lib/scraping/*`
- `app/api/*`
- `supabase/schema.sql`
- `supabase/migrations/*`

# Implementation Requirements

- Load active sources from Supabase.
- Fetch source homepages through Oxylabs.
- Extract likely article links, reject non-article URLs, dedupe, and check existing URLs in chunks of 15.
- Fetch article details through Oxylabs.
- Validate title, URL, image URL, published date, and meaningful body text before insert.
- Insert articles append-only.
- Emit console logs and final summary objects.
- Add scheduler sync, schedule list, scheduled result processing, and cron pipeline routes.

# Security Requirements

- `POST /api/scrape`, `POST /api/oxylabs/schedules`, and `POST /api/oxylabs/scheduled-results/process` require `x-biasly-admin-secret`.
- Cron route uses `CRON_SECRET` in production and skips the check locally.
- Never expose service role, Oxylabs credentials, or secrets to browser code.
- Enable RLS on public tables and grant public read only where needed.

# Acceptance Criteria

- Manual scraping route returns a run summary.
- Scheduler sync creates one schedule per active source and stores exact schedule IDs.
- Scheduled results processing uses `/runs` and only processes jobs with `result_status === "done"`.
- Cron pipeline triggers scheduled processing and leaves a placeholder for analysis chaining if analysis is not implemented.
- TypeScript and lint pass.

# Checks To Run

- `npm run lint`
- `npm run build`

# Manual Test Steps

1. Apply the new Supabase migration.
2. Add environment variables from `.env.local.example`.
3. Insert active source rows into `public.sources`.
4. Start `npm run dev`.
5. Use the curl commands returned in the final implementation notes.
