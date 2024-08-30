import * as actions from "utils/constants/redux-actions";

const initState = []

const proceduresDetailStatus = (state = initState, action) => {
  switch (action.type) {
    case actions.SET_PROCEDURE_DETAIL_STATUS:
      return action.payload
    default:
      return state
  }
}

export default proceduresDetailStatus