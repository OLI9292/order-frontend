import * as React from "react"
import { isEqual } from "lodash"

import { fetchAccountTrades, AccountTrade } from "../../models/accountTrade"
import Table from "../table"
import { DateRange } from "../home/index"

interface State {
  accountTrades: AccountTrade[]
}

interface Props {
  dateRange?: DateRange
  setError: (error?: string) => void
}

class AccountTrades extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      accountTrades: []
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
    const accountTrades = await fetchAccountTrades(startDate, endDate)
    if (accountTrades instanceof Error) {
      this.props.setError(accountTrades.message)
    } else {
      accountTrades.length === 0
        ? this.props.setError("No data found for this date range.")
        : this.setState({ accountTrades })
    }
  }

  public render() {
    return (
      <div style={{ height: "80vh" }}>
        <Table editableFields={[]} data={this.state.accountTrades} />
      </div>
    )
  }
}

export default AccountTrades
