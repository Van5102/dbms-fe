import api from "utils/service/api";

export const actionCreateOvertimeProcedure = (data, params) => {
  return api({
    method: "POST",
    url: "/overtimes/create-procedure",
    data,
    params
  })
}

export const actionGetOvertimeProcedures = (params) => {
  return api({
    method: "GET",
    url: "/overtimes/get-procedures",
    params
  })
}

export const actionCancelOvertimeProcedure = (procedure_id, data, params) => {
  return api({
    method: "PUT",
    url: `/overtimes/cancel-procedure/${procedure_id}`,
    data,
    params
  })
}

export const actionGetListPendingOvertimeProcedures = (params) => {
  return api({
    method: "GET",
    url: "/overtimes/get-list-pending-procedures",
    params
  })
}

export const acctionApproveOvertimeProcedure = (procedure_id, status, data, params) => {
  return api({
    method: "PUT",
    url: `/overtimes/approve-procedure/${procedure_id}/${status}`,
    params,
    data: data ? data : {},
  })
}
