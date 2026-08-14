import type { SupabaseClient } from "@supabase/supabase-js"
import {
  fetchOxylabsQueryResultHtml,
  fetchOxylabsRealtimeHtml,
  getOxylabsDoneJobs,
} from "@/app/lib/oxylabs"
import { createSupabaseServiceClient } from "@/app/lib/supabase"
import { extractCandidateArticleUrls, parseArticleHtml } from "./html"
import type { ArticleInsert, PipelineSummary, ScrapeOptions, SourceRow } from "./types"

const DEFAULT_LIMIT_PER_SOURCE = 5
const URL_CHECK_CHUNK_SIZE = 15

type ScheduledHomepage = {
  html: string
  jobId: string
  scheduleId: string
}

function emptySummary(): PipelineSummary {
  return {
    status: "completed",
    sourcesChecked: 0,
    candidatesFound: 0,
    candidatesRejected: 0,
    duplicatesSkipped: 0,
    detailPagesScraped: 0,
    articlesInserted: 0,
    articlesRejected: 0,
    articlesFailed: 0,
    totalDurationMs: 0,
    rejectionReasons: {},
  }
}

function addRejection(summary: PipelineSummary, reason: string) {
  summary.rejectionReasons[reason] = (summary.rejectionReasons[reason] ?? 0) + 1
}

function log(message: string, metadata?: unknown) {
  if (metadata === undefined) {
    console.log(`[scrape] ${message}`)
    return
  }

  console.log(`[scrape] ${message}`, metadata)
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

function getClient() {
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    throw new Error("Supabase service role client is not configured")
  }

  return supabase
}

