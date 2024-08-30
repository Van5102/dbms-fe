import api from "utils/service/api";

export const actionCreateProcurementProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-procurement-proposal-procedure",
    data,
  });
};

export const actionGetProcurementProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-procurement-proposal-procedures",
    params,
  });
};

export const actionGetImplementerPendingProcurementProposalProcedures = (
  params
) => {
  return api({
    method: "get",
    url: `/get-implementer-pending-procurement-proposal-procedures`,
    params,
  });
};

export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",
  });
};
export const actionGetPendingProcurementProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-procurement-proposal-procedures",
    params,
  });
};

export const actionApproveProcurementProcedure = (
  procedure_id,
  status,
  params
) => {
  return api({
    method: "put",
    url: `/approve-procurement-proposal-procedure/${procedure_id}/${status}`,
    params,
  });
};

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-procurement-proposal-procedure/${id}`,
    params,
    data: { description },
  });
};
