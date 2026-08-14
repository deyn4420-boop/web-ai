import { assertAdminRequest } from "@/app/lib/server-auth"
import {
  listStoredOxylabsSchedules,
  syncOxylabsSchedules,
} from "@/app/lib/scraping/schedules"

export const runtime = "nodejs"
export const maxDuration = 300

export async function GET() {
  try {
    const schedules = await listStoredOxylabsSchedules()
    return Response.json({ schedules })
  } catch (error) {
    console.error("[oxylabs] Failed to list schedules", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const authError = assertAdminRequest(request)

  if (authError) return authError

  try {
    const summary = await syncOxylabsSchedules()
    return Response.json({ summary })
  } catch (error) {
    console.error("[oxylabs] Failed to sync schedules", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
