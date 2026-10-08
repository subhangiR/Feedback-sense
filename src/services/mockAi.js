function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function classifyFeedback(text) {
  const value = text.toLowerCase()

  if (
    /crash|does not work|doesn't work|cannot reset|can't reset|broken|bug|safari|incomplete/.test(
      value,
    )
  ) {
    return {
      category: 'Bug',
      sentiment: 'Negative',
      priority: /search|incomplete/.test(value) ? 'Medium' : 'High',
      reason: /password/.test(value)
        ? 'Password reset failure locks users out of their accounts.'
        : /safari|mobile/.test(value)
          ? 'A broken mobile checkout path prevents customers from paying.'
          : /search|incomplete/.test(value)
            ? 'Incomplete search results reduce trust in the product.'
            : 'This issue can block customers from completing a core task.',
    }
  }

  if (/please add|can you add|would be helpful|export|dark mode|assign/.test(value)) {
    return {
      category: 'Feature Request',
      sentiment: 'Neutral',
      priority: 'Medium',
      reason: 'This is a useful product request, but it does not block current usage.',
    }
  }

  if (/love|fantastic|easy to use|quickly/.test(value)) {
    return {
      category: 'Praise',
      sentiment: 'Positive',
      priority: 'Low',
      reason: 'Positive feedback is worth tracking and does not need urgent action.',
    }
  }

  if (/support|three days|wait|slow|respond/.test(value)) {
    return {
      category: 'Complaint',
      sentiment: 'Negative',
      priority: 'High',
      reason: 'Slow support response can increase churn and should be reviewed quickly.',
    }
  }

  return {
    category: 'Complaint',
    sentiment: 'Neutral',
    priority: 'Medium',
    reason: 'This feedback needs a product review but is not clearly blocking.',
  }
}

export async function mockAnalyzeFeedback(feedbackItems) {
  await delay(900)

  return {
    results: feedbackItems.map((text, index) => {
      const classified = classifyFeedback(text)

      return {
        id: `feedback-${String(index + 1).padStart(3, '0')}`,
        text,
        ...classified,
      }
    }),
  }
}

