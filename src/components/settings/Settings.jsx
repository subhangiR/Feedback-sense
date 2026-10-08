import { useDispatch, useSelector } from 'react-redux'
import Button from '../common/Button'
import { clearFeedback, clearHistory } from '../../features/feedback/feedbackSlice'
import { isMockAiEnabled } from '../../services/aiService'
import '../dashboard/dashboard.css'

function Settings() {
  const dispatch = useDispatch()
  const { items, historyItems, isSampleData } = useSelector((state) => state.feedback)
  const mockEnabled = isMockAiEnabled()

  return (
    <div className="dashboard settings-page">
      <section className="panel">
        <div className="panel-header">
          <h2>Analysis mode</h2>
          <p>This workspace uses mock AI unless a server-side Claude key is configured.</p>
        </div>
        <div className="settings-row">
          <div>
            <strong>{mockEnabled ? 'Mock AI' : 'Claude API'}</strong>
            <p>
              {mockEnabled
                ? 'Feedback is classified locally so you can demo the product without an API key.'
                : 'Feedback is sent to /api/analyze-feedback. The API key stays on the server.'}
            </p>
          </div>
          <span className={`settings-pill ${mockEnabled ? 'is-mock' : 'is-live'}`}>
            {mockEnabled ? 'Demo mode' : 'Live mode'}
          </span>
        </div>
        <p className="settings-hint">
          To switch modes, change <code>VITE_USE_MOCK_AI</code> in your <code>.env</code> file
          and restart the app. Never put <code>ANTHROPIC_API_KEY</code> in frontend code.
        </p>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Workspace data</h2>
          <p>Clear the latest dashboard results or the saved history stored in this browser.</p>
        </div>
        <div className="settings-row">
          <div>
            <strong>{items.length} analyzed items</strong>
            <p>
              {isSampleData
                ? 'Sample insights are currently loaded.'
                : items.length === 0
                  ? 'No analyzed feedback is stored right now.'
                  : 'These results came from your latest analysis.'}
            </p>
          </div>
          <Button variant="ghost" disabled={items.length === 0} onClick={() => dispatch(clearFeedback())}>
            Clear results
          </Button>
        </div>
        <div className="settings-row">
          <div>
            <strong>{historyItems.length} saved history items</strong>
            <p>
              Historical analysis stays in this browser until you clear it. Dashboard Clear Results
              does not delete history.
            </p>
          </div>
          <Button variant="ghost" disabled={historyItems.length === 0} onClick={() => dispatch(clearHistory())}>
            Clear history
          </Button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Profile</h2>
          <p>A placeholder user for this frontend demo.</p>
        </div>
        <div className="settings-row">
          <div className="user-chip">
            <span className="avatar" aria-hidden="true">
              JL
            </span>
            <span className="user-meta">
              <strong>Jordan Lee</strong>
              <small>Product Manager</small>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Settings
