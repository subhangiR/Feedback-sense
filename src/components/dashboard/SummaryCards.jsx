function MetricIcon({ name }) {
  const icons = {
    total: (
      <path
        d="M5 7.2A2.2 2.2 0 0 1 7.2 5h9.6A2.2 2.2 0 0 1 19 7.2v6.1A2.2 2.2 0 0 1 16.8 15.5H9.2L5 19v-11.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    high: (
      <path d="M12 5v8M12 19h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    ),
    negative: (
      <path
        d="M8.5 15c.8-1 1.8-1.5 3.5-1.5s2.7.5 3.5 1.5M9 10h.01M15 10h.01M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
    features: (
      <>
        <path
          d="M9 17h6M10 20h4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M12 3.5a5.2 5.2 0 0 0-3.1 9.4c.4.3.6.8.6 1.3V15h5v-.8c0-.5.2-1 .6-1.3A5.2 5.2 0 0 0 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </>
    ),
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function SummaryCards({ metrics, hasResults, activeCardId, onCardClick }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Feedback',
      value: hasResults ? metrics.total : '—',
      hint: hasResults ? 'Click to view all items' : 'Analyze feedback to populate this metric',
    },
    {
      id: 'high',
      label: 'High Priority',
      value: hasResults ? metrics.highPriority : '—',
      hint: hasResults ? 'Click to view high-priority items' : 'Urgent issues will appear here',
    },
    {
      id: 'negative',
      label: 'Negative Sentiment',
      value: hasResults ? metrics.negative : '—',
      hint: hasResults ? 'Click to view negative feedback' : 'Track unhappy customers at a glance',
    },
    {
      id: 'features',
      label: 'Feature Requests',
      value: hasResults ? metrics.featureRequests : '—',
      hint: hasResults ? 'Click to view feature requests' : 'Product ideas grouped after analysis',
    },
  ]

  return (
    <section className="summary-grid" aria-label="Feedback summary">
      {cards.map((metric) => {
        const isActive = hasResults && activeCardId === metric.id
        const className = `summary-card${hasResults ? ' is-clickable' : ''}${isActive ? ' is-active' : ''}`

        if (!hasResults) {
          return (
            <article key={metric.id} className="summary-card">
              <span className="summary-icon">
                <MetricIcon name={metric.id} />
              </span>
              <p className="summary-value">{metric.value}</p>
              <h3>{metric.label}</h3>
              <p className="summary-hint">{metric.hint}</p>
            </article>
          )
        }

        return (
          <button
            key={metric.id}
            type="button"
            className={className}
            aria-pressed={isActive}
            onClick={() => onCardClick(metric.id)}
          >
            <span className="summary-icon">
              <MetricIcon name={metric.id} />
            </span>
            <p className="summary-value">{metric.value}</p>
            <h3>{metric.label}</h3>
            <p className="summary-hint">{metric.hint}</p>
          </button>
        )
      })}
    </section>
  )
}

export default SummaryCards
