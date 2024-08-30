import { useState } from "react"
import { NOTARIZATION_PROCEDURE_TYPES, DATE_FORMAT } from "utils/constants/config"
import { actionCreateNotarizationProcedure } from "../actions"
import { SpinCustom } from "components"
import { isEmpty } from "utils/helps"
import dayjs from "dayjs"

import {
  Modal, Form, Row, Col,
  Button, Input, InputNumber, 
  message, Select, DatePicker
} from "antd"

import { 
  DeleteOutlined,
  PlusOutlined
} from "@ant-design/icons"

const AddProcedure = ({ onCancel, setData }) => {
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)

  const handleAddProcedure = async (values) => {
    try {
      if (isEmpty(values?.papers))  {
        return
      }
      else {
        setSpinning(true)
        const papers = values?.papers.map((v) => ({
          name: v?.name,
          purpose: v?.purpose,
          quantity: v?.quantity,
          type_notariza: v?.type_notariza,
          description: v?.description,
          day_need: dayjs(v?.day_need).unix() || null,          
        }))
        
        const {data, status} = await actionCreateNotarizationProcedure({papers})

        if (status === 200) {
          message.success(data?.message)
          setData(data?.procedures)
          onCancel()
        }
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false)
  }

  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title="Đề xuất công chứng/dịch thuật"
      width={450}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          onFinish={handleAddProcedure}
        >
          <Form.List name="papers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row gutter={[8, 0]} key={key}>
                    <Col>
                      STT: {index + 1}
                    </Col>

                    <Col>
                      <Button type="text" size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        danger
                      />
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Vui lòng nhập tên hồ sơ/giấy tờ' }]}
                      >
                        <Input.TextArea size="small" placeholder="Tên hồ sơ/giấy tờ" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, 'purpose']}
                        rules={[{ required: true, message: 'Vui lòng nhập mục đích' }]}
                      >
                        <Input.TextArea size="small" placeholder="Mục đích" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Vui long nhập số lượng' }]}
                      >
                        <InputNumber min={1} className="w-full" placeholder="Số lượng" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'day_need']}
                        rules={[{ required: true, message: 'Vui lòng con ngày cần' }]}
                      >
                        <DatePicker 
                          className="w-full" 
                          placeholder="Ngày cần"
                          disabledDate={currentDate => currentDate <= dayjs().startOf('D')}
                          format={DATE_FORMAT}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, 'type_notariza']}
                        rules={[{ required: true, message: 'Vui lòng chọ hình thức công chứng' }]}
                      >
                        <Select 
                          placeholder="Hình thức công chứng"
                          allowClear
                        >
                          {Object.keys(NOTARIZATION_PROCEDURE_TYPES).map((key) => (
                            <Select.Option key={key} value={key}>
                              {NOTARIZATION_PROCEDURE_TYPES[key]}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col> 

                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                      >
                        <Input.TextArea size="small" placeholder="Mô tả" />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button icon={<PlusOutlined />} onClick={add}>
                    Thêm giấy tờ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Button className="w-full" onClick={onCancel}>Thoát</Button>
            </Col>

            <Col span={12}>
              <Button htmlType="submit"
                type="primary"
                className="w-full"
              >
                Đề xuất
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default AddProcedure