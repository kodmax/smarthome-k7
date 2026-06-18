export const convertMarketCap = (marketCap: string): number => {
  switch (marketCap.charAt(marketCap.length - 1)) {
    case 'T':
      return +marketCap.substring(0, marketCap.length - 1) * 1000

    case 'B':
      return +marketCap.substring(0, marketCap.length - 1)

    default:
      return +marketCap.substring(0, marketCap.length - 1) / 1000
  }
}
