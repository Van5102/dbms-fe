import { useEffect, useState } from 'react';

import { useSelector, useDispatch } from "react-redux"
// import {
//   actionGetDepartments,
//   actionGetPositions,
//   actionAddUser
// } from '../actions';
import SpinCutom from 'components/spin-custom';
import {
  Modal, Row, Col,
  Button, Form, Input,
  Select, message, Spin, DatePicker, InputNumber,
} from 'antd'

import { actionAddVehicle } from '../action';

const AddVehiclesModal = ({ onClose, setVehicles }) => {
  const userLogin = useSelector(state => state?.profile)
  const [form] = Form.useForm()
  const [callingApi, setCallApi] = useState(false)

  const handleAddVehicles = async (values) => {
    setCallApi(true)
    try {

      const { data, status } = await actionAddVehicle(values)
      if (status == 200) {
        message.success(data?.message)
        setVehicles(data?.vehicles)
        onClose()
      }

    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  }


  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Thêm xe"
      className='form-modal'
      width={350}
      footer={false}
    >
      <Spin spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleAddVehicles}
          form={form}

        >
          <Row>
            <Col span={24}>
              <Form.Item name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên xe" }
                ]}
              >
                <Input placeholder="Nhập tên xe "
                />
              </Form.Item>

        
              <Form.Item name="license_plate"
                className='w-full'

              >
                <Input placeholder="Nhập biển số xe "
                />
              </Form.Item>

                         
            </Col>

            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className='w-full' onClick={onClose} >Thoát</Button>
                </Col>

                <Col span={12}>
                  <Button htmlType='submit' type='primary' className='w-full'>Thêm xe</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>

    </Modal>
  )
}

export default AddVehiclesModal