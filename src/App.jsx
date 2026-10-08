import { useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './components/dashboard/Dashboard'
import FeedbackHistory from './components/history/FeedbackHistory'
import Settings from './components/settings/Settings'
import FeedbackTrends from './components/trends/FeedbackTrends'

const DASHBOARD_SECTIONS = ['dashboard', 'feedback', 'analytics']

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <AppLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div hidden={!DASHBOARD_SECTIONS.includes(activeSection)}>
        <Dashboard
          searchQuery={searchQuery}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
      {activeSection === 'history' ? <FeedbackHistory searchQuery={searchQuery} /> : null}
      {activeSection === 'trends' ? <FeedbackTrends /> : null}
      {activeSection === 'settings' ? <Settings /> : null}
    </AppLayout>
  )
}

export default App
