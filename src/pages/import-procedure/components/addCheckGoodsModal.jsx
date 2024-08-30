import { CHECK_GOODS_TYPE, DATE_FORMAT, } from "utils/constants/config";
import {  getServerBaseUrl } from "utils/helps";
import { useEffect, useState } from "react";
import { SpinCustom } from "components";
import dayjs from "dayjs";
import { UploadFile } from "components";
import { saveAs } from 'file-saver';

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

import { actionRequestCheck, actionUploadFile } from "../actions";
import { ArrowDownOutlined, DeleteOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";


const AddCheckGoods = ({ onCancel, title, checkGoods, setListCheckGoodsProcedures, setTabKey }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  // console.log(checkGoods);

  const [files, setFiles] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);


  const handleAddCheckingRequest = async () => {
    setSpinning(true)

    form.validateFields().then(async (values) => {

      const params = {
        request_checking: null,
        warehouse_import: checkGoods?.id
      }

      const list_items = values?.list_items?.map((v) =>
      // console.log(v) 
      ({

        device_id: checkGoods?.devices.find(c => c.device_name === v?.name)?.device_id || v?.device_id || null,
        deadline: dayjs(v?.deadline).unix() || null,
        quantity: v?.quantity || null,
        model: v?.model || null,
        manufactor: v?.manufactor || null,
        origin: v?.origin || null,
        description: v?.description || null,
        //thiet bi con
        list_attach: v?.list_attach && v?.list_attach?.map((e) => ({
          att_name: e?.att_name || null,
          att_quantity: e?.att_quantity || null,
          att_model: e?.att_model || null,
          att_manufactor: e?.att_manufactor || null,
          att_origin: e?.att_origin || null,
          att_description: e?.att_description || null,
        }))
      })
      )

      const data_req = {
        batch: values?.batch || null,
        device_item: values?.device_item || null,
        address_checking: values?.address_checking || null,
        result_checking: values?.result_checking || null,
        description: values?.description || null,
        devices: list_items// danh sach thiet bi
      }

      if (files) {

        const reader = new FileReader();
        const readerExcel = new FileReader();
        reader?.readAsDataURL(files[0]);
        if (fileUpload.length > 0) {
          readerExcel?.readAsDataURL(fileUpload[0]);
          readerExcel.onload = () => {
            readerExcelResultReady = true;
            // if (readerResultReady && readerExcelResultReady) {
            //   replaceAndContinue();
            // }
          };
        }

        let readerResultReady = false;
        let readerExcelResultReady = false;

        reader.onload = () => {
          readerResultReady = true;
          if (readerResultReady) {
            replaceAndContinue();
          }
        };

        const replaceAndContinue = async () => {
          try {
            data_req.contract_number_attached = reader?.result?.replace(/;/g, ",").split(",").slice(2).join(",") || null;
            data_req.attach_file = readerExcel?.result?.replace(/;/g, ",").split(",").slice(2).join(",") || null;

            const { data, status } = await actionRequestCheck(checkGoods?.id, data_req, params);
            if (status === 200) {
              setTabKey("tab-5");
              setListCheckGoodsProcedures(data?.list_request)
              message.success(data?.message);
              onCancel();
            }
          } catch (error) {
            console.log(error);
          }

        };

      }

    }).catch((err) => {
      console.log('err', err);
    })


    setSpinning(false)

  };

  const handleDateChange = (date) => {
    form.setFieldValue("deadline", date)
  };

  const handleUploadExcel = async () => {
    setSpinning(true)
    try {
      const formData = new FormData();
      fileUpload.forEach((file) => formData.append('file', file))
      const { data, status } = await actionUploadFile(checkGoods?.id, formData)
      if (status === 200) {
        let res_data = JSON.parse(data?.replace(/NaN/g, 'null'))
        message.success(res_data?.message)

        res_data = res_data?.list_items.map(item => ({
          ...item,
          deadline: item?.deadline && dayjs(item?.deadline * 1000)
        }));



        form.setFieldValue("list_items", res_data)
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false)
  }

  useEffect(() => {
    if ((fileUpload.length > 0)) {
      handleUploadExcel()
    }
  }, [fileUpload])

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
      title="Yêu cầu kiểm hàng"
      width={900}
    >

      <Form
        form={form}
        name="dynamic_form_nest_item"
        layout="vertical"
      >
        <SpinCustom spinning={spinning}>
 <Row gutter={[8, 8]}>
          <Col span={8}>
            <Form.Item

              name="batch"
              label="Hàng về đợt thứ"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung" },
              ]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>

          <Col span={8}>
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

          <Col span={8}>
            <Form.Item

              name="address_checking"
              label="Địa điểm kiểm hàng"

            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Hợp đồng đính kèm(PDF)" name="contract_number_attached"


            >
              <UploadFile
                setFiles={setFiles}
                files={files}
                maxCount={1}
              />
            </Form.Item>
          </Col>


          <Col span={10}>
            <Form.Item name="result_checking"

              rules={[
                { required: true, message: "Vui lòng chọn hình thức" }
              ]}
              label="Kết quả kiểm hàng:"
            >
              <Radio.Group className="w-full">
                <Row gutter={[6, 6]}>

                  {Object.keys(CHECK_GOODS_TYPE).map((key) =>
                    <Col key={key} md={12}>
                      <Radio value={key}>
                        {CHECK_GOODS_TYPE[key]}
                      </Radio>
                    </Col>
                  )}
                </Row>
              </Radio.Group>
            </Form.Item>
          </Col>


          <Col span={8}
          >
            <Form.Item
              name="description"
              label="Ghi chú"
            >
              <Input.TextArea rows={3}></Input.TextArea>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col>
            <Form.Item name="">
              <Button onClick={() => window.open(`${getServerBaseUrl()}/get-divice_templates`, "_blank")} icon={<ArrowDownOutlined />} type="primary">Tải File Mẫu</Button>

            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              name="attach_file"
            >
              <UploadFile
                setFiles={setFileUpload}
                files={fileUpload}
                maxCount={1}
              />
            </Form.Item>
          </Col>


        </Row>


        <Form.List name="list_items">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => (

                  <Row key={field.key} gutter={[50, 0]}>
                    <Col span={24}>
                      <Row>
                        <Col><strong>STT: {index + 1}</strong> </Col>

                        <Col>
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            danger
                          />
                        </Col>
                      </Row>

                    </Col>

                    <Col span={8}>

                      <Row >

                        <Col span={24}>
                          <Form.Item
                            {...field}
                            name={[field.name, "device_id"]}
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

                        <Col span={24}>
                          <Form.Item
                            {...field}
                            name={[field.name, "quantity"]}
                            label="Số lượng"

                          >
                            <InputNumber className="w-full" min={0}></InputNumber>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            {...field}
                            name={[field.name, "model"]}

                            label="Model:"

                          >
                            <Input placeholder="Model" />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item

                            {...field}
                            name={[field.name, "manufactor"]}
                            label="Nhà sản xuất:"

                          >
                            <Input placeholder="Nhà sản xuất:" />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item

                            {...field}
                            name={[field.name, "origin"]}
                            label="Nguồn gốc:"

                          >
                            <Input placeholder="Nguồn:" />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item  {...field}
                            name={[field.name, "deadline"]}

                            label="Ngày hoàn thành:"

                          >
                            <DatePicker
                              className="w-full"
                              onChange={(date) => handleDateChange(date)}
                              format={DATE_FORMAT}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "description"]}
                            label="Ghi chú"
                          >
                            <Input.TextArea rows={3}></Input.TextArea>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={16}>
                      Thiết bị đi kèm
                      <Form.List name={[field.name, 'list_attach']}>
                        {(e, { add, remove }) => {
                          return (
                            <div>
                              {e.map((e, index) => (
                                <Row key={e.key} gutter={[8, 0]}>
                                  <Col span={4}>
                                    <Row>
                                      <Col><strong>STT: {index + 1}</strong> </Col>

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

                                  <Col span={8}>
                                    <Form.Item
                                      {...e}
                                      name={[e.name, "att_name"]}
                                      label="Thiết bị đi kèm"

                                    >
                                      <Input ></Input>
                                    </Form.Item>
                                  </Col>

                                  <Col span={8}>
                                    <Form.Item
                                      {...e}
                                      name={[e.name, 'att_quantity']}
                                      label="Số lượng"

                                    >
                                      <InputNumber className="w-full" />
                                    </Form.Item>
                                  </Col>

                                  <Col span={8}>
                                    <Form.Item
                                      {...field}
                                      name={[field.name, "att_model"]}

                                      label="Model:"

                                    >
                                      <Input placeholder="Model" />
                                    </Form.Item>
                                  </Col>

                                  <Col span={8}>
                                    <Form.Item

                                      {...field}
                                      name={[field.name, "att_manufactor"]}
                                      label="Nhà sản xuất:"

                                    >
                                      <Input placeholder="Nhà sản xuất:" />
                                    </Form.Item>
                                  </Col>

                                  <Col span={8}>
                                    <Form.Item

                                      {...field}
                                      name={[field.name, "att_origin"]}
                                      label="Nguồn gốc:"

                                    >
                                      <Input placeholder="Nguồn:" />
                                    </Form.Item>
                                  </Col>

                                  <Col span={16}
                                  >
                                    <Form.Item
                                      {...field}
                                      name={[field.name, "att_description"]}
                                      label="Ghi chú"
                                    >
                                      <Input.TextArea rows={3}></Input.TextArea>
                                    </Form.Item>
                                  </Col>

                                </Row>
                              ))}

                              <Form.Item>
                                <Button type="info" icon={<PlusCircleOutlined />} onClick={add}>

                                </Button>
                              </Form.Item>
                            </div>
                          );
                        }}
                      </Form.List>
                    </Col>

                  </Row>



                ))}

                <Form.Item>
                  <Button type="primary" icon={<PlusOutlined />} onClick={add}>
                    Thêm thiết bị
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
        </SpinCustom>
       

        

      </Form>

    </Modal>
  );
};

export default AddCheckGoods;
