import {
  articles as fallbackArticles,
  type Article,
  type BiasBreakdown,
} from "@/app/data/news"
import { createSupabaseServerClient } from "./supabase"

export type SourceBias = "Left" | "Center" | "Right"

export type ArticleSource = {
  name: string
  bias: SourceBias
  sourceUrl?: string
}

type NewsArticleRow = {
  slug: string
  category: string
  region: string
  title: string
  author: string
  published_at: string
  read_time: string
  source_count: number
  image_url: string
  image_position: string | null
  caption: string
  bias_left: number
  bias_center: number
  bias_right: number
  body: string[]
  summary: string[]
}

type NewsArticleSourceRow = {
  name: string
  bias: SourceBias
  source_url: string | null
}

type PipelineAnalysisRow = {
  summary: string
  bias_label: string
  left_percentage: number
  center_percentage: number
  right_percentage: number
  embedding?: number[] | string | null
}

type PipelineSourceRow = {
  name: string
}

type PipelineArticleRow = {
  id: number
  title: string
  image_url: string
  published_at: string
  raw_text: string
  original_url: string
  sources: PipelineSourceRow | PipelineSourceRow[] | null
  article_analyses: PipelineAnalysisRow | PipelineAnalysisRow[] | null
}

type RelatedPipelineArticleRow = {
  id: number
  title: string
  image_url: string
  published_at: string
  source_name: string
  bias_label: string
  left_percentage: number
  center_percentage: number
  right_percentage: number
  confidence: number
  similarity: number
}

const fallbackSources: ArticleSource[] = [
  { name: "Fox News", bias: "Right" },
  { name: "The Wall Street Journal", bias: "Center" },
  { name: "Reuters", bias: "Center" },
  { name: "BBC", bias: "Center" },
  { name: "CNN", bias: "Left" },
  { name: "The New York Times", bias: "Center" },
  { name: "The Washington Post", bias: "Center" },
  { name: "Newsmax", bias: "Right" },
]

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00Z`))
}

function toBias(row: NewsArticleRow): BiasBreakdown {
  return {
    left: row.bias_left,
    center: row.bias_center,
    right: row.bias_right,
  }
}

function toArticle(row: NewsArticleRow): Article {
  return {
    slug: row.slug,
    category: row.category,
    region: row.region,
    title: row.title,
    author: row.author,
    publishedAt: formatPublicationDate(row.published_at),
    readTime: row.read_time,
    sources: row.source_count,
    image: row.image_url,
    imagePosition: row.image_position ?? undefined,
    caption: row.caption,
    bias: toBias(row),
    body: row.body,
    summary: row.summary,
  }
}

function toArticleSource(row: NewsArticleSourceRow): ArticleSource {
  return {
    name: row.name,
    bias: row.bias,
    sourceUrl: row.source_url ?? undefined,
  }
}

function firstJoinRow<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min read`
}

function splitBody(text: string) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (paragraphs.length > 0) {
    return paragraphs
  }

  return [text.trim()]
}

function toTitleBias(value: string | undefined): SourceBias {
  if (value === "left") return "Left"
  if (value === "right") return "Right"
  return "Center"
}

function toPipelineArticle(row: PipelineArticleRow): Article {
  const analysis = firstJoinRow(row.article_analyses)
  const source = firstJoinRow(row.sources)

  return {
    slug: `article-${row.id}`,
    category: "News",
    region: "Global",
    title: row.title,
    author: source?.name ?? "Source",
    publishedAt: formatPublicationDate(row.published_at),
    readTime: estimateReadTime(row.raw_text),
    sources: 1,
    image: row.image_url,
    caption: source?.name ? `Originally reported by ${source.name}.` : row.original_url,
    bias: {
      left: analysis?.left_percentage ?? 0,
      center: analysis?.center_percentage ?? 100,
      right: analysis?.right_percentage ?? 0,
    },
    body: splitBody(row.raw_text),
    summary: analysis?.summary ? [analysis.summary] : [],
  }
}

function toRelatedPipelineArticle(row: RelatedPipelineArticleRow): Article {
  return {
    slug: `article-${row.id}`,
    category: "News",
    region: "Global",
    title: row.title,
    author: row.source_name,
    publishedAt: formatPublicationDate(row.published_at),
    readTime: "Related",
    sources: 1,
    image: row.image_url,
    caption: `Similarity ${Math.round(row.similarity * 100)}%`,
    bias: {
      left: row.left_percentage,
      center: row.center_percentage,
      right: row.right_percentage,
    },
    body: [],
    summary: [],
  }
}

function getPipelineId(slug: string) {
  const match = slug.match(/^article-(\d+)$/)
  return match ? Number.parseInt(match[1], 10) : null
}

function byPublishedDateDesc(a: Article, b: Article) {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
}

