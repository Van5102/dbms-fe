import DatePickerCustom from "components/datePickerCustom";
import { setFormListItemValue } from "utils/helps";
import { TYPE_OVER_TIME, STATUS} from "utils/constants/config";
import dayjs from "dayjs";

import {
  Modal, Form, Input, Row,
  Col, Select, InputNumber
} from "antd"

const UpdateActualTimesModal = ({ onCancel, record, onConfirm}) => {
  const [form] = Form.useForm();

  // Hàm xử lý để tạo đề xuất
  const handleConfrim = async () => {
    // lấy dữ liệu từ form
    const values = await form.validateFields()
      .then(async (values) => {
        const list_overTimes = values?.list_overTimes?.map(v => ({
          id: v?.id,
          actual_start_time: v?.actual_start_time / 1000,
          actual_end_time: v?.actual_end_time / 1000,
          total_minute: v?.total_minute
        }))

        return { list_overTimes }
      })
      .catch((err) =>
        console.log(err)
      )

    // Gọi API để tạo đề xuất
    if (values) {
      onConfirm(record?.id, STATUS.ACCEPT, values);
      onCancel();
    }
  }

  const list_overTimes = record?.over_time?.map(prev => ({
    ...prev,
    type_overtime: `${prev?.type_overtime}`,
  }));

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Cập nhật thời gian làm thực tế"
      className="fullscreen-modal"
      onCancel={onCancel}
      onOk={handleConfrim}
      okText="Xác nhận"
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ list_overTimes }}
      >
        <Form.List name="list_overTimes">
          {(fields, { add, remove }) => (
            fields.map(({ key, name, ...restField }, index) => (
              <Row gutter={[8, 0]} key={key}>
                <Col span={24}>
                  STT: {index + 1}
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "estimated_start_time"]}
                    label="Thời gian dự kiến bắt đầu làm"
                  >
                    <DatePickerCustom
                      setDatetime={() => { }}
                      disabled={() => true}
                      initValue={list_overTimes[index]?.estimated_start_time}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "estimated_end_time"]}
                    label="Thời gian dự kiến kết thúc làm"
                  >
                    <DatePickerCustom
                      setDatetime={() => { }}
                      disabled={() => true}
                      initValue={list_overTimes[index]?.estimated_end_time}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "type_overtime"]}
                    label="Loại làm thêm giờ"
                  >
                    <Select disabled>
                      {Object.keys(TYPE_OVER_TIME).map((key) => (
                        <Select.Option key={key} value={key}>
                          {TYPE_OVER_TIME[key]}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "actual_start_time"]}
                    label="Thời gian thực tế bắt đầu làm"
                    rules={[
                      { required: true, message: "Vui lòng chọn thời gian thực tế bắt đầu làm" },
                    ]}
                  >
                    <DatePickerCustom
                      setDatetime={v => setFormListItemValue(form, "list_overTimes", "actual_start_time", index, v)}
                      disabled={v => v < dayjs.unix(list_overTimes[index]?.estimated_start_time).startOf("day")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "actual_end_time"]}
                    label="Thời gian thực tế kết đầu làm"
                    rules={[
                      { required: true, message: "Vui lòng chọn thời gian thực tế kết đầu làm" },
                    ]}
                  >
                    <DatePickerCustom
                      setDatetime={v => setFormListItemValue(form, "list_overTimes", "actual_end_time", index, v)}
                      disabled={v => v < dayjs.unix(list_overTimes[index]?.estimated_end_time).startOf("day")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "total_minute"]}
                    label="Tổng thời gian làm thực tế (Phút)"
                  >
                    <InputNumber className="w-full"/>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Mô tả công việc"
                  >
                    <Input.TextArea disabled placeholder="Mô tả bạn việc" />
                  </Form.Item>
                </Col>
              </Row>
            ))
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}

export default UpdateActualTimesModal