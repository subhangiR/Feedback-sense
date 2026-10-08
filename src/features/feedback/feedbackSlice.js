import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { analyzeFeedbackItems, isMockAiEnabled } from '../../services/aiService'
import { SAMPLE_ANALYZED_FEEDBACK } from '../../services/sampleFeedback'
import { toFeedbackRecord } from '../../utils/csvParser'
import { loadHistory, saveHistory } from '../../utils/historyStorage'

const useSampleData = isMockAiEnabled()

function normalizeAnalyzePayload(payload) {
  if (Array.isArray(payload)) {
    return {
      records: payload.map((item) => toFeedbackRecord(item)),
      source: 'upload',
    }
  }

  return {
    records: (payload?.records ?? []).map((item) => toFeedbackRecord(item)),
    source: payload?.source || 'upload',
  }
}

export const analyzeFeedback = createAsyncThunk(
  'feedback/analyze',
  async (payload, { rejectWithValue }) => {
    try {
      const { records, source } = normalizeAnalyzePayload(payload)
      const usableRecords = records.filter((record) => record.text)
      const texts = usableRecords.map((record) => record.text)

      if (texts.length === 0) {
        throw new Error('EMPTY_INPUT')
      }

      const results = await analyzeFeedbackItems(texts)
      const analyzedAt = new Date().toISOString()
      const batchId = `hist-${Date.now()}`

      return results.map((item, index) => {
        const record = usableRecords[index] ?? {}

        return {
          ...item,
          id: `${batchId}-${index}`,
          date: record.date ?? null,
          year: typeof record.year === 'number' ? record.year : null,
          source: record.source || source,
          analyzedAt,
        }
      })
    } catch (error) {
      return rejectWithValue(error.message || 'ANALYSIS_FAILED')
    }
  },
)

const initialState = {
  items: useSampleData ? SAMPLE_ANALYZED_FEEDBACK : [],
  historyItems: loadHistory(),
  loading: false,
  error: null,
  isSampleData: useSampleData,
}

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback(state, action) {
      state.items = action.payload
      state.isSampleData = false
      state.error = null
    },
    clearFeedback(state) {
      state.items = []
      state.isSampleData = false
      state.error = null
    },
    clearHistory(state) {
      state.historyItems = []
      saveHistory([])
    },
    setError(state, action) {
      state.error = action.payload
    },
    resetFeedback(state) {
      return {
        items: [],
        historyItems: state.historyItems,
        loading: false,
        error: null,
        isSampleData: false,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(analyzeFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.isSampleData = false
        state.error = null
        state.historyItems.push(...action.payload)
        saveHistory(state.historyItems)
      })
      .addCase(analyzeFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'ANALYSIS_FAILED'
      })
  },
})

export const { setFeedback, clearFeedback, clearHistory, setError, resetFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
