import * as React from "react"
import * as moment from "moment"
import { Redirect } from "react-router"
import { without } from "lodash"

import "react-dates/lib/css/_datepicker.css"
import "react-dates/initialize"
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates"

import AccountTradesTable from "../accountTrades"
import FilledOrdersTable from "../filledOrders"
import GroupedTradesTable from "../groupedTrades"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"
import Text from "../common/text"
import colors from "../../lib/colors"

import { Container, UpperContainer } from "./components"
import Header from "../common/header"

interface Props {
  logout: (cb: () => void) => void
}

interface State {
  redirect?: string
  table: TableType
  error?: string
  startDate: moment.Moment | null
  endDate: moment.Moment | null
  focusedInput: "startDate" | "endDate" | null
}

export type DateRange = [string, string]

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
      table: TableType.trade,
      startDate: moment().subtract(30, "days"),
      endDate: moment(),
      focusedInput: null
    }
  }

  public setError(error?: string) {
    this.setState({ error })
  }

  public render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const dateRange: DateRange | undefined =
      this.state.startDate && this.state.endDate
        ? [
            this.state.startDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            this.state.endDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
          ]
        : undefined

    return (
      <Container>
        <UpperContainer>
          <FlexedDiv height={"100px"} justifyContent={"space-between"}>
            <FlexedDiv alignItems="flex-start">
              <Header.m margin="0 25px 0 0">
                {headers[this.state.table]}
              </Header.m>
              {without(allTableTypes, this.state.table).map(table => (
                <Header.s
                  margin="0 0 0 10px"
                  cursor="pointer"
                  color={colors.grey}
                  key={table}
                  onClick={() => this.setState({ table }, this.setError)}
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

          <DateRangePicker
            startDate={this.state.startDate}
            startDateId="1111"
            endDate={this.state.endDate}
            endDateId="2222"
            onDatesChange={({ startDate, endDate }) =>
              this.setState({ startDate, endDate })
            }
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
          />

          <Text.s margin={"0"} height={"20px"} color={colors.red}>
            {this.state.error}
          </Text.s>
        </UpperContainer>

        {
          {
            trade: (
              <FilledOrdersTable
                dateRange={dateRange}
                setError={this.setError.bind(this)}
              />
            ),
            accountTrade: (
              <AccountTradesTable setError={this.setError.bind(this)} />
            ),
            groupedTrade: (
              <GroupedTradesTable setError={this.setError.bind(this)} />
            )
          }[this.state.table]
        }
      </Container>
    )
  }
}

export default Home
