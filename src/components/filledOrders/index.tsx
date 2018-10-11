import * as React from "react"
import { createRef } from "react"
import { includes, uniq, sum } from "lodash"

import Table from "../table2"
import FileUpload from "../common/fileUpload"
import Button from "../common/button"
import Text from "../common/text"

import AllocateModal, { OrdersForAllocation } from "./allocateModal"

import {
  fetchFilledOrders,
  FilledOrder,
  EDITABLE_FIELDS
} from "../../models/filledOrder"

import colors from "../../lib/colors"
import FlexedDiv from "../common/flexedDiv"

interface State {
  filledOrders: FilledOrder[]
  error?: string
  selectedRows: number[]
  ordersForAllocation?: OrdersForAllocation
}

class TableComponent extends React.Component<any, State> {
  private table = createRef<Table>()

  constructor(props: any) {
    super(props)

    this.state = {
      filledOrders: [],
      selectedRows: []
    }
  }

  public async componentDidMount() {
    const filledOrders = await fetchFilledOrders()
    if (!(filledOrders instanceof Error)) {
      this.setState({ filledOrders })
    } else {
      console.log(filledOrders.message)
    }
  }

  public uploadedFilledOrders(filledOrders: FilledOrder[]) {
    this.setState({
      filledOrders: this.state.filledOrders.concat(filledOrders),
      error: undefined
    })
  }

  public clickedAllocate() {
    const { filledOrders } = this.state
    const selectedRows = this.table.current!.state.selectedRows
    const orders = filledOrders.filter((o, i) => includes(selectedRows, i))
    const direction = uniq(orders.map(f => f.buy_sell))
    const instrument = uniq(orders.map(f => f.external_symbol))
    const total = sum(orders.map(f => parseFloat(String(f.quantity))))

    let error = ""

    if (orders.length === 0) {
      error = "Please highlight filled orders to allocate."
    } else if (orders.some(f => f.assigned)) {
      error = "Please un-highlight assigned orders."
    } else if (direction.length > 1 || instrument.length > 1) {
      error = "Orders must be of the same instrument and buy/sell direction."
    }

    if (error.length) {
      window.alert(error)
    } else {
      const ordersForAllocation = {
        filledOrders: orders,
        direction: direction[0],
        instrument: instrument[0],
        total
      }
      this.setState({ ordersForAllocation })
    }
  }

  public render() {
    const { filledOrders, ordersForAllocation } = this.state

    return (
      <div>
        {ordersForAllocation && (
          <AllocateModal
            closeModal={() => this.setState({ ordersForAllocation: undefined })}
            clients={["client 1", "client 2"]}
            ordersForAllocation={ordersForAllocation}
          />
        )}

        <Text.s margin={"0"} height={"20px"} color={colors.red}>
          {this.state.error}
        </Text.s>

        <Table
          ref={this.table}
          editableFields={EDITABLE_FIELDS}
          data={filledOrders}
        />

        <FlexedDiv>
          <Button.m
            white={true}
            margin="0 10px 0 0"
            onClick={this.clickedAllocate.bind(this)}
          >
            Allocate
          </Button.m>
          <FileUpload
            setError={error => this.setState({ error })}
            uploadedFilledOrders={this.uploadedFilledOrders.bind(this)}
          />
        </FlexedDiv>
      </div>
    )
  }
}

export default TableComponent
