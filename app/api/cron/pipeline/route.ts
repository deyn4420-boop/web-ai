import { assertCronRequest } from "@/app/lib/server-auth"
import { analyzePendingArticles } from "@/app/lib/scraping/analysis-pipeline"
import { processScheduledResults } from "@/app/lib/scraping/pipeline"

export const runtime = "nodejs"
export const maxDuration = 300

export async function GET(request: Request) {
  const authError = assertCronRequest(request)

  if (authError) return authError

  const response: {
    scheduledScrape?: unknown
    analysis?: unknown
  } = {}

  try {
    response.scheduledScrape = await processScheduledResults()
  } catch (error) {
    console.error("[cron] Scheduled scraping failed; analysis step would still run", error)
    response.scheduledScrape = {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  try {
    response.analysis = await analyzePendingArticles()
  } catch (error) {
    console.error("[cron] AI analysis failed", error)
    response.analysis = {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  return Response.json(response)
}
