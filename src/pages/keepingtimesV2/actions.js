import { getFullUrlStaticFile } from "utils/helps";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";
import api from "utils/service/api";

export const actionGetMyHistoryTimeKeeping = (params) => {
  return api({
    method: "GET",
    url: "/time-keepings/get-history",
    params,
  });
};

export const actionGetListTimeKeepingDetail = (params) => {
  return api({
    method: "GET",
    url: "/time-keepings/get-history-all-users",
    params,
  });
};

export const actionGetListTimeKeeping = (params) => {
  return api({
    method: "GET",
    url: "/time-keepings/get-history-all-users-by-day",
    params,
  });
};
export const actionApproveBusinessTrip  = (id, status, params) => {
  return api({
    method: "PUT",
    url: `/time-keepings/approve-business-trip/${id}/${status}`,
    params,
  });
};
