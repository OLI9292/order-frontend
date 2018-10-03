import * as React from "react"
import { Redirect } from "react-router"

import Header from "../common/header"
import Input from "../common/input"
import { Container, Form, ErrorMessage } from "./components"

import { login } from "../../models/user"

export interface Props {
  login: (cb: () => void) => void
}

interface State {
  username: string
  password: string
  error?: string
  redirect?: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: "",
      password: ""
    }
  }

  public async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { username, password } = this.state
    if (!username || !password) {
      this.setState({ error: "Username & password are required." })
    } else {
      const success = await login(username, password)
      if (success instanceof Error) {
        this.setState({ error: "Incorrect login." })
      } else {
        this.props.login(() => this.setState({ redirect: "/home" }))
      }
    }
  }

  public render() {
    const { redirect, username, password, error } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <Header.m>Admin</Header.m>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Input.m
            onChange={e => this.setState({ username: e.target.value })}
            value={username}
            autoCapitalize={"none"}
            placeholder="Username"
            type="text"
          />
          <Input.m
            onChange={e => this.setState({ password: e.target.value })}
            value={password}
            autoCapitalize={"none"}
            placeholder="Password"
            type="text"
          />
          <Input.submit type="submit" />
        </Form>

        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    )
  }
}

export default Login