export async function loadActiveSources(options: ScrapeOptions = {}) {
  const supabase = getClient()
  let query = supabase
    .from("sources")
    .select("id, name, listing_url, parser_strategy, logo_url, active")
    .eq("active", true)
    .order("name", { ascending: true })

  if (options.sourceIds?.length) {
    query = query.in("id", options.sourceIds)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to load active sources: ${error.message}`)
  }

  const sources = (data ?? []) as SourceRow[]

  if (!options.sourceNames?.length) {
    return sources
  }

  const selectedNames = new Set(
    options.sourceNames.map((name) => name.trim().toLowerCase()),
  )

  return sources.filter((source) => selectedNames.has(source.name.toLowerCase()))
}

async function getExistingUrls(supabase: SupabaseClient, urls: string[]) {
  const existing = new Set<string>()

  for (let index = 0; index < urls.length; index += URL_CHECK_CHUNK_SIZE) {
    const chunk = urls.slice(index, index + URL_CHECK_CHUNK_SIZE)
    const originalResult = await supabase
      .from("articles")
      .select("original_url")
      .in("original_url", chunk)
    const canonicalResult = await supabase
      .from("articles")
      .select("canonical_url")
      .in("canonical_url", chunk)

    if (originalResult.error) {
      throw new Error(`Original URL existence check failed: ${originalResult.error.message}`)
    }

    if (canonicalResult.error) {
      throw new Error(`Canonical URL existence check failed: ${canonicalResult.error.message}`)
    }

    for (const row of originalResult.data ?? []) {
      existing.add(row.original_url)
    }

    for (const row of canonicalResult.data ?? []) {
      existing.add(row.canonical_url)
    }
  }

  return existing
}

async function insertArticle(
  supabase: SupabaseClient,
  article: ArticleInsert
) {
  const { data, error } = await supabase
    .from("articles")
    .insert(article)
    .select("id")
    .single()

  if (error) {
    throw new Error(`Article insert failed: ${error.message}`)
  }

  return data.id as number
}

async function scrapeSourceFromHomepage(
  supabase: SupabaseClient,
  source: SourceRow,
  homepageHtml: string,
  summary: PipelineSummary,
  limitPerSource: number,
) {
  log(`Extracting candidates for ${source.name}`)
  const extraction = extractCandidateArticleUrls(homepageHtml, source)
  summary.candidatesFound += extraction.candidates.length
  summary.candidatesRejected += extraction.rejectedCount

  log(`${source.name}: candidate links found`, {
    found: extraction.candidates.length,
    rejectedBeforeDetail: extraction.rejectedCount,
  })

  const existingUrls = await getExistingUrls(supabase, extraction.candidates)
  const freshCandidates = extraction.candidates.filter((url) => !existingUrls.has(url))
  summary.duplicatesSkipped += extraction.candidates.length - freshCandidates.length

  let insertedForSource = 0

  for (const candidateUrl of freshCandidates.slice(0, Math.max(limitPerSource * 4, limitPerSource))) {
    if (insertedForSource >= limitPerSource) break

    try {
      log(`${source.name}: scraping detail`, { url: candidateUrl })
      const detailHtml = await fetchOxylabsRealtimeHtml(candidateUrl)
      summary.detailPagesScraped += 1

      const parsed = parseArticleHtml(detailHtml, source, candidateUrl)

      if (!parsed.article) {
        summary.articlesRejected += 1
        addRejection(summary, parsed.rejectionReason ?? "unknown")
        continue
      }

      await insertArticle(supabase, parsed.article)
      insertedForSource += 1
      summary.articlesInserted += 1
      log(`${source.name}: inserted article`, { title: parsed.article.title })
    } catch (error) {
      summary.articlesFailed += 1
      addRejection(summary, "detail_failed")
      console.error(`[scrape] ${source.name}: detail scrape failed`, error)
    }
  }
}

export async function runManualScrape(options: ScrapeOptions = {}) {
  const startedAt = Date.now()
  const supabase = getClient()
  const summary = emptySummary()
  const limitPerSource = options.limitPerSource ?? DEFAULT_LIMIT_PER_SOURCE
  const sources = await loadActiveSources(options)

  summary.sourcesChecked = sources.length
  log("Scrape started", { sources: sources.map((source) => source.name), limitPerSource })
  await logToDatabase(supabase, "scrape_started", "Manual scrape started", {
    sourceNames: sources.map((source) => source.name),
    limitPerSource,
  })

  for (const source of sources) {
    try {
      log(`Fetching homepage for ${source.name}`, { url: source.listing_url })
      const homepageHtml = await fetchOxylabsRealtimeHtml(source.listing_url)
      await scrapeSourceFromHomepage(supabase, source, homepageHtml, summary, limitPerSource)
    } catch (error) {
      summary.articlesFailed += 1
      addRejection(summary, "homepage_failed")
      console.error(`[scrape] ${source.name}: homepage scrape failed`, error)
    }
  }

  summary.status = summary.articlesFailed > 0 ? "partial" : "completed"
  summary.totalDurationMs = Date.now() - startedAt
  log("Scrape completed", summary)
  await logToDatabase(supabase, "scrape_completed", "Manual scrape completed", { summary })

  return summary
}

async function loadScheduledHomepages(supabase: SupabaseClient, source: SourceRow) {
  const { data, error } = await supabase
    .from("oxylabs_schedules")
    .select("schedule_id")
    .eq("source_id", source.id)
    .eq("active", true)

  if (error) {
    throw new Error(`Failed to load schedules for ${source.name}: ${error.message}`)
  }

  const homepages: ScheduledHomepage[] = []

  for (const schedule of data ?? []) {
    const doneJobs = await getOxylabsDoneJobs(schedule.schedule_id)

    for (const job of doneJobs) {
      const existingRun = await supabase
        .from("oxylabs_schedule_runs")
        .select("id")
        .eq("oxylabs_job_id", job.jobId)
        .maybeSingle()

      if (existingRun.error) {
        throw new Error(`Failed to check scheduled job ${job.jobId}: ${existingRun.error.message}`)
      }

      if (existingRun.data) {
        continue
      }

      const html = await fetchOxylabsQueryResultHtml(job.jobId)
      homepages.push({
        html,
        jobId: job.jobId,
        scheduleId: schedule.schedule_id,
      })
    }
  }

  return homepages
}

export async function processScheduledResults(options: ScrapeOptions = {}) {
  const startedAt = Date.now()
  const supabase = getClient()
  const summary = emptySummary()
  const limitPerSource = options.limitPerSource ?? DEFAULT_LIMIT_PER_SOURCE
  const sources = await loadActiveSources(options)

  summary.sourcesChecked = sources.length
  log("Scheduled result processing started", {
    sources: sources.map((source) => source.name),
    limitPerSource,
  })

  for (const source of sources) {
    try {
      const homepages = await loadScheduledHomepages(supabase, source)

      for (const homepage of homepages) {
        const beforeInserted = summary.articlesInserted
        const beforeRejected = summary.articlesRejected
        const beforeFailed = summary.articlesFailed

        await scrapeSourceFromHomepage(
          supabase,
          source,
          homepage.html,
          summary,
          limitPerSource,
        )

        await supabase.from("oxylabs_schedule_runs").insert({
          schedule_id: homepage.scheduleId,
          oxylabs_job_id: homepage.jobId,
          source_id: source.id,
          result_status: "done",
          processed_at: new Date().toISOString(),
          inserted_count: summary.articlesInserted - beforeInserted,
          rejected_count: summary.articlesRejected - beforeRejected,
          failed_count: summary.articlesFailed - beforeFailed,
          metadata: { sourceName: source.name },
        })
      }
    } catch (error) {
      summary.articlesFailed += 1
      addRejection(summary, "scheduled_result_failed")
      console.error(`[scrape] ${source.name}: scheduled result processing failed`, error)
    }
  }

  summary.status = summary.articlesFailed > 0 ? "partial" : "completed"
  summary.totalDurationMs = Date.now() - startedAt
  log("Scheduled result processing completed", summary)
  await logToDatabase(supabase, "scheduled_scrape_completed", "Scheduled scrape completed", {
    summary,
  })

  return summary
}
