import React, { Component } from 'react'
import styled from 'styled-components'

const StyledUserLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default class UserLayout extends Component {
  render() {
    return (
      <StyledUserLayout style={{ minHeight: '100vh' }}>
        <p>LOL</p>
        {this.props.children}
      </StyledUserLayout>
    )
  }
}
