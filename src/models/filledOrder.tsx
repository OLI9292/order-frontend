import CONFIG from "../lib/config"

import { query, rows } from "./query"

export enum JournalType {
  bunched,
  strategy,
  account
}

export enum BuySell {
  B = "Buy",
  S = "Sell"
}

export const EDITABLE_FIELDS = [
  "strategy_id",
  "client_id",
  "clearing_account_id"
]

export interface FilledOrder {
  id: string
  journal_type: JournalType
  external_order_id: string
  bunched_order_id: string
  account_trade_id: string
  strategy_trade_id: string
  external_trade_id: string
  bunched_trade_id: string
  trade_date: string
  executing_account_id: string
  buy_sell: BuySell
  quantity: number
  external_symbol: string
  price: number
  commissions: string
  exchange_id: string
  trader_id: string
  strategy_id: string
  client_id: string
  clearing_account_id: string
  settlement_date: string
  assigned: boolean
}

const fields =
  "id journal_type external_order_id bunched_order_id account_trade_id strategy_trade_id external_trade_id bunched_trade_id trade_date executing_account_id buy_sell quantity external_symbol price commissions exchange_id trader_id strategy_id client_id clearing_account_id settlement_date assigned"

export const fetchFilledOrders = async (): Promise<FilledOrder[] | Error> =>
  rows("filled_order", "FilledOrder", fields)

export const updateFilledOrder = async (
  id: string,
  attr: string,
  value: string
): Promise<FilledOrder | Error> => {
  const gqlQuery = `mutation { updateFilledOrder(id: "${id}", attr: "${attr}", value: "${value}") { ${fields} } }`
  return query(gqlQuery, "updateFilledOrder")
}

export const updateFilledOrders = async (
  ids: string[],
  attr: string,
  value: string
): Promise<FilledOrder[] | Error> => {
  const gqlQuery = `mutation { updateFilledOrders(ids: "${ids.join(
    ","
  )}", attr: "${attr}", value: "${value}") { ${fields} } }`
  return query(gqlQuery, "updateFilledOrders")
}

export const uploadFilledOrders = (
  formData: FormData
): Promise<FilledOrder[] | Error> =>
  fetch(`${CONFIG.API_URL}/file-upload`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(json => (json.error ? Error(json.error) : json))
