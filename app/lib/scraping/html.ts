import * as cheerio from "cheerio"
import type { ArticleInsert, SourceRow } from "./types"

const NON_ARTICLE_PATH_PARTS = [
  "/about",
  "/advertise",
  "/author",
  "/authors",
  "/category",
  "/contact",
  "/games",
  "/live",
  "/login",
  "/newsletter",
  "/podcast",
  "/podcasts",
  "/privacy",
  "/program",
  "/reviews",
  "/search",
  "/section",
  "/sections",
  "/shopping",
  "/shows",
  "/subscribe",
  "/tag",
  "/tags",
  "/terms",
  "/topic",
  "/topics",
  "/video",
  "/watch",
]

const BAD_TITLE_PARTS = [
  "subscribe",
  "newsletter",
  "podcast",
  "live updates",
  "latest news",
  "homepage",
  "search",
]

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function safeUrl(href: string, baseUrl: string) {
  try {
    const url = new URL(href, baseUrl)
    url.hash = ""
    return url.toString()
  } catch {
    return null
  }
}

function isSameHost(url: URL, baseUrl: URL) {
  return url.hostname.replace(/^www\./, "") === baseUrl.hostname.replace(/^www\./, "")
}

function hasRejectPath(url: URL) {
  const path = url.pathname.toLowerCase()
  return NON_ARTICLE_PATH_PARTS.some((part) => path === part || path.startsWith(`${part}/`))
}

function isLikelyArticleUrl(url: URL, source: SourceRow) {
  if (hasRejectPath(url)) return false

  const path = url.pathname.toLowerCase()
  const segments = path.split("/").filter(Boolean)
  const strategy = source.parser_strategy.toLowerCase()

  if (path === "/" || segments.length === 0) return false
  if (path.includes("/newsletters/") || path.includes("/video/")) return false

  if (strategy.includes("reuters")) {
    return /-\d{4}-\d{2}-\d{2}\/?$/.test(path) || /\/world\/.+\/\d{4}-\d{2}-\d{2}/.test(path)
  }

  if (strategy.includes("npr")) {
    return /^\/\d{4}\/\d{2}\/\d{2}\//.test(path)
  }

  if (strategy.includes("bbc")) {
    return path.startsWith("/news/articles/") || /^\/news\/[a-z0-9-]{18,}/.test(path)
  }

  if (strategy.includes("guardian")) {
    return /^\/[a-z-]+\/\d{4}\/[a-z]{3}\/\d{2}\//.test(path)
  }

  if (strategy.includes("fox")) {
    return segments.length >= 3 && !["category", "shows", "video", "live-news"].includes(segments[0])
  }

  return (
    segments.length >= 2 &&
    path.length >= 24 &&
    (/\d{4}/.test(path) || segments.some((segment) => segment.length >= 18))
  )
}

export function extractCandidateArticleUrls(html: string, source: SourceRow) {
  const $ = cheerio.load(html)
  const baseUrl = new URL(source.listing_url)
  const urls = new Map<string, string>()
  const rejected = new Map<string, string>()

  $("script, style, noscript, svg, nav, header, footer, aside, form").remove()

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href")
    const text = normalizeText($(element).text())

    if (!href || !text || text.length < 12) return

    const absolute = safeUrl(href, source.listing_url)

    if (!absolute) return

    const url = new URL(absolute)

    if (!["http:", "https:"].includes(url.protocol) || !isSameHost(url, baseUrl)) {
      return
    }

    if (!isLikelyArticleUrl(url, source)) {
      rejected.set(url.toString(), "non_article_url")
      return
    }

    urls.set(url.toString(), text)
  })

  return {
    candidates: [...urls.keys()],
    rejectedCount: rejected.size,
  }
}

function getMeta($: cheerio.CheerioAPI, ...names: string[]) {
  for (const name of names) {
    const value =
      $(`meta[property="${name}"]`).attr("content") ??
      $(`meta[name="${name}"]`).attr("content")

    if (value) return normalizeText(value)
  }

  return null
}

function extractParagraphs($: cheerio.CheerioAPI) {
  $("script, style, noscript, svg, nav, header, footer, aside, form").remove()
  $(
    [
      "[class*='advert']",
      "[class*='newsletter']",
      "[class*='related']",
      "[class*='share']",
      "[class*='subscribe']",
      "[id*='advert']",
      "[id*='newsletter']",
      "[id*='related']",
      "[id*='subscribe']",
    ].join(","),
  ).remove()

  const selectors = ["article p", "main p", "[itemprop='articleBody'] p", "p"]
  const paragraphs: string[] = []

  for (const selector of selectors) {
    paragraphs.length = 0
    $(selector).each((_, element) => {
      const text = normalizeText($(element).text())

      if (text.length >= 80 && !/^(read more|sign up|follow us|share this)/i.test(text)) {
        paragraphs.push(text)
      }
    })

    if (paragraphs.join("\n\n").length >= 900 || paragraphs.length >= 3) {
      break
    }
  }

  return [...new Set(paragraphs)]
}

function parsePublishedAt(value: string | null) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function isBadTitle(title: string) {
  const normalized = title.toLowerCase()
  return (
    title.length < 18 ||
    BAD_TITLE_PARTS.some((part) => normalized.includes(part)) ||
    /^[a-z\s&]+$/i.test(title) && title.split(/\s+/).length <= 3
  )
}

export function parseArticleHtml(
  html: string,
  source: SourceRow,
  originalUrl: string,
): { article?: ArticleInsert; rejectionReason?: string } {
  const $ = cheerio.load(html)
  const canonicalUrl =
    $("link[rel='canonical']").attr("href") ??
    getMeta($, "og:url") ??
    originalUrl
  const canonical = safeUrl(canonicalUrl, originalUrl)

  if (!canonical) {
    return { rejectionReason: "missing_canonical_url" }
  }

  const canonicalParsed = new URL(canonical)

  if (!isLikelyArticleUrl(canonicalParsed, source)) {
    return { rejectionReason: "canonical_not_article" }
  }

  const title =
    getMeta($, "og:title", "twitter:title") ??
    normalizeText($("h1").first().text()) ??
    normalizeText($("title").first().text())

  if (!title || isBadTitle(title)) {
    return { rejectionReason: "bad_title" }
  }

  const imageUrl = getMeta($, "og:image", "twitter:image")

  if (!imageUrl) {
    return { rejectionReason: "missing_image" }
  }

  const publishedAt = parsePublishedAt(
    getMeta($, "article:published_time", "datePublished", "pubdate") ??
      $("time[datetime]").first().attr("datetime") ??
      null,
  )

  if (!publishedAt) {
    return { rejectionReason: "missing_published_date" }
  }

  const paragraphs = extractParagraphs($)
  const rawText = paragraphs.join("\n\n")

  if (paragraphs.length < 3 && rawText.length < 900) {
    return { rejectionReason: "low_quality_body" }
  }

  return {
    article: {
      source_id: source.id,
      original_url: originalUrl,
      canonical_url: canonical,
      title,
      image_url: safeUrl(imageUrl, originalUrl) ?? imageUrl,
      published_at: publishedAt,
      raw_text: rawText,
    },
  }
}
