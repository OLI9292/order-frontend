import { rows } from "./query"
import { BuySell } from "./filledOrder"

export interface AccountTrade {
  id: string
  client: string
  buy_sell: BuySell
  quantity: number
  price: number
  external_symbol: string
}

const fields = "id client buy_sell quantity price external_symbol"

export const fetchAccountTrades = async (): Promise<AccountTrade[] | Error> =>
  rows("account_trade", "AccountTrade", fields)
