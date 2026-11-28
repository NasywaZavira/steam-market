import { priceTiers, totalGames, totalRevenue } from '../data/dashboard.js'
import { formatNumber, formatPercent, formatUsd, formatUsdMillions } from '../lib/format.js'
import BarList from '../components/BarList.jsx'
import DataTable from '../components/DataTable.jsx'
import Panel from '../components/Panel.jsx'

const shareRows = priceTiers.map((tier) => ({
  label: tier.label,
  games: tier.count / totalGames,
  revenue: tier.revenue / totalRevenue,
}))

const priceColumns = [
  { key: 'label', label: 'Price tier' },
  { key: 'count', label: 'Games', render: (tier) => formatNumber(tier.count) },
  { key: 'gameShare', label: 'Share of games', render: (tier) => formatPercent(tier.count / totalGames) },
  { key: 'medianRevenue', label: 'Median revenue', render: (tier) => formatUsd(tier.medianRevenue) },
  { key: 'revenue', label: 'Total revenue', render: (tier) => formatUsdMillions(tier.revenue) },
  { key: 'revenueShare', label: 'Share of revenue', render: (tier) => formatPercent(tier.revenue / totalRevenue) },
  { key: 'success', label: 'Success rate', render: (tier) => formatPercent(tier.success, 0) },
  { key: 'positive', label: 'Positive review ratio', render: (tier) => formatPercent(tier.positive, 0) },
]

function PriceMarket() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">MARKET: PRICE</p>
        <h1>Market by price tier</h1>
        <p>Compare the share of games, estimated revenue, and performance metrics across price ranges.</p>
      </div>

      <div className="content-grid">
        <Panel title="Share of games vs. revenue by price tier" description="A tier with a revenue share well above its share of games appears more efficient in these estimates.">
          <div className="legend-row"><span><i className="legend-dot blue" /> Share of games</span><span><i className="legend-dot orange" /> Share of estimated revenue</span></div>
          <div className="bar-list paired-bars">
            {shareRows.map((row) => (
              <div className="share-row" key={row.label}>
                <strong>{row.label}</strong>
                <div className="share-track">
                  <div className="share-bar blue" style={{ width: `${row.games / 0.6 * 100}%` }} />
                  <span>{formatPercent(row.games)}</span>
                </div>
                <div className="share-track">
                  <div className="share-bar orange" style={{ width: `${row.revenue / 0.6 * 100}%` }} />
                  <span>{formatPercent(row.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <div className="stacked-panels">
          <Panel title="Success rate by tier" description="Share of games with at least 200,000 owners.">
            <BarList rows={priceTiers.map((tier) => ({ label: tier.label, value: tier.success }))} valueLabel={(value) => formatPercent(value, 0)} maxValue={0.1} />
          </Panel>
          <Panel title="Median positive review ratio by tier" description="Only games with at least 10 reviews.">
            <BarList rows={priceTiers.map((tier) => ({ label: tier.label, value: tier.positive }))} valueLabel={(value) => formatPercent(value, 0)} maxValue={1} color="orange" />
          </Panel>
        </div>
      </div>

      <Panel title="Full price-tier table">
        <DataTable columns={priceColumns} rows={priceTiers} rowKey="label" />
      </Panel>
    </>
  )
}

export default PriceMarket
