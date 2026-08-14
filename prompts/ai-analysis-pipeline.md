# Goal

Implement and connect the AI article analysis pipeline so scraped rows in `articles` are analyzed and saved to `article_analyses`.

# Skills Read

- `supabase`
- OpenAI structured output guidance

# Existing Code Inspected

- `app/lib/scraping/analyzer.ts`
- `app/lib/scraping/analysis-pipeline.ts`
- `app/api/analyze/route.ts`
- `app/api/cron/pipeline/route.ts`
- `supabase/schema.sql`

# Decisions And Assumptions

- Use the existing OpenAI Responses API analyzer module.
- Detect pending articles with a real left anti-join against `article_analyses`, not `analyzed_at` alone.
- Keep action routes protected by the shared admin secret.
- Mark `articles.analyzed_at` only after `article_analyses` insert succeeds.
- If the follow-up `analyzed_at` update fails, remove the newly inserted analysis row so the article is not stuck hidden.

# Files Likely To Change

- `app/lib/scraping/analysis-pipeline.ts`
- `app/api/analyze/route.ts`
- `app/api/cron/pipeline/route.ts`
- `.env.local.example`

# Implementation Requirements

- Batch pending valid articles.
- Continue until no pending articles remain unless a limit is provided.
- Validate AI output before saving.
- Save only valid analysis rows.
- Log started, batch progress, per-article success/failure, and final summary.
- Chain analysis after scheduled scraping in cron, even if scraping fails.

# Security Requirements

- Do not expose OpenAI or Supabase service role keys to browser code.
- Require admin secret for manual analysis route.
- Keep cron protected by `CRON_SECRET` in production.

# Acceptance Criteria

- `POST /api/analyze` analyzes pending articles.
- `GET /api/cron/pipeline` runs scheduled scrape and then analysis.
- Failed articles do not loop forever inside one run.
- Pending detection is based on `article_analyses`, not only `analyzed_at`.

# Checks To Run

- `npm run lint`
- `npm run typecheck`
