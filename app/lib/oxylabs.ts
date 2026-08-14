const OXYLABS_REALTIME_URL = "https://realtime.oxylabs.io/v1/queries"
const OXYLABS_DATA_URL = "https://data.oxylabs.io/v1"

type OxylabsResult = {
  content?: string
  status_code?: number
}

type OxylabsResultsResponse = {
  results?: OxylabsResult[]
}

export type OxylabsDoneJob = {
  jobId: string
  resultStatus: "done"
}

function getAuthHeader() {
  const username = process.env.OXY_WSA_USERNAME
  const password = process.env.OXY_WSA_PASSWORD

  if (!username || !password) {
    throw new Error("Oxylabs credentials are not configured")
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
}

async function oxylabsFetch(url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      ...init.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Oxylabs request failed ${response.status}: ${body}`)
  }

  return response
}

function extractFirstId(rawText: string, key: string) {
  const match = rawText.match(new RegExp(`"${key}"\\s*:\\s*"?([0-9]+)"?`))
  return match?.[1]
}

function extractScheduleIds(rawText: string) {
  const match = rawText.match(/"schedules"\s*:\s*\[([\s\S]*?)\]/)

  if (!match) return []

  return [...match[1].matchAll(/\d{10,}/g)].map((idMatch) => idMatch[0])
}

export async function fetchOxylabsRealtimeHtml(url: string) {
  const response = await oxylabsFetch(OXYLABS_REALTIME_URL, {
    method: "POST",
    body: JSON.stringify({
      source: "universal",
      url,
      geo_location: "United States",
      render: "html",
    }),
  })
  const data = (await response.json()) as OxylabsResultsResponse
  const result = data.results?.[0]

  if (!result?.content) {
    throw new Error(`Oxylabs returned no HTML content for ${url}`)
  }

  return result.content
}

export async function createOxylabsSchedule(url: string, cron = "0 * * * *") {
  const response = await oxylabsFetch(`${OXYLABS_DATA_URL}/schedules`, {
    method: "POST",
    body: JSON.stringify({
      cron,
      items: [
        {
          source: "universal",
          url,
          geo_location: "United States",
        },
      ],
      end_time: "2032-12-21 12:34:45",
    }),
  })
  const rawText = await response.text()
  const scheduleId = extractFirstId(rawText, "schedule_id")

  if (!scheduleId) {
    throw new Error(`Oxylabs schedule response did not include a schedule_id`)
  }

  return scheduleId
}

export async function getOxylabsScheduleIds() {
  const response = await oxylabsFetch(`${OXYLABS_DATA_URL}/schedules`, {
    method: "GET",
  })

  return extractScheduleIds(await response.text())
}

export async function deactivateOxylabsSchedule(scheduleId: string) {
  await oxylabsFetch(`${OXYLABS_DATA_URL}/schedules/${scheduleId}/state`, {
    method: "PUT",
    body: JSON.stringify({ active: false }),
  })
}

export async function getOxylabsDoneJobs(scheduleId: string) {
  const response = await oxylabsFetch(
    `${OXYLABS_DATA_URL}/schedules/${scheduleId}/runs`,
    { method: "GET" },
  )
  const rawText = await response.text()
  const jobs: OxylabsDoneJob[] = []

  for (const jobMatch of rawText.matchAll(/\{[^{}]*"id"\s*:\s*"?(\d+)"?[^{}]*"result_status"\s*:\s*"([^"]+)"[^{}]*\}/g)) {
    const [, jobId, resultStatus] = jobMatch

    if (resultStatus === "done") {
      jobs.push({ jobId, resultStatus })
    }
  }

  return jobs
}

export async function fetchOxylabsQueryResultHtml(jobId: string) {
  const response = await oxylabsFetch(
    `${OXYLABS_DATA_URL}/queries/${jobId}/results?type=raw`,
    { method: "GET" },
  )
  const data = (await response.json()) as OxylabsResultsResponse
  const result = data.results?.[0]

  if (!result?.content) {
    throw new Error(`Oxylabs returned no scheduled HTML content for job ${jobId}`)
  }

  return result.content
}
