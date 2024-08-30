import api from "utils/service/api"

export const actionAddPayment = (data) => {
  return api({
    method: "POST",
    url: "/create-payment",
    data
  })
}

export const actionAddAdvance = (data) => {
  return api({
    method: "POST",
    url: "/create-deposit",
    data
  })
}

export const actionGetPaymentProcedures = (params) => {
  return api({
    method: "GET",
    url: "/get-all-payments",
    params
  })
}

export const actionGetTemporaryReimbursementProcedures = (params) => {
  return api({
    method: "GET",
    url: "/get-deposit",
    params
  })
}

export const actionGetPenddingTemporaryReimbursementProcedures = (params) => {
  return api({
    method: "GET",
    url: "/get-pending-deposit",
    params
  })
}

export const actionGetPenddingPaymentProcedures = (params) => {
  return api({
    method: "GET",
    url: "/get-pending-payments",
    params
  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "POST",
    url: `/user-cancel-payment/${id}`,
    params,
    data: { description },
  });
};

export const acctionApprovePaymentProcedure = (procedure_id, status, data, params) => {
  return api({
    method: "PUT",
    url: `/approve-payment/${procedure_id}/${status}`,
    params,
    data: data ? data : {},
  })
}

export const acctionApproveAdvancedPaymentProcedure = (procedure_id, status, data, params) => {
  return api({
    method: "PUT",
    url: `/approve-deposit/${procedure_id}/${status}`,
    params,
    data: data ? data : {},
  })
}