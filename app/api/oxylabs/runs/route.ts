import { createSupabaseServiceClient } from "@/app/lib/supabase"

export const runtime = "nodejs"

export async function GET() {
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    return Response.json(
      { error: "Supabase service role client is not configured" },
      { status: 500 },
    )
  }

  const { data, error } = await supabase
    .from("oxylabs_schedule_runs")
    .select("id, schedule_id, oxylabs_job_id, source_id, result_status, processed_at, inserted_count, rejected_count, failed_count, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ runs: data ?? [] })
}
