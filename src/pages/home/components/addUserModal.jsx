import { useState } from 'react';
import { DATE_FORMAT, EMAIL_PATTERN, PHONE_PATTERN, REACT_APP_TELEGRAM_API_BOT, REACT_APP_TELEGRAM_BOT } from "utils/constants/config"
import { useSelector } from "react-redux"
import SpinCutom from 'components/spin-custom';
import moment from 'moment';
import {
  actionAddUser
} from '../actions';

import {
  Modal, Row, Col,
  Button, Form, Input,
  Select, message, DatePicker,
} from 'antd'
import axios from "axios"
import { GetTelegramUser } from 'utils/helps';
import { RedoOutlined } from '@ant-design/icons';

const AddUser = ({ onClose, setUser }) => {
  const departments = useSelector(state => state?.departments)
  const positions = useSelector(state => state?.positions)
  const [telegrams, setTelegarms] = useState([])

  const [form] = Form.useForm()
  const [callingApi, setCallApi] = useState(false)
  const [files, setFiles] = useState([])

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

  const handleAddUser = async (values) => {

    setCallApi(true)
    try {
      const params = {
        ...values,
        phone: values.phone || null,

        avatar: values.avatar || null,
        department_id: values.department_id || null,
        date_of_birth: (moment(values.date_of_birth).valueOf()) / 1000 || null,
        start_working: (moment(values.start_working).valueOf()) / 1000 || null
      }
      if (values?.telegram_chat_id) {
        params.telegram_chat_id = values.telegram_chat_id || null
      }
      if (values?.phone) {
        params.phone = values.phone
      }
      // console.log(params);
      const formData = new FormData()
      files.forEach((file) => formData.append(`avatar`, file))

      Object.keys(params).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, params[key]);
        }
      })

      const { data, status } = await actionAddUser(formData)
      if (status === 200) {
        message.success(data?.message)
        setUser(data?.employees)
        onClose()
      }

    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  }
  const handleDateChange = (date) => {
    form.setFieldValue('date_of_birth', date)
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Thêm nhân viên"
      className='common-long-modal'
      width={700}
      footer={false}
    >
      <SpinCutom SpinCutom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleAddUser}
          form={form}
        >
          <Row gutter={[8,8]}>
         
            <Col span={12}>
              <Form.Item name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên" }
                ]}
                label="Họ và tên:"
              >
                <Input placeholder="Nhập tên "
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { pattern: EMAIL_PATTERN, message: "Email không đúng định dạng !" }

                ]}
                label="Email:"
              >
                <Input placeholder="Nhập email "
                />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="date_of_birth"
                label="Ngày sinh:"
                rules={[
                  { required: true, message: "Vui lòng điền" }
                ]}
              >

                <DatePicker
                  onChange={(date) => handleDateChange(date)}
                  allowClear={false}
                  format={DATE_FORMAT}
                  className="w-full"
                />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="start_working"
                label="Ngày bắt đầu làm việc:"
                rules={[
                  { required: true, message: "Vui lòng điền" }
                ]}
              >

                <DatePicker
                  onChange={(date) => handleDateChange(date)}
                  allowClear={false}
                  format={DATE_FORMAT}
                  className="w-full"
                />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="phone"
                rules={[
                  { pattern: PHONE_PATTERN, message: "Số điện thoại không đúng định dạng !" },
                ]}
                label="Số điện thoại:"
              >
                <Input placeholder="Nhập số điện thoại "
                />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="position_id"
                rules={[
                  { required: true, message: "Vui lòng chọn chức vụ !" }
                ]}
                label="Chức vụ:"
              >
                <Select
                  className='w-full'
                  placeholder="Chức vụ"
                  options={positions?.filter(e => e?.code !== "GIAM_DOC")?.map(e => ({
                    value: e.id.toString(),
                    label: e.name,
                  }))}
                >
                </Select>
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu !" }
                ]}
                label="Mật khẩu:"
              >
                <Input.Password placeholder="Mật khẩu" autoComplete="auto" />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item name="department_id"
                // rules={[
                //   { required: true, message: "Vui lòng chọn phòng ban !" }
                // ]}
                label="Phòng ban:"
              >
                <Select
                  showSearch
                  className='w-full'
                  placeholder="Phòng ban"
                  options={departments?.map(e => ({
                    value: e.id.toString(),
                    label: e.name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>

              {/* <Form.Item name="telegram_chat_id">
                <InputNumber placeholder="ID telegram" className='w-full'
                />
              </Form.Item> */}
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <span>Link kết nối: </span>

                  <a className="txt-link" target='_blank' href={REACT_APP_TELEGRAM_BOT}
                  >
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


              {/* <Form.Item name="avatar">
                <Row  >
                  <Col>
                    Ảnh:
                  </Col>

                  <Col className='w-full'>
                    <UploadImage
                      maxCount={1}
                      files={files}
                      setFiles={setFiles}
                    />
                  </Col>
                </Row>

              </Form.Item> */}
            </Col>

            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className='w-full' onClick={onClose} >Thoát</Button>
                </Col>

                <Col span={12}>
                  <Button htmlType='submit' type='primary' className='w-full'>Thêm nhân viên</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </SpinCutom>
    </Modal>
  )
}

export default AddUser