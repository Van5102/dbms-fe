import { useEffect, useState } from "react";
import DatePickerCustom from "components/datePickerCustom";
import { actionAddProcedure } from "../action";
import { actionGetUsers } from "pages/home/actions";
import { useSelector } from "react-redux";
import { SpinCustom } from "components";
import dayjs from "dayjs";

import { Modal, Row, Col, Button, Form, Input, Select, message } from "antd";

const { TextArea } = Input;

const AddProcedure = ({ onClose, vehicles, setListCars }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [users, setUsers] = useState([]);
  const userLogin = useSelector((state) => state?.profile);

  const handleSetTimeStart = (v) => {
    form.setFieldValue("time_start", v);
  };

  const handleSetTimeEnd = (v) => {
    form.setFieldValue("time_end", v);
  };

  const handleAddProcedure = async (values) => {
    setSpinning(true);

    try {
      const numericTimeEnd = values.time_end
        ? parseInt(values.time_end) / 1000
        : null;
      const params = {
        ...values,
        time_start: parseInt(values.time_start) / 1000,
        time_end: numericTimeEnd,
        member_ids: values.member_ids || [],
      };

      const { data, status } = await actionAddProcedure(params);
      if (status === 200) {
        message.success(data?.message);
        setListCars(data?.procedures);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }

    setSpinning(false);
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

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const handleDriverSelect = (value) => {
  }
  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Đề xuất xin xe"
      className="form-modal"
      width={350}
      footer={false}
    >
      <Form
        layout="vertical"
        className="commom-form"
        onFinish={handleAddProcedure}
        form={form}
      >
        <SpinCustom spinning={spinning}>
          <Form.Item
            name="vehicle_id"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select
              className="w-full"
              placeholder="Chọn xe"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                `${option.children}`
                  .toLocaleLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
            >
              {vehicles.map((e) => (
                <Select.Option key={e?.id} value={e.id}>
                  {e?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="driver">
            <Select
              className="w-full"
              placeholder="Người lái xe"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                `${option.children}`
                  .toLocaleLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
              onChange={handleDriverSelect}
            >
              {users.map((e) => (
                <Select.Option key={e?.id} value={e.id}>
                  {e?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="departure"
            rules={[
              { required: true, message: "Vui lòng nhập địa điểm xuất phát" },
            ]}
          >
            <Input placeholder="Địa điểm xuất phát " />
          </Form.Item>

          <Form.Item
            name="destination"
            rules={[
              { required: true, message: "Vui lòng nhập địa điểm làm việc" },
            ]}
          >
            <Input placeholder="Địa điểm làm việc " />
          </Form.Item>

          <Form.Item
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <TextArea rows={2} placeholder="Lý do xin xe" />
          </Form.Item>

          <Form.Item name="member_ids">
            <Select
              className="w-full"
              mode="multiple"
              placeholder="Thành viên tham gia"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                `${option.children}`
                  .toLocaleLowerCase()
                  .includes(input.toLocaleLowerCase())
              }
            >
              {users
                .filter((u) => u?.id !== userLogin?.id)
                .map((u) => (
                  <Select.Option key={u?.id} value={u.id}>
                    {u?.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="time_start"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian dự kiến đi ",
              },
            ]}
          >
            <Row gutter={[4, 0]}>
              <Col>
                <span>Thời gian đi(dự kiến) từ:</span>
              </Col>

              <Col className="w-full">
                <DatePickerCustom
                  setDatetime={handleSetTimeStart}
                  disabled={handleDisabledDate}
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="time_end"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian dự kiến về ",
              },
            ]}
          >
            <Row gutter={[4, 0]}>
              <Col>Thời gian về(dự kiến)</Col>

              <Col className="w-full">
                <DatePickerCustom
                  setDatetime={handleSetTimeEnd}
                  disabled={handleDisabledDate}
                />
              </Col>
            </Row>
          </Form.Item>

          <Row gutter={[8, 0]}>
            <Col span={12}>
              <Button className="w-full" onClick={onClose}>
                Thoát
              </Button>
            </Col>

            <Col span={12}>
              <Button htmlType="submit" type="primary" className="w-full">
                Thêm đề xuất
              </Button>
            </Col>
          </Row>
        </SpinCustom>
      </Form>
    </Modal>
  );
};

export default AddProcedure;
