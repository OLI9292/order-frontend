import * as React from "react"
import { Redirect } from "react-router"

import Table from "../table"
import FileUpload from "../common/fileUpload"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"

import { Container } from "./components"
import Header from "../common/header"

import { fetchFilledOrders, FilledOrder } from "../../models/filledOrder"

interface Props {
  logout: (cb: () => void) => void
}

interface State {
  filledOrders: FilledOrder[]
  redirect?: string
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      filledOrders: []
    }
  }

  public async componentDidMount() {
    const filledOrders = await fetchFilledOrders()
    if (!(filledOrders instanceof Error)) {
      this.setState({ filledOrders })
    }
  }

  public render() {
    const { redirect, filledOrders } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <FlexedDiv height={"120px"} justifyContent={"space-between"}>
          <Header.m>Transactions</Header.m>
          <FlexedDiv>
            <FileUpload />
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
        <Table filledOrders={filledOrders} />
      </Container>
    )
  }
}

export default Home
