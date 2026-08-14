import {
  createOxylabsSchedule,
  deactivateOxylabsSchedule,
  getOxylabsScheduleIds,
} from "@/app/lib/oxylabs"
import { createSupabaseServiceClient } from "@/app/lib/supabase"
import { loadActiveSources } from "./pipeline"

const DEFAULT_SCHEDULE_CRON = "0 * * * *"

function getClient() {
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    throw new Error("Supabase service role client is not configured")
  }

  return supabase
}

export async function syncOxylabsSchedules() {
  const supabase = getClient()
  const sources = await loadActiveSources()
  const created: string[] = []
  const retained: string[] = []

  for (const source of sources) {
    const existing = await supabase
      .from("oxylabs_schedules")
      .select("schedule_id")
      .eq("source_id", source.id)
      .eq("active", true)
      .maybeSingle()

    if (existing.error) {
      throw new Error(`Failed to check schedule for ${source.name}: ${existing.error.message}`)
    }

    if (existing.data?.schedule_id) {
      retained.push(existing.data.schedule_id)
      continue
    }

    const scheduleId = await createOxylabsSchedule(source.listing_url, DEFAULT_SCHEDULE_CRON)
    const { error } = await supabase.from("oxylabs_schedules").upsert(
      {
        source_id: source.id,
        schedule_id: scheduleId,
        cron: DEFAULT_SCHEDULE_CRON,
        active: true,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "source_id" },
    )

    if (error) {
      throw new Error(`Failed to store schedule for ${source.name}: ${error.message}`)
    }

    created.push(scheduleId)
  }

  const storedResult = await supabase
    .from("oxylabs_schedules")
    .select("schedule_id")
    .eq("active", true)

  if (storedResult.error) {
    throw new Error(`Failed to list stored schedules: ${storedResult.error.message}`)
  }

  const storedScheduleIds = new Set(
    (storedResult.data ?? []).map((schedule) => schedule.schedule_id),
  )
  const remoteScheduleIds = await getOxylabsScheduleIds()
  const deactivated: string[] = []

  for (const remoteScheduleId of remoteScheduleIds) {
    if (!storedScheduleIds.has(remoteScheduleId)) {
      await deactivateOxylabsSchedule(remoteScheduleId)
      deactivated.push(remoteScheduleId)
    }
  }

  return {
    sourcesChecked: sources.length,
    created,
    retained,
    deactivated,
  }
}

export async function listStoredOxylabsSchedules() {
  const supabase = getClient()
  const { data, error } = await supabase
    .from("oxylabs_schedules")
    .select("id, source_id, schedule_id, cron, active, last_synced_at, sources(name, listing_url)")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to list stored schedules: ${error.message}`)
  }

  return data ?? []
}
