import React, { Component } from 'react';
import styled from 'styled-components'
import {
  SearchInput,
  Button,
  Autocomplete,
  TextInput,
} from 'evergreen-ui'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  logout_user,
} from '../../modules/users'

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10%;
  a {
    text-decoration: none;
  }
  .searcher {
    display: flex;
  }
`

class Header extends Component {
  constructor() {
    super()
    this.state = {
      toSearch: ''
    }
  }

  search = () => {
    this.props.history.push(`/activities?type=${this.state.toSearch}`)
  }

  render() {

    if (this.props.user.id) {
      return (
        <StyledHeader>
          <div>
            <Link to='/'>
              <p>Alesta</p>
            </Link>
          </div>
          <div className='searcher'>
            <Autocomplete
              title="Activités"
              onChange={(changedItem) => {
                // this.setState({ toSearch: changedItem })
                this.props.history.push(`/activities?type=${changedItem}`)
              }}
              items={this.props.activities.map(ac => ac.name)}
            >
              {(props) => {
                const { getInputProps, getRef, inputValue } = props
                return (
                  <TextInput
                    placeholder="Chercher une activité..."
                    value={inputValue}
                    innerRef={getRef}
                    {...getInputProps()}
                  />
                )
              }}
            </Autocomplete>
            {this.props.location.search ?
            <Button onClick={() => this.props.history.push('/activities')}>x</Button>
            :
            null
            }
          </div>
          <div>
            <Button onClick={this.props.logout_user}>Déconnexion</Button>
          </div>
        </StyledHeader>
      );
    }

    return (
      <StyledHeader>
        <div>
          <Link to='/'>
            <p>Alesta</p>
          </Link>
        </div>
        <div>
          <SearchInput placeholder="Chercher une activité..." />
        </div>
        <div className='rightButtons'>
          <Link to='/register'><Button>Inscription</Button></Link>
          <Link to='/login'><Button>Connexion</Button></Link>
        </div>
      </StyledHeader>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.user,
  activities: state.activities.all_activities,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout_user,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header))
