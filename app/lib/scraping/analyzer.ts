const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses"
const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings"
const DEFAULT_ANALYSIS_MODEL = "gpt-5-mini"
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"
const MAX_ARTICLE_CHARS = 24000
const MAX_EMBEDDING_CHARS = 8000
const EMBEDDING_DIMENSIONS = 1536

const SENTIMENT_LABELS = ["positive", "neutral", "negative"] as const
const BIAS_LABELS = ["left", "center", "right", "mixed", "unclear"] as const

type SentimentLabel = (typeof SENTIMENT_LABELS)[number]
type BiasLabel = (typeof BIAS_LABELS)[number]

export type ArticleAnalysisInsert = {
  article_id: number
  summary: string
  sentiment_score: number
  sentiment_label: SentimentLabel
  bias_score: number
  bias_label: BiasLabel
  left_percentage: number
  center_percentage: number
  right_percentage: number
  confidence: number
  framing_notes: string
  loaded_terms: string[]
  disclaimer: string
  model: string
  embedding: number[]
}

type AnalyzeArticleInput = {
  articleId: number
  title: string
  rawText: string
  model?: string
  embeddingModel?: string
}

type ModelAnalysis = {
  summary: string
  sentimentScore: number
  sentimentLabel: SentimentLabel
  politicalFramingLabel: BiasLabel
  leftPercentage: number
  centerPercentage: number
  rightPercentage: number
  confidence: number
  framingNotes: string
  loadedTerms: string[]
  disclaimer: string
}

type ResponsesApiBody = {
  output_text?: string
  output?: Array<{
    content?: Array<{
      text?: string
      type?: string
    }>
  }>
}

const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "sentimentScore",
    "sentimentLabel",
    "politicalFramingLabel",
    "leftPercentage",
    "centerPercentage",
    "rightPercentage",
    "confidence",
    "framingNotes",
    "loadedTerms",
    "disclaimer",
  ],
  properties: {
    summary: {
      type: "string",
      description: "A neutral two to four sentence summary of the article.",
    },
    sentimentScore: {
      type: "number",
      minimum: -1,
      maximum: 1,
    },
    sentimentLabel: {
      type: "string",
      enum: SENTIMENT_LABELS,
    },
    politicalFramingLabel: {
      type: "string",
      enum: BIAS_LABELS,
    },
    leftPercentage: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    centerPercentage: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    rightPercentage: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    framingNotes: {
      type: "string",
      description: "Brief evidence-based notes about framing choices in the article.",
    },
    loadedTerms: {
      type: "array",
      items: { type: "string" },
    },
    disclaimer: {
      type: "string",
      description: "A short disclaimer that framing is AI-estimated and may be imperfect.",
    },
  },
}

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  return apiKey
}

function roundToThree(value: number) {
  return Math.round(value * 1000) / 1000
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function cleanString(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isSentimentLabel(value: unknown): value is SentimentLabel {
  return typeof value === "string" && SENTIMENT_LABELS.includes(value as SentimentLabel)
}

function isBiasLabel(value: unknown): value is BiasLabel {
  return typeof value === "string" && BIAS_LABELS.includes(value as BiasLabel)
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === "string" ? cleanString(value) : null
}

function getNumber(record: Record<string, unknown>, key: string) {
  const value = record[key]
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function getStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key]

  if (!Array.isArray(value)) return null

  return value
    .filter((item): item is string => typeof item === "string")
    .map(cleanString)
    .filter(Boolean)
    .slice(0, 12)
}

function normalizePercentages(left: number, center: number, right: number) {
  const values = [
    Math.round(clamp(left, 0, 100)),
    Math.round(clamp(center, 0, 100)),
    Math.round(clamp(right, 0, 100)),
  ]
  const total = values.reduce((sum, value) => sum + value, 0)

  if (total === 0) {
    return { left: 0, center: 100, right: 0 }
  }

  const normalized = values.map((value) => Math.round((value / total) * 100))
  const difference = 100 - normalized.reduce((sum, value) => sum + value, 0)
  const largestIndex = normalized.indexOf(Math.max(...normalized))
  normalized[largestIndex] += difference

  return {
    left: normalized[0],
    center: normalized[1],
    right: normalized[2],
  }
}

function normalizeBiasLabel(
  label: BiasLabel,
  confidence: number,
  percentages: { left: number; center: number; right: number },
): BiasLabel {
  const sorted = [
    ["left", percentages.left],
    ["center", percentages.center],
    ["right", percentages.right],
  ].sort((a, b) => Number(b[1]) - Number(a[1])) as Array<[BiasLabel, number]>
  const [strongestLabel, strongestValue] = sorted[0]
  const [, secondValue] = sorted[1]

  if (confidence < 0.35) return "unclear"
  if (strongestValue - secondValue <= 10) return "mixed"
  if (label === "unclear" || label === "mixed") return label

  return strongestLabel
}

function validateModelAnalysis(value: unknown): ModelAnalysis {
  if (!isRecord(value)) {
    throw new Error("AI analysis response was not a JSON object")
  }

  const summary = getString(value, "summary")
  const sentimentScore = getNumber(value, "sentimentScore")
  const sentimentLabel = value.sentimentLabel
  const politicalFramingLabel = value.politicalFramingLabel
  const leftPercentage = getNumber(value, "leftPercentage")
  const centerPercentage = getNumber(value, "centerPercentage")
  const rightPercentage = getNumber(value, "rightPercentage")
  const confidence = getNumber(value, "confidence")
  const framingNotes = getString(value, "framingNotes")
  const loadedTerms = getStringArray(value, "loadedTerms")
  const disclaimer = getString(value, "disclaimer")

  if (!summary) throw new Error("AI analysis summary is missing")
  if (sentimentScore === null) throw new Error("AI sentiment score is missing")
  if (!isSentimentLabel(sentimentLabel)) throw new Error("AI sentiment label is invalid")
  if (!isBiasLabel(politicalFramingLabel)) {
    throw new Error("AI political framing label is invalid")
  }
  if (leftPercentage === null || centerPercentage === null || rightPercentage === null) {
    throw new Error("AI framing percentages are missing")
  }
  if (confidence === null) throw new Error("AI confidence is missing")
  if (!framingNotes) throw new Error("AI framing notes are missing")
  if (!loadedTerms) throw new Error("AI loaded terms are invalid")
  if (!disclaimer) throw new Error("AI disclaimer is missing")

  const percentages = normalizePercentages(
    leftPercentage,
    centerPercentage,
    rightPercentage,
  )
  const normalizedConfidence = roundToThree(clamp(confidence, 0, 1))

  return {
    summary,
    sentimentScore: roundToThree(clamp(sentimentScore, -1, 1)),
    sentimentLabel,
    politicalFramingLabel: normalizeBiasLabel(
      politicalFramingLabel,
      normalizedConfidence,
      percentages,
    ),
    leftPercentage: percentages.left,
    centerPercentage: percentages.center,
    rightPercentage: percentages.right,
    confidence: normalizedConfidence,
    framingNotes,
    loadedTerms,
    disclaimer,
  }
}

function parseResponsesOutput(body: ResponsesApiBody) {
  if (body.output_text) {
    return body.output_text
  }

  for (const outputItem of body.output ?? []) {
    for (const contentItem of outputItem.content ?? []) {
      if (typeof contentItem.text === "string") {
        return contentItem.text
      }
    }
  }

  throw new Error("OpenAI response did not include output text")
}

function validateEmbedding(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error("OpenAI embedding response was not an array")
  }

  const embedding = value.map((item) => {
    if (typeof item !== "number" || !Number.isFinite(item)) {
      throw new Error("OpenAI embedding contained a non-numeric value")
    }

    return item
  })

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `OpenAI embedding returned ${embedding.length} dimensions; expected ${EMBEDDING_DIMENSIONS}`,
    )
  }

  return embedding
}

