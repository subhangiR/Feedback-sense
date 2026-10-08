# FeedbackSense

Turn customer feedback into actionable insights.

FeedbackSense is an AI-powered dashboard that helps product and support teams categorize customer feedback, score sentiment and priority, and spot issues without reading every comment by hand.

## Problem

Product and support teams receive large amounts of unstructured feedback. Manually tagging every item is slow, and important bugs, complaints, and feature requests are easy to miss.

## Solution

Users paste comments or upload a CSV. FeedbackSense sends that text to Claude (or a mock AI in development). Each item is returned as structured JSON with a category, sentiment, priority, and short reason. The dashboard then updates summary cards, charts, and a searchable table from that single Redux store.

## Features

- Paste multiple feedback items or upload a CSV
- Mock AI mode for local demos without an API key
- Claude analysis through a server-side `/api/analyze-feedback` endpoint
- Summary cards for total, high priority, negative sentiment, and feature requests
- Category, sentiment, and priority charts
- Search, combined filters, and a feedback detail modal
- Loading, error, and empty states
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- React
- JavaScript
- Vite
- Redux Toolkit
- Recharts
- Claude API
- Papa Parse
- Axios

## Architecture

```
User input (paste or CSV)
  → validation
  → aiService (mock AI or /api/analyze-feedback)
  → structured JSON
  → Redux feedback slice
  → dashboard (cards, charts, table)
```

Search, filters, and the modal stay in local React state because they are UI concerns. Analyzed feedback lives in Redux because many widgets need the same source of truth.

## AI Integration

`src/services/aiService.js` is the only place the UI talks to AI.

- If `VITE_USE_MOCK_AI` is `true`, the app classifies feedback locally after a short delay.
- If mock mode is off, the frontend posts to `/api/analyze-feedback`.
- The server calls Claude with a strict JSON schema and never exposes `ANTHROPIC_API_KEY` to the browser.
- Every response is validated for required fields and allowed enum values before it is stored.

## Security

The Claude API key is server-side only. Vite only exposes variables prefixed with `VITE_` to client code, so `ANTHROPIC_API_KEY` is never bundled into the frontend.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/).

## Mock Mode

`.env` includes:

```bash
VITE_USE_MOCK_AI=true
ANTHROPIC_API_KEY=
```

With mock mode on, the dashboard loads sample insights immediately. You can still paste text or upload `public/sample-feedback.csv`, then click **Analyze Feedback** to replace the demo data.

To use Claude instead:

```bash
VITE_USE_MOCK_AI=false
ANTHROPIC_API_KEY=your_key_here
```

## Deployment

The app is a Vite SPA with a Vercel serverless function at `api/analyze-feedback.js`.

1. Set `ANTHROPIC_API_KEY` in the host environment.
2. Set `VITE_USE_MOCK_AI=false` for production analysis, or keep it `true` for a demo.
3. Deploy to Vercel. Netlify can use the same React build; add an equivalent serverless function if you are not using Vercel.

## Future Improvements

- Authentication
- Persistent database
- Team collaboration
- Feedback history
- Export reports
- Pagination
- Role-based access
- Advanced AI insights
