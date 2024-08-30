import Cookies from 'js-cookie'
import api from 'utils/service/api'
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
    params
  })
}

export const actionGetListFolderChid = (params) => {
  return api({
    method: "GET",
    url: '/seach-document',
    params
  })
}

export const actionUpdateNameFile = (body) => {
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

export const actionGetImage = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return  getFullUrlStaticFile(`/download-file/${doc_id}/${as_attachment}/${token}`)
}
export const actionDownLoadFile = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return  getFullUrlStaticFile(`/download-file/${doc_id}/${as_attachment}/${token}`)
}

export const actionSeachFile = (body) => {
  return api({
    method: "GET",
    url: "/seach-document",
    params: body
  })
}

export const actionDetail = (doc_id, as_attachment) => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  return api({
    method: "GET",
    url: `/download-file/${doc_id}/${as_attachment}/${token}`,
    responseType: 'blob'
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