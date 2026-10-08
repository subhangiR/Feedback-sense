import { BADGE_TONES } from '../../utils/feedbackUtils'

function Badge({ children }) {
  const tone = BADGE_TONES[children] || 'neutral'

  return <span className={`badge badge-${tone}`}>{children}</span>
}

export default Badge
