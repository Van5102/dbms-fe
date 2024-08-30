import * as actions from "utils/constants/redux-actions";

const initState = []

const departments = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_DEPARTMENTS:
      return action.payload
    default:
      return state
  }
}

export default departments