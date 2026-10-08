import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  PRIORITY_COLORS,
  SENTIMENT_COLORS,
  SENTIMENTS,
} from '../../utils/feedbackUtils'

function ChartPanel({ title, description, children }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </article>
  )
}

function TrendCharts({ volumeData, priorityData, categoryData, sentimentData, topCategories }) {
  return (
    <section className="trends-grid" aria-label="Feedback trends">
      <ChartPanel title="Feedback volume by year" description="How many comments were stored in each year.">
        <div className="chart-box trend-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="total" name="Feedback" stroke="#0f766e" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel title="Priority by year" description="High, medium, and low priority volume over time.">
        <div className="chart-box trend-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="High" fill={PRIORITY_COLORS.High} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Medium" fill={PRIORITY_COLORS.Medium} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Low" fill={PRIORITY_COLORS.Low} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Category distribution by year"
        description="How issue types changed across the selected years."
      >
        <div className="chart-box trend-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              {CATEGORIES.map((category) => (
                <Bar key={category} dataKey={category} fill={CATEGORY_COLORS[category]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel title="Sentiment by year" description="Positive, neutral, and negative comments over time.">
        <div className="chart-box trend-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sentimentData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip />
              <Legend />
              {SENTIMENTS.map((sentiment) => (
                <Bar key={sentiment} dataKey={sentiment} fill={SENTIMENT_COLORS[sentiment]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>

      <ChartPanel
        title="Top recurring categories"
        description="Which categories appear most often in the selected range."
      >
        <div className="chart-box trend-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCategories} layout="vertical" margin={{ top: 8, right: 12, left: 24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={110} />
              <Tooltip />
              <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]}>
                {topCategories.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartPanel>
    </section>
  )
}

export default TrendCharts
