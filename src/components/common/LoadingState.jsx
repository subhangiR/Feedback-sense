function LoadingState({ message = 'AI is analyzing your feedback...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
