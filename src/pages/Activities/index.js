import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Pane, Button, Text, Heading } from 'evergreen-ui'
import {
  fetchActivities,
} from '../../modules/activities'
import ActivityCard from './ActivityCard'

const styledActivities = styled.div`

`

class index extends Component {
  constructor(props) {
    super(props)
    props.fetchActivities()
  }

  renderActivities = () => {
    let activities = this.props.activities
    if (this.props.location.search) {
      let term = this.props.location.search.split('=')[1]
      console.log(term)
      activities = this.props.activities.filter((a) => {
        console.log(a.name, term)
        return a.name.toLowerCase().includes(term.toLowerCase())
      })
    }

    return (
      <Pane clearfix>
        {activities.map(activity => <ActivityCard activity={activity} /> )}
      </Pane>
    )
  }

  render() {
    return (
      <styledActivities>
        <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
          <Pane flex={1} alignItems="center" display="flex">
            <Heading size={600}>Activités</Heading>
          </Pane>
          <Pane>
            <Link to='/activity/new'>
              <Button appearance="primary">Ajouter une activité</Button>
            </Link>
          </Pane>
        </Pane>
        {this.renderActivities()}
      </styledActivities>
    );
  }
}

const mapStateToProps = state => ({
  activities: state.activities.all_activities,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchActivities,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(index))
