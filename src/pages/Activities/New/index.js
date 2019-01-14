import React, { Component } from 'react';
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toaster } from 'evergreen-ui'
import { withRouter } from 'react-router-dom'
import ActivityForm from '../../../components/ActivityForm'

const styledNewActivity = styled.div`

`

class NewActivity extends Component {
  render() {

    if (!this.props.user.id) {
      toaster.notify('Veuillez vous connecter pour ajouter une activité')
      this.props.history.push('/activities')
    }

    return (
      <styledNewActivity>
        <ActivityForm />
      </styledNewActivity>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.user,
})

export default withRouter(connect(
  mapStateToProps,
  null,
)(NewActivity))
