import { useEffect, useMemo, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { actionGetUserProfileByToken } from "pages/login/actions"
import { findPageByPath, isEmpty } from "utils/helps"
import { useDispatch } from "react-redux"
import { AIPT_WEB_TOKEN } from "./utils/constants/config"
import { Layout } from "antd"
import navigatePage from "utils/helps/navigate"
import pages from "pages"
import Cookies from "js-cookie"
import PageContent from "routes"
import api from "utils/service/api"
import * as actions from 'utils/constants/redux-actions'
import socketIO from "./utils/service/socketIO"

import {
  AppHeader,
  AppSider,
  AppFooter
} from "./components"

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  window.navigatePage = (name, params = {}, query = {}) => navigatePage(navigate, name, params, query)
  const token = Cookies.get(AIPT_WEB_TOKEN)
  const currentPath = useLocation().pathname

  const isPublicPage = useMemo(() => {
    const page = findPageByPath(currentPath, pages)
    return !page?.auth
  }, [currentPath])

  const handleGetPositions = async () => {
    try {
      const { data, status } = await api({
        method: "GET",
        url: "/get-positions",
      })
      if (status === 200) {
        dispatch({ type: actions.SET_POSITIONS, payload: data })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetDepartments = async () => {
    try {
      const { data, status } = await api({
        method: "GET",
        url: "/get-departments",
      })
      if (status === 200) {
        dispatch({ type: actions.SET_DEPARTMENTS, payload: data })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGetStatusProcedures = async () => {
    try {
      const { data, status } = await api({
        method: "GET",
        url: "/get-procedures-status"
      })
      if (status === 200) {
        dispatch({ type: actions.SET_PROCEDURE_STATUS, payload: data })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetStatusProceduresDetails = async () => {
    try {
      const { data, status } = await api({
        method: "GET",
        url: "/get-procedures-detail-status"
      })

      if (status === 200) {
        dispatch({ type: actions.SET_PROCEDURE_DETAIL_STATUS, payload: data })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheckNavigate = useCallback(() => {
    const paths = pages.map(page => page.path)
    if (!paths.includes(currentPath)) {
      window.location.href = '/'
    }
  }, [currentPath])

  // check navigate
  handleCheckNavigate()

  useEffect(() => {
    if (!isEmpty(token)) {
      handleGetDepartments()
      handleGetPositions()
      handleGetStatusProcedures()
      handleGetStatusProceduresDetails()
      actionGetUserProfileByToken(dispatch)

      socketIO.emit('join', token)
    }
    else if (!isPublicPage) {
      window.navigatePage('login')
    }
  }, [token])

  return (
    <Layout hasSider id="app">
      {!isPublicPage && <AppSider />}

      <Layout>
        {!isPublicPage && <AppHeader />}
        <PageContent />
        {!isPublicPage && <AppFooter />}
      </Layout>
    </Layout>
  )
}

export default App