import { DATE_FORMAT, PAYMENT_TYPE, PHONE_PATTERN } from "utils/constants/config";
import { isEmpty } from "utils/helps";
import { useState } from "react";
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
  Checkbox,
} from "antd";

import { actionAddWareHouse } from "../actions";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";


const AddProcedure = ({ onCancel, title, setDataTb2, devices }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [files, setFiles] = useState([]);

  const handleAddProcedure = async (values) => {
    const items = values?.list_items?.filter((item) => item)
    setSpinning(true)
    try {
      const data_rq = {
        description: values?.description || null,
        customer_name: values?.customer_name || null,
        customer_address: values?.customer_address || null,
        pay_t1: values?.pay_t1 || null,
        pay_t2: values?.pay_t2 || null,
        pay_t3: values?.pay_t3 || null,
        pay_t4: values?.pay_t4 || null,
        payment: parseInt(values?.payment) || null,
        tax_code: values?.tax_code || null,
        bank: values?.bank || null,
        contact_name: values?.contact_name || null,
        date_of_manufacture: values?.date_of_manufacture ? 1 : 0,
        delivery_day: dayjs(values?.delivery_day).unix() || null,
        delivery_place: values?.delivery_place || null,
        invoice_VAT: values?.invoice_VAT ? 1 : 0,
        receipt_CO: values?.receipt_CO ? 1 : 0,
        contract_phone: values?.contract_phone || null,
        devices: items?.map((e) =>
        ({
          device_id: e.devices || null,
          quantity: e.quantity || null,
          model: e.model || null,
          manufactor: e.manufactor || null,
          description: e.description || null,
          origin: e.origin || null,
        })),
      }
      if (isEmpty(values?.list_items)) {
        message.error("Vui lòng chọn thêm thiết bị và nhập số lượng !");
      } else {

        if (files) {
          console.log('files', files)
          const reader = new FileReader();
          reader?.readAsDataURL(files[0]);


          let readerResultReady = false;
          reader.onload = () => {
            readerResultReady = true;
            if (readerResultReady) {
              replaceAndContinue()
            }


          }
          const replaceAndContinue = async () => {
            try {
              data_rq.attachments = reader?.result?.replace(/;/g, ",").split(",").slice(2).join(",") || null;

              const { data, status } = await actionAddWareHouse(data_rq);
              if (status === 200) {
                setDataTb2(data?.procedures)
                onCancel()
                message.success(data?.message);
              }
            } catch (error) {
              console.log(error);
            }

          };
        }

      }
    }
    catch (error) {
      console.log(error);
    }
    setSpinning(false)

  };


  const handleDateChangeHD = (date) => {
    form.setFieldValue("contract_day", date)
  };

  const handleDateChangeGH = (date) => {
    form.setFieldValue("delivery_day", date)
  };





  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title={title}
      width={1200}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={handleAddProcedure} layout="vertical">
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

                    <Col span={8}>
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
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option.children}`
                              .toLocaleLowerCase()
                              .includes(input.toLocaleLowerCase())
                          }
                        >
                          {devices?.map((e) => (
                            <Select.Option key={e?.id} value={e.id}>
                              {e?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        label="Số lượng"
                        rules={[
                          { required: true, message: "Vui lòng nhập số lượng" },
                        ]}
                      >
                        <InputNumber
                          className="w-full"
                          placeholder="Số lượng (VD: 1 cái)"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "model"]}
                        label="Model"
                        rules={[
                          { required: true, message: "Vui lòng nhập model" },
                        ]}
                      >
                        <Input
                          className="w-full"
                          placeholder="Model"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "manufactor"]}
                        label="Hãng sản xuất"
                        rules={[
                          { required: true, message: "Vui lòng nhập Hãng sản xuất" },
                        ]}
                      >
                        <Input
                          className="w-full"
                          placeholder="Hãng sản xuất"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "origin"]}
                        label="Xuất xứ"
                        rules={[
                          { required: true, message: "Vui lòng nhập Xuất xứ" },
                        ]}
                      >
                        <Input
                          className="w-full"
                          placeholder="Xuất xứ"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Mô tả"
                        rules={[
                          { required: true, message: "Vui lòng nhập Mô tả" },
                        ]}
                      >
                        <Input.TextArea
                          className="w-full"
                          placeholder="Mô tả"
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

          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item

                name="customer_name"
                label="Tên khách hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung" },
                ]}
              >
                <Input placeholder="Tên khách hàng" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item

                name="customer_address"
                label="Địa chỉ khách hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung" },
                ]}

              >
                <Input placeholder="Địa chỉ khách hàng" />
              </Form.Item>
            </Col>


            <Col span={8}>
              <Form.Item

                name="description"
                label="Mô tả"

              >
                <Input.TextArea size="small" placeholder="Mô tả" />
              </Form.Item>
            </Col>


            <Col span={8}>
              <Form.Item

                name="contact_name"

                label="Thông tin liên hệ"
              >
                <Input placeholder="Liên hệ" />
              </Form.Item>
            </Col>





            <Col span={24}>
              <strong>Điều kiện thanh toán:</strong>
              <Row gutter={[8, 0]}>
                <Col md={6} xs={24} >
                  <Form.Item
                    name="pay_t1"

                  >
                    <Input placeholder="Lần 1"></Input>
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    name="pay_t2"
                  >
                    <Input placeholder="Lần 2"></Input>

                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    name="pay_t3"
                  >
                    <Input placeholder="Lần 3"></Input>

                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    name="pay_t4"
                  >
                    <Input placeholder="Lần 4"></Input>

                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <strong>Chứng từ cung cấp:</strong>
              <Row gutter={[8, 0]}>
                <Col md={6} xs={12}>
                  <Form.Item name="date_of_manufacture"
                    valuePropName="checked"
                  >

                    <Checkbox >CQ NSX</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="receipt_CO"
                    valuePropName="checked"
                  >

                    <Checkbox>CO (PTM or NSX)</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="invoice_VAT"
                    valuePropName="checked"
                  >

                    <Checkbox>Hóa đơn đỏ</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item name="payment"

                rules={[
                  { required: true, message: "Vui lòng chọn hình thức" }
                ]}
                label="Loại thanh toán:"
              >
                <Radio.Group className="w-full">
                  <Row gutter={[6, 6]}>

                    {Object.keys(PAYMENT_TYPE)?.map((key) =>
                      <Col key={key} md={8} xs={12}>
                        <Radio value={key}>
                          {PAYMENT_TYPE[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>






            <Col md={8} xs={12}>
              <Form.Item name="tax_code"

                rules={[
                  { required: true, message: "Vui lòng chọn" }
                ]}
                label="MST:"
              >
                <InputNumber placeholder="MST" style={{ width: '150px' }}></InputNumber>

              </Form.Item>
            </Col>
            <Col md={8} xs={12}>
              <Form.Item name="bank"

                rules={[
                  { required: true, message: "Vui lòng chọn" }
                ]}
                label="Tài khoản:"
              >
                <Input placeholder="Tài khoản" style={{ width: '350px' }}></Input>

              </Form.Item>
            </Col>
            <Col md={8} xs={12}>
              <Form.Item name="delivery_day"

                rules={[
                  { required: true, message: "Vui lòng chọn" }
                ]}
                label="Ngày giao hàng:"
              >
                <DatePicker
                  className="w-full"
                  onChange={(date) => handleDateChangeGH(date)}
                  format={DATE_FORMAT}
                  allowClear={false}

                />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item

                name="delivery_place"
                rules={[{ required: true, message: "Vui lòng chọn" }]}
                label="Địa điểm giao hàng"
              >
                <Input placeholder="Địa điểm giao hàng" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item

                name="contract_phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: PHONE_PATTERN, message: "Số điện thoại không đúng định dạng !" }
                ]}
                label="SDT liên hệ HD:"
              >
                <Input placeholder="Số điện thoại"
                />
              </Form.Item>
            </Col>



            <Col span={8}>
              <Form.Item
                label="Tệp" name="attachments"

              >
                <UploadFile
                  setFiles={setFiles}
                  files={files}
                />
              </Form.Item>
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
  );
};

export default AddProcedure;
