import Papa from 'papaparse'

export const CSV_ERROR = {
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_CSV: 'INVALID_CSV',
  MISSING_FEEDBACK_COLUMN: 'MISSING_FEEDBACK_COLUMN',
  EMPTY_CSV: 'EMPTY_CSV',
}

const DATE_HEADER_NAMES = new Set(['date', 'year', 'created', 'created_at', 'timestamp', 'feedback_date'])
const TEXT_HEADER_NAMES = ['feedback', 'comment', 'comments', 'text', 'message']

export function getCsvErrorMessage(code) {
  switch (code) {
    case CSV_ERROR.INVALID_TYPE:
      return 'Please upload a CSV, TSV, or TXT file with customer comments.'
    case CSV_ERROR.MISSING_FEEDBACK_COLUMN:
      return 'We could not find feedback text in that file. Use a feedback column, or one comment per line.'
    case CSV_ERROR.EMPTY_CSV:
      return 'No feedback rows were found in that file.'
    default:
      return 'We could not read that file. Try a CSV or TXT file instead.'
  }
}

export function isUnsupportedFile(file) {
  const fileName = file?.name?.toLowerCase() ?? ''
  const fileType = file?.type ?? ''

  return (
    fileType.startsWith('image/') ||
    fileType.startsWith('audio/') ||
    fileType.startsWith('video/') ||
    fileType === 'application/pdf' ||
    fileName.endsWith('.pdf') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.gif') ||
    fileName.endsWith('.webp') ||
    fileName.endsWith('.xlsx') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx') ||
    fileName.endsWith('.zip')
  )
}

export function parseFeedbackDate(value) {
  if (value === null || value === undefined) {
    return { date: null, year: null }
  }

  const trimmed = String(value).trim()

  if (!trimmed) {
    return { date: null, year: null }
  }

  if (/^(19|20)\d{2}$/.test(trimmed)) {
    return { date: null, year: Number(trimmed) }
  }

  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    return { date: `${iso[1]}-${iso[2]}-${iso[3]}`, year: Number(iso[1]) }
  }

  const yearFirst = trimmed.match(/^(\d{4})[/.](\d{1,2})[/.](\d{1,2})/)
  if (yearFirst) {
    const year = Number(yearFirst[1])
    const month = String(yearFirst[2]).padStart(2, '0')
    const day = String(yearFirst[3]).padStart(2, '0')
    return { date: `${year}-${month}-${day}`, year }
  }

  const monthFirst = trimmed.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/)
  if (monthFirst) {
    const year = Number(monthFirst[3])
    if (year >= 1990 && year <= 2100) {
      const month = String(monthFirst[1]).padStart(2, '0')
      const day = String(monthFirst[2]).padStart(2, '0')
      return { date: `${year}-${month}-${day}`, year }
    }
  }

  return { date: null, year: null }
}

export function looksLikeFeedbackTable(text) {
  const firstLine = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .find((line) => line.trim())

  if (!firstLine) {
    return false
  }

  const cells = firstLine.split(/,|\t/).map((cell) => cell.trim().toLowerCase().replace(/^"|"$/g, ''))
  return cells.includes('feedback') || (cells.includes('date') && cells.length >= 2)
}

export function parseLineRecord(line, fallbackYear = null) {
  const trimmed = String(line || '')
    .replace(/^\uFEFF/, '')
    .trim()

  if (!trimmed) {
    return null
  }

  const headerCells = trimmed.split(/,|\t/).map((cell) => cell.trim().toLowerCase().replace(/^"|"$/g, ''))
  if (headerCells.includes('date') && headerCells.includes('feedback') && headerCells.length <= 4) {
    return null
  }

  const csvLike = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s*[,;\t]\s*(.*)$/)
  if (csvLike) {
    let text = csvLike[2].trim()
    if (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      text = text.slice(1, -1).replace(/""/g, '"')
    }

    return {
      text,
      date: csvLike[1],
      year: Number(csvLike[1].slice(0, 4)),
      source: null,
    }
  }

  return {
    text: trimmed,
    date: null,
    year: fallbackYear,
    source: null,
  }
}

export function toFeedbackRecord(item, fallbackYear = null) {
  if (typeof item === 'string') {
    return parseLineRecord(item, fallbackYear) ?? {
      text: '',
      date: null,
      year: fallbackYear,
      source: null,
    }
  }

  const parsedFromText = parseLineRecord(item?.text, fallbackYear)
  const parsed = parseFeedbackDate(item?.date)

  return {
    text: parsed.date ? (item?.text?.trim() ?? '') : parsedFromText?.text ?? item?.text?.trim() ?? '',
    date: parsed.date ?? parsedFromText?.date ?? null,
    year: parsed.year ?? item?.year ?? parsedFromText?.year ?? fallbackYear,
    source: item?.source || null,
  }
}

function extractItemsFromTable(results) {
  const headers = results.meta?.fields ?? []
  const normalized = headers.map((header) => header.toLowerCase())
  const feedbackKey =
    headers.find((_, index) => TEXT_HEADER_NAMES.includes(normalized[index])) ??
    headers.find((_, index) => !DATE_HEADER_NAMES.has(normalized[index])) ??
    headers[0]
  const dateKey = headers.find((_, index) => DATE_HEADER_NAMES.has(normalized[index]))

  if (!feedbackKey) {
    return []
  }

  return results.data
    .map((row) => {
      const text = row[feedbackKey]?.trim()
      if (!text) {
        return null
      }

      const parsed = parseFeedbackDate(dateKey ? row[dateKey] : null)
      return {
        text,
        date: parsed.date,
        year: parsed.year,
      }
    })
    .filter(Boolean)
}

export function parseFeedbackCsv(source) {
  return new Promise((resolve, reject) => {
    Papa.parse(String(source).replace(/^\uFEFF/, ''), {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.replace(/^\uFEFF/, '').trim(),
      complete: (results) => {
        const items = extractItemsFromTable(results)

        if (items.length === 0) {
          reject(new Error(CSV_ERROR.EMPTY_CSV))
          return
        }

        resolve({
          items,
          rowCount: items.length,
          datedCount: items.filter((item) => typeof item.year === 'number').length,
        })
      },
      error: () => {
        reject(new Error(CSV_ERROR.INVALID_CSV))
      },
    })
  })
}

function shouldParseAsTable(fileName, text) {
  if (looksLikeFeedbackTable(text)) {
    return true
  }

  return fileName.endsWith('.csv') || fileName.endsWith('.tsv')
}

export async function parseFeedbackFile(file) {
  if (!file) {
    throw new Error(CSV_ERROR.INVALID_TYPE)
  }

  if (isUnsupportedFile(file)) {
    throw new Error(CSV_ERROR.INVALID_TYPE)
  }

  const text = (await file.text()).replace(/^\uFEFF/, '')
  const fileName = file.name.toLowerCase()

  if (!text.trim()) {
    throw new Error(CSV_ERROR.EMPTY_CSV)
  }

  if (shouldParseAsTable(fileName, text)) {
    return parseFeedbackCsv(text)
  }

  const items = text
    .split(/\r?\n/)
    .map((line) => parseLineRecord(line))
    .filter(Boolean)

  if (items.length === 0) {
    throw new Error(CSV_ERROR.EMPTY_CSV)
  }

  return {
    items,
    rowCount: items.length,
    datedCount: items.filter((item) => typeof item.year === 'number').length,
  }
}
