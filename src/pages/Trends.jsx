import { useMemo, useState } from 'react'
import { yearlyStats } from '../data/dashboard.js'
import { formatNumber, formatPercent, formatUsdMillions } from '../lib/format.js'
import MetricGrid from '../components/MetricGrid.jsx'
import Panel from '../components/Panel.jsx'
import TrendChart from '../components/TrendChart.jsx'

function Trends() {
  const [fromYear, setFromYear] = useState(yearlyStats[0].year)
  const [toYear, setToYear] = useState(yearlyStats.at(-1).year)
  const years = useMemo(() => {
    const min = Math.min(fromYear, toYear)
    const max = Math.max(fromYear, toYear)
    return yearlyStats.filter((item) => item.year >= min && item.year <= max)
  }, [fromYear, toYear])
  const totalCount = years.reduce((sum, item) => sum + item.count, 0)
  const totalRevenue = years.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">YEARLY TRENDS</p>
        <h1>How the market has changed over time</h1>
        <p>Explore game releases, estimated revenue, and success rates by release year.</p>
      </div>
      <Panel title="Select a release period">
        <div className="filter-row">
          <label className="field">
            <span>From year</span>
            <select value={fromYear} onChange={(event) => setFromYear(Number(event.target.value))}>
              {yearlyStats.map((item) => <option value={item.year} key={item.year}>{item.year}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Through year</span>
            <select value={toYear} onChange={(event) => setToYear(Number(event.target.value))}>
              {yearlyStats.map((item) => <option value={item.year} key={item.year}>{item.year}</option>)}
            </select>
          </label>
        </div>
      </Panel>
      <MetricGrid items={[
        { label: 'Year range', value: `${years[0].year}–${years.at(-1).year}` },
        { label: 'Games released', value: formatNumber(totalCount), note: 'in the selected range' },
        { label: 'Total estimated revenue', value: formatUsdMillions(totalRevenue), note: 'in the selected range' },
      ]} />
      <div className="content-grid">
        <Panel title="Games released" description="Number of games by release year.">
          <TrendChart data={years} valueKey="count" label="Games released by year" formatValue={formatNumber} />
        </Panel>
        <Panel title="Total estimated revenue" description="Millions of US dollars, for games released in that year.">
          <TrendChart data={years} valueKey="revenue" label="Estimated revenue by year" formatValue={(value) => `${formatNumber(Math.round(value))}M`} color="#eb6834" />
        </Panel>
        <Panel title="Success rate" description="Share of games with at least 200,000 owners.">
          <TrendChart data={years} valueKey="success" label="Success rate by year" formatValue={(value) => formatPercent(value, 0)} type="line" color="#eb6834" />
        </Panel>
      </div>
      <p className="footnote">* 2026 is incomplete. Revenue for 2025 may be lower than 2024 because owner estimates for newer games are not yet complete.</p>
    </>
  )
}

export default Trends
