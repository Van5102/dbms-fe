import { useEffect, useState } from "react"
import { actionCreateSchedule } from "../actions"
import { actionGetUsers } from 'pages/home/actions';
import { SpinCustom } from "components"
import dayjs from "dayjs"
import {
  Modal, Form, Row, Col,
  Button, Input,
  message, Select, 
} from "antd"
import DatePickerCustom from "components/datePickerCustom";
const { TextArea } = Input;
const AddScheduleModal = ({ onCancel, setDataTb, openScheduleCv, setTabKey, page_num, page_size }) => {
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)
  const [users, setUsers] = useState([])


  const handleAddSchedule = async () => {
    setSpinning(true)
    form.validateFields().then(async (values) => {
      const params = {
        page_num,
        page_size,
        tab: 1,
        // applicant_id:
      }
      const data_req = {
        ...values,
        description: values?.description || " ",
        interview_time: (parseInt(values.interview_time)) / 1000 || null
      }
      const { data, status } = await actionCreateSchedule(openScheduleCv?.id, data_req, params)

      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        onCancel()
        setSpinning(false)
      } else {
        message.err(data?.message)
       
      }
    })
      .catch(
        err => console.log(err)
      )
    // 
  }

  const handleGetUser = async () => {
    // setSpinning(true)
    try {
      const { data, status } = await actionGetUsers()

      if (status === 200) {
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
    // setSpinning(false)
  }

  const handleSetTimeStart = (v) => {
    form.setFieldValue('interview_time', v)
  }

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }

  useEffect(() => {
    handleGetUser()
  }, [])

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Lịch Phỏng vấn "
      width={350}
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleAddSchedule}
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
            <Col span={24}>
              <Form.Item name="interviewer"
                rules={[
                  { required: true, message: "Vui lòng chọn người phỏng vấn " }
                ]}
                label="Người tham gia phỏng vấn"
              >
                <Select
                  className='w-full'
                  placeholder="Người tham gia phỏng vấn"
                  showSearch
                  allowClear
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                  }
                >
                  {users.map((e) =>
                    <Select.Option key={e?.id} value={e.id}>
                      {e?.name}
                    </Select.Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="interview_time"
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian phỏng vấn " }
                ]}
                label="Thời gian phỏng vấn"
              >
                <Row gutter={[4, 0]}>


                  <Col className="w-full">
                    <DatePickerCustom
                      setDatetime={handleSetTimeStart}
                      disabled={handleDisabledDate}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description"
                label="Mô tả:"
              >
                <TextArea rows={2} placeholder="Mô tả" />
              </Form.Item>
            </Col>


          </Row>

        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default AddScheduleModal