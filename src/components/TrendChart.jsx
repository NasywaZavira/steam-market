function TrendChart({ data, valueKey, label, formatValue, type = 'bar', color = '#2a78d6' }) {
  const width = 760
  const height = 230
  const margin = { top: 14, right: 12, bottom: 32, left: 62 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const rawMaximum = Math.max(0, ...data.map((item) => item[valueKey]))
  const magnitude = 10 ** Math.floor(Math.log10(rawMaximum || 1))
  const maximum = rawMaximum
    ? [1, 2, 2.5, 5, 10].map((step) => step * magnitude).find((step) => step >= rawMaximum) ?? 10 * magnitude
    : 1
  const x = (index) => margin.left + innerWidth * (index + 0.5) / data.length
  const y = (value) => margin.top + innerHeight * (1 - value / maximum)
  const step = Math.max(1, Math.ceil(data.length / 12))

  return (
    <div className="chart-scroll">
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const position = margin.top + innerHeight * (1 - fraction)
          return (
            <g key={fraction}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={position}
                y2={position}
                className="chart-gridline"
              />
              <text x={margin.left - 8} y={position + 4} textAnchor="end" className="chart-label">
                {formatValue(maximum * fraction)}
              </text>
            </g>
          )
        })}
        {type === 'bar' ? (
          data.map((item, index) => {
            const barWidth = Math.max(4, Math.min(24, innerWidth / data.length * 0.68))
            return (
              <g key={item.year}>
                <rect
                  x={x(index) - barWidth / 2}
                  y={y(item[valueKey])}
                  width={barWidth}
                  height={Math.max(0, margin.top + innerHeight - y(item[valueKey]))}
                  rx="3"
                  fill={color}
                  opacity={item.year === 2026 ? 0.42 : 0.9}
                >
                  <title>{`${item.year}: ${formatValue(item[valueKey])}`}</title>
                </rect>
                {index % step === 0 && (
                  <text x={x(index)} y={height - 8} textAnchor="middle" className="chart-label">
                    {item.year}{item.year === 2026 ? '*' : ''}
                  </text>
                )}
              </g>
            )
          })
        ) : (
          <>
            <polyline
              points={data.map((item, index) => `${x(index)},${y(item[valueKey])}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((item, index) => (
              <g key={item.year}>
                <circle cx={x(index)} cy={y(item[valueKey])} r="3.5" fill={color}>
                  <title>{`${item.year}: ${formatValue(item[valueKey])}`}</title>
                </circle>
                {index % step === 0 && (
                  <text x={x(index)} y={height - 8} textAnchor="middle" className="chart-label">
                    {item.year}{item.year === 2026 ? '*' : ''}
                  </text>
                )}
              </g>
            ))}
          </>
        )}
      </svg>
    </div>
  )
}

export default TrendChart
