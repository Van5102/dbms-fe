import { getFullUrlStaticFile } from "utils/helps";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";
import api from "utils/service/api";

export const actionHandleGetSalaryUser = (date, params) => {
  return api({
    method: "GET",
    url: `/get-payroll/${date}`,
    params,
  });
};

export const actionHandleAddSalaryUser = (date, data, params) => {
  return api({
    method: "POST",
    url: `/create-payroll/${date}`,
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
