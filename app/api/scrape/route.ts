import { assertAdminRequest } from "@/app/lib/server-auth"
import { runManualScrape } from "@/app/lib/scraping/pipeline"

export const runtime = "nodejs"
export const maxDuration = 300

type ScrapeRequestBody = {
  sources?: string[]
  sourceIds?: number[]
  sourceNames?: string[]
  limitPerSource?: number
}

async function readBody(request: Request): Promise<ScrapeRequestBody> {
  try {
    return (await request.json()) as ScrapeRequestBody
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  const authError = assertAdminRequest(request)

  if (authError) return authError

  try {
    const body = await readBody(request)
    const summary = await runManualScrape({
      sourceIds: body.sourceIds,
      sourceNames: body.sourceNames ?? body.sources,
      limitPerSource: body.limitPerSource,
    })

    return Response.json({ summary })
  } catch (error) {
    console.error("[scrape] Manual scrape failed", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
