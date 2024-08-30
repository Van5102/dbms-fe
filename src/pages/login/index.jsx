import { useState } from "react"
import { AIPT_WEB_TOKEN } from "utils/constants/config"
import { actionLogin } from "./actions"
import Cookies from "js-cookie"
import { SpinCustom } from "components"

import {
  Form, Input, Button, Layout
} from "antd"

const LoginPage = () => {
  const [spinning, setSpinning] = useState(false)

  const handelLogin = async (values) => {
    setSpinning(true)
    try {
      const { data, status } = await actionLogin(values)
      if (status === 200) {
        Cookies.set(AIPT_WEB_TOKEN, `Bearer ${data?.token}`,{ expires: 7 })
        window.navigatePage("home")
      }
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }

  return (
    <Layout className="common-layout auth-page">
      <div className="page-content">
        <SpinCustom spinning={spinning}>
          <Form name="login-form"
            layout="vertical"
            size="large"
            onFinish={handelLogin}
            className="commom-form"
          >
            <Form.Item name="username"
              rules={[
                { required: true, message: "Vui lòng nhập email !" },
              ]}
            >
              <Input placeholder="Email làm việc" />
            </Form.Item>

            <Form.Item name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu !" }
              ]}
            >
              <Input.Password placeholder="Mật khẩu" autoComplete="auto" />
            </Form.Item>

            <Button className="w-full" type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form>
        </SpinCustom>
      </div>
    </Layout>
  )
}

export default LoginPage