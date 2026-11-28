import Panel from '../components/Panel.jsx'

function Methodology() {
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">METHODOLOGY</p>
        <h1>Definitions and assumptions</h1>
        <p>How to interpret and verify the figures in this dashboard.</p>
      </div>
      <Panel title="Source and definitions">
        <ul className="finding-list">
          <li><strong>Source:</strong> FronkonGames/steam-games-dataset (Steam API and SteamSpy), with 124,145 games after cleaning. Data cleaning and the star schema are documented in the project notebook.</li>
          <li><strong>Owners and revenue are estimates.</strong> SteamSpy provides owner ranges (for example, 0–20,000). Estimated revenue is the midpoint of the owner range multiplied by the current price, excluding discounts, Steam's share, and in-game purchases.</li>
          <li><strong>Successful game:</strong> the lower bound of its owner estimate is at least 200,000. Changing this threshold changes every success rate.</li>
          <li><strong>Positive review ratio:</strong> calculated for games with at least 10 reviews and displayed only when at least 30 qualifying games are available.</li>
          <li><strong>Price ranges:</strong> use the current Steam price, not the launch price. The upper bound is inclusive (US$5 belongs to the US$2–5 range).</li>
          <li><strong>Genres overlap.</strong> A game can belong to multiple genres, so genre totals should not be added together. The “All genres” benchmark counts unique games.</li>
          <li><strong>The benchmark</strong> uses 11 major game genres and excludes software and adult-content categories.</li>
        </ul>
      </Panel>
      <div className="content-grid">
        <Panel title="How to read the benchmark">
          <ul className="finding-list">
            <li>When selecting multiple genres, use intersection (games tagged with all selected genres) or union (games tagged with any selected genre).</li>
            <li>Selecting more genres in intersection mode reduces the sample size and can widen uncertainty.</li>
            <li>95% confidence intervals use the Wilson method. Price ranges with fewer than 30 games are marked as small samples.</li>
            <li>The price recommendation chooses the paid range with the highest lower confidence bound among ranges with sufficient samples; it is not a prediction of success.</li>
          </ul>
        </Panel>
        <Panel title="Uncertainty and limitations">
          <p>Current prices and owner estimates do not reflect launch prices, discounts, or performance changes over time. Newer games may not yet have stable owner estimates, so recent success rates can appear lower.</p>
          <p>Genres are assigned by developers. These results are descriptive and do not show that a particular price or genre causes revenue or success.</p>
        </Panel>
      </div>
      <Panel title="Using the results">
        <p>Use the benchmark to narrow down initial options, then consider production costs, target players, positioning, competitors, game quality, and discount plans. Compare multiple periods and check sample sizes before making a decision.</p>
      </Panel>
    </>
  )
}

export default Methodology
