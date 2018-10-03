import * as React from "react"
import { Redirect } from "react-router"

import Table from "../table"
import FileUpload from "../common/fileUpload"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"
import Text from "../common/text"

import { Container } from "./components"
import Header from "../common/header"

import { fetchFilledOrders, FilledOrder } from "../../models/filledOrder"

import colors from "../../lib/colors"

interface Props {
  logout: (cb: () => void) => void
}

interface State {
  filledOrders: FilledOrder[]
  redirect?: string
  error?: string
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      filledOrders: []
    }
  }

  public async componentDidMount() {
    const result = await fetchFilledOrders()
    if (!(result instanceof Error)) {
      this.setState({ filledOrders: result, error: undefined })
    } else {
      this.setState({ error: result.message })
    }
  }

  public uploadedFilledOrders(filledOrders: FilledOrder[]) {
    this.setState({
      filledOrders: this.state.filledOrders.concat(filledOrders),
      error: undefined
    })
  }

  public render() {
    const { redirect, filledOrders } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <FlexedDiv height={"100px"} justifyContent={"space-between"}>
          <Header.m>Transactions</Header.m>
          <FlexedDiv>
            <FileUpload
              setError={error => this.setState({ error })}
              uploadedFilledOrders={this.uploadedFilledOrders.bind(this)}
            />
            <Button.m
              onClick={() =>
                this.props.logout(() => this.setState({ redirect: "/login" }))
              }
              margin={"0 0 0 10px"}
            >
              Logout
            </Button.m>
          </FlexedDiv>
        </FlexedDiv>
        <Text.s margin={"0"} height={"20px"} color={colors.red}>
          {this.state.error}
        </Text.s>
        <Table
          setError={error => this.setState({ error })}
          filledOrders={filledOrders}
        />
      </Container>
    )
  }
}

export default Home
