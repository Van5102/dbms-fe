import api from "utils/service/api";

export const actionCreateNotarizationProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-notarization-procedure",
    data
  })
}

export const actionGetNotarizationProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-notarization-procedures",
    params
  })
}
export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
}
export const actionGetPendingNotarizationProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-notarization-procedures",
    params
  })
}

export const actionApproveNotarizationProcedure = (procedure_id, status, params) => {
  return api({
    method: "put",
    url: `/approve-notarization-procedure/${procedure_id}/${status}`,
    params
  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-notarization-procedure/${id}`,
    params,
    data: {description}
  })
}