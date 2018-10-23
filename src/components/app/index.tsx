import * as React from "react"
import { Route, Switch, Redirect } from "react-router"
import { Router } from "react-router-dom"

import Login from "../login"
import Home from "../home"

import history from "../../history"
import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute"

import "./index.css"

interface State {
  isAuthenticated: boolean
  checkedAuth: boolean
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      isAuthenticated: true,
      checkedAuth: false
    }
  }

  public componentDidMount() {
    this.checkForAuth()
  }

  public async checkForAuth() {
    /* TODO: - add user table
    const user = fetchUserFromStorage()
    const isAuthenticated = user !== null
    this.setState({ user, checkedAuth: true, isAuthenticated }) */
  }

  public login(cb: () => void) {
    this.setState({ isAuthenticated: true }, cb)
  }

  public logout(cb: () => void) {
    this.setState({ isAuthenticated: false }, cb)
  }

  public render() {
    const { isAuthenticated } = this.state

    /* if (!checkedAuth) {
      return null
    } */

    const defaultProtectedRouteProps: ProtectedRouteProps = {
      isAuthenticated,
      authenticationPath: "/login"
    }

    return (
      <Router history={history}>
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={() => <Login login={this.login.bind(this)} />}
          />
          <ProtectedRoute
            exact={true}
            {...defaultProtectedRouteProps}
            path="/home"
            render={() => <Home logout={this.login.bind(this)} />}
          />
          <Route render={() => <Redirect to="login" />} />
        </Switch>
      </Router>
    )
  }
}

export default App
