export type SourceRow = {
  id: number
  name: string
  listing_url: string
  parser_strategy: string
  logo_url: string | null
  active: boolean
}

export type PipelineSummary = {
  status: "completed" | "failed" | "partial"
  sourcesChecked: number
  candidatesFound: number
  candidatesRejected: number
  duplicatesSkipped: number
  detailPagesScraped: number
  articlesInserted: number
  articlesRejected: number
  articlesFailed: number
  totalDurationMs: number
  rejectionReasons: Record<string, number>
}

export type ScrapeOptions = {
  sourceIds?: number[]
  sourceNames?: string[]
  limitPerSource?: number
}

export type ArticleInsert = {
  source_id: number
  original_url: string
  canonical_url: string
  title: string
  image_url: string
  published_at: string
  raw_text: string
}
