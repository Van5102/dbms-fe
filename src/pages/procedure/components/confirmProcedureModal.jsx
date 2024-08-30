
import { useState, useEffect } from 'react'
import DatePickerCustom from 'components/datePickerCustom';
import { UploadImage, SpinCustom } from 'components';
import { actionConfirmDriver } from '../action';
import dayjs from 'dayjs';

import {
  Select, Modal, Row, Col,
  Button, Form, Input,
  message, InputNumber,
} from 'antd'

const { TextArea } = Input;

const ConfirmProcedureModal = ({ vehicles, processingProcedure, onClose, handleGetProcedures }) => {
  const [form] = Form.useForm()
  const [files, setFiles] = useState([]);
  const [callingApi, setCallApi] = useState(false)

  const handleSetTimeStart = (v) => {
    form.setFieldValue('departure_time', v)
  }

  const handleSetTimeEnd = (v) => {
    form.setFieldValue('trip_end_time', v)
  }

  const handleConfirmProcedure = async (values) => {
    setCallApi(true)
    try {
      const timeEnd = values.trip_end_time ? values.trip_end_time : " ";
      const numericTimeEnd = timeEnd !== " " ? parseInt(timeEnd) / 1000 : "";
      const kmStart = parseInt(values.km_start, 10);
      const kmEnd = parseInt(values.km_end, 10);

      if (values.driver_destination === undefined) {
        values.driver_destination = '';
      }
      const params = {
        ...values,
        departure_time: (parseInt(values.departure_time)) / 1000,
        trip_end_time: numericTimeEnd,
        km_start: kmStart,
        km_end: kmEnd,
      }

      const formData = new FormData()
      files.forEach((file) => formData.append(`imgs`, file))

      Object.keys(params).forEach(key => {
        if (key !== 'imgs') {
          formData.append(key, params[key]);
        }
      })

      const { data, status } = await actionConfirmDriver(formData, processingProcedure?.id);
      if (status == 200) {
        message.success(data?.message);
        handleGetProcedures()
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  };

  const handleDisabledDate = (currentDate) => {
    return currentDate < dayjs().startOf('D').subtract(30, 'days');
  }

  useEffect(() => {
    form.setFieldValue('imgs', files)
  }, [files])

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Xác nhận"
      className='form-modal'
      width={350}
      footer={false}

    >
      <SpinCustom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleConfirmProcedure}
          form={form}
        >
          <Form.Item name="vehicle_id"
            label='Xe đi (thực tế):'
            rules={[
              { required: true, message: "Vui lòng chọn xe" }
            ]}
          >
            <Select
              className='w-full'
              placeholder="Chọn xe"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
              }
            >
              {vehicles.map((e) =>
                <Select.Option key={e?.id} value={e.id}>
                  {e?.name}
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="departure_time"
            label='Thời gian đi (thực tế):'
            rules={[
              { required: true, message: "Vui lòng chọn thời gian đi(thực tế) " }
            ]}
          >
            <DatePickerCustom
              setDatetime={handleSetTimeStart}
              disabled={handleDisabledDate}
            />
          </Form.Item>

          <Form.Item name="trip_end_time"
            label='Thời gian về (thực tế):'
            rules={[
              { required: true, message: "Vui lòng chọn thời gian về(thực tế) " }
            ]}
          >
            <DatePickerCustom
              setDatetime={handleSetTimeEnd}
              disabled={handleDisabledDate}
            />
          </Form.Item>

          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Form.Item name="km_start">
                <InputNumber className='w-full' placeholder="KM bắt đầu "
                />
              </Form.Item>
            </Col>

            <Col span={12} >
              <Form.Item name="km_end" className='w-full'>
                <InputNumber placeholder="KM kết thúc " className='w-full'
                />
              </Form.Item>
            </Col>
          </Row >

          <Form.Item name="driver_destination">
            <TextArea rows={2} placeholder="Ghi chú(nếu có)" />
          </Form.Item>

          <Form.Item name="imgs"
            rules={[
              { required: true, message: "Vui lòng chọn ảnh" }
            ]}
          >
            <UploadImage
              maxCount={3}
              files={files}
              setFiles={setFiles}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Button className='w-full' onClick={onClose} >Thoát</Button>
            </Col>

            <Col span={12}>
              <Button htmlType='submit' type='primary' className='w-full' >Hoàn thành</Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default ConfirmProcedureModal

