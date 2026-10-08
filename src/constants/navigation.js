export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'feedback', label: 'Upload Feedback' },
  { id: 'history', label: 'Feedback History' },
  { id: 'trends', label: 'Feedback Trends' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

export const PAGE_META = {
  dashboard: {
    title: 'Feedback Intelligence',
    subtitle: 'Monitor issues, requests, and customer sentiment in one place.',
  },
  feedback: {
    title: 'Upload Feedback',
    subtitle: 'Paste comments, upload a CSV, and review analyzed items.',
  },
  history: {
    title: 'Feedback History',
    subtitle: 'Review previously analyzed feedback and filter it by year, category, and sentiment.',
  },
  trends: {
    title: 'Feedback Trends',
    subtitle: 'Compare stored feedback across years and see how issues changed over time.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'See category, sentiment, and priority across analyzed feedback.',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Workspace details, analysis mode, and data controls.',
  },
}
