
import api from "utils/service/api";

export const actionCreateEvaluate = (data, params) => {
  return api({
    method: "POST",
    url: "/create-evaluate",
    data,
    params
  })
}

export const actionGetListEvaluate = (params) => {
  return api({
    method: "GET",
    url: "/get-list-evaluate-procedure",
    params
  })
}

export const actionGetPendingEvaluateProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-evaluate-procedure",
    params
  })
}

export const actionGetContract = (id,data) => {
  return api({
    method: "POST",
    url: `/create-contract/${id}`,
    responseType: "blob",
    data,
  })
}

export const actionApproveEvaluate = (id, statusId, data, params) => {
  return api({
    method: "POST",
    url: `/approve-eavaluate-procedure/${id}/${statusId}`,
    data,
    params
  })
}

export const actionCancelEvaluate = (id,data) => {
  return api({
    method: "put",
    url: `/cancel-evaluate-procedure/${id}`,
    data
  })
}
