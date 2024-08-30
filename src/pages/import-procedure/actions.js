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
    url: "/get-list-warehouse-import-procedure",
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
    url: "/get-list-pending-warehouse-import-procedure",
    params
  })
}
export const actionGetImplementerPendingWareHouseProcedures = (params) => {
  return api({
    method: "get",
    url: `/get-list-implementer-pending-warehouse-import-procedure`,
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
    method: "put",
    url: `/approve-warehouse-import-procedure/${procedure_id}/${status}`,
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

export const actionHandlePointUser = (id,data,params) => {
  return api({
    method: "POST",
    url: `/add-implementer/${id}`,
    data,
    params
  })
}

export const actionAddWareHouse = (data,params) => {
  return api({
    method: "POST",
    url: "/create-warehouse-import",
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

export const actionUploadFile = (id,data) => {
  return api({
    method: "POST",
    url: `/read-excel/${id}`,
    data
  })
}

export const actionReportCheck = (id,data) => {
  return api({
    method: "POST",
    url: `/add-report-checking/${id}`,
    data,
  })
}

export const actionDownloadKH = (id,data) => {
  return api({
    method: "GET",
    url: `/get-excel-report/${id}`,
    data,
  })
}

