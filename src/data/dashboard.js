export const kpis = [
  { label: 'Total games', value: '124,145', note: 'after data cleaning' },
  { label: 'Estimated total revenue', value: 'US$75.3 billion', note: 'midpoint owners × price' },
  { label: 'Median owners per game', value: '10,000', note: 'most games are small' },
  { label: 'Free games', value: '21.3%', note: '26,411 games' },
  { label: 'Median paid-game price', value: 'US$3.59', note: 'free games excluded' },
  { label: 'Success rate', value: '4.32%', note: 'at least 200,000 owners' },
  { label: 'Median positive review ratio', value: '81.2%', note: 'games with 10+ reviews' },
  { label: 'Revenue from top 1% of games', value: '77.2%', note: 'revenue concentration' },
]

export const priceTiers = [
  { label: 'Free', count: 26411, medianRevenue: 0, revenue: 0, success: 0.04, positive: 0.78 },
  { label: '$0.01-5', count: 66079, medianRevenue: 25400, revenue: 10932.68, success: 0.04, positive: 0.81 },
  { label: '$5-15', count: 26228, medianRevenue: 99900, revenue: 22306.5, success: 0.06, positive: 0.84 },
  { label: '$15-30', count: 4318, medianRevenue: 199900, revenue: 19934.76, success: 0.09, positive: 0.81 },
  { label: '> $30', count: 1109, medianRevenue: 549900, revenue: 22166.29, success: 0.07, positive: 0.75 },
]

export const genres = [
  { name: 'Action', count: 46743, revenue: 50898.71, medianRevenue: 31150, success: 0.06, positive: 0.8, revenuePerGame: 1088905.54 },
  { name: 'Adventure', count: 45726, revenue: 40138.23, medianRevenue: 35900, success: 0.05, positive: 0.81, revenuePerGame: 877798.78 },
  { name: 'RPG', count: 21259, revenue: 34385.54, medianRevenue: 45400, success: 0.07, positive: 0.8, revenuePerGame: 1617457.82 },
  { name: 'Indie', count: 81746, revenue: 27276.49, medianRevenue: 29900, success: 0.04, positive: 0.82, revenuePerGame: 333673.65 },
  { name: 'Simulation', count: 24504, revenue: 14899.79, medianRevenue: 34900, success: 0.05, positive: 0.77, revenuePerGame: 608055.27 },
  { name: 'Strategy', count: 22725, revenue: 14294.54, medianRevenue: 37400, success: 0.06, positive: 0.79, revenuePerGame: 629022.82 },
  { name: 'Massively Multiplayer', count: 2563, revenue: 8824.36, medianRevenue: 0, success: 0.13, positive: 0.67, revenuePerGame: 3442980.71 },
  { name: 'Casual', count: 50886, revenue: 8006.48, medianRevenue: 20650, success: 0.02, positive: 0.82, revenuePerGame: 157341.55 },
  { name: 'Early Access', count: 11324, revenue: 7737.41, medianRevenue: 49900, success: 0.03, positive: 0.77, revenuePerGame: 683275.6 },
  { name: 'Sports', count: 4925, revenue: 2336.13, medianRevenue: 29900, success: 0.04, positive: 0.78, revenuePerGame: 474340.25 },
  { name: 'Racing', count: 4117, revenue: 1720.03, medianRevenue: 29900, success: 0.04, positive: 0.78, revenuePerGame: 417788.11 },
  { name: 'Utilities', count: 1083, revenue: 392.1, medianRevenue: 26700, success: 0.03, positive: 0.75, revenuePerGame: 362049.12 },
]

export const yearlyStats = [
  [2007, 90, 279.49, 0.64], [2008, 158, 282.85, 0.39], [2009, 321, 877.46, 0.34],
  [2010, 255, 665.39, 0.33], [2011, 260, 1010.22, 0.46], [2012, 322, 909.7, 0.53],
  [2013, 467, 1439.37, 0.49], [2014, 1523, 2004.66, 0.24], [2015, 2515, 2609.05, 0.17],
  [2016, 4140, 3975.16, 0.12], [2017, 5921, 3155.11, 0.07], [2018, 7461, 4562.54, 0.05],
  [2019, 7242, 3585.59, 0.05], [2020, 8804, 5775.05, 0.05], [2021, 11067, 9320.5, 0.04],
  [2022, 12285, 6025.72, 0.03], [2023, 14596, 6699.82, 0.02], [2024, 20031, 16104.63, 0.02],
  [2025, 24973, 5433.51, 0.01], [2026, 1617, 14.48, 0],
].map(([year, count, revenue, success]) => ({ year, count, revenue, success }))

export const totalGames = 124145
export const totalRevenue = priceTiers.reduce((sum, tier) => sum + tier.revenue, 0)