export async function getArticles() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return [...fallbackArticles].sort(byPublishedDateDesc)
  }

  const newsResult = await supabase
    .from("news_articles")
    .select(
      "slug, category, region, title, author, published_at, read_time, source_count, image_url, image_position, caption, bias_left, bias_center, bias_right, body, summary",
    )
    .lte("published_at", new Date().toISOString().slice(0, 10))
    .order("published_at", { ascending: false })
    .order("slug", { ascending: true })

  const pipelineResult = await supabase
    .from("articles")
    .select(
      "id, title, image_url, published_at, raw_text, original_url, sources(name), article_analyses(summary, bias_label, left_percentage, center_percentage, right_percentage)",
    )
    .not("analyzed_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(30)

  if (newsResult.error && pipelineResult.error) {
    console.error("Failed to load news articles from Supabase", newsResult.error)
    console.error("Failed to load analyzed pipeline articles from Supabase", pipelineResult.error)
    return [...fallbackArticles].sort(byPublishedDateDesc)
  }

  const newsArticles = newsResult.error
    ? []
    : (newsResult.data as NewsArticleRow[]).map(toArticle)
  const pipelineArticles = pipelineResult.error
    ? []
    : (pipelineResult.data as PipelineArticleRow[]).map(toPipelineArticle)

  return [...pipelineArticles, ...newsArticles].sort(byPublishedDateDesc)
}

export async function getArticleBySlug(slug: string) {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return fallbackArticles.find((article) => article.slug === slug)
  }

  const pipelineId = getPipelineId(slug)

  if (pipelineId) {
    const { data, error } = await supabase
      .from("articles")
      .select(
        "id, title, image_url, published_at, raw_text, original_url, sources(name), article_analyses(summary, bias_label, left_percentage, center_percentage, right_percentage)",
      )
      .eq("id", pipelineId)
      .not("analyzed_at", "is", null)
      .maybeSingle()

    if (error) {
      console.error(`Failed to load analyzed article "${slug}" from Supabase`, error)
      return undefined
    }

    return data ? toPipelineArticle(data as PipelineArticleRow) : undefined
  }

  const { data, error } = await supabase
    .from("news_articles")
    .select(
      "slug, category, region, title, author, published_at, read_time, source_count, image_url, image_position, caption, bias_left, bias_center, bias_right, body, summary",
    )
    .eq("slug", slug)
    .lte("published_at", new Date().toISOString().slice(0, 10))
    .maybeSingle()

  if (error) {
    console.error(`Failed to load news article "${slug}" from Supabase`, error)
    return fallbackArticles.find((article) => article.slug === slug)
  }

  return data ? toArticle(data as NewsArticleRow) : undefined
}

export async function getRelatedArticles(slug: string, limit = 6) {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return fallbackArticles
      .filter((article) => article.slug !== slug)
      .sort(byPublishedDateDesc)
      .slice(0, limit)
  }

  const pipelineId = getPipelineId(slug)

  if (pipelineId) {
    const currentResult = await supabase
      .from("article_analyses")
      .select("embedding")
      .eq("article_id", pipelineId)
      .not("embedding", "is", null)
      .maybeSingle()

    if (currentResult.error || !currentResult.data?.embedding) {
      if (currentResult.error) {
        console.error(`Failed to load embedding for "${slug}"`, currentResult.error)
      }

      return []
    }

    const relatedResult = await supabase.rpc("match_related_articles", {
      query_embedding: currentResult.data.embedding,
      match_article_id: pipelineId,
      match_count: limit,
    })

    if (relatedResult.error) {
      console.error(`Failed to load semantic related articles for "${slug}"`, relatedResult.error)
      return []
    }

    return (relatedResult.data as RelatedPipelineArticleRow[]).map(
      toRelatedPipelineArticle,
    )
  }

  const { data, error } = await supabase
    .from("news_articles")
    .select(
      "slug, category, region, title, author, published_at, read_time, source_count, image_url, image_position, caption, bias_left, bias_center, bias_right, body, summary",
    )
    .neq("slug", slug)
    .lte("published_at", new Date().toISOString().slice(0, 10))
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Failed to load related articles for "${slug}"`, error)
    return fallbackArticles
      .filter((article) => article.slug !== slug)
      .sort(byPublishedDateDesc)
      .slice(0, limit)
  }

  return (data as NewsArticleRow[]).map(toArticle)
}

export async function getArticleSources(slug: string) {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return slug === "trump-sends-iran-revised-peace-proposal" ? fallbackSources : []
  }

  const pipelineId = getPipelineId(slug)

  if (pipelineId) {
    const { data, error } = await supabase
      .from("articles")
      .select("original_url, sources(name), article_analyses(bias_label)")
      .eq("id", pipelineId)
      .maybeSingle()

    if (error || !data) {
      if (error) {
        console.error(`Failed to load source for "${slug}"`, error)
      }

      return []
    }

    const source = firstJoinRow(
      data.sources as PipelineSourceRow | PipelineSourceRow[] | null,
    )
    const analysis = firstJoinRow(
      data.article_analyses as Pick<PipelineAnalysisRow, "bias_label"> | Array<Pick<PipelineAnalysisRow, "bias_label">> | null,
    )

    return source
      ? [
          {
            name: source.name,
            bias: toTitleBias(analysis?.bias_label),
            sourceUrl: data.original_url as string,
          },
        ]
      : []
  }

  const { data, error } = await supabase
    .from("news_article_sources")
    .select("name, bias, source_url")
    .eq("article_slug", slug)
    .order("id", { ascending: true })

  if (error) {
    console.error(`Failed to load sources for "${slug}"`, error)
    return slug === "trump-sends-iran-revised-peace-proposal" ? fallbackSources : []
  }

  return (data as NewsArticleSourceRow[]).map(toArticleSource)
}
