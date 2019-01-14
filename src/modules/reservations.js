import axios from 'axios'
import config from '../config'
import { getAuth } from './StateLoader'
// import PNG from '../helpers/colorProfile'
// import s3 from '../services/s3'
// import { signedUpload } from '../helpers/s3'

// import hash from '../helpers/stringHash'
const THUMBNAIL_LIMIT = 200000
const initialState = {
  loading: true,
  error: false,
  all_reservations: [],
  modalOpened: false,
  editedReservationId: null,
  iconURL: null,
}

export const RECEIVE_RESERVATIONS = 'reservations/RECEIVE_RESERVATIONS'
export const ERROR_FETCHING_RESERVATIONS = 'reservations/ERROR_FETCHING_RESERVATIONS'
export const UPDATE_RESERVATIONS = 'reservations/UPDATE_RESERVATIONS'
export const UPDATE_ONE_RESERVATION = 'reservations/UPDATE_ONE_RESERVATION'
export const LOADING_RESERVATIONS = 'reservations/LOADING'
export const REINIT_RESERVATIONS = 'reservations/REINIT'
export const DELETED_RESERVATION = 'reservations/DELETED'
export const ADD_RESERVATION = 'reservation/ADD_RESERVATION'

export default function (state = initialState, action) {
  switch (action.type) {
  case REINIT_RESERVATIONS:
    return Object.assign({}, initialState)
  case LOADING_RESERVATIONS:
    return Object.assign({}, state, { loading: true })
  case ERROR_FETCHING_RESERVATIONS:
    return Object.assign({}, state, {
      error: true,
      error_value: action.error,
      loading: false,
    })
  case RECEIVE_RESERVATIONS:
    return Object.assign({}, state, {
      all_reservations: action.data,
      loading: false,
    })
  case ADD_RESERVATION:
    return Object.assign({}, state, {
      loading: false,
      all_reservations: state.all_reservations.map((reservation) => {
        if (reservation._id === action.value._id) {
          return action.value
        }
        return reservation
      }),
    })
  case UPDATE_ONE_RESERVATION:
    return Object.assign({}, state, {
      loading: false,
      all_reservations: state.all_reservations.map((reservation) => {
        if (reservation._id === action.value._id) {
          return action.value
        }
        return reservation
      }),
    })
  case UPDATE_RESERVATIONS:
    fetchReservations()
    return Object.assign({}, state, {
      loading: true,
      all_reservations: [],
    })
  case DELETED_RESERVATION:
    return Object.assign(
      {},
      state,
      { all_reservations: state.all_reservations.filter(reservation => reservation._id !== action.id) },
    )
  default:
    return state
  }
}

export const edit_reservation = (reservation) => {
  reservation.updatedAt = new Date()
  return function (dispatch) {
    // console.log('dispatching edit_reservation', reservation)
    axios({
      url: `${config.connections[config.env]}/booking`,
      method: 'PUT',
      headers: {
        'authorization': getAuth(),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(reservation),
      cache: 'default',
    })
      .then(
        (response) => { console.log(response, response.data, response.config); return response },
        (error) => {
          // dispatch(error_fetching(error))
          throw error
        },
      )
      .then((response) => {
        if (response && response.status === 200) {
          console.log(response)
          dispatch({
            type: UPDATE_ONE_RESERVATION,
            value: reservation,
          })
        } else if (response) {
          throw new Error(response)
          // refaire un fetch sur l'api pour récupérer les valeurs "canon"
        }
      })
      .catch((error) => {
        console.log('error edit_reservation', error)
      })
  }
}

const receiveReservations = json =>
  (dispatch) => {
    console.log('reservations received: ', json)
    dispatch({
      type: RECEIVE_RESERVATIONS,
      data: json.data,
    })
  }

const error_fetching = error =>
  (dispatch) => {
    console.log('error_fetching: ', error)
    dispatch({
      type: ERROR_FETCHING_RESERVATIONS,
      error,
    })
  }

export function fetchReservations() {
  return function (dispatch) {
    const reservations = axios({
      url: `${config.connections[config.env]}/bookings`,
      method: 'GET',
      mode: 'cors',
      cache: 'default',
    })
      .then(
        response => response,
        error => dispatch(error_fetching(error)),
      )
      .then((response) => {
        if (response) {
          console.log('fetchReservationsFromShopId', response)
          dispatch(receiveReservations(response))
        }
      })
      .catch((error) => {
        console.log('error fetching reservations', error)
      })
    return reservations
  }
}

export const delete_reservation = (reservation_id, callback) => (dispatch) => {
  axios({
    url: `${config.connections[config.env]}/booking`,
    method: 'DELETE',
    headers: {
      'authorization': getAuth(),
      'id': reservation_id,
      'Content-Type': 'application/json',
    },
    cache: 'default',
  })
    .then(
      (response) => {
        console.log(response, response.data, response.config)
        return response
      },
      (error) => {
        // console.log(error, error.response, reservation_id)
        throw new Error(error)
      },
    )
    .then((response) => {
      if (response && response.status === 200) {
        dispatch({
          type: DELETED_RESERVATION,
          id: reservation_id,
        })
        if (callback) {
          callback()
        }
        // TODO delete from s3
      } else {
        throw new Error(response.status)
      }
    })
    .catch((error) => {
      console.log('Error delete_reservation', error)
    })
}

export const create_reservation = (reservation, callback) => {
  const data = {
    activity_id: reservation.activity_id,
    participants: reservation.participants,
    datetime: reservation.date,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return function (dispatch) {
    axios({
      url: `${config.connections[config.env]}/bookings`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      cache: 'default',
    })
      .then((response) => {
        if (response && response.status === 200) {
          dispatch(fetchReservations())
          dispatch({
            type: ADD_RESERVATION,
            value: reservation,
          })
          if (callback) {
            callback(response.data)
          }
          return response.data.id
        } else if (response) {
          console.log('failed create reservation: ', response)
          if (response.data.id) {
            delete_reservation(response.data.id)
          }
        }
        return 'done'
      })
      .catch((error) => {
        console.log('something went wrong', error)
      })
  }
}

export const fetch_noun = (key, options, random) => {
  if (key) {
    let opt = {}
    if (options) {
      opt = JSON.stringify(options)
    }
    const icons = axios({
      url: `${config.connections[config.env]}/noun`,
      method: 'GET',
      headers: {
        'authorization': getAuth(),
        'Content-Type': 'application/json',
        'key': key,
        'options': opt,
        'random': random,
      },
      cache: 'default',
    })
      .then((res) => {
        return res
      })

    return icons
  }
}
