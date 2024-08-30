import { Spin } from "antd"
import { SPINNING_SIZE } from 'utils/constants/config'
// import { LoadingOutlined } from "@ant-design/icons"
import "./index.scss"

const SpinCutom = ({spinning, children}) => {
  return (
    <Spin 
      className='spin-custom'
      spinning={spinning} 
      // indicator={<LoadingOutlined />}  
      size={SPINNING_SIZE}
    >
      {children}
    </Spin>
  )
}

export default SpinCutom