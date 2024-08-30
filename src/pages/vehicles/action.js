import api from "utils/service/api"

export const actionAddVehicle = (data) => {
  return api({
    method: "POST",
    url: "/create-vehicle",
    data
  })
}

export const actionGetVehicles = (params) => {
  return api({
    method: "GET",
    url: "/get-vehicles",
    params:params
  })
}

export const actionDeleteVehicle = (id) => {
  return api({
    method: "delete",
    url: `/delete-vehicle/${id}`
  })
}