import { useState } from "react"
import { PASSWORD_PATTEN } from "utils/constants/config"
import { actionChangePassword } from "../actions"
import { SpinCustom } from "components"

import {
  Modal, Form, Input, 
  Row, Col, Button, message
} from "antd"

const ChangePassword = ({ onClose }) => {
  const [spinning, setSpinning] = useState(false)

  const handleChangePassword = async (values) => {
    setSpinning(true)
    try {
      const { data, status } = await actionChangePassword(values)
      if (status === 200) {
        message.success(data?.message)
        onClose()
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false)
  }

  return (
    <Modal
      open={true}
      title="Sửa mật khẩu"
      closeIcon={false}
      width={280}
      className='form-modal'
      footer={false}
    >
      <SpinCustom spinning={spinning}>
        <Form
          onFinish={handleChangePassword}
        >
          <Form.Item name="old-password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ !" }
            ]}
          >
            <Input.Password placeholder="Mật khẩu cũ" />
          </Form.Item>

          <Form.Item name="new-password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới !" },
              { pattern: PASSWORD_PATTEN, message: "Mật khẩu phải bao gồm chữ và số !"}
            ]}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item name="confirm-password"
            dependencies={['new-password']}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu mới !',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new-password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không giống nhau !'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Button onClick={onClose} className='w-full'>Thoát</Button>
            </Col>

            <Col span={12}>
              <Button
                htmlType='submit'
                type='primary'
                className='w-full'
              >
                Lưu
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default ChangePassword