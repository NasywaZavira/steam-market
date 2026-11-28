function MetricGrid({ items, className = '' }) {
  return (
    <div className={`metric-grid ${className}`}>
      {items.map((item) => (
        <article className="metric-card" key={item.label}>
          <div className="metric-label">{item.label}</div>
          <div className="metric-value">{item.value}</div>
          {item.note && <div className="metric-note">{item.note}</div>}
        </article>
      ))}
    </div>
  )
}

export default MetricGrid
