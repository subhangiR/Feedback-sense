import Badge from '../common/Badge'
import { formatFeedbackDate } from '../../utils/historyUtils'

function FeedbackRow({ item, onSelect, showDate = false }) {
  return (
    <tr>
      {showDate ? <td className="date-cell">{formatFeedbackDate(item)}</td> : null}
      <td>
        <button type="button" className="row-button" onClick={() => onSelect(item)}>
          <span className="feedback-text">{item.text}</span>
        </button>
      </td>
      <td>
        <Badge>{item.category}</Badge>
      </td>
      <td>
        <Badge>{item.sentiment}</Badge>
      </td>
      <td>
        <Badge>{item.priority}</Badge>
      </td>
      <td className="reason-cell">{item.reason}</td>
    </tr>
  )
}

export default FeedbackRow
