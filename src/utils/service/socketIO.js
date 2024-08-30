import { AIPT_WEB_TOKEN, REACT_APP_SERVER_BASE_URL } from 'utils/constants/config'
import socketIOClient from "socket.io-client";
import Cookies from "js-cookie"
import { message } from 'antd'

// config
const token = Cookies.get(AIPT_WEB_TOKEN)

const config = {
  uri: `${REACT_APP_SERVER_BASE_URL}`.toLocaleLowerCase() !== "null" ? REACT_APP_SERVER_BASE_URL : null,
  opts: {
    extraHeaders: {
      "Authorization": `${token}`
    }
  }
}

// create
const socketIO =  socketIOClient(config.uri, {...config.opts})
  
// on message
socketIO.on('message', (data) => {
  const { msg, status } = data

  if (status === 200) {
    message.success(msg)
  } 
  else {
    message.error(msg)
  }
})

export default socketIO