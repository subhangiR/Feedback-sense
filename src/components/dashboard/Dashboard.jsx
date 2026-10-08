import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import ErrorMessage from '../common/ErrorMessage'
import LoadingState from '../common/LoadingState'
import Toast from '../common/Toast'
import CsvUploader from '../feedback/CsvUploader'
import FeedbackFilters from '../feedback/FeedbackFilters'
import FeedbackInput from '../feedback/FeedbackInput'
import FeedbackModal from '../feedback/FeedbackModal'
import FeedbackTable from '../feedback/FeedbackTable'
import {
  analyzeFeedback,
  clearFeedback,
  setError,
} from '../../features/feedback/feedbackSlice'
import { looksLikeFeedbackTable, parseFeedbackCsv, parseLineRecord, toFeedbackRecord } from '../../utils/csvParser'
import {
  CATEGORIES,
  PRIORITIES,
  SENTIMENTS,
  filterFeedback,
  getDistribution,
  getFriendlyError,
  getSummaryMetrics,
  splitFeedbackText,
} from '../../utils/feedbackUtils'
import { getBatchYearOptions } from '../../utils/historyUtils'
import AnalyticsSection from './AnalyticsSection'
import SummaryCards from './SummaryCards'
import './dashboard.css'

function Dashboard({ searchQuery = '', activeSection = 'dashboard', onSectionChange }) {
  const dispatch = useDispatch()
  const { items, loading, error, isSampleData } = useSelector((state) => state.feedback)
  const [pasteText, setPasteText] = useState('')
  const [csvUpload, setCsvUpload] = useState(null)
  const [batchYear, setBatchYear] = useState(String(new Date().getFullYear()))
  const [inputError, setInputError] = useState('')
  const [category, setCategory] = useState('All')
  const [sentiment, setSentiment] = useState('All')
  const [priority, setPriority] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [toast, setToast] = useState('')
  const wasLoading = useRef(false)
  const tableRef = useRef(null)
  const shouldScrollToTable = useRef(false)

  const pasteItems = splitFeedbackText(pasteText)
  const csvItems = csvUpload?.items ?? []
  const pasteRecordsPreview = pasteItems.map((line) => parseLineRecord(line)).filter(Boolean)
  const datedCount =
    csvItems.filter((item) => typeof item?.year === 'number').length +
    pasteRecordsPreview.filter((item) => typeof item.year === 'number').length
  const readyCount = pasteRecordsPreview.length + csvItems.length
  const yearOptions = getBatchYearOptions()
  const hasResults = items.length > 0
  const hasActiveFilters = category !== 'All' || sentiment !== 'All' || priority !== 'All'
  const activeCardId =
    category === 'All' && sentiment === 'All' && priority === 'All'
      ? 'total'
      : category === 'All' && sentiment === 'All' && priority === 'High'
        ? 'high'
        : category === 'All' && sentiment === 'Negative' && priority === 'All'
          ? 'negative'
          : category === 'Feature Request' && sentiment === 'All' && priority === 'All'
            ? 'features'
            : null

  const metrics = useMemo(() => getSummaryMetrics(items), [items])
  const categoryData = useMemo(
    () => getDistribution(items, 'category', CATEGORIES),
    [items],
  )
  const sentimentData = useMemo(
    () => getDistribution(items, 'sentiment', SENTIMENTS),
    [items],
  )
  const priorityData = useMemo(
    () => getDistribution(items, 'priority', PRIORITIES),
    [items],
  )
  const visibleItems = useMemo(
    () =>
      filterFeedback(items, {
        search: searchQuery,
        category,
        sentiment,
        priority,
      }),
    [items, searchQuery, category, sentiment, priority],
  )

  useEffect(() => {
    if (wasLoading.current && !loading && !error) {
      setToast('Analysis complete. Saved to Feedback History.')
    }
    wasLoading.current = loading
  }, [loading, error])

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeoutId = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timeoutId)
  }, [toast])

  function handlePasteChange(value) {
    setPasteText(value)
    setInputError('')
    dispatch(setError(null))
  }

  function handleCsvLoaded(upload) {
    setCsvUpload(upload)
    setInputError('')
    dispatch(setError(null))
  }

  function handleCsvError(message) {
    setCsvUpload(null)
    setInputError(message)
  }

  function handleCsvClear() {
    setCsvUpload(null)
    setInputError('')
  }

  async function handleAnalyze() {
    const assignedYear = batchYear ? Number(batchYear) : null
    let pasteRecords = []

    if (pasteText.trim()) {
      if (looksLikeFeedbackTable(pasteText)) {
        try {
          const parsed = await parseFeedbackCsv(pasteText)
          pasteRecords = parsed.items.map((item) => ({
            ...toFeedbackRecord(item, assignedYear),
            source: 'Pasted comments',
          }))
        } catch {
          pasteRecords = pasteItems
            .map((line) => parseLineRecord(line, assignedYear))
            .filter(Boolean)
            .map((item) => ({
              ...item,
              source: 'Pasted comments',
            }))
        }
      } else {
        pasteRecords = pasteItems
          .map((line) => parseLineRecord(line, assignedYear))
          .filter(Boolean)
          .map((item) => ({
            ...item,
            source: 'Pasted comments',
          }))
      }
    }

    const csvRecords = csvItems.map((item) => ({
      ...toFeedbackRecord(item, assignedYear),
      source: csvUpload?.name || 'Uploaded file',
    }))
    const records = [...pasteRecords, ...csvRecords].filter((record) => record.text)

    if (records.length === 0) {
      dispatch(setError('EMPTY_INPUT'))
      return
    }

    dispatch(
      analyzeFeedback({
        records,
        source: csvUpload?.name || 'Pasted comments',
      }),
    )
  }

  function handleClearResults() {
    dispatch(clearFeedback())
    setSelectedItem(null)
    setCategory('All')
    setSentiment('All')
    setPriority('All')
  }

  function handleClearFilters() {
    setCategory('All')
    setSentiment('All')
    setPriority('All')
  }

  function handleMetricClick(metricId) {
    if (metricId === 'total') {
      setCategory('All')
      setSentiment('All')
      setPriority('All')
    } else if (metricId === 'high') {
      setCategory('All')
      setSentiment('All')
      setPriority('High')
    } else if (metricId === 'negative') {
      setCategory('All')
      setSentiment('Negative')
      setPriority('All')
    } else if (metricId === 'features') {
      setCategory('Feature Request')
      setSentiment('All')
      setPriority('All')
    }

    if (activeSection === 'analytics') {
      onSectionChange?.('feedback')
    }

    shouldScrollToTable.current = true
  }

  useEffect(() => {
    if (!shouldScrollToTable.current || !tableRef.current) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      shouldScrollToTable.current = false
    }, 50)

    return () => clearTimeout(timeoutId)
  }, [activeSection, category, sentiment, priority])

  const helperText = loading
    ? 'AI is analyzing your feedback...'
    : readyCount === 0
      ? 'Add feedback above to start analysis. File dates are kept. If a file has no dates, the selected year is used so the batch still appears in Trends.'
      : `${readyCount} feedback ${readyCount === 1 ? 'item' : 'items'} ready${
          datedCount ? `, ${datedCount} with file dates` : ''
        }${batchYear && datedCount < readyCount ? `, undated rows stored as ${batchYear}` : ''}${
          !batchYear && datedCount < readyCount ? ', undated rows saved without a year' : ''
        }.`

  const displayError = inputError || (error ? getFriendlyError(error) : '')
  const showInput = activeSection === 'dashboard' || activeSection === 'feedback'
  const showOverview = activeSection === 'dashboard' || activeSection === 'analytics'
  const showTable = activeSection === 'dashboard' || activeSection === 'feedback'

  return (
    <div className="dashboard">
      {showInput ? (
        <section className="hero-panel" aria-labelledby="hero-title">
          <p className="eyebrow">AI-powered analysis</p>
          <h2 id="hero-title">Analyze customer feedback with AI</h2>
          <p className="hero-copy">
            Paste feedback or upload a CSV to instantly identify issues, requests and
            customer sentiment. Analyzed items are saved to Feedback History.
          </p>

          <div className="input-grid">
            <FeedbackInput value={pasteText} onChange={handlePasteChange} />
            <CsvUploader
              fileName={csvUpload?.name}
              recordCount={csvItems.length}
              datedCount={datedCount}
              onLoaded={handleCsvLoaded}
              onError={handleCsvError}
              onClear={handleCsvClear}
            />
          </div>

          <div className="hero-actions">
            <label className="filter-field batch-year-field" htmlFor="batch-year">
              <span>Year for this batch</span>
              <select
                id="batch-year"
                value={batchYear}
                onChange={(event) => setBatchYear(event.target.value)}
              >
                <option value="">No year (unknown)</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <Button disabled={loading || readyCount === 0} onClick={handleAnalyze}>
              {loading ? 'Analyzing...' : 'Analyze Feedback'}
            </Button>
            {hasResults ? (
              <Button variant="ghost" disabled={loading} onClick={handleClearResults}>
                Clear Results
              </Button>
            ) : null}
            <p className="helper-text">{helperText}</p>
          </div>
          {loading ? <LoadingState /> : null}
          <ErrorMessage message={displayError} />
        </section>
      ) : null}

      {showOverview && isSampleData && hasResults ? (
        <p className="sample-banner" role="status">
          You are viewing sample insights. Analyze your own feedback to replace this demo.
        </p>
      ) : null}

      {showOverview ? (
        <SummaryCards
          metrics={metrics}
          hasResults={hasResults}
          activeCardId={activeCardId}
          onCardClick={handleMetricClick}
        />
      ) : null}

      {showOverview ? (
        hasResults ? (
          <AnalyticsSection
            categoryData={categoryData}
            sentimentData={sentimentData}
            priorityData={priorityData}
          />
        ) : (
          <section className="analytics-grid" aria-label="Feedback analytics">
            {['Category Distribution', 'Sentiment Distribution', 'Priority Distribution'].map(
              (title) => (
                <article key={title} className="panel">
                  <div className="panel-header">
                    <h2>{title}</h2>
                  </div>
                  <div className="chart-placeholder">
                    Charts will appear here after feedback is analyzed.
                  </div>
                </article>
              ),
            )}
          </section>
        )
      ) : null}

      {showTable ? (
        <section className="panel" aria-labelledby="table-title" ref={tableRef}>
          <div className="panel-header panel-header-row">
            <div>
              <h2 id="table-title">Analyzed feedback</h2>
              <p>
                {hasResults
                  ? `${visibleItems.length} of ${items.length} items shown.`
                  : 'Search and filters will apply to this list after analysis.'}
              </p>
            </div>
          </div>

          {hasResults ? (
            <>
              <FeedbackFilters
                category={category}
                sentiment={sentiment}
                priority={priority}
                onCategoryChange={setCategory}
                onSentimentChange={setSentiment}
                onPriorityChange={setPriority}
                onClear={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
              <FeedbackTable
                items={visibleItems}
                onSelect={setSelectedItem}
                showDate={items.some((item) => item.date || item.year)}
              />
            </>
          ) : (
            <EmptyState
              title="No feedback analyzed yet"
              description="Paste customer feedback or upload a CSV file to get started."
            />
          )}
        </section>
      ) : null}

      <FeedbackModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <Toast message={toast} />
    </div>
  )
}

export default Dashboard
