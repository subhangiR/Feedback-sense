import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { analyzeWithClaude } from './server/claudeAnalyze.js'

function analyzeApiPlugin() {
  return {
    name: 'analyze-feedback-api',
    configureServer(viteServer) {
      const env = loadEnv(viteServer.config.mode, process.cwd(), '')

      viteServer.middlewares.use('/api/analyze-feedback', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        try {
          const body = await readJsonBody(req)
          const payload = await analyzeWithClaude(body.feedbackItems, {
            ...process.env,
            ...env,
          })
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        } catch (error) {
          res.statusCode = error.status || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message || 'ANALYSIS_FAILED' }))
        }
      })
    },
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''

    req.on('data', (chunk) => {
      raw += chunk
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        reject(new Error('INVALID_BODY'))
      }
    })

    req.on('error', reject)
  })
}

export default defineConfig({
  plugins: [react(), analyzeApiPlugin()],
})
