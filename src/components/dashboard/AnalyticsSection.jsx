import ErrorBoundary from '../common/ErrorBoundary'
import CategoryChart from './CategoryChart'
import PriorityChart from './PriorityChart'
import SentimentChart from './SentimentChart'

function AnalyticsSection({ categoryData, sentimentData, priorityData }) {
  return (
    <section className="analytics-grid" aria-label="Feedback analytics">
      <article className="panel">
        <div className="panel-header">
          <h2>Category Distribution</h2>
          <p>Bugs, requests, praise, and complaints.</p>
        </div>
        <ErrorBoundary>
          <CategoryChart data={categoryData} />
        </ErrorBoundary>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Sentiment Distribution</h2>
          <p>Positive, neutral, and negative feedback.</p>
        </div>
        <ErrorBoundary>
          <SentimentChart data={sentimentData} />
        </ErrorBoundary>
      </article>

      <article className="panel">
        <div className="panel-header">
          <h2>Priority Distribution</h2>
          <p>High, medium, and low urgency.</p>
        </div>
        <ErrorBoundary>
          <PriorityChart data={priorityData} />
        </ErrorBoundary>
      </article>
    </section>
  )
}

export default AnalyticsSection
