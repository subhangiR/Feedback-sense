function FeedbackInput({ value, onChange }) {
  return (
    <div className="input-card">
      <h3>Paste feedback</h3>
      <label htmlFor="feedback-paste" className="visually-hidden">
        Customer feedback
      </label>
      <textarea
        id="feedback-paste"
        rows="7"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`The checkout page crashes when applying coupons.\nPlease add dark mode.\nThe new dashboard is really easy to use.\nSupport took three days to respond.`}
      />
    </div>
  )
}

export default FeedbackInput
