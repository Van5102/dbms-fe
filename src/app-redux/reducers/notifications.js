import * as actions from "utils/constants/redux-actions";

const initState = []

const notification = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_NOTIFICATION:
      return action.payload
    default:
      return state
  }
}

export default notification