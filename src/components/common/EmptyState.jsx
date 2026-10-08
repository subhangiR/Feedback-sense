function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 7h10M7 12h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
