import { loadActiveSources } from "@/app/lib/scraping/pipeline"

export const runtime = "nodejs"

export async function GET() {
  try {
    const sources = await loadActiveSources()
    return Response.json({ sources })
  } catch (error) {
    console.error("[sources] Failed to list active sources", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
