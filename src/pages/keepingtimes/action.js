import { getFullUrlStaticFile } from "utils/helps";
import { REACT_APP_SERVER_BASE_URL } from "utils/constants/config";
import api from "utils/service/api";

export const actionGetListKeeping = (params) => {
  return api({
    method: "GET",
    url: "/get-list-keeping-time",
    params,
  });
};

export const actionGetImageKeeping = (id) => {
  return  getFullUrlStaticFile(`/get-avatar-checkin/${id}`);
};

export const actionGetListKeepingByDate = (date, params) => {
  return api({
    method: "GET",
    url: `get-list-checkin-date/${date}`,
    params,
  });
};

export const actionGetListFreeTime = (date, params) => {
  return api({
    method: "GET",
    url: `get-list-free-time/${date}`,
    params,
  });
};

export const actionHandleFreeTime = (date, id, status, params) => {
  return api({
    method: "PUT",
    url: `handle-free-time/${date}/${id}/${status}`,
    params,
  });
};

export const actionCreatePropose = (salaryid, stt, params) => {
  return api({
    method: "POST",
    url: `/propose-salary/${salaryid}/${stt}`,
    params: params,
  });
};

export const actionHandlePropose = (salaryid, stt, params) => {
  return api({
    method: "PUT",
    url: `/handle-propose-salary/${salaryid}/${stt}`,
    params: params
  });
};
