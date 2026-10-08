import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import EmptyState from '../common/EmptyState'
import FeedbackFilters from '../feedback/FeedbackFilters'
import {
  buildHistoricalInsights,
  filterHistory,
  getAvailableYears,
  getCategoryByYear,
  getDatedItems,
  getPriorityByYear,
  getSentimentByYear,
  getTopCategories,
  getVolumeByYear,
} from '../../utils/historyUtils'
import ComparisonTable from './ComparisonTable'
import HistoricalInsight from './HistoricalInsight'
import TrendCharts from './TrendCharts'
import '../dashboard/dashboard.css'

function FeedbackTrends() {
  const historyItems = useSelector((state) => state.feedback.historyItems)
  const datedItems = useMemo(() => getDatedItems(historyItems), [historyItems])
  const years = useMemo(() => getAvailableYears(datedItems), [datedItems])
  const [fromYear, setFromYear] = useState(years[0] ?? null)
  const [toYear, setToYear] = useState(years[years.length - 1] ?? null)
  const [category, setCategory] = useState('All')
  const [sentiment, setSentiment] = useState('All')
  const [priority, setPriority] = useState('All')

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

  const rangeFrom = fromYear <= toYear ? fromYear : toYear
  const rangeTo = fromYear <= toYear ? toYear : fromYear
  const selectedYears = years.filter((year) => year >= rangeFrom && year <= rangeTo)

  const visibleItems = useMemo(
    () =>
      filterHistory(datedItems, {
        fromYear: rangeFrom,
        toYear: rangeTo,
        category,
        sentiment,
        priority,
      }),
    [datedItems, rangeFrom, rangeTo, category, sentiment, priority],
  )

  const volumeData = useMemo(() => getVolumeByYear(visibleItems, selectedYears), [visibleItems, selectedYears])
  const priorityData = useMemo(
    () => getPriorityByYear(visibleItems, selectedYears),
    [visibleItems, selectedYears],
  )
  const categoryData = useMemo(
    () => getCategoryByYear(visibleItems, selectedYears),
    [visibleItems, selectedYears],
  )
  const sentimentData = useMemo(
    () => getSentimentByYear(visibleItems, selectedYears),
    [visibleItems, selectedYears],
  )
  const topCategories = useMemo(() => getTopCategories(visibleItems), [visibleItems])
  const insights = useMemo(() => buildHistoricalInsights(visibleItems), [visibleItems])

  const hasActiveFilters =
    category !== 'All' ||
    sentiment !== 'All' ||
    priority !== 'All' ||
    (years.length > 0 && (rangeFrom !== years[0] || rangeTo !== years[years.length - 1]))

  function handleClearFilters() {
    setCategory('All')
    setSentiment('All')
    setPriority('All')
    if (years.length > 0) {
      setFromYear(years[0])
      setToYear(years[years.length - 1])
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

  if (datedItems.length === 0) {
    return (
      <div className="dashboard">
        <EmptyState
          title="No dated history to compare"
          description="Analyze feedback to save it here. File dates, the selected batch year, or the import year are used so Trends can compare later."
        />
      </div>
    )
  }

  return (
    <div className="dashboard">
      <section className="panel">
        <div className="panel-header">
          <h2>Feedback Trends</h2>
          <p>
            Compare stored feedback across years. Filter to a category such as Complaint or Bug to
            see how that issue changed over time.
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
        <p className="helper-text">
          {`Comparing ${rangeFrom}–${rangeTo}${category === 'All' ? '' : ` for ${category}`}. ${visibleItems.length} dated records match the current filters.`}
        </p>
      </section>

      <HistoricalInsight insights={insights} />

      <section className="panel">
        <div className="panel-header">
          <h2>Year comparison</h2>
          <p>
            {category === 'All'
              ? 'High-priority volume across the selected years.'
              : `High-priority ${category} volume across the selected years.`}
          </p>
        </div>
        <ComparisonTable rows={priorityData} category={category} />
      </section>

      <TrendCharts
        volumeData={volumeData}
        priorityData={priorityData}
        categoryData={categoryData}
        sentimentData={sentimentData}
        topCategories={topCategories}
      />
    </div>
  )
}

export default FeedbackTrends
