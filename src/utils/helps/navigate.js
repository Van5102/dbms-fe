import pages from "pages"
import { getRouterParams, convertQueryToString } from "utils/helps"

const navigatePage = (navigate, name, params = {}, query = {}) => {
  if (name.toLocaleLowerCase() === "back") {
    navigate(-1)
  }
  else {
    let path = pages.find((page) =>
      page.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    ).path

    path = getRouterParams(path, params)
    path = convertQueryToString(path, query)
    navigate(path)
  }
}

export default navigatePage