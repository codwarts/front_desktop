const version = 1
const key = `https://dashboard.alesta.co:state?version=${version}`

export default class StateLoader {
  loadState() {
    try {
      const serializedState = localStorage.getItem(key)

      if (serializedState === null) {
        return this.initializeState()
      }

      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  saveState(state) {
    // TODO ? save state only if cart content changes, && project only relevant content
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(key, serializedState)
    } catch (err) {
      console.log(err)
    }
  }

  initializeState() {
    return {
      // state object
      // TODO
    }
  }
}

export const getAuth = () => {
  const stateLoader = new StateLoader()
  // TODO check validity of auth (expiration)
  const auth = stateLoader.loadState().user.userauth
  // console.log('getting auth', auth)
  return auth
}
