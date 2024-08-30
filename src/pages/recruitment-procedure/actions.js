import api from "utils/service/api";

export const actionCreateRecruitmentProcedure = (data) => {
  return api({
    method: "post",
    url: "/create-recruitment-procedure",
    data
  })
}

export const actionGetRecruitmentProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-recruitment-procedures",
    params
  })
}

export const actionGetPendingRecruitmentProcedures = (params) => {
  return api({
    method: "get",
    url: "/get-pending-recruitment-procedures",
    params
  })
}

export const actionApproveRecruitmentProcedure = (procedure_id, status, params) => {
  return api({
    method: "put",
    url: `/approve-recruitment-procedure/${procedure_id}/${status}`,
    params
  })
}

export const actionCanCelProcedure = (id, description, params) => {
  return api({
    method: "PUT",
    url: `/user-cancel-recruitment-procedure/${id}`,
    params,
    data: { description }
  })
}

export const actionGetCv = (params) => {
  return api({
    method: "GET",
    url: `/get-list-profile-applicant`,
    params,

  })
}

export const actionGetScheldule = (params) => {
  return api({
    method: "GET",
    url: `/get-list-interview-date`,
    params,

  })
}

export const actionUpdateCv = (id, data, params) => {
  return api({
    method: "PUT",
    url: `/update-profile-applicant/${id}`,
    data,
    params

  })
}

export const actionDeleteCv = (id, id_delete, params) => {
  return api({
    method: "DELETE",
    url: `/delete-profile-applicant/${id}/${id_delete}`,
    params
  })
}

export const actionDeleteRequest = (id, params) => {
  return api({
    method: "DELETE",
    url: `/delete-recruitment-procedure/${id}`,
    params
  })
}

export const actionHandleReview = (id, data, params) => {
  return api({
    method: "POST",
    url: `/handle-interview-date/${id}`,
    data,
    params
  })
}

export const actionCreateCv = (id, data, params) => {
  return api({
    method: "post",
    url: `/create-profile-applicant/${id}`,
    data,
    params
  })
}

export const actionCreateSchedule = (id, data, params) => {
  return api({
    method: "post",
    url: `/create-interview-date/${id}`,
    data,
    params
  })
}
export const actionGetListInterview = (params) => {
  return api({
    method: "GET",
    url: `/get-list-interview-date`,
    params
  })
}

export const actionHandleInterviewCalendar = (id, params, data) => {
  return api({
    method: "POST",
    url: `/handle-interview-date/${id}`,
    params,
    data
  })
}

export const actionGetLinkCv = (id) => {
  return api({
    method: "GET",
    url: `/get-cv-applicant/${id}`,
  })
}

export const actionSaveFeedback = (id, status, data) => {
  return api({
    method: "POST",
    url: `/save-feeback/${id}/${status}`,
    data
  })
}

export const actionSendEmail = (id, data, params) => {
  return api({
    method: "POST",
    url: `/send_email_receive_job/${id}`,
    data,
    params
  })
}

export const actionUpdateFinishProcedure = (id_procedure, id_status_procedure, ) => {
  return api({
    method: "PUT",
    url: `/hr-update-recruitment-procedure-status/${id_procedure}/${id_status_procedure}`,

  })
}

export const actionGetStatusProcedures = () => {
  return api({
    method: "GET",
    url: "/get-procedures-status",
   
  })
}