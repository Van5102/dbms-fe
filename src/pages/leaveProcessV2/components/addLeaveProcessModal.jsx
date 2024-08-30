import { useEffect, useState } from 'react';
import moment from 'moment'

import {
  Modal, Row, Col,
  Button, Form, Input,
  message, InputNumber,
  Spin
} from 'antd'

import { actionAddProcedure } from '../action';
import DatePickerCustom from 'components/datePickerCustom';
import { SpinCustom } from 'components';
const { TextArea } = Input;

const AddLeaveProcess = ({ onCancel, setMyProcedures }) => {
  const [form] = Form.useForm()
  const [callingApi, setCallApi] = useState(false)
  const [start] = useState(null);

  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const disable = form.getFieldValue('disabledDays');

  const handleSetTimeStart = (v) => {
    form.setFieldsValue({ 'time_start': v });

  }

  const handleSetTimeEnd = (v) => {
    form.setFieldsValue({ 'time_end': v });
  }

  const handleAddProcedure = async (values) => {
    setCallApi(true)
    try {

      const params = {
        ...values,
        time_start: (parseInt(values.time_start)) / 1000,
        time_end: (parseInt(values.time_end)) / 1000,
        description: values.description || null,

      };

      const { data, status } = await actionAddProcedure(params)
      if (status == 200) {
        message.success(data?.message)

        setMyProcedures(data?.procedures)

      }

      onCancel();
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  }

  const calculateTotalLeave = (changedValues, allValues) => {
    const totalLeave =
      parseFloat(allValues.allow_day || 0) + parseFloat(allValues.not_allow_day || 0);
    setTotalLeaveDays(totalLeave);
    let disabledDays = 0;
    const allowDays = parseFloat(allValues.allow_day || 0);

    if (allowDays > 0 && allowDays <= 1) {
      disabledDays = 1;
    } else if (allowDays > 1 && allowDays <= 2) {
      disabledDays = 2;
    } else if (allowDays > 2 && allowDays <= 5) {
      disabledDays = 5;
    } else if (allowDays > 5 && allowDays <= 12) {
      disabledDays = 6;
    }
    form.setFieldsValue({ disabledDays });
    // setDisable(form.getFieldValue('disabledDays'))  

  };


  const disabledDate = (current) => {
    if (disable) {
      const maxDisabledDays = Math.min(disable, 6);
      return (
        current &&
        current < moment().startOf('day').add(maxDisabledDays, 'days')
      );
    }
    return current && current < moment().startOf('day');
  };

  useEffect(() => {
    if (start && totalLeaveDays > 0) {
      const endDate = moment(parseInt(start, 10)).add(totalLeaveDays, 'day').format('YYYY-MM-DD');
    }
  },
    [start, totalLeaveDays]);
  return (
    <Spin spinning={callingApi}>
      <Modal
        open={true}
        closeIcon={false}
        title="Thêm đề xuất"
        className='form-modal'
        width={350}
        footer={false}
      >
        <SpinCustom spinning={callingApi}>
          <Form
            layout="vertical"
            className="commom-form"
            onFinish={handleAddProcedure}
            form={form}
            onValuesChange={(changedValues, allValues) => {
              calculateTotalLeave(changedValues, allValues);
            }}
          >
            <Row gutter={[8, 0]} >
              <Col span={24}>
                <Form.Item name="reason"
                  rules={[
                    { required: true, message: "Vui lòng nhập lý do nghỉ" }
                  ]}
                >
                  <TextArea rows={2} placeholder="Lý do xin nghỉ" />
                </Form.Item>

              </Col>

              <Col span={12}>
                <Form.Item
                  name="allow_day"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        return new Promise((resolve, reject) => {
                          const numberDayOff = form.getFieldValue('number_day_off');
                          const allowDay = parseFloat(value);
                          if (!value && value !== 0) {
                            reject('Vui lòng nhập số ngày nghỉ có phép');
                          } else if (allowDay > numberDayOff) {
                            reject('Nghỉ có phép <= nghỉ phép còn lại');
                          } else {
                            resolve();
                          }
                        });
                      }
                    },
                  ]}

                >
                  <InputNumber
                    className='w-full'
                    placeholder="Số ngày có phép"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="not_allow_day"
                  rules={[
                    { required: true, message: "Vui lòng nhập số ngày nghỉ không phép" }
                  ]}
                >
                  <InputNumber
                    className='w-full'
                    placeholder="Số ngày không phép"
                  />
                </Form.Item>
              </Col>

              <Col span={24} >
                <strong>Tổng số ngày nghỉ: {totalLeaveDays}</strong>
              </Col>

              <Col span={24}>
                <Form.Item name="time_start"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời gian bắt đầu " }
                  ]}
                >
                  <Row gutter={[4, 0]}>
                    <Col>
                      <span>Thời gian bắt đầu:</span>
                    </Col>
                    <Col className="w-full">
                      <DatePickerCustom
                        setDatetime={handleSetTimeStart}
                      disabled={disabledDate}
                      />
                    </Col>
                  </Row>

                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="time_end"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời gian kết thúc " }
                  ]}
                >
                  <Row gutter={[4, 0]}>
                    <Col>
                      <span>Thời gian kết thúc:</span>
                    </Col>
                    <Col className="w-full">
                      <DatePickerCustom
                        setDatetime={handleSetTimeEnd}
                      disabled={disabledDate}

                      />
                    </Col>
                  </Row>

                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="description">
                  <TextArea rows={2} placeholder="Ghi chú" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 0]}>
                  <Col span={12}>
                    <Button className='w-full' onClick={onCancel} >Thoát</Button>
                  </Col>

                  <Col span={12}>
                    <Button htmlType='submit' type='primary' className='w-full'>Thêm đề xuất</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </SpinCustom>
      </Modal>
    </Spin>

  )
}

export default AddLeaveProcess