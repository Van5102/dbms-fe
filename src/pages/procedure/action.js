import api from "utils/service/api"

export const actionAddProcedure = (data) => {
  return api({
    method: "POST",
    url: "/create-vehicle-procedure",
    data
  })
}

export const actionChangeCar = (id, data) => {
  return api({
    method: "PUT",
    url: `/driver-changes-vehicle/${id}`,
    data
  })
}

export const actionGetCarRequestList = (params) => {
  return api({
    method: "GET",
    url: "/get-vehicle-procedures-by-user",
    params
  })
}

export const actionApprove = (idProcedure, status, params) => {
  return api({
    method: "put",
    url: `/approve-vehicle-procedures/${idProcedure}/${status}`,
    params: params
  })
}

export const actionGetProceduresPending = (params) => {
  return api({
    method: "GET",
    url: "/get-pending-approval-vehicle-procedures",
    params
  })
}

export const actionConfirmDriver = (a, id) => {
  return api({
    method: "PUT",
    url: `/driver-confirmed-completion-vehicle-procedure/${id}`,
    data: a
  })
}

export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
}

export const actionGetStatusProceduresDetails = () => {
  return api({
    method: "GET",
    url: "/get-procedures-detail-status",

  })
}
export const actionGetStatusTripDetails = (params) => {
  return api({
    method: "GET",
    url: "/get-vehicle-procedure-join",
    params

  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-vehicle-procedure/${id}`,
    params,
    data: { description }
  })
}