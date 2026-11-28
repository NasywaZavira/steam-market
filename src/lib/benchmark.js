export const benchmarkGenres = [
  'Indie',
  'Casual',
  'Action',
  'Adventure',
  'Simulation',
  'Strategy',
  'RPG',
  'Early Access',
  'Sports',
  'Racing',
  'Massively Multiplayer',
]

export const priceBuckets = [
  'Free',
  '$0.01–2',
  '$2–5',
  '$5–10',
  '$10–15',
  '$15–20',
  '$20–30',
  '$30–50',
  '> $50',
]

export const benchmarkPeriods = {
  all: { label: 'All years (1997–2026)', from: 1997, to: 2100 },
  recent: { label: '2021–2026 (most recent)', from: 2021, to: 2100 },
  mature: { label: '2016–2020 (mature cohort)', from: 2016, to: 2020 },
}

const minimumSample = 30

export function parseGamesCsv(csv) {
  const lines = csv.trim().split(/\r?\n/)
  return lines.slice(1).filter(Boolean).map((line) => {
    const [mask, year, price, success, positive, owners] = line.split(',')
    return {
      mask: Number(mask),
      year: Number(year),
      price: Number(price),
      success: Number(success),
      positive: positive === '' ? -1 : Number(positive),
      owners: Number(owners) || 0,
    }
  })
}

export function bucketIndex(price) {
  if (!(price > 0)) return 0
  const boundaries = [2, 5, 10, 15, 20, 30, 50]
  const index = boundaries.findIndex((limit) => price <= limit)
  return index < 0 ? 8 : index + 1
}

function quantile(values, q) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const position = (sorted.length - 1) * q
  const lower = Math.floor(position)
  const fraction = position - lower
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + (sorted[lower + 1] - sorted[lower]) * fraction
}

export function wilsonInterval(successes, sampleSize) {
  if (!sampleSize) return [0, 0]
  const z = 1.96
  const p = successes / sampleSize
  const denominator = 1 + (z * z) / sampleSize
  const center = p + (z * z) / (2 * sampleSize)
  const margin = z * Math.sqrt((p * (1 - p)) / sampleSize + (z * z) / (4 * sampleSize * sampleSize))
  return [
    Math.max(0, (center - margin) / denominator),
    Math.min(1, (center + margin) / denominator),
  ]
}

export function calculateBenchmark(games, selectedGenres, mode, period) {
  const selectedMask = selectedGenres.reduce(
    (mask, genre) => mask | (1 << benchmarkGenres.indexOf(genre)),
    0,
  )
  const bucketStats = priceBuckets.map(() => ({ count: 0, successes: 0, revenues: [], positive: [] }))
  const yearly = new Map()
  const paidPrices = []
  const successfulPaidPrices = []
  let count = 0
  let successes = 0

  games.forEach((game) => {
    if (selectedMask) {
      const matches = mode === 'and'
        ? (game.mask & selectedMask) === selectedMask
        : (game.mask & selectedMask) !== 0
      if (!matches) return
    }

    if (game.year >= 2010) {
      const year = yearly.get(game.year) || { year: game.year, count: 0, successes: 0 }
      year.count += 1
      year.successes += game.success
      yearly.set(game.year, year)
    }
    if (game.year < period.from || game.year > period.to) return

    const bucket = bucketStats[bucketIndex(game.price)]
    bucket.count += 1
    bucket.successes += game.success
    bucket.revenues.push(game.owners * 1000 * game.price)
    if (game.positive >= 0) bucket.positive.push(game.positive / 100)
    count += 1
    successes += game.success
    if (game.price > 0) {
      paidPrices.push(game.price)
      if (game.success) successfulPaidPrices.push(game.price)
    }
  })

  const rows = bucketStats.map((stats, index) => {
    const interval = wilsonInterval(stats.successes, stats.count)
    return {
      ...stats,
      label: priceBuckets[index],
      rate: stats.count ? stats.successes / stats.count : 0,
      lower: interval[0],
      upper: interval[1],
      medianRevenue: quantile(stats.revenues, 0.5),
      medianPositive: quantile(stats.positive, 0.5),
      sampleIsLarge: stats.count >= minimumSample,
    }
  })
  const sortedYears = [...yearly.values()]
    .sort((a, b) => a.year - b.year)
    .map((year) => ({ ...year, rate: year.count ? year.successes / year.count : 0 }))

  return {
    rows,
    count,
    successes,
    paidPrices,
    successfulPaidPrices,
    years: sortedYears,
  }
}

export function median(values) {
  return quantile(values, 0.5)
}

export const minimumBenchmarkSample = minimumSample
