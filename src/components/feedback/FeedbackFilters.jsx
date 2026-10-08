import { CATEGORIES, PRIORITIES, SENTIMENTS } from '../../utils/feedbackUtils'

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <label className="filter-field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function FeedbackFilters({
  category,
  sentiment,
  priority,
  onCategoryChange,
  onSentimentChange,
  onPriorityChange,
  onClear,
  hasActiveFilters,
  showYearRange = false,
  years = [],
  fromYear,
  toYear,
  onFromYearChange,
  onToYearChange,
}) {
  const yearOptions = years.map(String)

  return (
    <div className="filters">
      {showYearRange && years.length > 0 ? (
        <>
          <FilterSelect
            id="filter-year-from"
            label="From year"
            value={String(fromYear)}
            onChange={onFromYearChange}
            options={yearOptions}
          />
          <FilterSelect
            id="filter-year-to"
            label="To year"
            value={String(toYear)}
            onChange={onToYearChange}
            options={yearOptions}
          />
        </>
      ) : null}
      <FilterSelect
        id="filter-category"
        label="Category"
        value={category}
        onChange={onCategoryChange}
        options={['All', ...CATEGORIES]}
      />
      <FilterSelect
        id="filter-sentiment"
        label="Sentiment"
        value={sentiment}
        onChange={onSentimentChange}
        options={['All', ...SENTIMENTS]}
      />
      <FilterSelect
        id="filter-priority"
        label="Priority"
        value={priority}
        onChange={onPriorityChange}
        options={['All', ...PRIORITIES]}
      />
      {hasActiveFilters ? (
        <button type="button" className="filter-clear" onClick={onClear}>
          Clear filters
        </button>
      ) : null}
    </div>
  )
}

export default FeedbackFilters
