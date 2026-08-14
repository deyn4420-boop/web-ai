create extension if not exists vector
with schema extensions;

alter table public.article_analyses
add column if not exists embedding extensions.vector(1536);

create index if not exists article_analyses_embedding_ivfflat_idx
on public.article_analyses
using ivfflat (embedding extensions.vector_cosine_ops)
with (lists = 100)
where embedding is not null;

create or replace function public.match_related_articles(
  query_embedding extensions.vector(1536),
  match_article_id bigint,
  match_count integer default 5
)
returns table (
  id bigint,
  title text,
  image_url text,
  published_at timestamptz,
  source_name text,
  bias_label text,
  left_percentage smallint,
  center_percentage smallint,
  right_percentage smallint,
  confidence numeric,
  similarity double precision
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    articles.id,
    articles.title,
    articles.image_url,
    articles.published_at,
    sources.name as source_name,
    article_analyses.bias_label,
    article_analyses.left_percentage,
    article_analyses.center_percentage,
    article_analyses.right_percentage,
    article_analyses.confidence,
    1 - (article_analyses.embedding <=> query_embedding) as similarity
  from public.article_analyses
  join public.articles
    on articles.id = article_analyses.article_id
  join public.sources
    on sources.id = articles.source_id
  where article_analyses.embedding is not null
    and articles.analyzed_at is not null
    and articles.id <> match_article_id
  order by article_analyses.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 20);
$$;

create or replace function public.pending_articles_for_analysis(
  match_count integer default 5,
  excluded_article_ids bigint[] default '{}'::bigint[],
  selected_article_ids bigint[] default null
)
returns table (
  id bigint,
  title text,
  raw_text text,
  analysis_id bigint,
  needs_full_analysis boolean,
  needs_embedding boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    articles.id,
    articles.title,
    articles.raw_text,
    article_analyses.id as analysis_id,
    article_analyses.id is null as needs_full_analysis,
    article_analyses.id is not null and article_analyses.embedding is null as needs_embedding
  from public.articles
  left join public.article_analyses
    on article_analyses.article_id = articles.id
  where (
      article_analyses.id is null
      or article_analyses.embedding is null
    )
    and not (articles.id = any(excluded_article_ids))
    and (
      selected_article_ids is null
      or articles.id = any(selected_article_ids)
    )
  order by articles.scraped_at asc
  limit least(greatest(match_count, 1), 20);
$$;

grant execute on function public.match_related_articles(extensions.vector(1536), bigint, integer)
to anon, authenticated, service_role;

grant execute on function public.pending_articles_for_analysis(integer, bigint[], bigint[])
to service_role;
