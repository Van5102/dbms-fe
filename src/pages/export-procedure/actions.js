import api from "utils/service/api";

export const actionCreateGeneralPurchaseProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-general-purchase-procedure",
    data
  })
}

export const actionGetWarehouse = (params) => {
  return api({
    method: "get",
    url: "/get-list-warehouse-export",
    params
  })
}
export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",

  })
}
export const actionGetPendingWareHouseProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-list-pending-warehouse-export",
    params
  })
}
export const actionGetImplementerPendingWareHouseProcedures = (params) => {
  return api({
    method: "get",
    url: `/get-list-implementer-warehouse-export`,
    params,
  });
};

export const actionGetCheckingGoodsProcedures = (params) => {
  return api({
    method: "get",
    url: `/get-list-request-checking`,
    params,
  });
};

export const actionApproveWareHouseProcedure = (procedure_id, status, params) => {
  return api({
    method: "post",
    url: `/approve-warehouse-export/${procedure_id}/${status}`,
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
export const actionGetDevices = (params) => {
  return api({
    method: "GET",
    url: "/get-list-device",
    params
  })
}
export const actionHandleAddDevice = (data) => {
  return api({
    method: "POST",
    url: "/create-device",
    data
  })
}

export const actionHandlePointUser = (id,data) => {
  return api({
    method: "POST",
    url: `/add-implementer-warehouse-export/${id}`,
    data
  })
}

export const actionAddWareHouse = (data,params) => {
  return api({
    method: "POST",
    url: "/create-warehouse-export",
    data,
    params
  })
}

export const actionRequestCheck = (id,data,params) => {
  return api({
    method: "POST",
    url: `/create-request-checking/${id}`,
    data,
    params
  })
}

export const actionReportCheck = (id,data,params) => {
  return api({
    method: "POST",
    url: `/add-report-checking/${id}`,
    data,
    params
  })
}