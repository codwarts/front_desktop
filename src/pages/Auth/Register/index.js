import React, { Component } from 'react';
import styled from 'styled-components'
import { Pane, Heading, Button, TextInput } from 'evergreen-ui'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  fetchUsers,
  create_user,
} from '../../../modules/users'

const StyledRegister = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    label {
      margin: 6px 0;
    }
  }
`


class NewUser extends Component {
  constructor() {
    super()
    this.state = {
      newUser: {
        email: null,
        password: null,
        passwordConfirm: null
      }
    }
  }

  updateField = (field, value) => {
    const newUser = Object.assign({}, this.state.newUser)
    newUser[field] = value
    this.setState({
      newUser
    });
  }

  submitUser = () => {
    this.props.create_user(this.state.newUser, () => {
      this.props.history.push('/activities')
    })
  }

  render() {
    return (
      <StyledRegister>
        <h1>Inscription</h1>
        <div className="form">
          <label htmlFor="">email</label>
          <TextInput
            name="text-input-email"
            placeholder="Text input placeholder..."
            onChange={(e) => this.updateField('email', e.target.value)}
          />
          <label htmlFor="">mot de passe</label>
          <TextInput
            name="text-input-pw"
            placeholder="Text input placeholder..."
            onChange={(e) => this.updateField('password', e.target.value)}
          />
          <label htmlFor="">mot de passe (confirmer)</label>
          <TextInput
            name="text-input-pwc"
            placeholder="Text input placeholder..."
            onChange={(e) => this.updateField('passwordConfirm', e.target.value)}
          />
          <Button onClick={this.submitUser}>
            Créer
          </Button>
        </div>
      </StyledRegister>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.all_users,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  create_user,
  fetchUsers,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewUser))
