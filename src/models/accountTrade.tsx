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

const fields =
  "id grouped_trade_id client buy_sell quantity price external_symbol created_at"

export const fetchAccountTrades = async (
  startDate: string,
  endDate: string
): Promise<AccountTrade[] | Error> =>
  rows("account_trade", "AccountTrade", startDate, endDate, fields)
