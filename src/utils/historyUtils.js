import { CATEGORIES, PRIORITIES, SENTIMENTS } from './feedbackUtils'

export function getImportYear(item) {
  if (!item?.analyzedAt) {
    return null
  }

  const year = Number(String(item.analyzedAt).slice(0, 4))
  return Number.isFinite(year) ? year : null
}

export function getItemYear(item) {
  if (typeof item?.year === 'number') {
    return item.year
  }

  return getImportYear(item)
}

export function getAvailableYears(items) {
  return [...new Set(items.map((item) => getItemYear(item)).filter((year) => typeof year === 'number'))].sort(
    (left, right) => left - right,
  )
}

export function getBatchYearOptions(currentYear = new Date().getFullYear()) {
  const start = 2018
  const years = []

  for (let year = currentYear; year >= start; year -= 1) {
    years.push(year)
  }

  return years
}

export function formatFeedbackDate(item) {
  if (item?.date) {
    return item.date
  }

  if (typeof item?.year === 'number') {
    return String(item.year)
  }

  const importedYear = getImportYear(item)
  if (importedYear) {
    return `Imported ${importedYear}`
  }

  return 'No date'
}

export function formatImportedOn(item) {
  if (!item?.analyzedAt) {
    return null
  }

  return String(item.analyzedAt).slice(0, 10)
}

export function sortHistoryItems(items) {
  return [...items].sort((left, right) => {
    const leftYear = getItemYear(left)
    const rightYear = getItemYear(right)

    if (leftYear && rightYear && leftYear !== rightYear) {
      return rightYear - leftYear
    }

    if (left.date && right.date && left.date !== right.date) {
      return left.date < right.date ? 1 : -1
    }

    if (left.analyzedAt && right.analyzedAt && left.analyzedAt !== right.analyzedAt) {
      return left.analyzedAt < right.analyzedAt ? 1 : -1
    }

    return 0
  })
}

export function filterHistory(
  items,
  { fromYear, toYear, category = 'All', sentiment = 'All', priority = 'All', search = '' },
) {
  const query = search.trim().toLowerCase()
  const hasYearRange = typeof fromYear === 'number' && typeof toYear === 'number'

  return items.filter((item) => {
    const matchesSearch = query.length === 0 || item.text.toLowerCase().includes(query)
    const matchesCategory = category === 'All' || item.category === category
    const matchesSentiment = sentiment === 'All' || item.sentiment === sentiment
    const matchesPriority = priority === 'All' || item.priority === priority
    const itemYear = getItemYear(item)
    const matchesYear = !hasYearRange
      ? true
      : typeof itemYear === 'number' && itemYear >= fromYear && itemYear <= toYear

    return matchesSearch && matchesCategory && matchesSentiment && matchesPriority && matchesYear
  })
}

export function getDatedItems(items) {
  return items.filter((item) => typeof getItemYear(item) === 'number')
}

export function getVolumeByYear(items, years) {
  return years.map((year) => ({
    year,
    total: items.filter((item) => getItemYear(item) === year).length,
  }))
}

export function getPriorityByYear(items, years) {
  return years.map((year) => {
    const yearItems = items.filter((item) => getItemYear(item) === year)
    const row = {
      year,
      total: yearItems.length,
    }

    PRIORITIES.forEach((priority) => {
      row[priority] = yearItems.filter((item) => item.priority === priority).length
    })

    return row
  })
}

export function getCategoryByYear(items, years) {
  return years.map((year) => {
    const yearItems = items.filter((item) => getItemYear(item) === year)
    const row = { year }

    CATEGORIES.forEach((category) => {
      row[category] = yearItems.filter((item) => item.category === category).length
    })

    return row
  })
}

export function getSentimentByYear(items, years) {
  return years.map((year) => {
    const yearItems = items.filter((item) => getItemYear(item) === year)
    const row = { year }

    SENTIMENTS.forEach((sentiment) => {
      row[sentiment] = yearItems.filter((item) => item.sentiment === sentiment).length
    })

    return row
  })
}

