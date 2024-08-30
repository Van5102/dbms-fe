import {combineReducers} from "redux"

// reducers
import profile from "./profile";
import notification from "./notifications";
import departments from "./departments";
import positions from "./positions";
import procedureStatus from "./procedures-status";
import proceduresDetailStatus from "./procedures-detail-status";

const rootReducer = combineReducers({
    profile,
    notification,
    departments,
    positions,
    procedureStatus,
    proceduresDetailStatus
})

export default rootReducer;