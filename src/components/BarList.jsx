function BarList({ rows, valueLabel, color = 'blue', maxValue }) {
  const maximum = maxValue ?? Math.max(0, ...rows.map((row) => row.value))

  return (
    <div className="bar-list">
      {rows.map((row) => {
        const width = maximum > 0 ? Math.max((row.value / maximum) * 100, row.value ? 1 : 0) : 0
        return (
          <div className="bar-row" key={row.label}>
            <div className="bar-name">{row.label}</div>
            <div className="bar-track" aria-label={`${row.label}: ${valueLabel(row.value)}`}>
              <div className={`bar-fill ${color}`} style={{ width: `${width}%` }} />
            </div>
            <div className="bar-value">{valueLabel(row.value)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default BarList
