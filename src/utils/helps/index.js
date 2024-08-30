import { REACT_APP_SERVER_BASE_URL, AIPT_WEB_TOKEN } from 'utils/constants/config'
import Cookies from "js-cookie";
import pages from 'pages';

const has = Object.prototype.hasOwnProperty;

export const isEmpty = (prop) => {
  return (
    prop === null ||
    prop === undefined ||
    (has.call(prop, 'length') && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0) ||
    `${prop}`.toLocaleLowerCase() === "null"
  );
};

export const getRouterParams = (path, params) => {
  if (!isEmpty(params)) {
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key])
    })
  }

  return path
}

export const convertQueryToString = (routerPath, query) => {
  if (typeof query === 'object' && !isEmpty(query)) {
    const querys = [];
    Object.keys(query).forEach(key => {
      querys.push(`${key}=${query[key]}`)
    });
    return `${routerPath}?${querys.join('&')}`
  }
  if (typeof query === 'string') {
    return `${routerPath}${query}`
  }
  return routerPath
};

export const findPageByPath = (currentPath, pages = []) => {
  const page = pages.find(page => {
    const path = new RegExp("^" + page.path.replace(/:[^/]+/g, "([^/]+)") + "$")
    return path.test(currentPath)
  })
  return page
}

export const findChildByName = (name) => {
  return pages.filter(page => page?.parent === name).map(page => ({
    key: page?.name,
    icon: page?.icon,
    label: page?.label,
  }))
}

export const formatCurrency = (number) => {
  let s = parseInt(number)
  s = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s)
  return s
}

export const formatVND = (value) => {
  if (!value) return '';
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedValue} VND`;
}

export const IsJsonString = (str) => {
  try {
    var json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

export const GetTelegramUser = (data) => {
  try {
    let temp = []

    data?.result?.forEach(element => {
      const chat = !isEmpty(element?.message) ? element?.message.chat : element?.my_chat_member.chat
      if (!temp.find(t => t?.id === chat?.id)) {
        temp.push(chat)
      }
    })
    return temp
  } catch (error) {
    console.log(error);
  }


}

export const getServerBaseUrl = () => {
  if (!isEmpty(REACT_APP_SERVER_BASE_URL)) {
    return REACT_APP_SERVER_BASE_URL
  }

  // return null;
  return window.location.origin
}

export const getFullUrlStaticFile = (path) => {
  const server_url = getServerBaseUrl()
  let url = `${path}`.replace("_internal\\", "").replace("_internal/", "")
    .replace('server\\', '').replace('server/', '')
    .replace('src\\', '').replace('src/', '');

  if (server_url) {
    url = `${server_url}/${url}`;
  }

  return url;
}

export const getUrlUserAvatar = () => {
  const token = Cookies.get(AIPT_WEB_TOKEN)
  const path = `/get-user-avatar/${token}`;

  return getFullUrlStaticFile(path);
}

export const handleSetUrlParam = (key, value) => {
  // lấy ra đường dẫn
  let currentUrl = new URL(window.location.href);

  // sử dụng search params
  let searchParams = new URLSearchParams(currentUrl.search);
  searchParams.set(key, value);

  // cập nhật lại key
  if (isEmpty(value)) {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  // cập nhật lại dường dẫn
  let newUrl = `${currentUrl.origin}${currentUrl.pathname}?${searchParams.toString()}`;
  window.history.pushState(null, null, newUrl);
};

export const setFormListItemValue = (form, item_name, name, index, value) => {
  const items = form.getFieldValue(item_name);
  items[index][name] = value;
  form.setFieldsValue({ item_name: items });
};

export const handleGetProcedureStatusClassName = (status_code) => {
  switch (status_code) {
    case "PENDING":
      return "process--waiting";
    case "D_CONFIRMED":
      return "process--waiting";

    case "SUCCESS":
      return "process--success";

    case "CANCEL":
      return "process--cancel";

    case "CONFIRMED":
      return "process--success";

    case "SUPPLIER":
      return "process--success";

    default:
      return "process";
  }
}

export const range = (start = 0, end = 0) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const convertMinutesToHoursAndMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} giờ - ${remainingMinutes} phút`;
}