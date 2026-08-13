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
  }).format(new Date(`${value}T00:00:00Z`))
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

function byPublishedDateDesc(a: Article, b: Article) {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
}

export async function getArticles() {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return [...fallbackArticles].sort(byPublishedDateDesc)
  }

  const { data, error } = await supabase
    .from("news_articles")
    .select(
      "slug, category, region, title, author, published_at, read_time, source_count, image_url, image_position, caption, bias_left, bias_center, bias_right, body, summary",
    )
    .lte("published_at", new Date().toISOString().slice(0, 10))
    .order("published_at", { ascending: false })
    .order("slug", { ascending: true })

  if (error) {
    console.error("Failed to load news articles from Supabase", error)
    return [...fallbackArticles].sort(byPublishedDateDesc)
  }

  return (data as NewsArticleRow[]).map(toArticle)
}

export async function getArticleBySlug(slug: string) {
  const supabase = createSupabaseServerClient()

  if (!supabase) {
    return fallbackArticles.find((article) => article.slug === slug)
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
