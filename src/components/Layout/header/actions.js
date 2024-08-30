import api from "utils/service/api"

export const actionGetNotification = () => {
  return api({
    method: "GET",
    url: "/get-notifications-by-user",
  })
}

export const actionChangePassword = (data) => {
  return api({
    method: "POST",
    url: "/change-password",
    data
  })
}

export const actionChangeNotificationStatus = (id) => {
  return api({
    method: "PUT",
    url: `/change-notification-status/${id}`,
  })
}