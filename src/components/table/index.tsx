import * as React from "react"
import {
  includes,
  without,
  reject,
  findIndex,
  sortBy,
  intersection,
  uniq
} from "lodash"
import { titleCase } from "change-case"

import Text from "../common/text"
import ColumnSettings from "./columnSettings"
import RowComponent from "./row"

import DragScroll from "react-dragscroll"

import { HeaderRow, TableHeader, Container, Table, Span } from "./components"

import colors from "../../lib/colors"
import FlexedDiv from "../common/flexedDiv"

export interface Sort {
  header: string
  ascending: boolean
}

interface Props {
  data: any[]
  editableFields: string[]
  updated?: (ids: string[], header: string, newValue: string) => void
}

interface State {
  hidden: string[]
  sort: Sort
  isMoving?: number
  headers?: string[]
  isEditing: string
  holdingShift: boolean
  selectedRows: number[]
  data: any[]
}

class TableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hidden: [
        "external_order_id",
        "bunched_order_id",
        "account_trade_id",
        "strategy_trade_id",
        "bunched_trade_id",
        "executing_account_id",
        "commissions",
        "trader_id",
        "clearing_account_id",
        "settlement_date"
      ],
      holdingShift: false,
      isEditing: "",
      selectedRows: [],
      sort: { header: "id", ascending: true },
      data: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public componentDidMount() {
    this.setHeaders(this.props.data)
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setHeaders(nextProps.data)
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

  public setHeaders(data: any[]) {
    const state: any = {}
    state.data = data
    if (data.length) {
      state.headers = Object.keys(data[0])
    }
    this.setState(state)
  }

  public sortBy(header: string, ascending: boolean) {
    const sort = { header, ascending }
    let data = sortBy(this.state.data, sort.header)
    if (!sort.ascending) {
      data = data.reverse()
    }
    this.setState({ sort, data })
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

  public selectedRow(i: number, selected: boolean) {
    this.setState({
      selectedRows: selected
        ? this.state.selectedRows.concat(i)
        : without(this.state.selectedRows, i)
    })
  }

  public updated(rowIdx: number, header: string, newValue: string) {
    const { selectedRows, data } = this.state
    const ids = uniq(selectedRows.concat(rowIdx).map(idx => data[idx].id))
    if (this.props.updated) {
      this.props.updated(ids, header, newValue)
    }
  }

  public render() {
    const {
      headers,
      isMoving,
      sort,
      isEditing,
      holdingShift,
      data
    } = this.state

    if (!headers) {
      return null
    }

    const hidden = intersection(this.state.hidden, headers)

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

    return (
      <Container>
        <FlexedDiv justifyContent="space-between">
          <Text.s hide={hidden.length === 0} color={colors.darkGrey}>
            Show:{" "}
            {hidden.map(h => (
              <Span key={h} onClick={() => this.hide(h)}>
                {titleCase(h)}
              </Span>
            ))}
          </Text.s>
        </FlexedDiv>

        <DragScroll height={"60vh"} width={"100%"}>
          <Table>
            <tbody>
              <HeaderRow>{visibleHeaders.map(headerCell)}</HeaderRow>
              {data.map((d, i) => (
                <RowComponent
                  key={i}
                  visibleHeaders={visibleHeaders}
                  rowIdx={i}
                  data={d}
                  editableFields={this.props.editableFields}
                  isEditing={isEditing}
                  editRow={key => this.setState({ isEditing: key })}
                  holdingShift={holdingShift}
                  selectedRow={this.selectedRow.bind(this)}
                  unselectAllRows={() => this.setState({ selectedRows: [] })}
                  updated={this.updated.bind(this)}
                />
              ))}
            </tbody>
          </Table>
        </DragScroll>
      </Container>
    )
  }
}

export default TableComponent
