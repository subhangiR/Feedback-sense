import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import EmptyState from '../common/EmptyState'
import FeedbackFilters from '../feedback/FeedbackFilters'
import FeedbackModal from '../feedback/FeedbackModal'
import FeedbackTable from '../feedback/FeedbackTable'
import SummaryCards from '../dashboard/SummaryCards'
import { getSummaryMetrics } from '../../utils/feedbackUtils'
import {
  countUndated,
  filterHistory,
  getAvailableYears,
  sortHistoryItems,
} from '../../utils/historyUtils'
import '../dashboard/dashboard.css'

function FeedbackHistory({ searchQuery = '' }) {
  const historyItems = useSelector((state) => state.feedback.historyItems)
  const years = useMemo(() => getAvailableYears(historyItems), [historyItems])
  const [fromYear, setFromYear] = useState(years[0] ?? null)
  const [toYear, setToYear] = useState(years[years.length - 1] ?? null)
  const [category, setCategory] = useState('All')
  const [sentiment, setSentiment] = useState('All')
  const [priority, setPriority] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (years.length === 0) {
      setFromYear(null)
      setToYear(null)
      return
    }

    setFromYear((current) => (current == null || !years.includes(current) ? years[0] : current))
    setToYear((current) =>
      current == null || !years.includes(current) ? years[years.length - 1] : current,
    )
  }, [years])

  const hasActiveFilters =
    category !== 'All' ||
    sentiment !== 'All' ||
    priority !== 'All' ||
    (years.length > 0 && (fromYear !== years[0] || toYear !== years[years.length - 1]))

  const rangeFrom = fromYear <= toYear ? fromYear : toYear
  const rangeTo = fromYear <= toYear ? toYear : fromYear

  const visibleItems = useMemo(
    () =>
      sortHistoryItems(
        filterHistory(historyItems, {
          fromYear: rangeFrom,
          toYear: rangeTo,
          category,
          sentiment,
          priority,
          search: searchQuery,
        }),
      ),
    [historyItems, rangeFrom, rangeTo, category, sentiment, priority, searchQuery],
  )

  const metrics = useMemo(() => getSummaryMetrics(visibleItems), [visibleItems])
  const undatedCount = countUndated(historyItems)
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

  function handleClearFilters() {
    setCategory('All')
    setSentiment('All')
    setPriority('All')
    if (years.length > 0) {
      setFromYear(years[0])
      setToYear(years[years.length - 1])
    }
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
  }

  function handleFromYearChange(value) {
    const nextYear = Number(value)
    setFromYear(nextYear)
    if (typeof toYear === 'number' && nextYear > toYear) {
      setToYear(nextYear)
    }
  }

  function handleToYearChange(value) {
    const nextYear = Number(value)
    setToYear(nextYear)
    if (typeof fromYear === 'number' && nextYear < fromYear) {
      setFromYear(nextYear)
    }
  }

  if (historyItems.length === 0) {
    return (
      <div className="dashboard">
        <EmptyState
          title="No historical feedback yet"
          description="Analyze feedback from the dashboard to save it here. Use a date column or assign a batch year so you can compare results later."
        />
        <p className="sample-banner" role="status">
          Need dated example data? Download the multi-year sample CSV from Upload Feedback, then
          analyze it.
        </p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <section className="panel">
        <div className="panel-header">
          <h2>Feedback History</h2>
          <p>
            Previously analyzed feedback stays available after each upload. Filter by year,
            category, priority, and sentiment.
          </p>
        </div>
        <FeedbackFilters
          showYearRange
          years={years}
          fromYear={rangeFrom}
          toYear={rangeTo}
          category={category}
          sentiment={sentiment}
          priority={priority}
          onFromYearChange={handleFromYearChange}
          onToYearChange={handleToYearChange}
          onCategoryChange={setCategory}
          onSentimentChange={setSentiment}
          onPriorityChange={setPriority}
          onClear={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        {years.length > 0 ? (
          <p className="helper-text">
            {`Showing ${rangeFrom}–${rangeTo}${
              undatedCount > 0
                ? `. ${undatedCount} record${undatedCount === 1 ? '' : 's'} have no date and are hidden while a year range is selected.`
                : '.'
            }`}
          </p>
        ) : (
          <p className="helper-text">
            These records have no date yet. Assign a year on upload to compare them over time.
          </p>
        )}
      </section>

      <SummaryCards
        metrics={metrics}
        hasResults={visibleItems.length > 0}
        activeCardId={activeCardId}
        onCardClick={handleMetricClick}
      />

      <section className="panel">
        <div className="panel-header">
          <h2>Historical records</h2>
          <p>
            {visibleItems.length} of {historyItems.length} saved items shown.
          </p>
        </div>
        <FeedbackTable items={visibleItems} onSelect={setSelectedItem} showDate />
      </section>

      <FeedbackModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}

export default FeedbackHistory
