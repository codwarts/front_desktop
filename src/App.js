import React, { Component } from 'react';
import { Redirect, Switch, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import styled from 'styled-components'
import config from './config.js'
import './App.css';
import Home from './pages/Home'
import Courses from './pages/Courses'
import Activity from './pages/Activity'
import Register from './pages/Auth/Register'
import SignIn from './pages/Auth/SignIn'
import Header from './components/Header'
import Landing from './pages/Landing'
import AppLayout from './layouts/AppLayout'
import UserLayout from './layouts/UserLayout'

const StyledApp = styled.div`

`

const DashboardRoute = ({ component: Component, ...rest }) => {

  console.log(rest)
  const isAuthenticated = () => !!(rest.user
           && rest.user.email)
  if (isAuthenticated()) {
    return (
      <Route
        {...rest}
        render={matchProps => (
          <AppLayout path={rest.path}>
            <Component {...matchProps} />
          </AppLayout>
        )}
      />
    )
  }
  return (
    <Redirect to={{
      pathname: '/auth',
      state: { from: rest.location },
    }}
    />
  )
}

const LoginLayoutRoute = ({ ...rest }) => (
  <Route
    {...rest}
    render={matchProps => (
      <UserLayout>
        <h1>Mes couilles</h1>
        <Component {...matchProps} />
      </UserLayout>
    )}
  />
)

class App extends Component {
  render() {
    const { user } = this.props
    let HomeComponent = Landing
    if (user) {
      HomeComponent = Courses
    }

    return (
      <StyledApp>
        <Switch>
          <LoginLayoutRoute exact path='/auth' component={SignIn} />
          <LoginLayoutRoute exact path='/auth/register' component={Register} />
          <DashboardRoute
            path='/courses'
            component={Courses}
            {... this.props}
          />
        </Switch>
      </StyledApp>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.user,
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App))
