import * as React from "react"
import { includes, without, reject, findIndex, sortBy } from "lodash"
import { titleCase } from "change-case"
import { FilledOrder, EDITABLE_FIELDS } from "../../models/filledOrder"

import Text from "../common/text"
import ColumnSettings from "./columnSettings"

import {
  HeaderRow,
  TableHeader,
  Cell,
  Container,
  Table,
  Span,
  Row,
  RowInput
} from "./components"
import colors from "../../lib/colors"

export interface Sort {
  header: string
  ascending: boolean
}

interface Props {
  filledOrders: FilledOrder[]
}

interface State {
  hidden: string[]
  sort: Sort
  isMoving?: number
  headers?: string[]
  isEditing: string
  holdingShift: boolean
  selectedRows: number[]
}

const sortRows = (filledOrders: FilledOrder[], sort: Sort): FilledOrder[] => {
  filledOrders = sortBy(filledOrders, sort.header)
  if (!sort.ascending) {
    filledOrders = filledOrders.reverse()
  }
  return filledOrders
}

class TableComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hidden: [],
      holdingShift: false,
      isEditing: "",
      selectedRows: [],
      sort: { header: "id", ascending: true }
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
      this.setState({ headers })
    }
  }

  public sortBy(header: string, ascending: boolean) {
    const sort = { header, ascending }
    this.setState({ sort })
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

  public render() {
    const { filledOrders } = this.props

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

    const cell = (header: string, rowIdx: number, value: any) => {
      const isEditable = includes(EDITABLE_FIELDS, header)
      const key = `${header}-${rowIdx}`
      return (
        <Cell
          holdingShift={holdingShift}
          onClick={() => {
            if (holdingShift) {
              this.selectedRow(rowIdx)
            } else if (isEditable) {
              this.setState({ isEditing: key })
            }
          }}
          editable={isEditable}
          key={key}
        >
          {isEditing === key ? <RowInput autoFocus={true} /> : value}
        </Cell>
      )
    }

    const row = (data: FilledOrder, i: number) => (
      <Row selected={includes(selectedRows, i)} key={i}>
        {visibleHeaders.map((k: string) => cell(k, i, data[k]))}
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
            {sortRows(filledOrders, sort).map(row)}
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default TableComponent
