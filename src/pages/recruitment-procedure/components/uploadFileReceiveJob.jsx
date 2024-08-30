import {
  Modal, Row, Col,
  Button, Form, message,
  DatePicker,
  Input
} from "antd";
import { SpinCustom, UploadFile } from "components";
import { useState } from "react";
import { actionSendEmail, } from "../actions"
import { DATE_FORMAT } from "utils/constants/config";
import dayjs from "dayjs";


const SendEmailReceiveJob = ({ onCancel, interviewId, par, setDataTb }) => {
  const [spinning, setSpinning] = useState(false)
  const [files, setFiles] = useState([])
  const [form] = Form.useForm()

  const handleSendEmail = async () => {
    // console.log(v);
    setSpinning(true)

    try {
      const formData = new FormData();

      formData.append("file_invite", files[0])
      Object.keys(form.getFieldsValue()).map(v => {
        if (v !== 'file_invite') {
          if(v == 'start_working'){formData.append(v, dayjs(form.getFieldValue(v)).unix())}
          if(v == 'cc_emails'){formData.append(v,form.getFieldValue(v))}
        }
      })

      const { data, status } = await actionSendEmail(interviewId, formData, par)
      if (status === 200) {
        setDataTb(data?.list_interview)
        message.success(data?.message)
        onCancel()
      } else {
        message.error(data?.message)
        onCancel()
      }

    } catch (err) {
      console.log(err)
      message.error(err)
    }

    setSpinning(false)
  }

  const handleDateChange = (date) => {
    form.setFieldValue("start_working", date)
  };

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }

  return (

    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={350}
      open={true}
      title="Gửi email nhận việc"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button
            className="w-120"
            onClick={onCancel}
          >Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleSendEmail}
            type="primary"
          >
            Gửi Email
          </Button>
        </Col>
      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendEmail}
        >
          <Row gutter={[8, 0]}>
            <Col span={24}>
              <Form.Item name="start_working"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày nhận việc" }
                ]}
                label="Ngày nhận việc"
              >
                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    className="w-full"
                    onChange={(date) => handleDateChange(date)}
                    disabledDate={handleDisabledDate}
                  />
                </Col>


              </Form.Item>

            </Col>

            <Col span={24}>
              <Form.Item name="file_invite"
                rules={[
                  { required: true, message: "Vui lòng chọn file đính kèm" }
                ]}
                label="file đính kèm email:"
              >
                <UploadFile
                  maxCount={1}
                  files={files}
                  setFiles={setFiles}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name='cc_emails' label='CC email tới:'>

                <Input.TextArea rows={3} placeholder="VD: kythuat9@aipt.vn, kythuat6@aipt.vn" />


              </Form.Item>
            </Col>
          </Row>


        </Form>
      </SpinCustom>

    </Modal>
  )


}

export default SendEmailReceiveJob;