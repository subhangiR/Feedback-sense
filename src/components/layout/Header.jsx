import { PAGE_META } from '../../constants/navigation'

function Header({
  onMenuClick,
  isSidebarOpen,
  searchQuery = '',
  onSearchChange,
  activeSection = 'dashboard',
}) {
  const page = PAGE_META[activeSection] ?? PAGE_META.dashboard
  const showSearch =
    activeSection === 'dashboard' ||
    activeSection === 'feedback' ||
    activeSection === 'analytics' ||
    activeSection === 'history'

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-button"
          aria-label="Open navigation"
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          onClick={onMenuClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div>
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
        </div>
      </div>

      {showSearch ? (
        <form className="header-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="feedback-search" className="visually-hidden">
            Search feedback
          </label>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            id="feedback-search"
            type="search"
            placeholder="Search feedback"
            autoComplete="off"
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </form>
      ) : (
        <div className="header-search-spacer" />
      )}

      <div className="header-right">
        <button type="button" className="btn-icon" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 9a6 6 0 1 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <div className="user-chip" title="Jordan Lee, Product Manager">
          <span className="avatar" aria-hidden="true">
            JL
          </span>
          <span className="user-meta">
            <strong>Jordan Lee</strong>
            <small>Product Manager</small>
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
