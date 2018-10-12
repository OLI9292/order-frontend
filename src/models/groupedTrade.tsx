import { rows } from "./query"
import { BuySell } from "./filledOrder"

export interface GroupedTrade {
  id: string
  buy_sell: BuySell
  quantity: number
  external_symbol: string
  allocation_type: string
}

const fields = "id buy_sell quantity external_symbol allocation_type"

export const fetchGroupedTrades = async (): Promise<GroupedTrade[] | Error> =>
  rows("grouped_trade", "GroupedTrade", "", "", fields)
