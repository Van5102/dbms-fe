
import { useState, useEffect } from 'react'
import {
  Modal, Row, Col,
  Button, Form, Input,
  Select, message, Spin
} from 'antd'
import { actionApprove, actionGetProcedures } from '../action';
import { SpinCustom } from 'components';
const { TextArea } = Input;
const RejectProcedureModal = ({ rejectProcedure, onClose, setProcedures, handleGetProcedures }) => {
  const [description, setDescription] = useState("");
  const [callingApi, setCallApi] = useState(false);


  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleRejectProcedure = async (values) => {
    setCallApi(true)
    try {
      const { data, status } = await actionApprove(rejectProcedure?.id, 2, { description: values?.reason })
      if (status === 200) {
        const { data: updatedData, status: updatedStatus } = await actionGetProcedures()
        if (updatedStatus === 200) {
          message.success(data?.message)
          setProcedures(updatedData?.procedures);

          onClose()

        } else {
        }

      }
      handleGetProcedures()
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  }


  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Từ chối"
      className='form-modal'
      width={350}
      footer={false}
    >
      <SpinCustom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleRejectProcedure}
        >

          <Row>
            <Col span={24}>
              <Form.Item name="reason"
                rules={[
                  { required: true, message: "Vui lòng nhập lý do" }
                ]}>
                <TextArea rows={2} placeholder="Lý do từ chối"
                  onChange={handleDescriptionChange}
                />

              </Form.Item>
            </Col>

            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className='w-full' onClick={onClose} >Thoát</Button>
                </Col>

                <Col span={12}>
                  <Button htmlType='submit' type='primary' className='w-full' onClick={() => handleRejectProcedure}>Lưu</Button>
                </Col>
              </Row>
            </Col>

          </Row>



        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default RejectProcedureModal
