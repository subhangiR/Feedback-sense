function HistoricalInsight({ insights }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>AI Historical Insight</h2>
        <p>These summaries are generated only from the stored feedback in the selected range.</p>
      </div>
      {insights.length === 0 ? (
        <p className="helper-text">
          Analyze dated feedback to see trend summaries. Insights are not generated when there is
          not enough stored data.
        </p>
      ) : (
        <ul className="insight-list">
          {insights.map((insight) => (
            <li key={insight} className="insight-item">
              {insight}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default HistoricalInsight
