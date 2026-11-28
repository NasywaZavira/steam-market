const numberFormatter = new Intl.NumberFormat('en-US')
const oneDecimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const twoDecimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export const formatNumber = (value) => numberFormatter.format(value)

export const formatPercent = (value, digits = 1) =>
  `${(value * 100).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`

export const formatUsd = (value) => {
  if (value >= 1e9) return `US$${twoDecimalFormatter.format(value / 1e9)} billion`
  if (value >= 1e6) return `US$${twoDecimalFormatter.format(value / 1e6)} million`
  return `US$${numberFormatter.format(Math.round(value))}`
}

export const formatUsdMillions = (value) =>
  value >= 1000
    ? `US$${oneDecimalFormatter.format(value / 1000)} billion`
    : `US$${oneDecimalFormatter.format(value)} million`

export const formatUsdInput = (value) =>
  `US$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
