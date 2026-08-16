import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from 'recharts'
  
  function BarChartCard({
    title,
    data,
    dataKey = 'value',
    labelKey = 'name',
    barColor = 'var(--accent)',
    valueFormatter,
  }) {
    return (
      <div className="chart-card">
        {title ? <h2>{title}</h2> : null}
  
        {!data?.length ? (
          <p className="chart-empty">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis
                dataKey={labelKey}
                tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'var(--chart-text)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-h)',
                }}
                formatter={(value) =>
                  valueFormatter ? valueFormatter(value) : value
                }
              />
              <Bar dataKey={dataKey} fill={barColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }
  
  export default BarChartCard