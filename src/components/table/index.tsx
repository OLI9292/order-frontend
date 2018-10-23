import * as React from "react"
import {
  includes,
  omit,
  reject,
  findIndex,
  sortBy,
  intersection,
  without,
  uniq,
  isEmpty
} from "lodash"
import { titleCase } from "change-case"

import Text from "../common/text"
import Header from "../common/header"
import Input from "../common/input"
import Button from "../common/button"
import { DimOverlay, Modal } from "../common/modal"
import ColumnSettings from "./columnSettings"
import RowComponent from "./row"

import DragScroll from "react-dragscroll"

import {
  HeaderRow,
  TableHeader,
  Container,
  Table,
  Span,
  RowCountBox,
  DeselectSpan
} from "./components"

import colors from "../../lib/colors"
import { selectedIds } from "../../lib/helpers"
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
  isEditing?: string
  holdingShift: boolean
  data: any[]
  deselectCount: number
  selectedAllCount: number
  selected: number[]
  isHoveringHeader?: string
  filters: any
  isFilteringHeader?: string
  filterInput?: string
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
      sort: { header: "id", ascending: true },
      data: [],
      deselectCount: 0,
      selectedAllCount: 0,
      selected: [],
      filters: {}
    }
  }

  public componentDidMount() {
    this.setHeaders(this.props.data)
  }

  public componentWillReceiveProps(nextProps: Props) {
    this.setHeaders(nextProps.data)
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

  public updated(id: string, header: string, newValue: string) {
    const ids = uniq(selectedIds().concat(id))
    if (this.props.updated) {
      this.props.updated(ids, header, newValue)
      this.deselect()
    }
  }

  public selectedRow(rowIdx: number) {
    let { selected } = this.state
    selected = includes(selected, rowIdx)
      ? without(selected, rowIdx)
      : selected.concat(rowIdx)
    this.setState({ selected })
  }

  public deselect() {
    this.setState({ selected: [], deselectCount: this.state.deselectCount + 1 })
  }

  public selectAll() {
    const selected = this.state.data
      .map((d, i) => (this.matchesFilters(d) ? i : -1))
      .filter(i => i > -1)
    const selectedAllCount = this.state.selectedAllCount + 1
    this.setState({ selected, selectedAllCount })
  }

  public filter(header: string, value?: string) {
    const { filters } = this.state
    if (value) {
      filters[header] = value
    }
    this.setState(
      {
        filters,
        isFilteringHeader: undefined,
        filterInput: undefined
      },
      this.deselect
    )
  }

  public matchesFilters(d: any): boolean {
    const { filters } = this.state
    for (const header of Object.keys(filters)) {
      if (filters[header] !== d[header]) {
        return false
      }
    }
    return true
  }

  public render() {
    const {
      headers,
      isMoving,
      sort,
      isEditing,
      holdingShift,
      data,
      deselectCount,
      selectedAllCount,
      selected,
      isHoveringHeader,
      isFilteringHeader,
      filters,
      filterInput
    } = this.state

    if (!headers) {
      return null
    }

    const filterModal = isFilteringHeader && (
      <div>
        <DimOverlay
          onClick={() =>
            this.setState({
              isFilteringHeader: undefined,
              filterInput: undefined
            })
          }
        />
        <Modal>
          <Header.ms margin="0 0 20px 0">
            Filter {titleCase(isFilteringHeader)}
          </Header.ms>
          <Input.m
            onChange={e => this.setState({ filterInput: e.target.value })}
            value={filterInput}
            underline={true}
            placeholder="Value"
            type="text"
          />
          <Button.m onClick={() => this.filter(isFilteringHeader, filterInput)}>
            Filter
          </Button.m>
        </Modal>
      </div>
    )

    const hidden = intersection(this.state.hidden, headers)

    const visibleHeaders = reject(headers, h => includes(hidden, h))

    const highlightMove = (h: string): boolean =>
      isMoving !== undefined && headers[isMoving] === h

    const headerCell = (k: string) => (
      <TableHeader
        onMouseEnter={() => this.setState({ isHoveringHeader: k })}
        onMouseLeave={() => this.setState({ isHoveringHeader: undefined })}
        key={k}
      >
        <p>{titleCase(k)}</p>
        <ColumnSettings
          isHoveringHeader={isHoveringHeader}
          sort={sort}
          highlightMove={highlightMove(k)}
          move={this.move.bind(this)}
          sortBy={this.sortBy.bind(this)}
          hide={this.hide.bind(this)}
          filter={(header: string) =>
            this.setState({ isFilteringHeader: header })
          }
          filters={filters}
          header={k}
        />
      </TableHeader>
    )

    return (
      <Container>
        {filterModal}

        <FlexedDiv justifyContent="space-between">
          <Text.s
            margin="5px 0"
            hide={isEmpty(filters)}
            color={colors.darkGrey}
          >
            Filters:{" "}
            {Object.keys(filters).map((header: string) => (
              <Span
                key={header}
                onClick={() =>
                  this.setState({ filters: omit(filters, header) })
                }
              >
                {titleCase(header)} = {filters[header]}
              </Span>
            ))}
          </Text.s>
        </FlexedDiv>

        <FlexedDiv justifyContent="space-between">
          <Text.s
            margin="5px 0"
            hide={hidden.length === 0}
            color={colors.darkGrey}
          >
            Hidden columns:{" "}
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
              <HeaderRow>
                <TableHeader slim={true} />
                {visibleHeaders.map(headerCell)}
              </HeaderRow>
              {data.filter(this.matchesFilters.bind(this)).map((d, i) => (
                <RowComponent
                  deselectCount={deselectCount}
                  selectedAllCount={selectedAllCount}
                  key={i}
                  visibleHeaders={visibleHeaders}
                  rowIdx={i}
                  data={d}
                  editableFields={this.props.editableFields}
                  isEditing={isEditing}
                  editRow={key => this.setState({ isEditing: key })}
                  holdingShift={holdingShift}
                  updated={this.updated.bind(this)}
                  selectedRow={this.selectedRow.bind(this)}
                />
              ))}
            </tbody>
          </Table>
        </DragScroll>

        <RowCountBox>
          <Text.s margin="5px 0" color={colors.darkGrey}>
            {selected.length} row
            {selected.length === 1 ? "" : "s"} selected
            {selected.length > 0 && (
              <span>
                {" ( "}
                <DeselectSpan onClick={this.deselect.bind(this)}>
                  deselect all
                </DeselectSpan>
                {" ) "}
              </span>
            )}
          </Text.s>
          <Text.s
            onClick={this.selectAll.bind(this)}
            clickable={true}
            margin="5px 0"
            color={colors.blue}
          >
            Select all
          </Text.s>
        </RowCountBox>
      </Container>
    )
  }
}

export default TableComponent
