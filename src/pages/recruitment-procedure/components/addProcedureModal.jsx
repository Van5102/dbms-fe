import { useEffect, useState } from "react"
import { EXPERIENCE, GENDER, DATE_FORMAT, USE_NEEDS, EDUCATION_LEVEL } from "utils/constants/config"
import { actionCreateRecruitmentProcedure } from "../actions"
import { actionGetUsers } from 'pages/home/actions';
import { useSelector } from "react-redux"
import { SpinCustom, QuillEditer } from "components"
import dayjs from "dayjs"

import {
  Modal, Form, Row, Col, Radio,
  Button, Input, InputNumber,
  message, Select, DatePicker
} from "antd"

const AddProcedure = ({ onCancel, setData }) => {
  const [form] = Form.useForm()
  const departments = useSelector(state => state?.departments)
  const userLogin = useSelector(state => state?.profile)

  const [spinning, setSpinning] = useState(false)
  const [users, setUsers] = useState([])

  const handleAddProcedure = async () => {
    setSpinning(true)
    form.validateFields().then(async (values) => {
      const data_req = {
        ...values,
        day_need: dayjs(values?.day_need).unix(),
      }

      const { data, status } = await actionCreateRecruitmentProcedure(data_req)

      if (status === 200) {
        message.success(data?.message)
        setData(data?.procedures)
        onCancel()
      }
    }).catch(
      err => console.log(err)
    )
    setSpinning(false)
  }

  const handleGetUser = async () => {
    setSpinning(true)
    try {
      const { data, status } = await actionGetUsers()

      if (status === 200) {
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Đề xuất tuyển dụng"
      width={1200}
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleAddProcedure}
            type="primary"
          >
            Đề xuất
          </Button>
        </Col>
      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={[8, 0]}>
            <Col md={8} xs={12}>
              <Form.Item name="position_name"
                rules={[
                  { required: true, message: "Vui lòng nhập vị trí" }
                ]}
              >
                <Input placeholder="Vị trí cần tuyển" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="department_id"
                rules={[
                  { required: true, message: "Vui lòng chọn bộ phận" }
                ]}
              >
                <Select
                  placeholder='Bộ phận'
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                  }
                >
                  {departments?.map(item =>
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.name}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="gender">
                <Select
                  allowClear
                  className='w-full'
                  placeholder="Giới tính"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                  }
                >
                  {Object.keys(GENDER).map((key) =>
                    <Select.Option key={key} value={key}>
                      {GENDER[key]}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="quantity"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng" }
                ]}
              >
                <InputNumber className="w-full" min={1} placeholder="Số lượng" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="day_need"
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian yêu cầu " }
                ]}
              >
                <DatePicker
                  className="w-full"
                  placeholder="Thời gian yêu cầu"
                  disabledDate={currentDate => currentDate <= dayjs().startOf('D')}
                  format={DATE_FORMAT}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="user_replaced">
                <Select
                  allowClear
                  className='w-full'
                  placeholder="Thay thế nhân viên"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                  }
                >
                  {users.filter((u) =>
                    u?.id !== userLogin?.id && u?.position_code !== "GIAM_DOC" && u?.position_code !== "P_GIAM_DOC"
                  ).map((u) =>
                    <Select.Option key={u?.id} value={u.id}>
                      {u?.name}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item name="reason_replaced"
                label="Lý do thay thế"
              >
                <QuillEditer
                  onChange={(v) => {
                    form.setFieldValue('reason_replaced', v)
                  }}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item name="reason_recruitment"
                label="Lý do tuyến dụng"
                rules={[
                  { required: true, message: "Vui lòng nhập lý do tuyển dụng" }
                ]}
              >
                <QuillEditer
                  onChange={(v) => {
                    form.setFieldValue('reason_recruitment', v)
                  }}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item name="description"
                label="Yêu cầu năng lực nhân sự"
                rules={[
                  { required: true, message: "Vui lòng nhập yêu cầu năng lực nhân sự" }
                ]}
              >
                <QuillEditer
                  onChange={(v) => {
                    form.setFieldValue('description', v)
                  }}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item name="specializes"
                label="Mô tả công việc"
                rules={[
                  { required: true, message: "Vui lòng nhập chuyên môn" }
                ]}
              >
                <QuillEditer
                  onChange={(v) => {
                    form.setFieldValue('specializes', v)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="use_needs"
            rules={[
              { required: true, message: "Vui lòng chọn nhu cần sử dụng" }
            ]}
          >
            <Radio.Group className="w-full">
              <Row gutter={[6, 6]}>
                <Col span={24}>Nhu cầu sử dụng:</Col>

                {Object.keys(USE_NEEDS).map((key) =>
                  <Col span={8} key={key}>
                    <Radio value={key}>
                      {USE_NEEDS[key]}
                    </Radio>
                  </Col>
                )}
              </Row>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="experience"
            rules={[
              { required: true, message: "Vui lòng chọn kinh nghiệm làm việc" }
            ]}
          >
            <Radio.Group className="w-full">
              <Row gutter={[6, 6]}>
                <Col span={24}>Kinh nghiệm làm việc:</Col>

                {Object.keys(EXPERIENCE).map((key) =>
                  <Col key={key} md={8} xs={12}>
                    <Radio value={key}>
                      {EXPERIENCE[key]}
                    </Radio>
                  </Col>
                )}
              </Row>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="education_level"
            rules={[
              { required: true, message: "Vui lòng chọn trình độ học vấn" }
            ]}
          >
            <Radio.Group className="w-full">
              <Row gutter={[6, 6]}>
                <Col span={24}>Trình độ học vấn:</Col>

                {Object.keys(EDUCATION_LEVEL).map((key) =>
                  <Col key={key} md={8} xs={12}>
                    <Radio value={key}>
                      {EDUCATION_LEVEL[key]}
                    </Radio>
                  </Col>
                )}
              </Row>
            </Radio.Group>
          </Form.Item>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default AddProcedure