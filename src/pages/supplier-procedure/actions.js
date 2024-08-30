import api from "utils/service/api";

export const actionCreateGeneralPurchaseProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-general-purchase-procedure",
    data
  })
}

export const actionGetSupplierProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-list-supplier",
    params
  })
}
export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
}
export const actionGetPendingGeneralPurchaseProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-supplier-procedures",
    params
  })
}

export const actionApproveGeneralPurchaseProcedure = (procedure_id, status, params) => {
  return api({
    method: "put",
    url: `/approve-supplier-procedure/${procedure_id}/${status}`,
    params
  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-general-purchase-procedure/${id}`,
    params,
    data: {description}
  })
}
export const actionGetUsers = (params) => {
  return api({
    method: "GET",
    url: "/get-employees",
    params
  })
}

export const actionCreateQuoteProcedure = (data) => {
  return api({
    method: "post",
    url: `/created-supplier`,
    data,
  });
};


