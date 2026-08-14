import { assertAdminRequest } from "@/app/lib/server-auth"
import { analyzePendingArticles } from "@/app/lib/scraping/analysis-pipeline"

export const runtime = "nodejs"
export const maxDuration = 300

type AnalyzeRequestBody = {
  articleIds?: number[]
  limit?: number
  batchSize?: number
}

async function readBody(request: Request): Promise<AnalyzeRequestBody> {
  try {
    return (await request.json()) as AnalyzeRequestBody
  } catch {
    return {}
  }
}

export async function POST(request: Request) {
  const authError = assertAdminRequest(request)

  if (authError) return authError

  try {
    const body = await readBody(request)
    const summary = await analyzePendingArticles({
      articleIds: body.articleIds,
      limit: body.limit,
      batchSize: body.batchSize,
    })

    return Response.json({ summary })
  } catch (error) {
    console.error("[analysis] Manual analysis failed", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
