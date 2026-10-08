import { NAV_ITEMS } from '../../constants/navigation'

function NavIcon({ name }) {
  const icons = {
    dashboard: (
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
    feedback: (
      <>
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H9l-4 4v-4.2A2.5 2.5 0 0 1 5 13.5v-7Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M8.5 9h7M8.5 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    history: (
      <>
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8.5V12l2.5 1.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    trends: (
      <path
        d="M4 16.5 9 11l3.5 3.5L20 7M20 7h-4.5M20 7v4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    analytics: (
      <path d="M5 19V10M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    ),
    settings: (
      <path
        d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Zm7.2-3.2c0-.4 0-.7-.1-1l1.7-1.3-1.6-2.8-2 .5a6.8 6.8 0 0 0-1.7-1L15.2 4h-6.4l-.3 2.2a6.8 6.8 0 0 0-1.7 1l-2-.5-1.6 2.8L4.9 10.8c0 .4-.1.7-.1 1s0 .7.1 1L3.2 14.1l1.6 2.8 2-.5a6.8 6.8 0 0 0 1.7 1l.3 2.2h6.4l.3-2.2a6.8 6.8 0 0 0 1.7-1l2 .5 1.6-2.8-1.7-1.3c.1-.3.1-.6.1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function Sidebar({ isOpen, activeSection, onNavigate }) {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} id="app-sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          FS
        </span>
        <div>
          <p className="brand-name">FeedbackSense</p>
          <p className="brand-tagline">Customer intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeSection

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <NavIcon name={item.id} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <p className="sidebar-footnote">Turn customer feedback into actionable insights.</p>
    </aside>
  )
}

export default Sidebar
