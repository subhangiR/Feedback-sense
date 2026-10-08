import { useEffect, useRef } from 'react'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { formatFeedbackDate, formatImportedOn } from '../../utils/historyUtils'

function FeedbackModal({ item, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!item) {
      return undefined
    }

    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [item, onClose])

  if (!item) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="feedback-modal-title">Feedback detail</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-icon"
            aria-label="Close feedback detail"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="modal-text">{item.text}</p>
        <div className="modal-meta">
          <span>Date: {formatFeedbackDate(item)}</span>
          {formatImportedOn(item) ? <span>Imported: {formatImportedOn(item)}</span> : null}
          {item.source ? <span>Source: {item.source}</span> : null}
        </div>
        <div className="modal-badges">
          <Badge>{item.category}</Badge>
          <Badge>{item.sentiment}</Badge>
          <Badge>{item.priority}</Badge>
        </div>
        <p className="modal-reason">
          <strong>AI reason</strong>
          {item.reason}
        </p>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}

export default FeedbackModal
