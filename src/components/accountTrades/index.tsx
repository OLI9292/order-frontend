import * as React from "react"

import { fetchAccountTrades, AccountTrade } from "../../models/accountTrade"
import Table from "../table2"

interface State {
  accountTrades: AccountTrade[]
}

class TableComponent extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      accountTrades: []
    }
  }

  public async componentDidMount() {
    const accountTrades = await fetchAccountTrades()
    if (!(accountTrades instanceof Error)) {
      this.setState({ accountTrades })
    } else {
      console.log(accountTrades.message)
    }
  }

  public render() {
    const { accountTrades } = this.state
    return <Table editableFields={[]} data={accountTrades} />
  }
}

export default TableComponent
