import { useState } from 'react';
import {
  EMAIL_PATTERN,
  GENDER,
  TYPE_CV,
  PHONE_PATTERN,
  EDUCATION_LEVEL,
  EXPERIENCE,
  DATE_FORMAT,
} from "utils/constants/config"

import {
  Modal, Row, Col, Form,
  Input, Select, Spin,
  DatePicker, message, Button, Radio
} from 'antd'
import dayjs from 'dayjs';
import { SpinCustom, UploadFile } from 'components';
import { actionUpdateCv } from '../actions';
import moment from 'moment';
import DatePickerCustom from 'components/datePickerCustom';
import { isString } from 'lodash';
const { TextArea } = Input;
const UpdateCvModal = ({ onCancel, setDataTb, openUpdateCv ,setTotalRecordTb}) => {

  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)
  const [files, setFiles] = useState([])

  const handleUpdateCv = async () => {
    setSpinning(true)
   
      form.validateFields().then(async (values) => {

      
        const data_req = {
          ...values,
          description: values?.description || ' ',
          birthday: dayjs(values?.birthday).unix(),

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
          if (typeof (formData.getAll('cv')[0]) === 'string') {
            formData.set("cv", "null");
        }

        const { data, status } = await actionUpdateCv(openUpdateCv?.id,formData )
        if (status === 200) {
          message.success(data?.message)

          setDataTb(data?.list_appliant)
          setTotalRecordTb(data?.total)
          onCancel()
        }
      })
      .catch(
        err => console.log(err)
      )
      setSpinning(false)

      }
  

 

  return (
    <Modal
      className="common-long-modal"
      style={{ top: 10 }}
      open={true}
      width={1200}
      title="Cập nhật hồ sơ"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleUpdateCv}
            type="primary"
          >
            Cập nhật
          </Button>
        </Col>
      </Row>}

    >
      <SpinCustom spinning={spinning}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            ...openUpdateCv,
            birthday: dayjs(openUpdateCv?.birthday*1000),

          }}

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
                  // onChange={(date) => handleDateChange(date)}
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
                  options={Object.entries(GENDER)?.map(([key, value]) => ({
                    value: Number(key),
                    label: value,
                  }))}
                // onChange={handleModeChange}
                >


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
                  options={Object.entries(TYPE_CV)?.map(([key, value]) => ({
                    value: Number(key),
                    label: value,
                  }))}
                >

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

            <Col md={8} xs={12}>
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
                  defaultFile={openUpdateCv?.cv}
                />
              </Form.Item>
            </Col>

            <Col md={12} xs={12}>
              <Form.Item name="education_level"
                rules={[
                  { required: true, message: "Vui lòng chọn trình độ học vấn" }
                ]}
                label="Trình độ học vấn:"
              >

                <Radio.Group className="w-full" >
                  <Row gutter={[6, 6]}>

                    {Object.keys(EDUCATION_LEVEL).map((key) =>
                      <Col key={key} md={8} xs={12}>
                        <Radio value={Number(key)} >
                          {EDUCATION_LEVEL[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>


            <Col md={12} xs={12}>
              <Form.Item name="experience"
                rules={[
                  { required: true, message: "Vui lòng chọn kinh nghiệm làm việc" }
                ]}
                label="Kinh nghiệm:"
              >
                <Radio.Group className="w-full" >
                  <Row gutter={[6, 6]}>
                    {Object.keys(EXPERIENCE).map((key) =>
                      <Col key={key} md={8} xs={12}>
                        <Radio value={Number(key)}>
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

export default UpdateCvModal