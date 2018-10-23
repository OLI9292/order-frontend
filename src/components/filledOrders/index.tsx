import { createRef } from "react"
import * as React from "react"
import { includes, uniq, sum, isEqual, findIndex } from "lodash"

import Table from "../table"
import FileUpload from "../common/fileUpload"
import Button from "../common/button"
import FlexedDiv from "../common/flexedDiv"

import AllocateModal, { OrdersForAllocation } from "./allocateModal"
import { DateRange } from "../home/index"

import {
  fetchFilledOrders,
  FilledOrder,
  EDITABLE_FIELDS,
  allocateFilledOrders,
  updateFilledOrder,
  updateFilledOrders
} from "../../models/filledOrder"

import { updateObjects, toArray } from "../../lib/helpers"

interface State {
  filledOrders: FilledOrder[]
  ordersForAllocation?: OrdersForAllocation
}

interface Props {
  dateRange?: DateRange
  setError: (error?: string) => void
}

class FilledOrders extends React.Component<Props, State> {
  private table = createRef<Table>()

  constructor(props: Props) {
    super(props)

    this.state = {
      filledOrders: []
    }
  }

  public async componentDidMount() {
    if (this.props.dateRange) {
      this.loadData(this.props.dateRange)
    }
  }

  public async componentWillReceiveProps(nextProps: Props) {
    const { dateRange } = nextProps
    if (!isEqual(this.props.dateRange, dateRange) && dateRange) {
      this.loadData(dateRange)
    }
  }

  public async loadData(dateRange: DateRange) {
    const [startDate, endDate] = dateRange
    const filledOrders = await fetchFilledOrders(startDate, endDate)
    filledOrders instanceof Error
      ? this.props.setError(filledOrders.message)
      : this.setState({ filledOrders })
  }

  public uploadedFilledOrders(filledOrders: FilledOrder[]) {
    filledOrders = this.state.filledOrders.concat(filledOrders)
    this.setState({ filledOrders }, this.props.setError)
  }

  public clickedAllocate() {
    const { filledOrders } = this.state
    const selectedRows = Array.from(document.getElementsByClassName("row"))
      .map((r, i) => (r.classList.contains("selected") ? i : -1))
      .filter(i => i !== -1)
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
      this.props.setError(error)
    } else {
      const ordersForAllocation = {
        filledOrders: orders,
        direction: direction[0],
        instrument: instrument[0],
        total
      }
      this.setState({ ordersForAllocation }, this.props.setError)
    }
  }

  public async allocate(ids: string[], data: any) {
    let { filledOrders } = this.state
    const result = await allocateFilledOrders(ids, data)
    if (result instanceof Error) {
      window.alert(result.message)
    } else {
      filledOrders = updateObjects(filledOrders, result.filledOrders)
      this.setState(
        { filledOrders, ordersForAllocation: undefined },
        this.props.setError
      )
    }
  }

  public async updated(ids: string[], header: string, newValue: string) {
    const { filledOrders } = this.state

    const result =
      ids.length === 1
        ? await updateFilledOrder(ids[0], header, newValue)
        : await updateFilledOrders(ids, header, newValue)

    if (result instanceof Error) {
      this.props.setError(result.message)
    } else {
      this.props.setError(undefined)
      toArray(result).forEach((updated: FilledOrder) => {
        const idx = findIndex(
          filledOrders,
          f => f.external_trade_id === updated.external_trade_id
        )
        filledOrders[idx] = updated
      })
      this.setState({ filledOrders })
    }
  }

  public render() {
    const { filledOrders, ordersForAllocation } = this.state

    return (
      <div style={{ height: "80vh" }}>
        {ordersForAllocation && (
          <AllocateModal
            allocate={this.allocate.bind(this)}
            closeModal={() => this.setState({ ordersForAllocation: undefined })}
            clients={["client 1", "client 2"]}
            ordersForAllocation={ordersForAllocation}
          />
        )}

        <Table
          updated={this.updated.bind(this)}
          ref={this.table}
          editableFields={EDITABLE_FIELDS}
          data={filledOrders}
        />

        <FlexedDiv
          style={{ position: "absolute", bottom: "20px" }}
          margin="10px 0 0 0"
        >
          <Button.m
            white={true}
            margin="0 10px 0 0"
            onClick={this.clickedAllocate.bind(this)}
          >
            Allocate
          </Button.m>
          <FileUpload
            setError={this.props.setError.bind(this)}
            uploadedFilledOrders={this.uploadedFilledOrders.bind(this)}
          />
        </FlexedDiv>
      </div>
    )
  }
}

export default FilledOrders
