import { useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import DatePickerCustom from "components/datePickerCustom";
import { setFormListItemValue } from "utils/helps";
import { TYPE_OVER_TIME } from "utils/constants/config";
import { actionCreateOvertimeProcedure } from "../actions";
import dayjs from "dayjs";

import {
  Modal, Button, Form,
  Input, Row, Col, Select,
  Spin, message
} from "antd"

const CreateOvertimeProcedureModal = ({ onCancel, setMyProcedures }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  // Hàm xử lý để tạo đề xuất
  const handleAddOvertimeProcedure = async () => {
    // lấy dữ liệu từ form
    const values = await form.validateFields()
      .then(async (values) => {
        const list_overTimes = values?.list_overTimes?.map(v => ({
          estimated_start_time: v?.estimated_start_time / 1000,
          estimated_end_time: v?.estimated_end_time / 1000,
          description: v?.description,
          type_overtime: parseInt(v?.type_overtime)
        }))

        return { list_overTimes }
      })
      .catch((err) =>
        console.log(err)
      )

    // Gọi API để tạo đề xuất
    if (values) {
      console.log(values);
      setSpinning(true)

      try {
        const { data, status } = await actionCreateOvertimeProcedure(values)

        if (status === 200) {
          message.success(data?.message);
          setMyProcedures(data?.procedures);
          onCancel();
        }

      } catch (error) {
        console.log(error);
      }

      setSpinning(false)
    }
  }

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Tạo đề xuất làm thêm giờ"
      className="fullscreen-modal"
      onCancel={onCancel}
      okText="Tạo đề xuất"
      onOk={handleAddOvertimeProcedure}
      width={800}
    >
      <Spin spinning={spinning}>
        <Form form={form} layout="vertical">
          <Form.List name="list_overTimes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row gutter={[8, 0]} key={key}>
                    <Col span={24}>
                      STT: {index + 1}

                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        danger
                      />
                    </Col>

                    <Col xs={24} sm={9}>
                      <Form.Item
                        {...restField}
                        name={[name, "estimated_start_time"]}
                        label="Thời gian dự kiến bắt đầu làm"
                        rules={[
                          { required: true, message: "Vui lòng chọn thời gian dự kiến bắt đầu làm" },
                        ]}
                      >
                        <DatePickerCustom
                          setDatetime={v => setFormListItemValue(form, "list_overTimes", "estimated_start_time", index, v)}
                          disabled={v => v < dayjs().startOf('D')}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={9}>
                      <Form.Item
                        {...restField}
                        name={[name, "estimated_end_time"]}
                        label="Thời gian dự kiến kết thúc làm"
                        rules={[
                          { required: true, message: "Vui lòng chọn thời gian dự kiến kết thúc làm" },
                        ]}
                      >
                        <DatePickerCustom
                          setDatetime={v => setFormListItemValue(form, "list_overTimes", "estimated_end_time", index, v)}
                          disabled={v => v < dayjs().startOf('D')}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "type_overtime"]}
                        label="Loại làm thêm giờ"
                        rules={[
                          { required: true, message: "Vui lòng chọn Loại làm thêm giờ" },
                        ]}
                      >
                        <Select>
                          {Object.keys(TYPE_OVER_TIME).map((key) => (
                            <Select.Option key={key} value={key}>
                              {TYPE_OVER_TIME[key]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Mô tả công việc"
                        rules={[
                          { required: true, message: "Vui lòng nhập mô tả công việc" },
                        ]}
                      >
                        <Input.TextArea placeholder="Mô tả bạn việc" />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button icon={<PlusOutlined />} onClick={add}>
                    Thêm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Spin>
    </Modal>
  )
}

export default CreateOvertimeProcedureModal