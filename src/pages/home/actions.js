import api from "utils/service/api"

export const actionAddUser = (data) => {
  return api({
    method: "POST",
    url: "/create-employee",
    data
  })
}

export const actionGetUsers = (params) => {
  return api({
    method: "GET",
    url: "/get-employees",
    params
  })
}
export const actionLockUser = (id) => {
  return api({
    method: "post",
    url: `/handle-change-account-status/${id}`
  })
}

export const actionUpdateUser = (id,data) => {
  return api({
    method: "PUT",
    url: `/update-info-employee/${id}`,
    data
  })
}

export const actionGetPositions = () => {
  return api({
    method: "GET",
    url: "/get-positions"
  })
}

export const actionGetDepartments = () => {
  return api({
    method: "GET",
    url: "/get-departments"
  })
}