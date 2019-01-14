import React, { Component } from 'react';
import styled from 'styled-components'
import { Pane, Heading, Button, Text } from 'evergreen-ui'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReservationForm from '../../components/ReservationForm'
import {
  fetchActivities,
} from '../../modules/activities'

const StyledActivity = styled.div`

`

class index extends Component {
  constructor(props) {
    super(props)
    props.fetchActivities()
  }

  render() {
    const { activity } = this.props
    if (!activity) {
      return null
    }
    return (
      <StyledActivity>
        <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>{activity.name}</Heading>
          </Pane>
        </Pane>
        <Pane clearfix>
          <Pane
            elevation={0}
            float="left"
            backgroundColor="white"
            padding={20}
            width={'80%'}
          >
            <h3>{activity.name}</h3>
            <p size={300}>Description</p>
          </Pane>
          <Pane
            elevation={1}
            float="left"
            width={'20%'}
            padding={20}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <ReservationForm
              activity={activity}
            />
          </Pane>
        </Pane>
      </StyledActivity>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  activity: state.activities.all_activities.find(p => p.id === parseInt(ownProps.match.params.id)),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchActivities,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(index))
