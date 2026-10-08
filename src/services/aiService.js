import axios from 'axios'
import { CATEGORIES, PRIORITIES, SENTIMENTS } from '../utils/feedbackUtils'
import { mockAnalyzeFeedback } from './mockAi'

const USE_MOCK_AI = import.meta.env.VITE_USE_MOCK_AI !== 'false'

function isValidResult(item) {
  return (
    typeof item?.text === 'string' &&
    item.text.trim().length > 0 &&
    typeof item?.reason === 'string' &&
    item.reason.trim().length > 0 &&
    CATEGORIES.includes(item.category) &&
    SENTIMENTS.includes(item.sentiment) &&
    PRIORITIES.includes(item.priority)
  )
}

export function validateAnalysisResults(payload) {
  if (!payload || !Array.isArray(payload.results) || payload.results.length === 0) {
    throw new Error('INVALID_AI_RESPONSE')
  }

  return payload.results.map((item, index) => {
    if (!isValidResult(item)) {
      throw new Error('INVALID_AI_RESPONSE')
    }

    return {
      id: item.id || `feedback-${String(index + 1).padStart(3, '0')}`,
      text: item.text.trim(),
      category: item.category,
      sentiment: item.sentiment,
      priority: item.priority,
      reason: item.reason.trim(),
    }
  })
}

export async function analyzeFeedbackItems(feedbackItems) {
  if (USE_MOCK_AI) {
    const payload = await mockAnalyzeFeedback(feedbackItems)
    return validateAnalysisResults(payload)
  }

  try {
    const response = await axios.post('/api/analyze-feedback', { feedbackItems })
    return validateAnalysisResults(response.data)
  } catch (error) {
    if (error.message === 'INVALID_AI_RESPONSE') {
      throw error
    }

    if (!error.response) {
      throw new Error('NETWORK')
    }

    if (error.response.status === 501) {
      throw new Error('MISSING_API_KEY')
    }

    throw new Error('ANALYSIS_FAILED')
  }
}

export function isMockAiEnabled() {
  return USE_MOCK_AI
}
