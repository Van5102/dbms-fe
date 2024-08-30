import { Layout } from 'antd'
import './index.scss'

const AppFooter = () => {
  return (
    <Layout.Footer className='app-footer'>
      <span className='blue-text'>Copyright 2011 - 2023 © </span>
      <span className='red-text'>AIPT Groups</span>
    </Layout.Footer>
  )
}

export default AppFooter