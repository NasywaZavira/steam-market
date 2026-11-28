import { useMemo, useState } from 'react'
import { genres } from '../data/dashboard.js'
import { formatNumber, formatPercent, formatUsd, formatUsdMillions } from '../lib/format.js'
import BarList from '../components/BarList.jsx'
import DataTable from '../components/DataTable.jsx'
import Panel from '../components/Panel.jsx'

const metrics = [
  { key: 'revenue', label: 'Total estimated revenue', format: formatUsdMillions },
  { key: 'revenuePerGame', label: 'Revenue per game', format: formatUsd },
  { key: 'medianRevenue', label: 'Median revenue per game', format: formatUsd },
  { key: 'success', label: 'Success rate', format: (value) => formatPercent(value, 0) },
  { key: 'positive', label: 'Median positive review ratio', format: (value) => formatPercent(value, 0) },
  { key: 'count', label: 'Number of games', format: formatNumber },
]

const columns = [
  { key: 'name', label: 'Genre' },
  { key: 'count', label: 'Games', render: (genre) => formatNumber(genre.count) },
  { key: 'revenue', label: 'Total revenue', render: (genre) => formatUsdMillions(genre.revenue) },
  { key: 'revenuePerGame', label: 'Revenue per game', render: (genre) => formatUsd(genre.revenuePerGame) },
  { key: 'medianRevenue', label: 'Median revenue', render: (genre) => formatUsd(genre.medianRevenue) },
  { key: 'success', label: 'Success rate', render: (genre) => formatPercent(genre.success, 0) },
  { key: 'positive', label: 'Positive review ratio', render: (genre) => formatPercent(genre.positive, 0) },
]

function GenreMarket() {
  const [metricKey, setMetricKey] = useState('revenue')
  const metric = metrics.find((option) => option.key === metricKey)
  const sortedGenres = useMemo(
    () => [...genres].sort((a, b) => b[metricKey] - a[metricKey]),
    [metricKey],
  )

  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">MARKET: GENRE</p>
        <h1>Genre comparison</h1>
        <p>The 12 genres with the highest estimated revenue. A game can belong to multiple genres, so genre totals should not be added together.</p>
      </div>
      <Panel
        title="Genre performance"
        description="Choose a metric to rank the comparison. Revenue is estimated in millions of US dollars."
        className="chart-panel"
      >
        <label className="field compact-field">
          <span>Sort by</span>
          <select value={metricKey} onChange={(event) => setMetricKey(event.target.value)}>
            {metrics.map((option) => <option value={option.key} key={option.key}>{option.label}</option>)}
          </select>
        </label>
        <BarList
          rows={sortedGenres.map((genre) => ({ label: genre.name, value: genre[metricKey] }))}
          valueLabel={metric.format}
        />
      </Panel>
      <Panel title="Full genre table">
        <DataTable columns={columns} rows={genres} rowKey="name" />
      </Panel>
    </>
  )
}

export default GenreMarket
