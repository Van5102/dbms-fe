import api from "utils/service/api";
import { REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'

export const actionDownloadContract = (params) => {
  return api({
    method: "GET",
    url: `${REACT_APP_SERVER_BASE_URL}/get-contract/${params}`
  })

}