import { inject } from '@adonisjs/core'

@inject()
export default class CurrencyService {
  private readonly baseUrl = 'https://api.frankfurter.app'

  async convertToCAD(amount: number, fromCurrency: string, date: string): Promise<number> {
    try {
      if (fromCurrency === 'CAD') {
        return amount
      }

      const formattedDate = new Date(date).toISOString().split('T')[0]
      const url = `${this.baseUrl}/${formattedDate}?symbols=${fromCurrency},CAD`
      console.log('Fetching:', url)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.status}`)
      }

      const data = (await response.json()) as {
        base: string
        date: string
        rates: Record<string, number>
      }

      if (!data.rates[fromCurrency] || !data.rates.CAD) {
        throw new Error(`Rates not found for ${fromCurrency} or CAD`)
      }

      const rate = data.rates.CAD / data.rates[fromCurrency]
      const converted = amount * rate

      // 소수점 2자리로 반올림
      return this.roundTo(converted, 2)
    } catch (error) {
      console.error('Currency conversion error:', error)
      return amount
    }
  }

  private roundTo(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
  }
}
