import { kpis } from '../data/dashboard.js'
import MetricGrid from '../components/MetricGrid.jsx'
import Panel from '../components/Panel.jsx'

const shortcuts = [
  { href: '#tren', title: 'What does the Steam market look like?', text: 'Explore game releases and estimated revenue by year.' },
  { href: '#benchmark', title: 'Which price ranges are most successful?', text: 'Compare prices by genre and release period.' },
  { href: '#genre', title: 'Which genres earn more?', text: 'Compare estimated revenue, success rates, and competition.' },
  { href: '#metodologi', title: 'How reliable are these numbers?', text: 'Review the definitions, assumptions, and limitations.' },
]

function Overview() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">OVERVIEW</p>
        <h1>Steam Market Dashboard</h1>
        <p>
          A data-based pricing benchmark for indie developers preparing to release a game on Steam.
          The market is crowded and revenue is highly uneven—use these figures as context, not as
          a guarantee of results.
        </p>
      </div>

      <MetricGrid items={kpis} />

      <div className="content-grid overview-grid">
        <Panel title="The problem">
          <p>
            Indie developers often set prices by intuition or by copying a few competitors.
            This dashboard compares the price ranges most often associated with successful games
            (estimated owners of at least 200,000) across relevant genres and release periods.
          </p>
        </Panel>
        <Panel title="Key findings" description="Based on the cleaned Steam dataset.">
          <ul className="finding-list">
            <li><strong>Revenue is highly concentrated.</strong> The top 1% of games account for 77.2% of estimated revenue; the median game has about 10,000 owners.</li>
            <li><strong>Low prices do not guarantee high revenue.</strong> The US$0.01–5 tier contains 53.2% of games but only 14.5% of revenue.</li>
            <li><strong>Revenue is distributed across several tiers.</strong> The US$5–15 and over-US$30 tiers each account for about 29–30% of revenue.</li>
            <li><strong>The highest success rate is in the US$15–30 tier</strong> (about 9%), but sample size and genre still matter.</li>
          </ul>
        </Panel>
      </div>

      <Panel title="Start with a question" description="Choose a page to explore the data.">
        <div className="shortcut-grid">
          {shortcuts.map((shortcut) => (
            <a className="shortcut-card" href={shortcut.href} key={shortcut.href}>
              <strong>{shortcut.title}</strong>
              <span>{shortcut.text}</span>
              <span className="shortcut-arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </Panel>
    </>
  )
}

export default Overview
