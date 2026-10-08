import { useEffect, useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './layout.css'

function AppLayout({
  children,
  searchQuery,
  onSearchChange,
  activeSection,
  onSectionChange,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 960px)')

    const onChange = (event) => {
      if (event.matches) {
        setIsSidebarOpen(false)
      }
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function handleNavigate(sectionId) {
    onSectionChange(sectionId)
    setIsSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {isSidebarOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <Sidebar
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className="app-main">
        <Header
          isSidebarOpen={isSidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          activeSection={activeSection}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main id="main-content" className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
