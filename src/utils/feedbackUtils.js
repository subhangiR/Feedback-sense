export const CATEGORIES = ['Bug', 'Feature Request', 'Praise', 'Complaint']
export const SENTIMENTS = ['Positive', 'Neutral', 'Negative']
export const PRIORITIES = ['High', 'Medium', 'Low']

export const BADGE_TONES = {
  Bug: 'danger',
  Complaint: 'warning',
  'Feature Request': 'accent',
  Praise: 'success',
  Negative: 'danger',
  Neutral: 'neutral',
  Positive: 'success',
  High: 'danger',
  Medium: 'warning',
  Low: 'accent',
}

export const CATEGORY_COLORS = {
  Bug: '#b42318',
  'Feature Request': '#0f766e',
  Praise: '#067647',
  Complaint: '#b45309',
}

export const SENTIMENT_COLORS = {
  Positive: '#067647',
  Neutral: '#78716c',
  Negative: '#b42318',
}

export const PRIORITY_COLORS = {
  High: '#b42318',
  Medium: '#b45309',
  Low: '#0f766e',
}

export function splitFeedbackText(text) {
  if (!text) {
    return []
  }

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function getSummaryMetrics(items) {
  return {
    total: items.length,
    highPriority: items.filter((item) => item.priority === 'High').length,
    negative: items.filter((item) => item.sentiment === 'Negative').length,
    featureRequests: items.filter((item) => item.category === 'Feature Request').length,
  }
}

export function getDistribution(items, key, labels) {
  return labels.map((label) => ({
    name: label,
    value: items.filter((item) => item[key] === label).length,
  }))
}

export function filterFeedback(items, { search, category, sentiment, priority }) {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesSearch = query.length === 0 || item.text.toLowerCase().includes(query)
    const matchesCategory = category === 'All' || item.category === category
    const matchesSentiment = sentiment === 'All' || item.sentiment === sentiment
    const matchesPriority = priority === 'All' || item.priority === priority

    return matchesSearch && matchesCategory && matchesSentiment && matchesPriority
  })
}

export function getFriendlyError(code) {
  switch (code) {
    case 'EMPTY_INPUT':
      return 'Please paste feedback or upload a CSV before analyzing.'
    case 'INVALID_AI_RESPONSE':
      return 'The analysis result was incomplete. Please try again.'
    case 'NETWORK':
      return 'We could not reach the analysis service. Check your connection and try again.'
    case 'MISSING_API_KEY':
      return 'Analysis is not configured yet. Enable mock AI or add a server API key.'
    default:
      return 'We could not analyze your feedback. Please try again.'
  }
}
