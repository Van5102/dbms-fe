import { Button, Col, Form, Modal, Row, message, Input, InputNumber, Upload, Radio, DatePicker } from "antd"
import { useEffect, useState } from "react";
import { actionAddAdvance, actionAddPayment } from "../actions";
import { SpinCustom } from "components";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { formatCurrency, formatVND } from "utils/helps";
import { DATE_FORMAT, PAYMENT_TYPE } from "utils/constants/config";
import dayjs from "dayjs";
const CreatePaymentProcedure = ({ onCancel, setMyProcedures, CheckTabItem1, CheckTabItem3 }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(null)
  const [base, setBase] = useState([]);
  const [files, setFiles] = useState([]);
  const [probationarySalary, setProbationarySalary] = useState();
  const [b, setB] = useState([]);
  const toBase64 = async (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleBase64Conversion = async () => {
    const updatedFiles = await Promise.all(
      files.map(async file => {

        const base64 = await toBase64(file.file) || null;
        return {
          ...file,
          file: base64.replace(/;/g, ",").split(",").slice(2).join(",")
        };
      })
    );
    setBase(updatedFiles);

  };

  useEffect(() => {
    handleBase64Conversion();
  }, [files]);


  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }

  const handleAddPayment = async (values) => {
    // console.log(values);
    setSpinning(true);
    try {



      const req_data = values?.payment.map((v, i) => ({
        details: v?.details || null,
        quantity: v?.quantity || null,
        cost: v?.cost || null,
        note: v?.note || null,
        files: base?.filter((file) => file.index === i).map(e => e.file) || null,
      }));
      // console.log(values?.content, req_data);
      const body_data = {
        content: values?.content,
        type_payment: parseInt(values?.type_payment),
        payment_term: dayjs(values?.payment_term).unix(),
        list_item: req_data
      }


      // Nếu là tạo đề xuất tạm ứng
      if (CheckTabItem1) {
        const { data, status } = await actionAddAdvance(body_data)
        if (status === 200) {

          setMyProcedures(data?.procedures);
          message.success(data?.message);
          onCancel()
        }
      }
      // Nếu là tạo đề xuất  thanh toán
      if (CheckTabItem3) {
        const { data, status } = await actionAddPayment(body_data)
        if (status === 200) {

          setMyProcedures(data?.procedures);
          message.success(data?.message);
          onCancel()
        }
      }

    }
    catch (e) {
      console.log(e);
    }
    setSpinning(false)

  }

  const setEstimatedPriceFormatCurrency = (index, value) => {
    const newItems = [...b];
    newItems[index] = { ...newItems[index], value };
    setB(newItems)
    
  };
  
//  xóa phần tử cập nhật lại giá trị mảng
  const handleRemoveItem = index => {
    const newItems = [...b];
    newItems.splice(index, 1); // Xóa phần tử có index tương ứng từ mảng newItems
    setB(newItems); // Cập nhật state items
  };

  return (
    <Modal
      title="Đề xuất"
      open={true}
      className="common-long-modal"
      footer={false}
      width={500}
    >
      <SpinCustom spinning={spinning} >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddPayment}
        >
          <Row gutter={[8, 8]}>
          <Col span={24}>
          <strong>Tổng số tiền: {formatCurrency(b?.map(e => e.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))}</strong>  
          </Col>
            <Col span={24}>
              <Form.Item
                name='content'
                label='Lý do/nội dung '
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung" },
                ]}
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            {CheckTabItem1 &&
              <Col span={24}>
                <Form.Item name="payment_term"
                  rules={[
                    { required: true, message: "Vui lòng chọn thời gian" }
                  ]}
                  label="Thời hạn thanh toán"
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabledDate={handleDisabledDate}
                  />
                </Form.Item>
              </Col>
            }

            <Col span={24}>
              <Form.Item name="type_payment"

                rules={[
                  { required: true, message: "Vui lòng chọn hình thức" }
                ]}
                label="Hình thức thanh toán:"
              >
                <Radio.Group className="w-full">
                  <Row gutter={[6, 6]}>

                    {Object.keys(PAYMENT_TYPE)?.map((key) =>
                      <Col key={key} md={12} xs={12}>
                        <Radio value={key}>
                          {PAYMENT_TYPE[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.List name="payment">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row gutter={[8, 0]} key={key}>
                        <Col>STT: {index + 1}</Col>

                        <Col>
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() =>   {
                              remove(name)
                              handleRemoveItem(index)
                            } }
                            danger
                          />
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "details"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập nội dung " },
                            ]}
                            label="Chi tiết nội dung "
                          >
                            <Input.TextArea size="small" />
                          </Form.Item>
                        </Col>


                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập số lượng" },
                            ]}
                            label="Số lượng "
                          >
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "cost"]}
                            label="Số tiền"
                            rules={[
                              { required: true, message: "Vui lòng nhập nội dung" },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              className="w-full"
                              value={probationarySalary}
                              onChange={(value) => {
                                setEstimatedPriceFormatCurrency(index, value)
                                value && setProbationarySalary(value);
                              }}
                              formatter={(value) => formatVND(value)}
                              parser={(value) => value.replace(/[^\d]/g, '')}
                            />


                          </Form.Item>
                        </Col>


                        <Col span={12}>
                          <Form.Item {...restField} name={[name, "files"]}
                            label="Hóa đơn chứng từ(ảnh/PDF):"
                          >
                            <Upload
                              beforeUpload={(file) => {
                                setFiles(prev => [...prev, { index, file }])
                                return false;
                              }}
                              onRemove={(file) => {

                                function removeItem(files, value) {
                                  return files.filter(item => item.file.uid !== value.uid);

                                }
                                setFiles(removeItem(files, file));
                              }}
                              multiple={true}
                              maxCount={3}
                            >
                              <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>

                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            label="Ghi chú"
                            {...restField}
                            name={[name, "note"]}
                          >
                            <Input.TextArea rows={4} placeholder="Thông tin người nhận thanh toán, số tài khoản(nếu có), ghi chú khác" />
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
            </Col>

          </Row>

          <Row justify="center" gutter={[8, 0]}>
            <Col>
              <Button
                className="w-120"
                onClick={onCancel}
              >Thoát</Button>
            </Col>

            <Col>
              <Button htmlType="submit" type="primary" className="w-full"
              >
                Đề xuất
              </Button>
            </Col>
          </Row>
        </Form>

      </SpinCustom>

    </Modal >
  )

}
export default CreatePaymentProcedure