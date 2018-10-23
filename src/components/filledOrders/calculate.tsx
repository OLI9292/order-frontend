import { sum, extend, find } from "lodash"

import { Model, OrdersForAllocation } from "./allocateModal"

export interface Allocation {
  client: string
  quantity: number
  price: number
  partialQuanity: number
  totalPrice: number
  filled: boolean
}

const calculate = (
  clients: string[],
  selectedClients: string[],
  quantityObj: any,
  ordersForAllocation: OrdersForAllocation,
  model?: Model
): Allocation[] | undefined => {
  const averagePrice =
    sum(ordersForAllocation.filledOrders.map(f => f.quantity * f.price)) /
    ordersForAllocation.total

  if (selectedClients.length === 1) {
    const quantity = ordersForAllocation.total
    return [
      {
        client: clients[0],
        quantity,
        filled: true,
        partialQuanity: quantity,
        price: averagePrice,
        totalPrice: averagePrice * quantity
      }
    ]
  }

  const allocations: any[] = selectedClients.map(client => ({
    client,
    quantity: parseFloat(quantityObj[client]),
    partialQuanity: 0,
    totalPrice: 0
  }))

  const quantities = allocations.map(a => a.quantity)

  const invalid =
    quantities.some(q => !Number(q)) ||
    sum(quantities) !== ordersForAllocation.total

  if (invalid) {
    return
  }

  if (model === Model.average) {
    return allocations.map(a =>
      extend({}, a, { price: averagePrice, filled: true })
    )
  } else {
    let idx = 0
    let partialQuantity = 0

    while (true) {
      const client = find(allocations, a => !a.filled)

      if (!client) {
        break
      }

      const f = ordersForAllocation.filledOrders[idx]
      const available = f.quantity - partialQuantity
      const quantityDesired = client.quantity - client.partialQuanity

      if (quantityDesired >= available) {
        client.partialQuanity += available
        client.totalPrice += available * f.price
        partialQuantity = 0
        idx += 1
      } else {
        partialQuantity += quantityDesired
        client.partialQuanity += quantityDesired
        client.totalPrice += quantityDesired * f.price
      }

      client.filled = client.partialQuanity === client.quantity
    }

    allocations.forEach(a => (a.price = a.totalPrice / a.quantity))
    return allocations
  }
}

export default calculate
