import { useEffect, useState } from 'react'
import Benchmark from './pages/Benchmark.jsx'
import GenreMarket from './pages/GenreMarket.jsx'
import Methodology from './pages/Methodology.jsx'
import Overview from './pages/Overview.jsx'
import PriceMarket from './pages/PriceMarket.jsx'
import Trends from './pages/Trends.jsx'

const pages = [
  { id: 'ringkasan', label: 'Overview', component: Overview },
  { id: 'benchmark', label: 'Price benchmark', component: Benchmark },
  { id: 'harga', label: 'Market: price', component: PriceMarket },
  { id: 'genre', label: 'Market: genre', component: GenreMarket },
  { id: 'tren', label: 'Yearly trends', component: Trends },
  { id: 'metodologi', label: 'Methodology', component: Methodology },
]

function getActivePage() {
  const hash = window.location.hash.slice(1)
  return pages.some((page) => page.id === hash) ? hash : 'ringkasan'
}

function App() {
  const [activePage, setActivePage] = useState(getActivePage)
  const Page = pages.find((page) => page.id === activePage).component

  useEffect(() => {
    const updatePage = () => setActivePage(getActivePage())
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#ringkasan" aria-label="Steam Market Dashboard, overview">
            <span className="brand-mark">S</span>
            <span>Steam Market <small>Dashboard</small></span>
          </a>
          <nav className="page-nav" role="tablist" aria-label="Dashboard pages">
            {pages.map((page) => (
              <a
                href={`#${page.id}`}
                role="tab"
                aria-selected={activePage === page.id}
                className={activePage === page.id ? 'active' : ''}
                key={page.id}
              >
                {page.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="page-content">
        <Page />
        <footer className="site-footer">
          Estimates based on Steam API and SteamSpy data. <a href="#metodologi">Read the methodology and limitations.</a>
        </footer>
      </main>
    </div>
  )
}

export default App
