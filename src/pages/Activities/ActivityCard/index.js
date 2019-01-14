import React, { Component } from 'react';
import { Pane, Text } from 'evergreen-ui'
import { Link } from 'react-router-dom'

export default class ActivityCard extends Component {
  render() {
    return (
      <Link to={`/activities/${this.props.activity.id}`}>
        <Pane
          elevation={1}
          float="left"
          width='20%'
          height={120}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text>{this.props.activity.name}</Text>
        </Pane>
      </Link>
    );
  }
}
