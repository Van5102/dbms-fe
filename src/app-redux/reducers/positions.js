import * as actions from "utils/constants/redux-actions";

const initState = []

const positions = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_POSITIONS:
      return action.payload
    default:
      return state
  }
}

export default positions