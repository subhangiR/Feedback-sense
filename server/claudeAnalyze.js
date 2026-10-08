const SYSTEM_PROMPT = `You are FeedbackSense, an AI that turns customer feedback into structured product insights.

Analyze each feedback item independently.
Assign exactly one category, one sentiment, and one priority.
Provide a concise reason for the priority.

Allowed categories: Bug, Feature Request, Praise, Complaint
Allowed sentiments: Positive, Neutral, Negative
Allowed priorities: High, Medium, Low

Return ONLY valid JSON with this shape:
{
  "results": [
    {
      "id": "feedback-001",
      "text": "original feedback",
      "category": "Bug",
      "sentiment": "Negative",
      "priority": "High",
      "reason": "short reason"
    }
  ]
}

Do not include markdown, comments, or any text outside JSON.`

function extractJson(text) {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)

  if (fenced?.[1]) {
    return JSON.parse(fenced[1])
  }

  return JSON.parse(trimmed)
}

export async function analyzeWithClaude(feedbackItems, env = process.env) {
  const apiKey = env.ANTHROPIC_API_KEY
  const model = env.ANTHROPIC_MODEL || 'claude-sonnet-4-5'

  if (!apiKey) {
    const error = new Error('MISSING_API_KEY')
    error.status = 501
    throw error
  }

  if (!Array.isArray(feedbackItems) || feedbackItems.length === 0) {
    const error = new Error('EMPTY_INPUT')
    error.status = 400
    throw error
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: JSON.stringify({ feedbackItems }),
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = new Error('ANALYSIS_FAILED')
    error.status = 502
    throw error
  }

  const data = await response.json()
  const text = data?.content?.find((block) => block.type === 'text')?.text

  if (!text) {
    const error = new Error('INVALID_AI_RESPONSE')
    error.status = 502
    throw error
  }

  try {
    return extractJson(text)
  } catch {
    const error = new Error('INVALID_AI_RESPONSE')
    error.status = 502
    throw error
  }
}
