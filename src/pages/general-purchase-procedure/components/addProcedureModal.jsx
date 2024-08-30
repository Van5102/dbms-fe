import { DATE_FORMAT } from "utils/constants/config";
import { formatCurrency, isEmpty } from "utils/helps";
import { SpinCustom } from "components";
import dayjs from "dayjs";

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
} from "antd";

import { actionGetUsers } from "../actions";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const AddProcedure = ({ onCancel, onSubmit, title }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [priceUnit,setPriceUnit] = useState();
  const [amount,setAmount] = useState();
  const handleAddProcedure = async (values) => {
    try {
      if (isEmpty(values?.equipments)) {
        return;
      } else {
        const equipments = values?.equipments.map((v) => ({
          name: v?.name,
          specifications: v?.specifications,
          estimated_price: v?.estimated_price,
          quantity: v?.quantity,
          day_need: dayjs(v?.day_need).unix(),
          purpose: v?.purpose,
          implementer: v?.implementer,
          inventory:v?.inventory|| null

        }));

        onSubmit(equipments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetUser = async () => {
    setSpinning(true);
    try {
      const { data, status } = await actionGetUsers();

      if (status === 200) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const setItemValue = (name, index, value) => {
    const items = form.getFieldValue("equipments");
    items[index][name] = value;
    form.setFieldsValue({ equipments: items });
  };

  const setEstimatedPriceFormatCurrency = (index, value) => {
    const items = form.getFieldValue("equipments");
    setItemValue("estimated_price_render", index, formatCurrency(value || 0));
  };

  const setTotalPrice= (index, price, amount) => {
    const items = form.getFieldValue("equipments");
    setItemValue("total_price",index, formatCurrency(parseInt(price * amount)));
  };

  const handleDisabledDate = (currentDate) => {
    return currentDate < dayjs().endOf("day");
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Modal
      className="common-long-modal"
      footer={false}
      open={true}
      title={title}
      width={500}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={handleAddProcedure} layout="vertical">
        <Form.List name="equipments">
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
                      onClick={() => remove(name)}
                      danger
                    />
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập nội dung" },
                      ]}
                      label="Nội dung"
                    >
                      <Input.TextArea size="small" placeholder="Nội dung" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "implementer"]}
                      rules={[
                        { required: true, message: "Vui lòng chọn người thực hiện" },
                      ]}
                      label="Người thực hiện"
                    >
                      <Select
                        className="w-full"
                        placeholder="Người thực hiện"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          `${option.children}`
                            .toLocaleLowerCase()
                            .includes(input.toLocaleLowerCase())
                        }
                      >
                        {users.map((e) => (
                          <Select.Option key={e?.id} value={e.id}>
                            {e?.name}
                          </Select.Option>
                        ))}
                      </Select>
                      </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "purpose"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập mục đích" },
                      ]}
                      label="Mục đích"
                    >
                      <Input.TextArea size="small" placeholder="Mục đích" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item {...restField} name={[name, "estimated_price"]}
                    label="Giá dự tính(1 chiếc, cái...)">
                      <InputNumber
                        min={0}
                        className="w-full"
                        placeholder="Giá dự tính"
                        onChange={(v) =>{
                          setEstimatedPriceFormatCurrency(index, v)
                          setPriceUnit(v)
                          if(amount){
                          setTotalPrice(index,v,amount)

                          }
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, "estimated_price_render"]}
                      label="Giá dự tính"
                    >
                      <Input className="input-format-currency" disabled />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
                      ]}
                      label="Số lượng cần"
                    >
                       <InputNumber
                        min={0}
                        className="w-full"
                        placeholder="Số lượng (VD: 1 cái)"
                        onChange={(v) => {
                          setTotalPrice(index,priceUnit,v)
                          setAmount(v)
                       
                        }}
                        />

                    </Form.Item>
                  </Col>

                  <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "inventory"]}
                       label="Số lượng tồn"
                      >
                        <Input
                        className="w-full"
                        placeholder="Số lượng tồn"
                     
                        />
                      </Form.Item>
                    </Col>

                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, "day_need"]}
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày cần" },
                      ]}
                      label="Ngày cần"
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        className="w-full"
                        placeholder="Ngày cần"
                        disabledDate={handleDisabledDate}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    
                    <Form.Item
                      {...restField}
                      name={[name, "total_price"]}
                      rules={[
                        { required: false },
                      ]}
                      label="Tổng tiền"
                      >
                      <Input
                      disabled
                        className="w-full"
                        placeholder="Tổng tiền"

                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Mô tả"
                      {...restField}
                      name={[name, "specifications"]}
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

export default AddProcedure;
