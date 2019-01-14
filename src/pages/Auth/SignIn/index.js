import React, { Component } from 'react';
import styled from 'styled-components'
import { Pane, Heading, Button, TextInputField } from 'evergreen-ui'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  fetchUsers,
  login_user,
} from '../../../modules/users'

const StyledSignIn = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    label {
      margin: 6px 0;
    }
  }
`


class LoginUser extends Component {
  constructor() {
    super()
    this.state = {
      user: {
        email: null,
        password: null,
      }
    }
  }

  updateField = (field, value) => {
    const user = Object.assign({}, this.state.user)
    user[field] = value
    this.setState({
      user
    });
  }

  submit = () => {
    this.props.login_user(this.state.user, () => {
      this.props.history.push('/activities')
    })
  }

  render() {
    return (
      <StyledSignIn>
        <h1>Connexion</h1>
        {this.props.error ?
          <p>{this.props.error}</p>
          :
          null
        }
        <div className="form">
          <TextInputField
            name="text-input-email"
            label="Email"
            required
            placeholder="Text input placeholder..."
            onChange={(e) => this.updateField('email', e.target.value)}
          />
          <TextInputField
            name="text-input-pw"
            label="Mot de passe"
            required
            placeholder="Text input placeholder..."
            onChange={(e) => this.updateField('password', e.target.value)}
          />
          <Button onClick={this.submit}>
            Connexion
          </Button>
        </div>
      </StyledSignIn>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.all_users,
  error: state.users.error,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  login_user,
  fetchUsers,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginUser))