export function getTopCategories(items) {
  return CATEGORIES.map((category) => ({
    name: category,
    value: items.filter((item) => item.category === category).length,
  })).sort((left, right) => right.value - left.value)
}

export function countUndated(items) {
  return items.filter((item) => typeof getItemYear(item) !== 'number').length
}

export function buildHistoricalInsights(items) {
  const dated = getDatedItems(items)

  if (dated.length === 0) {
    return []
  }

  const years = getAvailableYears(dated)

  if (years.length === 1) {
    return [`All ${dated.length} dated records in this view are from ${years[0]}.`]
  }

  const insights = []
  const volume = getVolumeByYear(dated, years)
  const firstVolume = volume[0]
  const lastVolume = volume[volume.length - 1]

  if (lastVolume.total !== firstVolume.total) {
    const direction = lastVolume.total < firstVolume.total ? 'decreased' : 'increased'
    insights.push(
      `Feedback volume ${direction} from ${firstVolume.total} in ${firstVolume.year} to ${lastVolume.total} in ${lastVolume.year}.`,
    )
  }

  const highByYear = getPriorityByYear(dated, years)
  const firstHigh = highByYear[0]
  const lastHigh = highByYear[highByYear.length - 1]

  if (lastHigh.High !== firstHigh.High) {
    const direction = lastHigh.High < firstHigh.High ? 'decreased' : 'increased'
    insights.push(
      `High-priority feedback ${direction} from ${firstHigh.High} in ${firstHigh.year} to ${lastHigh.High} in ${lastHigh.year}.`,
    )
  }

  let largestCategoryShift = null

  CATEGORIES.forEach((category) => {
    const firstCount = dated.filter(
      (item) => getItemYear(item) === years[0] && item.category === category,
    ).length
    const lastCount = dated.filter(
      (item) => getItemYear(item) === years[years.length - 1] && item.category === category,
    ).length
    const delta = lastCount - firstCount

    if (delta === 0) {
      return
    }

    if (!largestCategoryShift || Math.abs(delta) > Math.abs(largestCategoryShift.delta)) {
      largestCategoryShift = {
        category,
        firstCount,
        lastCount,
        delta,
        fromYear: years[0],
        toYear: years[years.length - 1],
      }
    }
  })

  if (largestCategoryShift) {
    const direction = largestCategoryShift.delta > 0 ? 'increased' : 'decreased'
    insights.push(
      `${largestCategoryShift.category} feedback ${direction} from ${largestCategoryShift.firstCount} in ${largestCategoryShift.fromYear} to ${largestCategoryShift.lastCount} in ${largestCategoryShift.toYear}.`,
    )
  }

  const peak = volume.reduce((highest, current) => (current.total > highest.total ? current : highest))
  insights.push(`The highest feedback volume in this range was ${peak.total} in ${peak.year}.`)

  if (years.length >= 2) {
    const previousYear = years[years.length - 2]
    const currentYear = years[years.length - 1]
    let risingCategory = null

    CATEGORIES.forEach((category) => {
      const previousCount = dated.filter(
        (item) => getItemYear(item) === previousYear && item.category === category,
      ).length
      const currentCount = dated.filter(
        (item) => getItemYear(item) === currentYear && item.category === category,
      ).length
      const delta = currentCount - previousCount

      if (delta <= 0) {
        return
      }

      if (!risingCategory || delta > risingCategory.delta) {
        risingCategory = {
          category,
          previousCount,
          currentCount,
          delta,
          previousYear,
          currentYear,
        }
      }
    })

    if (risingCategory) {
      insights.push(
        `${risingCategory.category} feedback increased in ${risingCategory.currentYear} compared with ${risingCategory.previousYear} (${risingCategory.previousCount} to ${risingCategory.currentCount}).`,
      )
    }
  }

  return [...new Set(insights)].slice(0, 4)
}
