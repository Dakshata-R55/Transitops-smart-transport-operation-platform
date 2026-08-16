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
    barColor = '#2563eb',
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={labelKey}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip
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