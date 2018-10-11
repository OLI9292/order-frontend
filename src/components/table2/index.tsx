import * as React from "react"
import { includes, without, reject, findIndex, sortBy } from "lodash"
import { titleCase } from "change-case"

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
import FlexedDiv from "../common/flexedDiv"

export interface Sort {
  header: string
  ascending: boolean
}

interface Props {
  data: any[]
  editableFields: string[]
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
      hidden: [],
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
    if (data.length) {
      const headers = Object.keys(data[0])
      this.setState({ headers, data })
    }
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

  public selectedRow(i: number) {
    let { selectedRows } = this.state
    selectedRows = includes(selectedRows, i)
      ? without(selectedRows, i)
      : selectedRows.concat(i)
    this.setState({ selectedRows })
  }

  public render() {
    const {
      headers,
      hidden,
      isMoving,
      sort,
      isEditing,
      holdingShift,
      selectedRows,
      data
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

    const row = (d: any, i: number) => (
      <Row selected={includes(selectedRows, i)} key={i}>
        {visibleHeaders.map((k: string) => (
          <Cell
            key={`${k}-${i}`}
            rowIdx={i}
            value={d[k]}
            isEditable={includes(this.props.editableFields, k)}
            isEditing={isEditing}
            header={k}
            holdingShift={holdingShift}
            editRow={key => this.setState({ isEditing: key })}
            selectedRow={this.selectedRow.bind(this)}
            updated={() => console.log("updated") /*this.updated.bind(this)*/}
            unselectAllRows={() => this.setState({ selectedRows: [] })}
          />
        ))}
      </Row>
    )

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

        <Table>
          <tbody>
            <HeaderRow>{visibleHeaders.map(headerCell)}</HeaderRow>
            {data.map(row)}
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default TableComponent
