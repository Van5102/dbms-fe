import { getFullUrlStaticFile } from "utils/helps";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";
import api from "utils/service/api";

export const actionHandleGetSalaryUser = ( params) => {
  return api({
    method: "GET",
    url: `/payroll-v2/get-all`,
    params,
  });
};

export const actionHandleAddSalaryUser = ( data, params) => {
  return api({
    method: "POST",
    url: `/payroll-v2/create`,
    data,
    params
  });
};
export const actionGetImageKeeping = (id) => {
  return  getFullUrlStaticFile(`/get-avatar-checkin/${id}`) ;
};

export const actionGetListKeepingByDate = (date, params) => {
  return api({
    method: "GET",
    url: `get-list-checkin-date/${date}`,
    params,
  });
};
