import { formatCurrency, isEmpty } from "utils/helps";
import { SpinCustom } from "components";

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  message,
  Radio,
  Upload,

} from "antd";

import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { actionCreateQuoteProcedure } from "../actions";
import { useSelector } from "react-redux"


const AddQuoteProcedure = ({ onCancel, quoteModal ,setDataTb2}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [base, setBase] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [isRadioChecked, setIsRadioChecked] = useState(false);
  const userLogin = useSelector(state => state?.profile)


  const handleAddProcedure = async (values) => {
    setSpinning(true);
    try {
      if (isEmpty(values?.suppliers)) {
        return;
      } else {
        const suppliers = values?.suppliers.map((v, i) => ({
          name: v?.name || null,
          content: v?.content || null,
          quantity: v?.quantity || null,
          cost_none_VAT: v?.cost_none_VAT || null,
          cost_include_VAT: v?.cost_include_VAT || null,
          description: v?.description || null,
          attachments: base.filter((file) => file.index === i).map(e => e.file) || null,
          status: i === selectedOption ? 1 : 0,
        }

        ));
        try {
          if (isRadioChecked) {

            setSpinning(true);
            const { data, status } = await actionCreateQuoteProcedure({
              list_supplier: suppliers,
              purpose: values?.purpose,
            });

            if (status === 200) {
              setSpinning(false);
              message.success(data?.message);
              setDataTb2(data?.procedures)
              onCancel();
              // window.open("/supplier?tabKey=tab-3", '_self')
            }
        }
        else {
          message.error("Vui lòng chọn ít nhất 1 đề xuất !");
        }
      } catch (error) {

          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleRadioChange = (index) => {
    setSelectedOption(index);
    setIsRadioChecked(true);
  };

  const setItemValue = (name, index, value) => {
    const items = form.getFieldValue("suppliers");
    items[index][name] = value;
    form.setFieldsValue({ suppliers: items });
  };

  const setEstimatedPriceFormatCurrency = (index, value) => {
    const items = form.getFieldValue("suppliers");
    setItemValue("cost_price_render", index, formatCurrency(value || 0));
  };

  const setEstimatedPriceFormatCurrency1 = (index, value) => {
    const items = form.getFieldValue("suppliers");
    setItemValue("ship_price_render", index, formatCurrency(value || 0));
  };

  const toBase64 = async(file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      
    });

  const handleBase64Conversion = async () => {
    const updatedFiles = await Promise.all(
      files.map(async file => {
        console.log('files supp',file)

        const base64 = await toBase64(file.file) || null;
        return {
          ...file,
          file: base64.replace(/;/g, ",").split(",").slice(2).join(",")
        };
      })
    );
    setBase(updatedFiles);
    console.log('updatedFiles',updatedFiles);

  };

  useEffect(() => {
    handleBase64Conversion();
  }, [files]);

  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title="Đề nghị duyệt nhà cung cấp"
      width={500}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={handleAddProcedure} layout="vertical">

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <strong>Họ tên người đề nghị</strong>:  {userLogin?.name}
            </Col>

            <Col span={24}>
              <strong>Bộ phận</strong>:  {userLogin?.department_name}
            </Col>

            <Col span={24}>
              <Form.Item

                name="purpose"
                label="Mục đích:"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col>
              <Form.List name="suppliers">
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
                                onClick={() => {
                                  remove(name);
                                  if (selectedOption === index) {
                                    setIsRadioChecked(false);
                                  }
                                }}
                                danger
                              />
                            </Col>
                            <Col>
                              <Radio
                                checked={selectedOption === index}
                                onChange={() => handleRadioChange(index)}
                              />
                            </Col>
                          </Row>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập tên" },
                            ]}
                            label="Tên nhà cung cấp"
                          >
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" },
                            ]}
                            label="Số lượng hàng hóa"
                          >
                            <InputNumber className="w-full" />
                          </Form.Item>
                        </Col>


                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, "content"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập" },
                            ]}
                            label="Nội dung hàng hóa/dịch vụ"
                          >
                            <Input.TextArea rows={4} />
                          </Form.Item>
                        </Col>


                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "cost_none_VAT"]}
                            label="Giá chưa VAT"
                          >
                            <InputNumber
                              min={0}
                              className="w-full"
                              onChange={(v) =>
                                setEstimatedPriceFormatCurrency1(index, v)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "ship_price_render"]}
                            label=" "
                          >
                            <Input className="input-format-currency" disabled />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item {...restField} name={[name, "cost_include_VAT"]}
                            label="Thành tiền"
                          >
                            <InputNumber
                              min={0}
                              className="w-full"
                              onChange={(v) =>
                                setEstimatedPriceFormatCurrency(index, v)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "cost_price_render"]}
                            label=" "
                          >
                            <Input className="input-format-currency" disabled />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            label="Ưu/nhược điểm"
                            {...restField}
                            name={[name, "description"]}
                          >
                            <Input.TextArea rows={4} />
                          </Form.Item>
                        </Col>


                        <Col span={12}>
                          <Form.Item {...restField} name={[name, "attachments"]}
                            label="Tệp(ảnh/PDF):"
                          >
                            <Upload
                              beforeUpload={(file) => {
                                setFiles(prev => [...prev, { index, file }])
                                return false;
                              }}
                              onRemove={(file)=>{
                                
                                function removeItem(files, value) {
                                  return files.filter(item => item.file.uid !== value.uid);
                                  
                                }
                                setFiles(removeItem(files,file));
                              }}
                              multiple={true}
                              maxCount={3}
                            >
                              <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>

                          </Form.Item>
                        </Col>


                      </Row>
                    ))}

                    <Form.Item>
                      <Button icon={<PlusOutlined />} type="primary" onClick={add}>
                        Thêm
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>

          </Row>
          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Button className="w-full" onClick={onCancel}>
                Thoát
              </Button>
            </Col>

            <Col span={12}>
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

export default AddQuoteProcedure;
