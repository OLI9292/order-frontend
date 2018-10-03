import * as React from "react"
import { includes, without, reject, findIndex, sortBy, uniq } from "lodash"
import { titleCase } from "change-case"
import {
  FilledOrder,
  EDITABLE_FIELDS,
  updateFilledOrder,
  updateFilledOrders
} from "../../models/filledOrder"

import Text from "../common/text"
import ColumnSettings from "./columnSettings"
import Cell from "./cell"

import {
  HeaderRow,
  TableHeader,
  Container,
  Table,
  Span,
  Row
} from "./components"

import colors from "../../lib/colors"
import { toArray } from "../../lib/helpers"

export interface Sort {
  header: string
  ascending: boolean
}

interface Props {
  filledOrders: FilledOrder[]
  setError: (error?: string) => void
}

interface State {
  hidden: string[]
  sort: Sort
  isMoving?: number
  headers?: string[]
  isEditing: string
  holdingShift: boolean
  selectedRows: number[]
  filledOrders: FilledOrder[]
}

class TableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hidden: [],
      holdingShift: false,
      isEditing: "",
      selectedRows: [],
      sort: { header: "id", ascending: true },
      filledOrders: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public componentDidMount() {
    this.setHeaders(this.props.filledOrders)
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keyup", this.handleKeyUp)
  }

  public handleKeyDown(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: true })
    }
  }

  public handleKeyUp(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: false })
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setHeaders(nextProps.filledOrders)
  }

  public setHeaders(filledOrders: FilledOrder[]) {
    if (filledOrders.length) {
      const headers = Object.keys(filledOrders[0])
      this.setState({ headers, filledOrders })
    }
  }

  public sortBy(header: string, ascending: boolean) {
    const sort = { header, ascending }
    let filledOrders = sortBy(this.state.filledOrders, sort.header)
    if (!sort.ascending) {
      filledOrders = filledOrders.reverse()
    }
    this.setState({ sort, filledOrders })
  }

  public hide(header: string) {
    let { hidden } = this.state
    hidden = includes(hidden, header)
      ? without(hidden, header)
      : hidden.concat(header)
    this.setState({ hidden })
  }

  public move(header: string) {
    const { headers } = this.state
    const isMoving = findIndex(headers, h => h === header)
    if (this.state.isMoving && headers) {
      headers[isMoving] = headers[this.state.isMoving]
      headers[this.state.isMoving] = header
      this.setState({ isMoving: undefined, headers })
    } else {
      this.setState({ isMoving })
    }
  }

  public selectedRow(i: number) {
    let { selectedRows } = this.state
    selectedRows = includes(selectedRows, i)
      ? without(selectedRows, i)
      : selectedRows.concat(i)
    this.setState({ selectedRows })
  }

  public async updated(rowIdx: number, header: string, newValue: string) {
    this.setState({ isEditing: "" })

    const { selectedRows, filledOrders } = this.state
    const ids = uniq(selectedRows.concat(rowIdx)).map(
      idx => filledOrders[idx].external_trade_id
    )

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
    const { filledOrders } = this.state

    const {
      headers,
      hidden,
      isMoving,
      sort,
      isEditing,
      holdingShift,
      selectedRows
    } = this.state

    if (!headers) {
      return null
    }

    const visibleHeaders = reject(headers, h => includes(hidden, h))

    const highlightMove = (h: string): boolean =>
      isMoving !== undefined && headers[isMoving] === h

    const headerCell = (k: string) => {
      return (
        <TableHeader key={k}>
          <p>{titleCase(k)}</p>
          <ColumnSettings
            sort={sort}
            highlightMove={highlightMove(k)}
            move={this.move.bind(this)}
            sortBy={this.sortBy.bind(this)}
            hide={this.hide.bind(this)}
            header={k}
          />
        </TableHeader>
      )
    }

    const row = (data: FilledOrder, i: number) => (
      <Row selected={includes(selectedRows, i)} key={i}>
        {visibleHeaders.map((k: string) => (
          <Cell
            key={`${k}-${i}`}
            rowIdx={i}
            value={data[k]}
            isEditable={includes(EDITABLE_FIELDS, k)}
            isEditing={isEditing}
            header={k}
            holdingShift={holdingShift}
            editRow={key => this.setState({ isEditing: key })}
            selectedRow={this.selectedRow.bind(this)}
            updated={this.updated.bind(this)}
            unselectAllRows={() => this.setState({ selectedRows: [] })}
          />
        ))}
      </Row>
    )

    return (
      <Container>
        <Text.s hide={hidden.length === 0} color={colors.darkGrey}>
          Show:{" "}
          {hidden.map(h => (
            <Span key={h} onClick={() => this.hide(h)}>
              {titleCase(h)}
            </Span>
          ))}
        </Text.s>

        <Table>
          <tbody>
            <HeaderRow>{visibleHeaders.map(headerCell)}</HeaderRow>
            {filledOrders.map(row)}
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default TableComponent
