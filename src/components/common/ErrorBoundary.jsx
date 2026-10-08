import { Component } from 'react'
import EmptyState from './EmptyState'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          title="This section could not be displayed"
          description="The rest of the dashboard is still available. Refresh the page to try again."
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
