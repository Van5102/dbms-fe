import * as actions from "utils/constants/redux-actions";

const initState = []

const procedureStatus = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_PROCEDURE_STATUS:
      return action.payload
    default:
      return state
  }
}

export default procedureStatus