function ComparisonTable({ rows, category }) {
  const priorityLabel = category === 'All' ? 'High priority' : `High-priority ${category}`

  return (
    <div className="table-scroll">
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>{priorityLabel}</th>
            <th>Total feedback</th>
            <th>Medium</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.year}>
              <td>{row.year}</td>
              <td>{row.High}</td>
              <td>{row.total}</td>
              <td>{row.Medium}</td>
              <td>{row.Low}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable
