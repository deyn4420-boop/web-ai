# Skew News

Skew News is a Next.js app backed by Supabase for article data, bias scores,
summaries, and source breakdowns. If Supabase environment variables are missing,
the app falls back to the local sample articles in `app/data/news.ts`.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

1. Copy `.env.local.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Apply `supabase/migrations/20260813000100_create_news_schema.sql` to your Supabase database.
4. Insert rows into `public.news_articles` and optional source rows into
   `public.news_article_sources`.

The migration enables RLS on public tables, adds least-privilege read grants for
`anon` and `authenticated`, and adds indexes for the article list, category,
region, slug, and source lookup paths.

## Data Access

News access lives in `app/lib/news-repository.ts`. Pages should call that module
instead of importing the local seed directly.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
