import api from "utils/service/api";

export const actionCreateGeneralPurchaseProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-general-purchase-procedure",
    data,
  });
};


export const actionGetImplementerPendingGeneralProposalProcedures = (
  
  params
) => {
  return api({
    method: "get",
    url: `/get-implementer-pending-general-proposal-procedures`,
    params,
  });
};

export const actionGetGeneralPurchaseProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-general-purchase-procedures",
    params,
  });
};
export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",
  });
};
export const actionGetPendingGeneralPurchaseProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-general-purchase-procedures",
    params,
  });
};

export const actionApproveGeneralPurchaseProcedure = (
  procedure_id,
  status,
  params
) => {
  return api({
    method: "put",
    url: `/approve-general-purchase-procedure/${procedure_id}/${status}`,
    params,
  });
};

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-general-purchase-procedure/${id}`,
    params,
    data: { description },
  });
};
export const actionCanCelProcedureSupllier = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/cancel-supplier-procedures/${id}`,
    params,
    data: { description },
  });
};
export const actionGetUsers = (params) => {
  return api({
    method: "GET",
    url: "/get-employees",
    params,
  });
};
