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
  all_users: [],
  user: {},
  modalOpened: false,
  editedUserId: null,
  iconURL: null,
}

export const RECEIVE_USERS = 'users/RECEIVE_USERS'
export const ERROR_FETCHING_USERS = 'users/ERROR_FETCHING_USERS'
export const UPDATE_USERS = 'users/UPDATE_USERS'
export const UPDATE_ONE_USER = 'users/UPDATE_ONE_USER'
export const LOADING_USERS = 'users/LOADING'
export const REINIT_USERS = 'users/REINIT'
export const DELETED_USER = 'users/DELETED'
export const ADD_USER = 'user/ADD_USER'
export const LOGIN_USER = 'user/LOGIN_USER'
export const LOGOUT_USER = 'user/LOGOUT_USER'
export const FAILED_LOGIN_USER = 'user/FAILED_LOGIN_USER'

export default function (state = initialState, action) {
  switch (action.type) {
  case REINIT_USERS:
    return Object.assign({}, initialState)
  case LOADING_USERS:
    return Object.assign({}, state, { loading: true })
  case ERROR_FETCHING_USERS:
    return Object.assign({}, state, {
      error: true,
      error_value: action.error,
      loading: false,
    })
  case RECEIVE_USERS:
    return Object.assign({}, state, {
      all_users: action.data,
      loading: false,
    })
  case ADD_USER:
    return Object.assign({}, state, {
      loading: false,
      all_users: state.all_users.map((user) => {
        if (user._id === action.value._id) {
          return action.value
        }
        return user
      }),
    })
  case LOGIN_USER:
    console.log(action)
    return Object.assign({}, state, {
      user: action.value
    })
  case FAILED_LOGIN_USER:
    return Object.assign({}, state, {
      error: action.value
    })
  case LOGOUT_USER:
    console.log(action)
    return Object.assign({}, state, {
      user: {}
    })
  case UPDATE_ONE_USER:
    return Object.assign({}, state, {
      loading: false,
      all_users: state.all_users.map((user) => {
        if (user._id === action.value._id) {
          return action.value
        }
        return user
      }),
    })
  case UPDATE_USERS:
    fetchUsers()
    return Object.assign({}, state, {
      loading: true,
      all_users: [],
    })
  case DELETED_USER:
    return Object.assign(
      {},
      state,
      { all_users: state.all_users.filter(user => user._id !== action.id) },
    )
  default:
    return state
  }
}

export const edit_user = (user) => {
  user.updatedAt = new Date()
  return function (dispatch) {
    // console.log('dispatching edit_user', user)
    axios({
      url: `${config.connections[config.env]}/Account`,
      method: 'PUT',
      headers: {
        'authorization': getAuth(),
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(user),
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
            type: UPDATE_ONE_USER,
            value: user,
          })
        } else if (response) {
          throw new Error(response)
          // refaire un fetch sur l'api pour récupérer les valeurs "canon"
        }
      })
      .catch((error) => {
        console.log('error edit_user', error)
      })
  }
}

const receiveUsers = json =>
  (dispatch) => {
    console.log('users received: ', json)
    dispatch({
      type: RECEIVE_USERS,
      data: json.data,
    })
  }

const error_fetching = error =>
  (dispatch) => {
    console.log('error_fetching: ', error)
    dispatch({
      type: ERROR_FETCHING_USERS,
      error,
    })
  }

export const logout_user = () =>
  (dispatch) => {
    dispatch({
      type: LOGOUT_USER,
    })
  }


export function fetchUsers() {
  return function (dispatch) {
    const users = axios({
      url: `${config.connections[config.env]}/Accounts`,
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
          console.log('fetchUsersFromShopId', response)
          dispatch(receiveUsers(response))
        }
      })
      .catch((error) => {
        console.log('error fetching users', error)
      })
    return users
  }
}

export const delete_user = (user_id, callback) => (dispatch) => {
  axios({
    url: `${config.connections[config.env]}/Account`,
    method: 'DELETE',
    headers: {
      'authorization': getAuth(),
      'id': user_id,
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
        // console.log(error, error.response, user_id)
        throw new Error(error)
      },
    )
    .then((response) => {
      if (response && response.status === 200) {
        dispatch({
          type: DELETED_USER,
          id: user_id,
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
      console.log('Error delete_user', error)
    })
}

export const create_user = (user, callback) => {
  const data = {
    email: user.email,
    password: user.password,
    passwordConfirm: user.passwordConfirm,
    realm: "string",
    username: Math.random().toString(36).substring(7),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return function (dispatch) {
    axios({
      url: `${config.connections[config.env]}/Accounts`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      cache: 'default',
    })
      .then((response) => {
        if (response && response.status === 200) {
          dispatch(fetchUsers())
          dispatch({
            type: ADD_USER,
            value: user,
          })
          if (callback) {
            callback(response.data)
          }
          return response.data.id
        } else if (response) {
          console.log('failed create user: ', response)
          if (response.data.id) {
            delete_user(response.data.id)
          }
        }
        return 'done'
      })
      .catch((error) => {
        console.log('something went wrong', error)
      })
  }
}


export const login_user = (user, callback) => {
  const data = {
    credentials: {
      email: user.email,
      password: user.password,
    }
  }

  return function (dispatch) {
    axios({
      url: `${config.connections[config.env]}/Accounts/login`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      cache: 'default',
    })
      .then((response) => {
        console.log(response)
        if (response && response.status === 200) {
          dispatch({
            type: LOGIN_USER,
            value: response.data.user,
          })
          if (callback) {
            callback(response.data.user)
          }
          return response.data.id
        } else if (response && response.status === 401) {
          console.log('failed login: ', response)
          dispatch({
            type: FAILED_LOGIN_USER,
            value: 'wrong',
          })
        }
        return 'done'
      })
      .catch((error) => {
        console.log('something went wrong', {error})
        let message = 'Erreur de connection'
        if (error.response) {
          console.log('AHAHAHAAH')
        }
        dispatch({
          type: FAILED_LOGIN_USER,
          value: error.message,
        })
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
