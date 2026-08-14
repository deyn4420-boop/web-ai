import type { SupabaseClient } from "@supabase/supabase-js"
import { createSupabaseServiceClient } from "@/app/lib/supabase"
import { analyzeArticleForInsert, generateArticleEmbedding } from "./analyzer"

const DEFAULT_BATCH_SIZE = 5

type ArticleRow = {
  id: number
  title: string
  raw_text: string
  analysis_id: number | null
  needs_full_analysis: boolean
  needs_embedding: boolean
}

export type AnalyzeOptions = {
  articleIds?: number[]
  limit?: number
  batchSize?: number
}

export type AnalysisSummary = {
  status: "completed" | "partial" | "failed"
  batchesProcessed: number
  articlesChecked: number
  analyzed: number
  skipped: number
  failed: number
  totalDurationMs: number
  failureReasons: Record<string, number>
}

function getClient() {
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    throw new Error("Supabase service role client is not configured")
  }

  return supabase
}

function getBatchSize(value?: number) {
  const envValue = Number.parseInt(process.env.ANALYSIS_BATCH_SIZE ?? "", 10)
  const selected = value ?? (Number.isFinite(envValue) ? envValue : DEFAULT_BATCH_SIZE)

  return Math.max(1, Math.min(selected, 20))
}

function emptySummary(): AnalysisSummary {
  return {
    status: "completed",
    batchesProcessed: 0,
    articlesChecked: 0,
    analyzed: 0,
    skipped: 0,
    failed: 0,
    totalDurationMs: 0,
    failureReasons: {},
  }
}

function addFailure(summary: AnalysisSummary, reason: string) {
  summary.failureReasons[reason] = (summary.failureReasons[reason] ?? 0) + 1
}

function log(message: string, metadata?: unknown) {
  if (metadata === undefined) {
    console.log(`[analysis] ${message}`)
    return
  }

  console.log(`[analysis] ${message}`, metadata)
}

async function logToDatabase(
  supabase: SupabaseClient,
  eventType: string,
  message: string,
  metadata: Record<string, unknown> = {},
  level: "info" | "warn" | "error" = "info",
) {
  await supabase.from("logs").insert({
    event_type: eventType,
    level,
    message,
    metadata,
  })
}

async function loadPendingArticles(
  supabase: SupabaseClient,
  options: AnalyzeOptions,
  batchSize: number,
  excludedIds: Set<number>,
) {
  const { data, error } = await supabase
    .rpc("pending_articles_for_analysis", {
      match_count: batchSize,
      excluded_article_ids: [...excludedIds],
      selected_article_ids: options.articleIds ?? null,
    })

  if (error) {
    throw new Error(`Failed to load pending articles: ${error.message}`)
  }

  return (data ?? []) as ArticleRow[]
}

async function saveFullAnalysis(
  supabase: SupabaseClient,
  article: ArticleRow,
) {
  const analysis = await analyzeArticleForInsert({
    articleId: article.id,
    title: article.title,
    rawText: article.raw_text,
  })

  const insertResult = await supabase
    .from("article_analyses")
    .insert(analysis)

  if (insertResult.error) {
    throw new Error(`Failed to insert article analysis: ${insertResult.error.message}`)
  }

  const updateResult = await supabase
    .from("articles")
    .update({ analyzed_at: new Date().toISOString() })
    .eq("id", article.id)

  if (updateResult.error) {
    await supabase
      .from("article_analyses")
      .delete()
      .eq("article_id", article.id)

    throw new Error(`Failed to mark article analyzed: ${updateResult.error.message}`)
  }
}

async function saveEmbeddingBackfill(
  supabase: SupabaseClient,
  article: ArticleRow,
) {
  if (!article.analysis_id) {
    throw new Error("Cannot backfill embedding without an analysis row")
  }

  const embedding = await generateArticleEmbedding({
    title: article.title,
    rawText: article.raw_text,
  })
  const updateAnalysisResult = await supabase
    .from("article_analyses")
    .update({ embedding })
    .eq("id", article.analysis_id)

  if (updateAnalysisResult.error) {
    throw new Error(`Failed to save article embedding: ${updateAnalysisResult.error.message}`)
  }

  const updateArticleResult = await supabase
    .from("articles")
    .update({ analyzed_at: new Date().toISOString() })
    .eq("id", article.id)

  if (updateArticleResult.error) {
    throw new Error(`Failed to refresh article analyzed timestamp: ${updateArticleResult.error.message}`)
  }
}

export async function analyzePendingArticles(options: AnalyzeOptions = {}) {
  const startedAt = Date.now()
  const supabase = getClient()
  const summary = emptySummary()
  const batchSize = getBatchSize(options.batchSize)
  const maxAttempts = options.limit ?? Number.POSITIVE_INFINITY
  const processedArticleIds = new Set<number>()

  log("Analysis started", {
    articleIds: options.articleIds,
    limit: options.limit,
    batchSize,
  })
  await logToDatabase(supabase, "analysis_started", "AI analysis started", {
    articleIds: options.articleIds,
    limit: options.limit,
    batchSize,
  })

  while (summary.analyzed + summary.failed + summary.skipped < maxAttempts) {
    const remaining = maxAttempts - summary.analyzed - summary.failed - summary.skipped
    const batch = await loadPendingArticles(
      supabase,
      options,
      Math.min(batchSize, remaining),
      processedArticleIds,
    )

    summary.articlesChecked += batch.length

    if (batch.length === 0) {
      break
    }

    summary.batchesProcessed += 1
    log(`Processing analysis batch ${summary.batchesProcessed}`, {
      count: batch.length,
    })

    for (const article of batch) {
      try {
        if (article.needs_full_analysis) {
          await saveFullAnalysis(supabase, article)
        } else if (article.needs_embedding) {
          await saveEmbeddingBackfill(supabase, article)
        } else {
          summary.skipped += 1
          processedArticleIds.add(article.id)
          continue
        }

        processedArticleIds.add(article.id)
        summary.analyzed += 1
        log("Article analyzed", { articleId: article.id, title: article.title })
      } catch (error) {
        processedArticleIds.add(article.id)
        summary.failed += 1
        addFailure(summary, error instanceof Error ? error.message : "unknown")
        console.error("[analysis] Article analysis failed", {
          articleId: article.id,
          error,
        })
      }
    }

    log(`Completed analysis batch ${summary.batchesProcessed}`, {
      analyzed: summary.analyzed,
      failed: summary.failed,
    })
  }

  summary.status =
    summary.failed > 0 && summary.analyzed === 0
      ? "failed"
      : summary.failed > 0
        ? "partial"
        : "completed"
  summary.totalDurationMs = Date.now() - startedAt
  log("Analysis completed", summary)
  await logToDatabase(supabase, "analysis_completed", "AI analysis completed", {
    summary,
  })

  return summary
}
