import * as React from "react"
import { isEqual } from "lodash"

import Table from "../table"
import Button from "../common/button"
import FlexedDiv from "../common/flexedDiv"

import { DateRange } from "../home/index"

import {
  undoAllocation,
  fetchGroupedTrades,
  GroupedTrade
} from "../../models/groupedTrade"

import { selectedIds } from "../../lib/helpers"

interface State {
  groupedTrades: GroupedTrade[]
}

interface Props {
  dateRange?: DateRange
  setError: (error?: string) => void
}

class GroupedTrades extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      groupedTrades: []
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
    const groupedTrades = await fetchGroupedTrades(startDate, endDate)
    if (groupedTrades instanceof Error) {
      this.props.setError(groupedTrades.message)
    } else {
      this.setState({ groupedTrades })
      if (groupedTrades.length === 0) {
        this.props.setError("No data found for this date range.")
      }
    }
  }

  public async undoAllocation() {
    const { groupedTrades } = this.state
    const ids = selectedIds()
    if (ids.length !== 1) {
      this.props.setError("Please highlight 1 grouped trade to undo.")
    } else {
      const id = ids[0]
      const result = await undoAllocation(id)
      result instanceof Error
        ? this.props.setError(result.message)
        : this.setState(
            { groupedTrades: groupedTrades.filter(t => t.id !== id) },
            this.props.setError
          )
    }
  }

  public render() {
    return (
      <div style={{ height: "80vh" }}>
        <Table editableFields={[]} data={this.state.groupedTrades} />

        <FlexedDiv
          style={{ position: "absolute", bottom: "20px" }}
          margin="10px 0 0 0"
        >
          <Button.m
            white={true}
            margin="0 10px 0 0"
            onClick={this.undoAllocation.bind(this)}
          >
            Undo Allocation
          </Button.m>
        </FlexedDiv>
      </div>
    )
  }
}

export default GroupedTrades
