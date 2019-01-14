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
  all_activities: [],
  modalOpened: false,
  editedActivityId: null,
  iconURL: null,
}

export const RECEIVE_ACTIVITIES = 'activities/RECEIVE_ACTIVITIES'
export const ERROR_FETCHING_ACTIVITIES = 'activities/ERROR_FETCHING_ACTIVITIES'
export const UPDATE_ACTIVITIES = 'activities/UPDATE_ACTIVITIES'
export const UPDATE_ONE_ACTIVITY = 'activities/UPDATE_ONE_ACTIVITY'
export const LOADING_ACTIVITIES = 'activities/LOADING'
export const REINIT_ACTIVITIES = 'activities/REINIT'
export const DELETED_ACTIVITY = 'activities/DELETED'
export const ADD_ACTIVITY = 'activity/ADD_ACTIVITY'

export default function (state = initialState, action) {
  switch (action.type) {
  case REINIT_ACTIVITIES:
    return Object.assign({}, initialState)
  case LOADING_ACTIVITIES:
    return Object.assign({}, state, { loading: true })
  case ERROR_FETCHING_ACTIVITIES:
    return Object.assign({}, state, {
      error: true,
      error_value: action.error,
      loading: false,
    })
  case RECEIVE_ACTIVITIES:
    return Object.assign({}, state, {
      all_activities: action.data,
      loading: false,
    })
  case ADD_ACTIVITY:
    return Object.assign({}, state, {
      loading: false,
      all_activities: state.all_activities.map((activity) => {
        if (activity._id === action.value._id) {
          return action.value
        }
        return activity
      }),
    })
  case UPDATE_ONE_ACTIVITY:
    return Object.assign({}, state, {
      loading: false,
      all_activities: state.all_activities.map((activity) => {
        if (activity._id === action.value._id) {
          return action.value
        }
        return activity
      }),
    })
  case UPDATE_ACTIVITIES:
    fetchActivities()
    return Object.assign({}, state, {
      loading: true,
      all_activities: [],
    })
  case DELETED_ACTIVITY:
    return Object.assign(
      {},
      state,
      { all_activities: state.all_activities.filter(activity => activity._id !== action.id) },
    )
  default:
    return state
  }
}

export const edit_activity = (activity) => {
  activity.updatedAt = new Date()
  return function (dispatch) {
    // console.log('dispatching edit_activity', activity)
    axios({
      url: `${config.connections[config.env]}/activity`,
      method: 'PUT',
      headers: {
        'authorization': getAuth(),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(activity),
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
            type: UPDATE_ONE_ACTIVITY,
            value: activity,
          })
        } else if (response) {
          throw new Error(response)
          // refaire un fetch sur l'api pour récupérer les valeurs "canon"
        }
      })
      .catch((error) => {
        console.log('error edit_activity', error)
      })
  }
}

const receiveActivities = json =>
  (dispatch) => {
    console.log('activities received: ', json)
    dispatch({
      type: RECEIVE_ACTIVITIES,
      data: json.data,
    })
  }

const error_fetching = error =>
  (dispatch) => {
    console.log('error_fetching: ', error)
    dispatch({
      type: ERROR_FETCHING_ACTIVITIES,
      error,
    })
  }

export function fetchActivities() {
  return function (dispatch) {
    const activities = axios({
      url: `${config.connections[config.env]}/activities`,
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
          console.log('fetchActivitiesFromShopId', response)
          dispatch(receiveActivities(response))
        }
      })
      .catch((error) => {
        console.log('error fetching activities', error)
      })
    return activities
  }
}

export const delete_activity = (activity_id, callback) => (dispatch) => {
  axios({
    url: `${config.connections[config.env]}/activity`,
    method: 'DELETE',
    headers: {
      'authorization': getAuth(),
      'id': activity_id,
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
        // console.log(error, error.response, activity_id)
        throw new Error(error)
      },
    )
    .then((response) => {
      if (response && response.status === 200) {
        dispatch({
          type: DELETED_ACTIVITY,
          id: activity_id,
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
      console.log('Error delete_activity', error)
    })
}

export const create_activity = (activity, callback) => {
  const data = {
    owner_id: activity.owner_id,
    name: activity.name,
    price: activity.price,
    duration: activity.duration,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return function (dispatch) {
    axios({
      url: `${config.connections[config.env]}/activities`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      cache: 'default',
    })
      .then((response) => {
        if (response && response.status === 200) {
          dispatch(fetchActivities())
          dispatch({
            type: ADD_ACTIVITY,
            value: activity,
          })
          if (callback) {
            callback(response.data)
          }
          return response.data.id
        } else if (response) {
          console.log('failed create activity: ', response)
          if (response.data.id) {
            delete_activity(response.data.id)
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
