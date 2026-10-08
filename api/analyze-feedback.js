import { analyzeWithClaude } from '../server/claudeAnalyze.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const payload = await analyzeWithClaude(req.body?.feedbackItems, process.env)
    res.status(200).json(payload)
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || 'ANALYSIS_FAILED',
    })
  }
}
