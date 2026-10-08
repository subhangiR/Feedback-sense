import { CATEGORIES, PRIORITIES, SENTIMENTS } from './feedbackUtils'

export const HISTORY_STORAGE_KEY = 'feedbacksense-history'

function toYear(value, date) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && /^(19|20)\d{2}$/.test(value.trim())) {
    return Number(value.trim())
  }

  if (typeof date === 'string') {
    const match = date.trim().match(/^(\d{4})-/)
    if (match) {
      return Number(match[1])
    }
  }

  return null
}

export function sanitizeHistoryItems(items) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        item.text.trim().length > 0 &&
        CATEGORIES.includes(item.category) &&
        SENTIMENTS.includes(item.sentiment) &&
        PRIORITIES.includes(item.priority),
    )
    .map((item) => ({
      id: item.id,
      text: item.text,
      category: item.category,
      sentiment: item.sentiment,
      priority: item.priority,
      reason: typeof item.reason === 'string' ? item.reason : '',
      date: typeof item.date === 'string' && item.date.trim() ? item.date : null,
      year: toYear(item.year, item.date),
      source: typeof item.source === 'string' && item.source.trim() ? item.source : null,
      analyzedAt: typeof item.analyzedAt === 'string' ? item.analyzedAt : null,
    }))
}

export function loadHistory() {
  if (typeof localStorage === 'undefined') {
    return []
  }

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) {
      return []
    }

    return sanitizeHistoryItems(JSON.parse(raw))
  } catch {
    return []
  }
}

export function saveHistory(items) {
  if (typeof localStorage === 'undefined') {
    return
  }

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sanitizeHistoryItems(items)))
  } catch {
    // Ignore quota or private-mode failures so analysis still completes.
  }
}
