import { useEffect, useState } from "react";
import { Modal, Table, Button, Image, Row, Col, Form, message, Input, Radio, InputNumber, Upload, DatePicker } from "antd";
import { formatCurrency, formatVND, getFullUrlStaticFile } from "utils/helps";
import { DATE_FORMAT, PAGINATION, PAYMENT_TYPE, STATUS } from "utils/constants/config";
import dayjs from "dayjs";
import { SpinCustom } from "components";
import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { acctionApproveAdvancedPaymentProcedure } from "../actions";
const Reimbursement = ({ record, onCancel, spinning, setSpinning, setApproveProcedures }) => {
  console.log(record);
  const [form] = Form.useForm();
  const [base, setBase] = useState([]);
  const [files, setFiles] = useState([]);
  const [b, setB] = useState([]);
  const [c, setC] = useState([]);
  const [probationarySalary, setProbationarySalary] = useState();

  const [pagination, setPagination] = useState({
    page_num: PAGINATION['PAGE_NUM'],
    page_size: PAGINATION['PAGE_SIZE'],
  });

  // console.log(record);
  const toBase64 = async (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader?.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleBase64Conversion = async () => {
    const updatedFiles = await Promise.all(
      files?.map(async file => {

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

  const handleAddReimbursement = async (values) => {
    // console.log(values);
    setSpinning(true);
    try {



      const req_data = values?.payment?.map((v, i) => ({
        details: v?.details || null,
        quantity: v?.quantity || null,
        cost: v?.cost || null,
        note: v?.note || null,
        payment_date: dayjs(v?.payment_date).unix() || null,
        files: base?.filter((file) => file.index === i)?.map(e => e.file) || null,
      }));

      // console.log(values?.content, req_data);
      const body_data = {
        content: record?.accounting_details[0].content,
        type_payment: parseInt(values?.type_payment),
        // payment_term: dayjs(values?.payment_term).unix(),
        description: null,
        list_item: req_data
      }

      const { data, status } = await acctionApproveAdvancedPaymentProcedure(record?.id, STATUS.ACCEPT, body_data)
      if (status === 200) {

        setApproveProcedures(data?.procedures);
        message.success(data?.message);
        onCancel()
      }


    }
    catch (e) {
      console.log(e);
    }
    setSpinning(false)

  }

  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) =>
        i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
    {
      title: "Mã số",
      dataIndex: "id",
      align: "center",
      key: "id",
    },
    {
      title: "Nội dung tạm ứng",
      dataIndex: "details",
      align: "center",
      // render: (_, r) => r?.list_items.map(e => e?.details),

      key: "details",
    },

    {
      align: "center",
      title: "Số lượng",
      dataIndex: "quantity",
      // render: (_, r) => r?.list_items.map(e => e?.quantity),

      key: "quantity",
    },
    {
      align: "center",
      title: "Số tiền",
      dataIndex: "cost",
      key: "cost",
      render: (v) => (v ? formatCurrency(v) : ""),
    },
    {
      title: "Hồ sơ/chứng từ",
      dataIndex: "attachments",
      key: "attachments",
      align: "center",
      width: 300,

      render: e => (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {e && e?.map((url, index) => (
            <div key={index} >
              {url?.path?.split('.').pop()?.toLowerCase() === 'pdf' ?
                <Button type="info" onClick={() => window.open(getFullUrlStaticFile(url?.path), "_blank")}>Mở PDF</Button>
                :
                <Image src={getFullUrlStaticFile(url?.path)} width={100} style={{ "paddingBottom": "8px" }} />
              }
            </div>
          ))}
        </div>
      ),
    },
    {
      align: "center",
      title: "Ghi chú",
      dataIndex: "note",
      // render: (_, r) => r?.list_items.map(e => e?.note),

      key: "note",
    },

  ];

  console.log(record);
  const setEstimatedPriceFormatCurrency = (index, value) => {
    const newItems = [...b];
    newItems[index] = { ...newItems[index], value };
    setC(( record?.accounting_details[0]?.list_items?.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))  - newItems?.map(e => e.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))
    setB(newItems)

  };

  //  xóa phần tử cập nhật lại giá trị mảng
  const handleRemoveItem = index => {
    const newItems = [...b];
    newItems.splice(index, 1); // Xóa phần tử có index tương ứng từ mảng newItems
    setC(( record?.accounting_details[0]?.list_items?.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))  - newItems?.map(e => e.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))
    setB(newItems); // Cập nhật state items

  };
  // console.log(c);
  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={1200}
      title="Phiếu hoàn ứng"
      footer={
        false
      }
      open={true}
    >
      <SpinCustom spinning={spinning}>

        <Row gutter={[8, 8]}>
          <Col style={{ fontSize: "larger" }}><strong>I.Khoản đã tạm ứng</strong></Col>

          <Col span={24}>
            Lý do tạm ứng: {record?.accounting_details[0]?.content}
          </Col>



          <Col span={24}>
            Hình thức thanh toán:  {PAYMENT_TYPE[record?.accounting_details[0].type_payment]}
          </Col>

          <Col span={24}>
            <strong>Tổng số tiền tạm ứng: {formatCurrency(record?.accounting_details[0]?.list_items?.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))}
            </strong>
          </Col>

          <Col span={24}>
            <Table
              dataSource={record?.accounting_details[0].list_items}
              columns={columns}
              rowKey={(record) => record?.id}
              pagination={{
                position: ["bottomCenter"],
                current: pagination.page_num,
                pageSize: pagination.page_size,
                total: record?.accounting_details.length,
                onChange: (page_num, page_size) => {
                  setPagination({ page_num, page_size });
                },
              }}
              scroll={{ x: 1024 }}

            />
          </Col>

          <Col span={24}>
            <strong>II. Các khoản đã chi</strong>
          </Col>




        </Row>


        <Form
          layout="vertical"
          form={form}
          onFinish={handleAddReimbursement}
        >
          <Row gutter={[8, 8]}>

            <Col span={24}>
              <strong>Tổng số tiền hoàn ứng: {formatCurrency(b?.map(e => e.value).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))}</strong>
            </Col>

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
                        <Col span={24}>
                          <Row>
                            <Col>STT: {index + 1}</Col>

                            <Col>
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                  remove(name)
                                  handleRemoveItem(index)
                                }}
                                danger
                              />
                            </Col>
                          </Row>
                        </Col>


                        <Col md={8} xs={24}>
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


                        <Col md={8} xs={24}>
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

                        <Col span={8}>
                          <Form.Item 
                           {...restField}
                          name={[name, "payment_date"]}
                            rules={[
                              { required: true, message: "Vui lòng chọn thời gian" }
                            ]}
                            label="Ngày chi"
                          >
                            <DatePicker
                              format={DATE_FORMAT}
                              disabledDate={handleDisabledDate}
                            />
                          </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
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




                        <Col md={8} xs={24}>
                          <Form.Item
                            label="Ghi chú"
                            {...restField}
                            name={[name, "note"]}
                          >
                            <Input.TextArea rows={3} size="small" placeholder="Thông tin người nhận thanh toán, số tài khoản(nếu có), ghi chú khác" />
                          </Form.Item>
                        </Col>

                        <Col md={8} xs={24}>
                          <Form.Item {...restField} name={[name, "files"]}
                            label="Chứng từ(ảnh/PDF):"
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

            <Col span={24}>
              <strong> {c>0 ? `Số tiền thừa: ${formatCurrency(Math.abs(c))}` : `Số tiền thiếu: ${formatCurrency(Math.abs(c))}`} </strong>
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
  );
};

export default Reimbursement;
