import * as React from "react"

import { fetchGroupedTrades, GroupedTrade } from "../../models/groupedTrade"
import Table from "../table"

interface State {
  groupedTrades: GroupedTrade[]
}

interface Props {
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
    const groupedTrades = await fetchGroupedTrades()
    groupedTrades instanceof Error
      ? this.props.setError(groupedTrades.message)
      : this.setState({ groupedTrades })
  }

  public render() {
    const { groupedTrades } = this.state
    return <Table editableFields={[]} data={groupedTrades} />
  }
}

export default GroupedTrades