async function callAnalysisModel({
  title,
  rawText,
  model,
}: Omit<AnalyzeArticleInput, "articleId">) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You analyze news articles for neutral summaries, sentiment, and AI-estimated political framing. Use only evidence in the supplied article. Do not infer from the publication name. Return only JSON matching the schema.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nArticle text:\n${rawText.slice(0, MAX_ARTICLE_CHARS)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "article_analysis",
          strict: true,
          schema: analysisJsonSchema,
        },
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI analysis request failed ${response.status}: ${body}`)
  }

  return parseResponsesOutput((await response.json()) as ResponsesApiBody)
}

export async function generateArticleEmbedding({
  title,
  rawText,
  model = process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL,
}: {
  title: string
  rawText: string
  model?: string
}) {
  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: `Title: ${title}\n\nArticle text:\n${rawText.slice(0, MAX_EMBEDDING_CHARS)}`,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI embedding request failed ${response.status}: ${body}`)
  }

  const body = (await response.json()) as {
    data?: Array<{ embedding?: unknown }>
  }

  return validateEmbedding(body.data?.[0]?.embedding)
}

export async function analyzeArticleForInsert({
  articleId,
  title,
  rawText,
  model = process.env.OPENAI_ANALYSIS_MODEL ?? DEFAULT_ANALYSIS_MODEL,
  embeddingModel = process.env.OPENAI_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL,
}: AnalyzeArticleInput): Promise<ArticleAnalysisInsert> {
  if (!title.trim()) {
    throw new Error("Article title is required for analysis")
  }

  if (rawText.trim().length < 300) {
    throw new Error("Article raw text is too short for analysis")
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const outputText = await callAnalysisModel({ title, rawText, model })
      const modelAnalysis = validateModelAnalysis(JSON.parse(outputText) as unknown)
      const embedding = await generateArticleEmbedding({
        title,
        rawText,
        model: embeddingModel,
      })
      const biasScore = roundToThree(
        (modelAnalysis.rightPercentage - modelAnalysis.leftPercentage) / 100,
      )

      return {
        article_id: articleId,
        summary: modelAnalysis.summary,
        sentiment_score: modelAnalysis.sentimentScore,
        sentiment_label: modelAnalysis.sentimentLabel,
        bias_score: biasScore,
        bias_label: modelAnalysis.politicalFramingLabel,
        left_percentage: modelAnalysis.leftPercentage,
        center_percentage: modelAnalysis.centerPercentage,
        right_percentage: modelAnalysis.rightPercentage,
        confidence: modelAnalysis.confidence,
        framing_notes: modelAnalysis.framingNotes,
        loaded_terms: modelAnalysis.loadedTerms,
        disclaimer: modelAnalysis.disclaimer,
        model,
        embedding,
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown analysis error")
    }
  }

  throw lastError ?? new Error("AI analysis failed")
}
