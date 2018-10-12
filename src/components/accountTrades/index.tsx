import * as React from "react"

import { fetchAccountTrades, AccountTrade } from "../../models/accountTrade"
import Table from "../table"

interface State {
  accountTrades: AccountTrade[]
}

interface Props {
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
    const accountTrades = await fetchAccountTrades()
    accountTrades instanceof Error
      ? this.props.setError(accountTrades.message)
      : this.setState({ accountTrades })
  }

  public render() {
    const { accountTrades } = this.state
    return <Table editableFields={[]} data={accountTrades} />
  }
}

export default AccountTrades
