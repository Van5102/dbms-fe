import { useState } from 'react'
import { SpinCustom } from "components"
import { Layout } from "antd"

const FilePreviewPage = () => {
  const [spinning, setSpinning] = useState(false)

  return (
    <Layout className='common-layout'>
      <SpinCustom spinning={spinning}>
        <div className='common-layout--header'>
          1
        </div>

        <div className='common-layout--content'>
          1
        </div>

        <div className='common-layout--footer'>
          1
        </div>
      </SpinCustom>
    </Layout>
  )
}

export default FilePreviewPage
