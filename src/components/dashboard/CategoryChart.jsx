import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_COLORS } from '../../utils/feedbackUtils'

function CategoryChart({ data }) {
  return (
    <div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="chart-legend">
        {data.map((entry) => (
          <li key={entry.name}>
            <span style={{ background: CATEGORY_COLORS[entry.name] }} />
            {entry.name} ({entry.value})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryChart
