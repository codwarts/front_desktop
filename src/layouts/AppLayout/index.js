import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import Header from '../../components/Header'
import NavMenu from '../../components/NavMenu'

const PanopliContentOpen = styled.div`
  margin-left: ${props => props.collapsed ? '65px' : '200px'};
  margin-top: 65px;
  background-color: #fefefe;
  color: #222;
  font-family: 'Montserrat';
  display: flex;
  text-align: left;
`

const StyledAppLayout = styled.div`

`

class AppLayout extends Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
      collapsedcart: true,
      rgpd: true,
    }
  }

  onCollapse = () => {
    // window.dispatchEvent(new Event('resize'))
    const { collapsed } = this.state
    this.setState({ collapsed: !collapsed })
  }

  render() {
    const {
      path,
      children,
      user,
    } = this.props
    const { collapsed, collapsedcart, rgpd } = this.state
    return (
      <StyledAppLayout style={{ minHeight: '100vh' }}>
        <NavMenu
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        />
        <Header
          onCollapse={this.onCollapse}
          collapsed={collapsed}
          location={path}
          collapsedcart={collapsedcart}
          togglecart={this.onCollapseCartMenu}
        />
        <PanopliContentOpen collapsed={collapsed} id='app-content'>
          {children}
        </PanopliContentOpen>
      </StyledAppLayout>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

const mapStateToProps = state => ({
  user: state.users.user,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLayout)
