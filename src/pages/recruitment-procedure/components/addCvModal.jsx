import { useState } from "react"
import { EXPERIENCE, GENDER, DATE_FORMAT, EDUCATION_LEVEL, TYPE_CV, PHONE_PATTERN, EMAIL_PATTERN } from "utils/constants/config"
import { actionCreateCv, } from "../actions"
// import { useSelector } from "react-redux"
import { SpinCustom, UploadFile } from "components"
import dayjs from "dayjs"

import {
  Modal, Form, Row, Col, Radio,
  Button, Input,
  message, Select, DatePicker
} from "antd"

const { TextArea } = Input;
const AddCv = ({ onCancel, openAddCv, setTabKey, setRecruitmentId, recruitmentId, dataTb, setDataTb }) => {

  const [form] = Form.useForm()
  // const departments = useSelector(state => state?.departments)
  // const userLogin = useSelector(state => state?.profile)
  const [files, setFiles] = useState([])
  const [spinning, setSpinning] = useState(false)
  // const [users, setUsers] = useState([])

  const [paginationTab, setPaginationTab] = useState({
    page_num: 1,
    page_size: 10
  })

  const handleAddProcedure = async () => {
    
    form.validateFields().then(async (values) => {
      setSpinning(true)

      const data_req = {
        ...values,
        description: values?.description || " ",
        birthday: dayjs(values?.birthday).unix(),
        // gender:values?.gender || null
      }
      const formData = new FormData()

      files.forEach((file) => {
        formData.append(`cv`, file)
      })

      Object.keys(data_req).forEach(key => {
        if (key !== 'cv') {
          formData.append(key, data_req[key]);
        }
      })

      const params = {
        page_num: paginationTab.page_num,
        page_size: paginationTab.page_size,
        recruitment_id: recruitmentId || null,
        // recruitment_id: recruitmentId,
        // name: nameSeach,
        // deparment: selectedStatus
      }

      const { data, status } = await actionCreateCv(openAddCv, formData, params)

      if (status === 200) {
        message.success(data?.message)
        setRecruitmentId(openAddCv)
        setTabKey("tab-4")
        setDataTb(data?.list_appliant)
        // setData(data?.procedures)
        onCancel()
      }
    })
      .catch(
        err => console.log(err)
      )

    setSpinning(false)
  }

  const handleDateChange = (date) => {
    form.setFieldValue('date_of_birth', date)
  };

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Thêm hồ sơ"
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
            Thêm
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
              <Form.Item name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên" }
                ]}
                label="Họ và tên:"
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="birthday"
                rules={[
                  { required: true, message: "Vui lòng nhập ngày sinh" }
                ]}
                label="Ngày sinh:"
              >
                <DatePicker
                  onChange={(date) => handleDateChange(date)}
                  allowClear={false}
                  format={DATE_FORMAT}
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { pattern: EMAIL_PATTERN, message: "Email không đúng định dạng !" }
                ]}
                label="Email:"
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="gender"
                label="Giới tính:"

              >

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
              <Form.Item name="cv_type"
                rules={[
                  { required: true, message: "Vui lòng nhập loại hồ sơ" }
                ]}
                label="Loại hồ sơ:"
              >
                <Select
                  placeholder="Loại hồ sơ"
                  allowClear
                >
                  {Object.keys(TYPE_CV).map((key) => (
                    <Select.Option key={key} value={key}>
                      {TYPE_CV[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="address"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ" },
                ]}
                label="Địa chỉ:"
              >
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>


            <Col md={8} xs={12}>
              <Form.Item name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: PHONE_PATTERN, message: "Số điện thoại không đúng định dạng !" }
                ]}
                label="Số điện thoại"
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="description"
                label="Mô tả:"
              >
                <TextArea rows={2} placeholder="Mô tả" />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item name="cv"
                // rules={[
                //   { required: true, message: "Vui lòng nhập hồ sơ" }
                // ]}
                label="Hồ sơ:"
              >
                <UploadFile
                  maxCount={1}
                  files={files}
                  setFiles={setFiles}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <Form.Item name="education_level"
                rules={[
                  { required: true, message: "Vui lòng chọn trình độ học vấn" }
                ]}
                label="Trình độ học vấn:"
              >
                <Radio.Group className="w-full">
                  <Row gutter={[6, 6]}>

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
            </Col>


            <Col md={12} xs={24}>
              <Form.Item name="experience"
                rules={[
                  { required: true, message: "Vui lòng chọn kinh nghiệm làm việc" }
                ]}
                label="Kinh nghiệm:"
              >
                <Radio.Group className="w-full">
                  <Row gutter={[6, 6]}>
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
            </Col>



          </Row>

        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default AddCv