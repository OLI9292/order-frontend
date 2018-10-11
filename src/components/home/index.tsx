import * as React from "react"
import { Redirect } from "react-router"
import { without } from "lodash"

import AccountTradesTable from "../accountTrades"
import FilledOrdersTable from "../filledOrders"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"

import { Container } from "./components"
import Header from "../common/header"

import colors from "../../lib/colors"

interface Props {
  logout: (cb: () => void) => void
}

interface State {
  redirect?: string
  table: TableType
}

enum TableType {
  trade = "trade",
  accountTrade = "accountTrade",
  groupedTrade = "groupedTrade"
}

const allTableTypes = [
  TableType.trade,
  TableType.accountTrade,
  TableType.groupedTrade
]

const headers = {
  trade: "Trade",
  accountTrade: "Account Trade",
  groupedTrade: "Grouped Trade"
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      table: TableType.trade
    }
  }

  public render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <FlexedDiv height={"100px"} justifyContent={"space-between"}>
          <FlexedDiv alignItems="flex-start">
            <Header.m margin="0 25px 0 0">{headers[this.state.table]}</Header.m>
            {without(allTableTypes, this.state.table).map(table => (
              <Header.s
                margin="0 0 0 10px"
                cursor="pointer"
                color={colors.grey}
                key={table}
                onClick={() => this.setState({ table })}
              >
                {headers[table]}
              </Header.s>
            ))}
          </FlexedDiv>
          <Button.m
            onClick={() =>
              this.props.logout(() => this.setState({ redirect: "/login" }))
            }
            margin="0 0 0 10px"
          >
            Logout
          </Button.m>
        </FlexedDiv>

        {
          {
            trade: <FilledOrdersTable />,
            accountTrade: <AccountTradesTable />
          }[this.state.table]
        }
      </Container>
    )
  }
}

export default Home
