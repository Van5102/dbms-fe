import {  DATE_FORMAT } from "utils/constants/config";
import { isEmpty } from "utils/helps";
import {  useState } from "react";
import { SpinCustom } from "components";
import dayjs from "dayjs";
import {RANK} from "utils/constants/config"
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  DatePicker,
  Select,
  message,Radio
} from "antd";

import { actionReportCheck } from "../actions";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";


const AddReportCheck = ({ onCancel, reportCheckRequest }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  const handleAddCheckingReport = async (values) => {
    setSpinning(true)

    try {

      if (isEmpty(values?.list_items)) {
        return;
      } else {
        const params = {
          request_checking: reportCheckRequest?.id || null,
          warehouse_import: null
        }
        const data_rq = values?.list_items.map((v) => ({
          device_id:v?.device_id||null,
          model:v?.model||null,
          result:v?.result||null,
          description: v?.description || null,
          manufactor: v?.manufactor || null,
          manufactor_year: dayjs(v?.manufactor_year).unix() || null,

        }));
      
        const { data, status } = await actionReportCheck(reportCheckRequest?.id,{list_result:data_rq} , params);
        if (status === 200) {

          message.success(data?.message);
          onCancel()
        }
      }

    } catch (error) {
      console.log(error);
    }
    setSpinning(false)

  };

  const handleDateChange = (date) => {
    form.setFieldValue("manufactor_year", date)
  };

  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title="Báo cáo"
      width={500}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={handleAddCheckingReport} layout="vertical">
          <Form.List name="list_items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row gutter={[8, 0]} key={key}>
                    <Col span={24}>
                      <Row>
                        <Col>STT: {index + 1}</Col>

                        <Col>
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            danger
                          />
                        </Col>
                      </Row>

                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "device_id"]}

                        label="Thiết bị"
                        rules={[
                          { required: true, message: "Vui lòng nhập chọn" },
                        ]}
                      >
                        <Select
                          className="w-full"
                          placeholder="Thiết bị"
                          showSearch
                          allowClear

                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option.children}`
                              .toLocaleLowerCase()
                              .includes(input.toLocaleLowerCase())
                          }
                        >
                          {reportCheckRequest?.list_device?.map((e) => (
                            <Select.Option key={e?.id} value={e.id}>
                              {e?.device_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "model"]}

                        label="Model:"
                        rules={[
                          { required: true, message: "Vui lòng nhập nội dung" },
                        ]}
                      >
                        <Input placeholder="Model" />
                      </Form.Item>
                    </Col>



                    <Col span={12}>
                      <Form.Item

                        {...restField}
                        name={[name, "manufactor_year"]}
                        allowClear={false}
                        rules={[
                          { required: true, message: "Vui lòng chọn" }
                        ]}
                        label="Năm sản xuất:"
                      >
                        <DatePicker
                          className="w-full"
                          onChange={(date) => handleDateChange(date)}
                          format={DATE_FORMAT}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item

                        {...restField}
                        name={[name, "manufactor"]}
                        label="Nhà sản xuất:"
                        rules={[
                          { required: true, message: "Vui lòng nhập nội dung" },
                        ]}
                      >
                        <Input placeholder="Nhà sản xuất:" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                    Kết quả
                     
                        <Radio.Group className="w-full">
                  <Row gutter={[10, 10]}>
                    {Object.keys(RANK).map((key) =>
                      <Col key={key} md={4} xs={12}>
                        <Radio value={key}>
                          {RANK[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Ghi chú"

                      >
                        <Input.TextArea rows={4} />
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



          <Row gutter={[8, 0]} justify={"center"}>
            <Col span={6}>
              <Button className="w-full" onClick={onCancel}>
                Thoát
              </Button>
            </Col>

            <Col span={6}>
              <Button htmlType="submit" type="primary" className="w-full">
                Đề xuất
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>

    </Modal>
  );
};

export default AddReportCheck;
