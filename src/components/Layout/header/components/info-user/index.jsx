import {
  Button, Row, Col, Avatar,
  Modal,
  Form,
  Select
} from "antd"
import { GetTelegramUser, getFullUrlStaticFile } from "utils/helps";

import {
  ExclamationCircleOutlined,
  PhoneOutlined,
  GoldOutlined,
  RedoOutlined,
  WechatOutlined
} from "@ant-design/icons"



import './index.scss'
import { DefaultAvatar } from "assets";
import { REACT_APP_TELEGRAM_API_BOT, REACT_APP_TELEGRAM_BOT } from "utils/constants/config";
import { useState } from "react";
import axios from "axios";
import { SpinCustom } from "components";

const InfoUserModal = ({ onClose, userLogin, onChangePassword }) => {
  console.log(userLogin);
  const [telegrams, setTelegarms] = useState([])
  const [callingApi, setCallApi] = useState(false)

  const handleGetTelegarmUsers = async () => {
    setCallApi(true)
    try {
      const { data, status } = await axios.get(REACT_APP_TELEGRAM_API_BOT)
      if (status === 200) {


        setTelegarms(GetTelegramUser(data))
      }
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  }
  return (
    <Modal
      title="Thông tin nhân viên"
      open={true}
      closeIcon={false}
      width={350}
      className='common-modal employee-profile-modal'
      footer={<Row gutter={[8, 0]}>
        <Col span={12}>
          <Button onClick={onClose} className='w-full'>Thoát</Button>
        </Col>

        <Col span={12}>
          <Button type='primary'
            className='w-full'
            onClick={onChangePassword}
          >
            Sửa mật khẩu
          </Button>
        </Col>


      </Row>}
    >
      <SpinCustom SpinCutom spinning={callingApi}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Row gutter={[16, 0]}>
              <Col>
                <Avatar shape='square'
                  size={48}
                  src={userLogin?.avatar ? getFullUrlStaticFile(`${userLogin?.avatar}`) : DefaultAvatar}
                />
              </Col>

              <Col>
                <div className='employee-name'>{userLogin?.name}</div>
                <div>{userLogin?.email}</div>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={[6, 4]}>
              <Col>
                <PhoneOutlined />
              </Col>

              <Col>{userLogin?.phone || "Số điện thoại"}</Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={[6, 4]}>
              <Col>
                <GoldOutlined />
              </Col>

              <Col>{userLogin?.position_name}</Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={[6, 4]}>
              <Col>
                <ExclamationCircleOutlined />
              </Col>

              <Col>{userLogin?.department_name || "Phòng Giám đốc"}</Col>
            </Row>
          </Col>


          {
            userLogin?.telegram_chat_id ?
              <Col span={24}>
                <Row gutter={[6, 4]}>
                  <Col>
                    <WechatOutlined />
                  </Col>

                  <Col>{userLogin?.telegram_chat_id}</Col>
                </Row>
              </Col>
              :
              (
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <span>Link kết nối: </span>

                    <a className="txt-link" target='_blank' href={REACT_APP_TELEGRAM_BOT}>
                      {REACT_APP_TELEGRAM_BOT}
                    </a>
                  </Col>

                  <Col md={8} xs={24}>
                    <Button onClick={handleGetTelegarmUsers}
                      type='info'
                    >
                      <RedoOutlined />
                      Làm mới
                    </Button>
                  </Col>

                  <Col md={16} xs={24}>
                    <Form.Item name="telegram_chat_id">
                      <Select
                        showSearch
                        allowClear
                        // className="w-full"
                        placeholder="Danh sách"
                        optionFilterProp="children"
                      >
                        {telegrams?.map((telegram, index) =>
                          <Select.Option key={index} value={telegram?.id}>
                            {telegram?.first_name}
                            {telegram?.last_name}
                          </Select.Option>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>

                </Row>
              )

          }



        </Row>
      </SpinCustom>

    </Modal>
  );
}

export default InfoUserModal