
import api from 'utils/service/api'
import Cookies from 'js-cookie'
import { AIPT_WEB_TOKEN, REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'
import { getFullUrlStaticFile } from 'utils/helps'
export const actionAddDocument = (data) => {
  return api({
    method: "POST",
    url: "/add-document",
    data
  })
}

export const actionGetListDocument = (params) => {
  return api({
    method: "GET",
    url: '/seach-document',
    params: params
  })
}

export const actionGetListFolderChid = (body) => {
  return api({
    method: "GET",
    url: "/seach-document",
    params: body
  })
}

export const actionUpdateNameFile = async (body) => {
  return api({
    method: "POST",
    url: '/update-name-file',
    data: body
  })
}

export const actionEditFile = (body) => {
  return api({
    method: "POST",
    url: "/update-document",
    data: body
  })
}

export const actionDeleteFile = (body) => {
  return api({
    method: "POST",
    url: "/delete-document",
    data: body
  })
}

export const actionDownLoadFile = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
   return  getFullUrlStaticFile(`/download-file/${doc_id}/${as_attachment}/${token}`, "_blank")
}

export const actionSeachFile = (body) => {
  return api({
    method: "GET",
    url: "/seach-document",
    params: body
  })
}

export const actionGetlistEmpoyee = (params) => {
  return api({
    method: 'GET',
    url: "/get-employees",
    params: params
  })
}

export const actionGetListRole = (params) => {
  return api({
    method: "GET",
    url: "/get-list-role",
    params: params
  })
}

export const actionDecentralize = (params) => {
  return api({
    method: "POST",
    url: "/decentralization",
    data: params

  })
}

export const actionGetImage = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return  getFullUrlStaticFile(`/download-file/${doc_id}/${as_attachment}/${token}`)
}