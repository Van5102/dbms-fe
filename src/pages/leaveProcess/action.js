import api from "utils/service/api"

export const actionAddProcedure = (data) => {
  return api({
    method: "POST",
    url: "/create-leave-application-procedure",
    data
  })
}


export const actionGetCarRequestList = (params) => {
  return api({
    method: "GET",
    url: "/get-leave-application-procedure",
    params
  })
}
export const actionApprove = (idProcedure,status,params) => {
  return api({
    method: "put",
    url: `/approve-leave-application-procedures/${idProcedure}/${status}`,
    params:params
  })
}
export const actionGetProcedures = (params) => {
  return api({
    method: "GET",
    url: "/get-pending-leave-application-procedures",
    params
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

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-leave-application-procedures/${id}`,
    params,
    data: {description}
  })
}