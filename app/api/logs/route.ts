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
    .from("logs")
    .select("id, event_type, level, message, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ logs: data ?? [] })
}
