import { useEffect, useMemo, useState } from 'react'
import {
  benchmarkGenres,
  benchmarkPeriods,
  calculateBenchmark,
  median,
  minimumBenchmarkSample,
  parseGamesCsv,
  priceBuckets,
  wilsonInterval,
  bucketIndex,
} from '../lib/benchmark.js'
import { formatNumber, formatPercent, formatUsd, formatUsdInput } from '../lib/format.js'
import MetricGrid from '../components/MetricGrid.jsx'
import Panel from '../components/Panel.jsx'
import TrendChart from '../components/TrendChart.jsx'

function Benchmark() {
  const [games, setGames] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [selectedGenres, setSelectedGenres] = useState(['Indie'])
  const [mode, setMode] = useState('and')
  const [periodKey, setPeriodKey] = useState('recent')
  const [plannedPrice, setPlannedPrice] = useState('9.99')

  useEffect(() => {
    const dataUrl = `${import.meta.env.BASE_URL}games.csv`
    fetch(dataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.text()
      })
      .then((csv) => setGames(parseGamesCsv(csv)))
      .catch((error) => {
        const message = error instanceof TypeError
          ? 'The request could not reach a web server. Start the app with npm run dev and open the URL Vite prints; do not open index.html directly.'
          : `The request for ${dataUrl} failed (${error.message}). Make sure public/games.csv exists.`
        setLoadError(message)
      })
  }, [])

  const result = useMemo(() => {
    if (!games) return null
    return calculateBenchmark(games, selectedGenres, mode, benchmarkPeriods[periodKey])
  }, [games, selectedGenres, mode, periodKey])

  const parsedPrice = Number.parseFloat(plannedPrice)
  const validPrice = Number.isFinite(parsedPrice) && parsedPrice >= 0
  const selectedBucket = validPrice ? bucketIndex(parsedPrice) : -1

  function toggleGenre(genre) {
    setSelectedGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre],
    )
  }

  if (loadError) {
    return (
      <>
        <PageHeading />
        <Panel title="Benchmark data unavailable">
          <p role="alert">{loadError}</p>
        </Panel>
      </>
    )
  }

  const best = result?.rows
    .filter((row, index) => index > 0 && row.sampleIsLarge)
    .reduce((current, row) => !current || row.lower > current.lower ? row : current, null)
  const paidCount = result?.paidPrices.length ?? 0
  const successfulPaidCount = result?.successfulPaidPrices.length ?? 0
  const paidInterval = wilsonInterval(successfulPaidCount, paidCount)
  const medianPrice = result ? median(result.paidPrices) : null
  const medianSuccessfulPrice = result ? median(result.successfulPaidPrices) : null
  const maximumRate = result
    ? Math.max(0.01, ...result.rows.filter((row) => row.sampleIsLarge).map((row) => row.upper))
    : 0.01
  const years = result?.years ?? []

  return (
    <>
      <PageHeading />
      <Panel title="Configure benchmark" description="Choose genres, a release period, and a planned price to compare with the market.">
        <div className="benchmark-filters">
          <div className="filter-field genre-filter">
            <span className="field-label">Genres (select one or more)</span>
            <div className="chip-list">
              {benchmarkGenres.map((genre) => {
                const active = selectedGenres.includes(genre)
                return (
                  <button
                    className={`chip${active ? ' active' : ''}`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleGenre(genre)}
                    key={genre}
                  >
                    {active ? 'Selected · ' : ''}{genre}
                  </button>
                )
              })}
              <button className="chip clear-chip" type="button" onClick={() => setSelectedGenres([])}>
                Clear selection (all genres)
              </button>
            </div>
          </div>
          <div className="filter-row">
            <label className="field">
              <span>When multiple genres are selected</span>
              <select value={mode} disabled={selectedGenres.length < 2} onChange={(event) => setMode(event.target.value)}>
                <option value="and">Intersection: games tagged with all selected genres</option>
                <option value="or">Union: games tagged with any selected genre</option>
              </select>
            </label>
            <label className="field">
              <span>Release period</span>
              <select value={periodKey} onChange={(event) => setPeriodKey(event.target.value)}>
                {Object.entries(benchmarkPeriods).map(([key, period]) => <option value={key} key={key}>{period.label}</option>)}
              </select>
            </label>
            <label className="field price-input">
              <span>Planned price (US$)</span>
              <input type="number" min="0" step="0.01" value={plannedPrice} onChange={(event) => setPlannedPrice(event.target.value)} />
            </label>
          </div>
        </div>
      </Panel>

      {result ? (
        <>
          <MetricGrid items={[
            {
              label: selectedGenres.length > 1 && mode === 'and' ? 'Games tagged with all selected genres' : 'Games in this selection',
              value: formatNumber(result.count),
              note: `released in ${benchmarkPeriods[periodKey].label.toLowerCase()}`,
            },
            {
              label: 'Success rate (paid games)',
              value: paidCount ? formatPercent(successfulPaidCount / paidCount) : '-',
              note: paidCount ? `95% CI ${formatPercent(paidInterval[0])}–${formatPercent(paidInterval[1])} · n=${formatNumber(paidCount)}` : '',
            },
            {
              label: 'Median price (paid games)',
              value: medianPrice == null ? '-' : formatUsdInput(medianPrice),
              note: 'paid games in this selection',
            },
            {
              label: 'Median price of successful games',
              value: medianSuccessfulPrice == null ? '-' : formatUsdInput(medianSuccessfulPrice),
              note: `from ${formatNumber(successfulPaidCount)} successful paid games`,
            },
          ]} />

          <Panel title="Price recommendation" description={`${selectedGenres.length ? selectedGenres.join(mode === 'and' ? ' + ' : ' / ') : 'All genres'} · ${benchmarkPeriods[periodKey].label}`}>
            {!best ? (
              <p>The sample is too small to recommend a price for this selection. Try selecting fewer genres, switching to union mode, or choosing all years.</p>
            ) : (
              <ul className="finding-list">
                <li><strong>Best price range: {best.label}.</strong> Success rate {formatPercent(best.rate)} (95% CI {formatPercent(best.lower)}–{formatPercent(best.upper)}, from {formatNumber(best.count)} games). This range has the highest confidence-bound lower limit among ranges with sufficient samples.</li>
                {validPrice && (
                  <li>
                    Your planned price of {formatUsdInput(parsedPrice)} falls in the <strong>{priceBuckets[selectedBucket]}</strong> tier.
                    {' '}Its success rate is {formatPercent(result.rows[selectedBucket].rate)} across {formatNumber(result.rows[selectedBucket].count)} games.
                  </li>
                )}
              </ul>
            )}
          </Panel>

          <Panel title="Success rate by price range" description="Thin lines show 95% confidence intervals. Ranges with fewer than 30 games are marked in gray and should be treated cautiously.">
            <div className="benchmark-rows">
              {result.rows.map((row, index) => {
                const weak = !row.sampleIsLarge
                const barWidth = Math.min(row.rate / maximumRate, 1) * 100
                const intervalLeft = Math.min(row.lower / maximumRate, 1) * 100
                const intervalWidth = Math.max(Math.min((row.upper - row.lower) / maximumRate, 1), row.count ? 0.4 : 0)
                return (
                  <div className={`benchmark-row${index === selectedBucket ? ' selected' : ''}`} key={row.label}>
                    <div className="benchmark-tier">
                      {row.label}{index === selectedBucket && <span className="your-price">your price</span>}
                      <small>n = {formatNumber(row.count)}</small>
                    </div>
                    <div className="benchmark-track">
                      <div className={`benchmark-bar${weak ? ' weak' : ''}`} style={{ width: `${barWidth}%` }} />
                      {row.count > 0 && <div className="confidence-interval" style={{ left: `${intervalLeft}%`, width: `${intervalWidth}%` }} />}
                    </div>
                    <div className="benchmark-value">
                      {row.count ? formatPercent(row.rate) : '-'}
                      {weak && <small>Small sample</small>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Full price-range table">
            <div className="table-scroll">
              <table>
                <thead><tr><th>Price range</th><th>Games</th><th>Successful games</th><th>Success rate</th><th>95% CI</th><th>Median revenue</th><th>Positive review ratio</th></tr></thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}{!row.sampleIsLarge ? ' (small sample)' : ''}</td>
                      <td>{formatNumber(row.count)}</td>
                      <td>{formatNumber(row.successes)}</td>
                      <td>{row.count ? formatPercent(row.rate) : '-'}</td>
                      <td>{row.count ? `${formatPercent(row.lower)} - ${formatPercent(row.upper)}` : '-'}</td>
                      <td>{row.medianRevenue == null ? '-' : formatUsd(row.medianRevenue)}</td>
                      <td>{row.positive.length >= minimumBenchmarkSample && row.medianPositive != null ? formatPercent(row.medianPositive, 0) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="content-grid">
            <Panel title="Competition: games released per year" description={`${selectedGenres.length ? selectedGenres.join(', ') : 'All genres'}, all prices`}>
            {years.length ? <TrendChart data={years} valueKey="count" label="Games released per year for selected genres" formatValue={formatNumber} /> : <p>No data for this selection.</p>}
            </Panel>
            <Panel title="Success rate by release year" description={`${selectedGenres.length ? selectedGenres.join(', ') : 'All genres'}, all prices`}>
            {years.length ? <TrendChart data={years} valueKey="rate" label="Success rate by year for selected genres" formatValue={(value) => formatPercent(value, 0)} type="line" color="#eb6834" /> : <p>No data for this selection.</p>}
            <p className="footnote">2026 is incomplete.</p>
            </Panel>
          </div>
        </>
      ) : (
        <Panel title="Loading benchmark data"><p>Loading market data from games.csv…</p></Panel>
      )}
    </>
  )
}

function PageHeading() {
  return (
    <div className="page-intro">
      <p className="eyebrow">PRICE BENCHMARK</p>
      <h1>Price benchmark for indie developers</h1>
      <p>Select one or more genres that fit your game and a release period. The dashboard shows which price ranges most often contain successful games (at least 200,000 owners), along with uncertainty estimates.</p>
    </div>
  )
}

export default Benchmark
