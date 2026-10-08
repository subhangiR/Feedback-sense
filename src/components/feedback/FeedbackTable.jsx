import EmptyState from '../common/EmptyState'
import { formatFeedbackDate } from '../../utils/historyUtils'
import FeedbackRow from './FeedbackRow'

function FeedbackTable({ items, onSelect, showDate = false }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No matching feedback"
        description="Try a different search term or clear the filters."
      />
    )
  }

  return (
    <>
      <div className="table-scroll">
        <table className="feedback-table">
          <thead>
            <tr>
              {showDate ? <th>Date</th> : null}
              <th>Feedback</th>
              <th>Category</th>
              <th>Sentiment</th>
              <th>Priority</th>
              <th>AI Reason</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <FeedbackRow key={item.id} item={item} onSelect={onSelect} showDate={showDate} />
            ))}
          </tbody>
        </table>
      </div>

      <ul className="feedback-cards">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="feedback-card" onClick={() => onSelect(item)}>
              <p>{item.text}</p>
              <div className="feedback-card-meta">
                {showDate ? <span>{formatFeedbackDate(item)}</span> : null}
                <span>{item.category}</span>
                <span>{item.sentiment}</span>
                <span>{item.priority}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default FeedbackTable
