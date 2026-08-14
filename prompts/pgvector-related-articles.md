# Goal

Add pgvector support for scraped article analyses and show semantic related articles on the news detail page.

# Skills Read

- `supabase`
- `supabase-postgres-best-practices`
- Supabase pgvector/vector search docs
- OpenAI embeddings docs

# Existing Code Inspected

- `supabase/schema.sql`
- `supabase/migrations/20260814000100_create_oxylabs_pipeline.sql`
- `app/lib/scraping/analyzer.ts`
- `app/lib/scraping/analysis-pipeline.ts`
- `app/lib/news-repository.ts`
- `app/news/[slug]/page.tsx`

# Decisions And Assumptions

- Use `text-embedding-3-small`, which produces 1536-dimensional embeddings.
- Store embeddings on `article_analyses.embedding`.
- Use cosine distance with pgvector's `<=>` operator.
- Use a SQL RPC for related article matching because Supabase client query builders do not expose vector distance ordering cleanly.
- Surface analyzed scraped articles as `/news/article-<id>` so the existing detail page can display semantic related articles.

# Files Likely To Change

- `supabase/schema.sql`
- `supabase/migrations/*`
- `app/lib/scraping/analyzer.ts`
- `app/lib/scraping/analysis-pipeline.ts`
- `app/lib/news-repository.ts`
- `app/news/[slug]/page.tsx`
- `.env.local.example`

# Implementation Requirements

- Enable pgvector in SQL.
- Add nullable `embedding extensions.vector(1536)` to `article_analyses`.
- Add a cosine vector index.
- Add a related-article RPC.
- Generate embeddings during new analysis inserts.
- Backfill embeddings for existing analysis rows where `embedding is null`.
- Show the Related Stories section only when related stories exist.

# Security Requirements

- Keep OpenAI calls server-only.
- Keep Supabase service role key server-only.
- Use RLS-compatible SQL functions and avoid `SECURITY DEFINER`.

# Acceptance Criteria

- Analysis insert includes an embedding.
- Existing analyzed rows missing embeddings are picked up for embedding backfill.
- Related articles for `/news/article-<id>` are ordered by cosine similarity.
- Typecheck and lint pass.

# Checks To Run

- `npm run typecheck`
- `npm run lint`
