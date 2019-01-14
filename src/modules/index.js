import {combineReducers} from 'redux'
import activities from './activities'
import users from './users'
const rootReducer = combineReducers({
  activities,
  users,
})

export default rootReducer
