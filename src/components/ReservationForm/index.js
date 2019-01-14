import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import DatePicker from "react-datepicker";
import {
  Button,
  toaster,
  SideSheet,
  Pane,
  Heading,
  Paragraph,
  Select
} from 'evergreen-ui'
import {
  create_reservation,
} from '../../modules/reservations.js'

import "react-datepicker/dist/react-datepicker.css";

const StyledReservationForm = styled.div`
  .formField {
    display: flex;
    flex-direction: column;
  }

`

class ReservationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShown: false,
      reservation: {
        activity_id: props.activity.id,
        participants: 0,
        date: new Date(),
      }
    }
  }

  submitActivity = () => {
    this.props.create_reservation(this.state.reservation, () => {
      toaster.notify('Réservation confirmée !')
      this.setState({ isShown: false })
    })
  }

  handleChange = (date) => {
    this.setState({
      reservation: Object.assign({}, this.state.reservation, {
        date
      })
    });
  }

  setParticipants = (value) => {
    this.setState({
      reservation: Object.assign({}, this.state.reservation, {
        participants: value
      })
    });
  }

  renderOptions = () => {
    const optionsArray = Array.apply(null, {length: this.props.activity.capacity || 5}).map(Number.call, Number)
    const options = optionsArray.map((cur) => {
      console.log(cur)
      return <option value={cur + 1}>{cur + 1}</option>
    })
    return options
  }

  render() {
    return (
      <StyledReservationForm>
        <SideSheet
          isShown={this.state.isShown}
          onCloseComplete={() => this.setState({ isShown: false })}
          padding={20}
        >
          <Pane padding={16} borderBottom="muted">
            <Heading size={600}>Réservation</Heading>
            <Paragraph size={400} color="muted">
              {this.props.activity.name}
            </Paragraph>
          </Pane>
          <Pane padding={16} borderBottom="muted">
            <div className="form">
              <div className='formField'>
                <p htmlFor="lol">Nombre de participants</p>
                <Select
                  onChange={event => this.setParticipants(event.target.value)}
                >
                  {this.renderOptions()}
                </Select>
              </div>
              <div className='formField'>
                <p>Date</p>
                <DatePicker
                  selected={this.state.reservation.date}
                  onChange={this.handleChange}
                />
              </div>
              <Button onClick={this.submitActivity}>
                Réserver
              </Button>
            </div>
          </Pane>
        </SideSheet>
        <Button onClick={() => this.setState({ isShown: true })}>
          Réserver
        </Button>
      </StyledReservationForm>
    );
  }
}

const mapStateToProps = state => ({
  activities: state.activities.all_activities,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  create_reservation,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReservationForm))
