function Panel({ title, description, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || description) && (
        <div className="panel-heading">
          {title && <h2>{title}</h2>}
          {description && <p className="muted">{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export default Panel
