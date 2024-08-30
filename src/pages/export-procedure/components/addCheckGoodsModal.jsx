import { CHECK_GOODS_TYPE, DATE_FORMAT} from "utils/constants/config";
import { isEmpty } from "utils/helps";
import {  useState } from "react";
import { SpinCustom } from "components";
import dayjs from "dayjs";
import { UploadFile } from "components";

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Radio,
  message,
} from "antd";

import { actionRequestCheck } from "../actions";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";


const AddCheckGoods = ({ onCancel, title, checkGoods, setTabKey }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [files, setFiles] = useState([]);


  const handleAddCheckingRequest = async (values) => {
    form.validateFields().then(async (values) => {
      const items = values?.list_items?.filter((item) => item)
      setSpinning(true)
      try {
        if (isEmpty(values?.list_items)) {
          return;
        } else {
          const params = {
            request_checking: null,
            warehouse_import: checkGoods?.id
          }
          const formData = new FormData();
          formData.append("contract_number_attached", files[0])



          const data_rq = {
            batch: values?.batch || null,
            device_item: values?.device_item || null,
            address_checking: values?.address_checking || null,
            result_checking: values?.result_checking || null,
            devices: items?.map(e => e.devices),
            deadline: items?.map(e => parseInt(dayjs(e.deadline).unix())),
          }
          Object.keys(data_rq).forEach(key => {
            if (key !== 'contract_number_attached') {
              if (key === 'devices') {
                formData.append(key, data_rq[key]);

              }
              else if(key === 'deadline'){ 
                formData.append(key,data_rq[key] )

              }
              else{
                formData.append(key, form.getFieldValue(key))
            }
          }


          })

    
          const { data, status } = await actionRequestCheck(checkGoods?.id, formData, params);
          if (status === 200) {
            setTabKey("tab-5")
            // setImplementerProcedures
            message.success(data?.message);
            onCancel()
          }

        }
      } catch (error) {
        console.log(error);
      }
    })
      .catch(
        err => console.log(err)
      )





    setSpinning(false)

  };


  const handleDateChange = (date) => {
    form.setFieldValue("deadline", date)
  };

  return (
    <Modal
      className="common-long-modal"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button
            className="w-120"
            onClick={onCancel}
          >Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleAddCheckingRequest}
            type="primary"
          >
            Đề xuất
          </Button>
        </Col>
      </Row>}
      open={true}
      title={title}
      width={500}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form}
          // onFinish={handleAddCheckingRequest}
          layout="vertical">


          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Form.Item

                name="batch"
                label="Hàng về đợt thứ"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="device_item"
                label="Số mục thiết bị"
                rules={[
                  { required: true, message: "Vui lòng nhập " },
                ]}
              >
                <InputNumber
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item

                name="address_checking"
                label="Địa điểm kiểm hàng"

              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Hợp đồng đính kèm(PDF)"  name="contract_number_attached"
              // rules={[
              //   { required: true, message: "Vui lòng chọn tệp" },
              // ]}

              >
                <UploadFile
                  setFiles={setFiles}
                  files={files}
                  maxCount={1}
                />
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item name="result_checking"

                rules={[
                  { required: true, message: "Vui lòng chọn hình thức" }
                ]}
                label="Kết quả kiểm hàng:"
              >
                <Radio.Group className="w-full">
                  <Row gutter={[6, 6]}>

                    {Object.keys(CHECK_GOODS_TYPE).map((key) =>
                      <Col key={key} >
                        <Radio value={key}>
                          {CHECK_GOODS_TYPE[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>



          </Row>

          <Form.List name="list_items">
            {(fields, { add, remove }) => (
              <>
                {fields?.map(({ key, name, ...restField }, index) => (
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
                        name={[name, "devices"]}
                        label="Thiết bị"
                        rules={[
                          { required: true, message: "Vui lòng nhập chọn" },
                        ]}
                      >
                        <Select
                          className="w-full"
                          placeholder="Thiết bị"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option.children}`
                              .toLocaleLowerCase()
                              .includes(input.toLocaleLowerCase())
                          }
                        >
                          {checkGoods?.devices.map((e) => (
                            <Select.Option key={e?.id} value={e.id}>
                              {e?.device_name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item  {...restField}
                        name={[name, "deadline"]}
                        allowClear={false}
                        rules={[
                          { required: true, message: "Vui lòng chọn ngày hoàn thành" }
                        ]}
                        label="Ngày hoàn thành:"
                      >
                        <DatePicker
                          className="w-full"
                          onChange={(date) => handleDateChange(date)}
                          format={DATE_FORMAT}
                        />
                      </Form.Item>
                    </Col>

                  </Row>
                ))}

                <Form.Item>
                  <Button type="primary" icon={<PlusOutlined />} onClick={add}>
                    Thêm thiết bị
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* <Row gutter={[8, 0]} justify={"center"}>
            <Col span={6}>
              <Button className="w-full" onClick={onCancel}>
                Thoát
              </Button>
            </Col>

            <Col span={6}>
              <Button
                htmlType="submit"
                type="primary"
                className="w-full">
                Đề xuất
              </Button>
            </Col>
          </Row> */}
        </Form>
      </SpinCustom>

    </Modal>
  );
};

export default AddCheckGoods;
