import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd';
import { SpinCustom } from 'components';
import { useState } from 'react';
import { DATE_FORMAT, TYPE_HD } from 'utils/constants/config';
import { useSelector } from 'react-redux';
import { actionGetContract } from '../action';
import dayjs from 'dayjs';

import { saveAs } from 'file-saver';

const ContractModal = ({ onCancel, title, detailMenu }) => {
  const [form] = Form.useForm();
  const [probationarySalary, setProbationarySalary] = useState('');
  const userPosition = useSelector((state) => state?.positions);
  const [selectedAction, setSelectedAction] = useState('');

  const format = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDateChange = (date) => {
    form.setFieldValue('start_working', date)
  };

  const handleAddProcedure = async () => {
    try {
      const v = await form.validateFields();

      const data_req = {
        contract_type: v?.contract_type,
        start_working: dayjs(v?.start_working).unix(),
        // code: uuidv4(),
        position_id: v?.position_id,
        salary: v?.salary,
        content: JSON.stringify(v)

      }
      const a = await actionGetContract(detailMenu?.id, data_req);
      saveAs(a?.data, "Hop_dong.docx")
      onCancel();


    } catch (error) {
      console.log(error);
    }


  };

  const handleRadioBtnChange = (e) => {
    setSelectedAction(e?.target?.value);
  };

  return (
    <Modal
      title={title}
      open={true}
      className="common-long-modal"

      footer={false}
      onCancel={onCancel}
      width={1200}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <SpinCustom spinning={false}>
          <Form form={form}
            // onFinish={handleAddProcedure}
            layout="vertical">
            <Row gutter={[16, 8]}>

              <Col span={6}>
                <Form.Item
                  name="salary"
                  label="Lương"
                  rules={[
                    { required: true, message: "Vui lòng nhập lương" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    value={probationarySalary}
                    onChange={(value) => {
                      value &&
                        setProbationarySalary(format(value));
                    }}
                    formatter={(value) => value && value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value && value?.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="start_working"
                  label="Ngày bắt đầu làm việc:"
                  rules={[
                    { required: true, message: "Vui lòng điền" }
                  ]}
                >

                  <DatePicker
                    onChange={(date) => handleDateChange(date)}
                    allowClear={false}
                    format={DATE_FORMAT}
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="position_id"
                  label="Vị trí mới"
                  rules={[
                    { required: true, message: "Vui lòng điền" }
                  ]}
                >
                  <Select
                    className="w-full"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      `${option.children}`
                        .toLocaleLowerCase()
                        .includes(input.toLocaleLowerCase())
                    }

                  // defaultValue={}
                  >
                    {userPosition.filter(e =>
                      e?.code != "GIAM_DOC" && e?.code != "P_GIAM_DOC"

                    ).map((e) => (
                      <Select.Option key={e?.id} value={e.id}>
                        {e?.name}
                      </Select.Option>
                    ))}
                  </Select>

                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="contract_type"
                  label="Loại hợp đồng mới"
                  rules={[
                    { required: true, message: "Vui lòng điền" }
                  ]}
                >
                  <Radio.Group className="w-full" onChange={handleRadioBtnChange}>
                    <Row gutter={[6, 6]}>
                      {Object.keys(TYPE_HD).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {TYPE_HD[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>

                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="number"
                  label="Số/(No)"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="day"
                  label="Ngày hợp đồng"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="month"
                  label="Tháng hợp đồng"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="year"
                  label="Năm hợp đồng"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="name"
                  label="Ông/bà:"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="birthh_day"
                  label="Ngày sinh"
                >
                  <Input />
                </Form.Item>
              </Col>


              <Col span={6}>
                <Form.Item name="addressTT"
                  label="Địa chỉ thường trú"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="addressHT"
                  label="Địa chỉ hiện tại"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="CCCD"
                  label="Số CCCD"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="approveAdress"
                  label="Nơi cấp"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="approveDay"
                  label="Cấp ngày"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="BHXH"
                  label="Bảo hiểm xã hội"
                >
                  <Input />
                </Form.Item>
              </Col>



              <Col span={6}>
                <Form.Item name="codeTax"
                  label="Mã số thuế"
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="sdt"
                  label="Số điện thoại"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="nameWork"
                  label="Chức danh công việc"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="departname"
                  label="Bộ phận"
                >
                  <Input />
                </Form.Item>
              </Col>

              {selectedAction == 1 &&
                <Col span={6}>
                  <Form.Item name="deadlineWork"
                    label="Số tháng/kể từ"
                  >
                    <Input.TextArea rows={2} placeholder="VD: Trong thời hạn 03 tháng, kể từ ngày...tháng...năm  đến ngày...tháng...năm..." />
                  </Form.Item>
                </Col>
              }
              {selectedAction == 2 &&
                <>
                  <Col span={6}>
                    <Form.Item name="deadlineWork"
                      label="Thời điểm"
                    >
                      <Input.TextArea rows={2} placeholder="VD: Kể từ ngày … tháng … năm 20.. đến ngày … tháng … năm 20.." />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="position_name"
                      label="Vị trí"
                    >
                      <Input placeholder='Vd: thực tập sinh' />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="manage"
                      label="Quản lý trực tiếp"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="responCV"
                      label="Nhiệm vụ công việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="capacity"
                      label="Năng lực chuyên môn"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="experience"
                      label="kinh nghiệm"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="skill"
                      label="Yêu cầu kỹ năng"
                    >
                      <Input />
                    </Form.Item>
                  </Col>


                </>


              }
              {selectedAction == 3 &&
                <>
                  <Col span={6}>
                    <Form.Item name="timeTV"
                      label="Thời gian thử việc"
                    >
                      <Input.TextArea rows={2} placeholder='02 tháng – Bắt đầu từ ngày a tháng b năm c đến ngày a tháng b năm c' />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="positionCV"
                      label="Vị trí công việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="salaryCB"
                      label="Lương cơ bản"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="manage"
                      label="Quản lý trực tiếp"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="responCV"
                      label="Nhiệm vụ công việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="capacity"
                      label="Năng lực chuyên môn"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="experience"
                      label="kinh nghiệm"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="skill"
                      label="Yêu cầu kỹ năng"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="totalSalary"
                      label="Mức lương thử việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                </>


              }

              {selectedAction == 4 &&
                <>
                  <Col span={6}>
                    <Form.Item name="timeHD"
                      label="Thời hạn hợp đồng"
                    >
                      <Input placeholder='VD :12/24 tháng' />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="startendCT"
                      label="Bắt đầu từ:"
                    >
                      <Input placeholder='ngày a tháng b năm c đến hết ngày a tháng b năm c' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="positionCV"
                      label="Vị trí công việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item name="salaryCB"
                      label="Lương cơ bản"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="mobile"
                      label="Phụ cấp xăng xe, điện thoại"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="responsibility"
                      label="Phụ cấp trách nhiệm"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="complete"
                      label="Hiệu quả và hoàn thành công việc"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="totalSalary"
                      label="Tổng thu nhập"
                    >
                      <Input placeholder='VD:1.000.000' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="textSalary"
                      label="Bằng chữ"
                    >
                      <Input.TextArea rows={2} placeholder='Mười lăm triệu đồng' />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="manage"
                      label="Quản lý trực tiếp"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="responCV"
                      label="Nhiệm vụ công việc"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="capacity"
                      label="Năng lực chuyên môn"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="experience"
                      label="kinh nghiệm"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="skill"
                      label="Yêu cầu kỹ năng"
                    >
                      <Input />
                    </Form.Item>
                  </Col>


                </>


              }
              <Col span={24}>
                <Row gutter={[8, 8]} justify={"center"}>
                  <Col >
                    <Form.Item>
                      <Button onClick={() => onCancel()}>
                        Thoát
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col >
                    <Form.Item>
                      <Button onClick={handleAddProcedure} type='primary'>
                        Đồng ý
                      </Button>
                    </Form.Item>
                  </Col>

                </Row>
              </Col>

            </Row>


          </Form>
        </SpinCustom>
      </Form>
    </Modal>
  );
};

export default ContractModal;