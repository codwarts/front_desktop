import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button,
  TextInputField,
  toaster,
} from 'evergreen-ui'
import {
  fetchActivities,
  create_activity,
} from '../../modules/activities.js'

const StyledNewActivity = styled.div`
  .form {
    .formField {
      display: flex;
      flex-direction: column;
    }
  }
`

class ActivityForm extends Component {
  constructor() {
    super()
    this.state = {
      activity: {
        name: null,
        duration: null,
        owner_id: 1,
        price: null,
      }
    }
  }

  updateField = (field, value) => {
    const newActivity = Object.assign({}, this.state.activity)
    newActivity[field] = value
    this.setState({
      activity: newActivity
    });
  }

  submitActivity = () => {
    this.props.create_activity(this.state.activity, () => {
      this.props.history.push('/activities')
      toaster.notify('Activité créée !!')
    })
  }

  render() {
    return (
      <StyledNewActivity>
        <h1>Activité</h1>
        <div className="form">
          <div className='formField'>
            <TextInputField
              label='Nom'
              name="text-input-email"
              placeholder="Text input placeholder..."
              onChange={(e) => this.updateField('name', e.target.value)}
            />
          </div>
          <div className='formField'>
            <TextInputField
              label='Durée'
              name="text-input-pw"
              placeholder="Text input placeholder..."
              onChange={(e) => this.updateField('duration', e.target.value)}
            />
          </div>
          <div className='formField'>
            <TextInputField
              label='Prix'
              name="text-input-pw"
              placeholder="Text input placeholder..."
              onChange={(e) => this.updateField('price', e.target.value)}
            />
          </div>
          <Button onClick={this.submitActivity}>
            Créer
          </Button>
        </div>
      </StyledNewActivity>
    );
  }
}

const mapStateToProps = state => ({
  activities: state.activities.all_activities,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  create_activity,
  fetchActivities,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivityForm))
