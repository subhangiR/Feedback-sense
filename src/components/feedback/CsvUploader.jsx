import { useRef, useState } from 'react'
import { getCsvErrorMessage, parseFeedbackFile } from '../../utils/csvParser'

function UploadIcon() {
  return (
    <span className="upload-icon" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 16V7M12 7 8.5 10.5M12 7l3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 16.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function CsvUploader({ fileName, recordCount, datedCount = 0, onLoaded, onError, onClear }) {
  const inputRef = useRef(null)
  const dragCountRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  async function processFile(file) {
    if (!file) {
      return
    }

    try {
      const result = await parseFeedbackFile(file)
      onLoaded({
        name: file.name,
        items: result.items,
      })
    } catch (error) {
      onError(getCsvErrorMessage(error.message))
    }
  }

  function resetDragState() {
    dragCountRef.current = 0
    setIsDragging(false)
  }

  function handleDragEnter(event) {
    event.preventDefault()
    dragCountRef.current += 1
    setIsDragging(true)
  }

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  function handleDragLeave(event) {
    event.preventDefault()
    dragCountRef.current -= 1
    if (dragCountRef.current <= 0) {
      resetDragState()
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    resetDragState()
    const file = event.dataTransfer.files?.[0]
    processFile(file)
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0]
    processFile(file)
    event.target.value = ''
  }

  const hasFile = Boolean(fileName)

  return (
    <div className="input-card">
      <h3>Upload a file</h3>
      <p className="upload-intro">Drop a file here so we can extract customer comments.</p>
      <div
        className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${hasFile ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!hasFile) {
            inputRef.current?.click()
          }
        }}
        onKeyDown={(event) => {
          if (!hasFile && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        role={hasFile ? undefined : 'button'}
        tabIndex={hasFile ? undefined : 0}
        aria-label={hasFile ? undefined : 'Upload a feedback file'}
      >
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          onChange={handleInputChange}
        />

        {hasFile ? (
          <>
            <UploadIcon />
            <p className="upload-filename">{fileName}</p>
            <p className="upload-count">
              {recordCount} feedback {recordCount === 1 ? 'record' : 'records'} ready
              {datedCount > 0 ? ` · ${datedCount} with dates` : ''}
            </p>
            <div className="upload-actions">
              <label
                htmlFor="file-upload"
                className="upload-button upload-button-ghost"
                onClick={(event) => event.stopPropagation()}
              >
                Replace file
              </label>
              <button type="button" className="upload-clear" onClick={onClear}>
                Remove
              </button>
            </div>
          </>
        ) : (
          <>
            <UploadIcon />
            <p className="upload-title">Drop your file here</p>
            <p className="upload-copy">CSV, TSV, or TXT — optional date or year column</p>
            <label
              htmlFor="file-upload"
              className="upload-button"
              onClick={(event) => event.stopPropagation()}
            >
              Choose file to upload
            </label>
          </>
        )}
      </div>
      <a className="sample-link" href="/sample-feedback.csv" download>
        Need an example? Download sample CSV
      </a>
      <a className="sample-link" href="/sample-history-feedback.csv" download>
        or multi-year sample
      </a>
      <a className="sample-link" href="/sample-feedback.txt" download>
        or sample TXT
      </a>
    </div>
  )
}

export default CsvUploader
