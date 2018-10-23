import { query, rows } from "./query"
import { BuySell, AllocationResult } from "./filledOrder"

export interface GroupedTrade {
  id: string
  buy_sell: BuySell
  quantity: number
  external_symbol: string
  allocation_type: string
}

const fields = "id buy_sell quantity external_symbol allocation_type created_at"

export const fetchGroupedTrades = async (
  startDate: string,
  endDate: string
): Promise<GroupedTrade[] | Error> =>
  rows("grouped_trade", "GroupedTrade", startDate, endDate, fields)

export const undoAllocation = async (
  groupedTradeId: string
): Promise<AllocationResult | Error> => {
  const gqlQuery = `mutation { 
      undoAllocation(groupedTradeId: "${groupedTradeId}") {
        groupedTrade {
          id
        } 
        accountTrades {
          id
        }
        filledOrders {
          id
          grouped_trade_id
          assigned
        }
      } 
    }`
  return query(gqlQuery, "undoAllocation")
}
