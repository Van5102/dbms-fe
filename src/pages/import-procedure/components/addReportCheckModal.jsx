import { DATE_FORMAT } from "utils/constants/config";
import {  isEmpty } from "utils/helps";
import { useState } from "react";
import { SpinCustom } from "components";
import dayjs from "dayjs";
import { RANK } from "utils/constants/config"
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  DatePicker,
  Select,
  message, Radio,
  
} from "antd";
import { actionReportCheck,  } from "../actions";

const AddReportCheck = ({ onCancel, reportCheckRequest, setListCheckGoodsProcedures }) => {

  console.log(reportCheckRequest);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);


  const handleAddCheckingReport = async (values) => {
    setSpinning(true)

    try {

      if (isEmpty(values?.list_items)) {
        return;
      } else {
      

        const data_rq = values?.list_items.map((v) =>
        ({

          device_id: v?.device_id || null,
          model: v?.model || null,
          result: v?.result || null,
          description: v?.description || null,
          manufactor: v?.manufactor || null,
          manufactor_year: dayjs(v?.manufactor_year).unix() || null,
          serial: v?.serial || null,
        })
        );


        const { data, status } = await actionReportCheck(reportCheckRequest?.id, { list_result: data_rq });
        if (status === 200) {
          message.success(data?.message);
          setListCheckGoodsProcedures(data?.list_request)
          onCancel()
        }
      }

    } catch (error) {
      console.log(error);
    }
    setSpinning(false)

  };

  
  const res_data = reportCheckRequest?.list_items.map(item =>
  ({
    ...item,
    manufactor_year: item?.manufactor_year && dayjs(item?.manufactor_year * 1000),
    result: String(item?.result),
    list_attach: item?.list_attach.map(e => ({
      ...e,
      result: String(e?.result),
    }))
  })
  );
  form.setFieldValue("list_items", res_data)



  const handleDateChange = (date) => {
    form.setFieldValue("manufactor_year", date)
  };


  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title="Báo cáo"
      width={1200}
    >
      <SpinCustom spinning={spinning}>

        <Form form={form} onFinish={handleAddCheckingReport} layout="vertical"
        >
          <Row gutter={[16, 0]}>
            

            <Col>
              <Form.List name="list_items" >
                {(fields, { add, remove }) => (
                  <>

                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row gutter={[8, 0]} key={key}>
                        <Col span={24}>
                          <Row>
                            <Col><strong>STT: {index + 1}</strong></Col>

                            
                          </Row>

                        </Col>

                        <Col span={6}>
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
                              {reportCheckRequest?.list_items?.map((e) => (
                                <Select.Option key={e?.id} value={e.id}>
                                  {e?.device_name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "model"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
                            ]}
                            label="Model:"

                          >
                            <Input placeholder="Model" />
                          </Form.Item>
                        </Col>



                        <Col span={6}>
                          <Form.Item

                            {...restField}
                            name={[name, "manufactor_year"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
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

                        <Col span={6}>
                          <Form.Item

                            {...restField}
                            name={[name, "manufactor"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
                            ]}
                            label="Nhà sản xuất:"

                          >
                            <Input placeholder="Nhà sản xuất:" />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
                            ]}
                            {...restField}
                            name={[name, "origin"]}
                            label="Nguồn gốc:"

                          >
                            <Input placeholder="Nguồn:" />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
                            ]}
                            {...restField}
                            name={[name, "serial"]}
                            label="Serial:"

                          >
                            <Input placeholder="Serial:" />
                          </Form.Item>
                        </Col>

                        <Col span={6}>

                          <Form.Item name={[name, "result"]}
                            rules={[
                              { required: true, message: "Vui lòng chọn Kết quả" }
                            ]}
                            label="Kết quả:"
                          >
                            <Radio.Group className="w-full">
                              <Row gutter={[6, 6]}>
                                {Object.keys(RANK).map((key) =>
                                  <Radio value={key}>
                                    {RANK[key]}
                                  </Radio>
                                )}
                              </Row>
                            </Radio.Group>
                          </Form.Item>

                        </Col>

                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" }
                            ]}
                            label="Ghi chú"

                          >
                            <Input.TextArea rows={4} />
                          </Form.Item>
                        </Col>

                        {/* <Col span={24}>
                          <Row justify={"center"}>
                            <Col span={22} >
                              <strong>Thiết bị đi kèm</strong>
                              <Form.List name={[name, 'list_attach']}>
                                {(e, { add, remove }) => {
                                  return (
                                    <>
                                      {e.map((e, index) => (
                                        <Row key={e.key} gutter={[8, 0]}>
                                          <Col span={2}>
                                            <Row>
                                              <Col>STT: {index + 1}</Col>

                                              <Col>
                                                <Button
                                                  type="text"
                                                  size="small"
                                                  icon={<DeleteOutlined />}
                                                  onClick={() => remove(e.name)}
                                                  danger
                                                />
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Col span={4}>
                                            <Form.Item
                                              {...e}
                                              name={[e.name, "att_name"]}
                                              label="Thiết bị đi kèm"

                                            >
                                              <Input ></Input>
                                            </Form.Item>
                                          </Col>

                                          <Col span={4}>
                                            <Form.Item
                                              {...e}
                                              name={[e.name, 'att_quantity']}
                                              label="Số lượng"

                                            >
                                              <InputNumber className="w-full" />
                                            </Form.Item>
                                          </Col>

                                          <Col span={4}>
                                            <Form.Item
                                              {...e}
                                              name={[e.name, 'serial']}
                                              label="serial"

                                            >
                                              <Input className="w-full" />
                                            </Form.Item>
                                          </Col>

                                          <Col span={4}>

                                            <Form.Item  {...e} name={[name, "result"]}
                                              rules={[
                                                { required: true, message: "Vui lòng chọn Kết quả" }
                                              ]}
                                              label="Kết quả:"
                                            >
                                              <Radio.Group className="w-full">
                                                <Row gutter={[6, 6]}>
                                                  {Object.keys(RANK).map((key) =>
                                                    <Radio value={key}>
                                                      {RANK[key]}
                                                    </Radio>
                                                  )}
                                                </Row>
                                              </Radio.Group>
                                            </Form.Item>

                                          </Col>

                                          <Col span={6}>
                                            <Form.Item
                                              {...e}
                                              name={[name, "description"]}

                                              label="Ghi chú"
                                            >
                                              <Input.TextArea rows={3} ></Input.TextArea>
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                      ))}

                                  
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Col>
                          </Row>
                        </Col> */}

                      </Row>
                    ))}


                  </>
                )}
              </Form.List>
            </Col>
          </Row>

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
    // {dataExcel && }
  );
};

export default AddReportCheck;
