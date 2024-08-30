import { useState } from "react";
import {
  DATE_FORMAT,
  EMAIL_PATTERN,
  PHONE_PATTERN,
} from "utils/constants/config";
import { useSelector } from "react-redux";
import SpinCutom from "components/spin-custom";
import moment from "moment";
import { actionUpdateUser } from "../actions";

import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  message,
  DatePicker,
} from "antd";
import dayjs from "dayjs";

const EditUser = ({ onClose, setUser, editUser }) => {
  // console.log();
  const departments = useSelector((state) => state?.departments);
  const positions = useSelector((state) => state?.positions);
  const [form] = Form.useForm();
  const [callingApi, setCallApi] = useState(false);
  const [timeBirth, setTimeBirth] = useState(
  );
  const [timeWork, setTimeWork] = useState(
  );
  const handleEditUser = async () => {
    setCallApi(true);

    form
      .validateFields()
      .then(async (values) => {
        const data_req = {
          ...values,
          phone: values?.phone || null,
          department_id: values?.department_id || null,
          date_of_birth: dayjs(timeBirth).unix() || null,
          start_working: dayjs(timeWork).unix() || null,
        };
        if (values?.telegram_chat_id) {
          data_req.telegram_chat_id = values.telegram_chat_id || null;
        }
        if (values?.phone) {
          data_req.phone = values.phone || null;
        }

        const { data, status } = await actionUpdateUser(editUser?.id, data_req);
        if (status === 200) {
          message.success(data?.message);
          setUser(data?.employees?.filter(item => item.account_stutus === 1));
          onClose();
        }
      })
      .catch((err) => console.log(err));
    setCallApi(false);
  };

  // const handleDateChange = (date) => {
  //   form.setFieldValue("date_of_birth", parseInt(date));
  //   console.log("date_of_birth",parseInt(date))
  // };
  // const handleWorkDateChange = (date) => {
  //   form.setFieldValue("start_working", parseInt(date));
  //   console.log("start_working",parseInt(date))

  // };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Sửa nhân viên"
      className="common-long-modal"
      width={700}
      footer={
        <Row gutter={[16, 0]} justify={"center"}>
          <Col span={10}>
            <Button onClick={onClose} className="w-full">
              Thoát
            </Button>
          </Col>
          <Col span={10}>
            <Button className="w-full" onClick={handleEditUser} type="primary">
              Cập nhật
            </Button>
          </Col>
        </Row>
      }
    >
      <SpinCutom SpinCutom spinning={callingApi}>
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            ...editUser,
            date_of_birth: dayjs(editUser?.date_of_birth *1000).format(DATE_FORMAT),
            start_working: dayjs(editUser?.start_working *1000).format(DATE_FORMAT),
          }}
        >
          <Row gutter={[8, 8]}>

            <Col span={12}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                label="Họ và tên:"
              >
                <Input placeholder="Nhập tên " />
              </Form.Item>

            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  {
                    pattern: EMAIL_PATTERN,
                    message: "Email không đúng định dạng !",
                  },
                ]}
                label="Email:"
              >
                <Input placeholder="Nhập email " />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="date_of_birth" label="Ngày sinh">
                <Row >
                  <DatePicker
                    onChange={(date) => setTimeBirth(date)}
                    allowClear={false}
                    format={DATE_FORMAT}
                    className="w-full"
             
                  />
                </Row>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                rules={[
                  {
                    pattern: PHONE_PATTERN,
                    message: "Số điện thoại không đúng định dạng !",
                  },
                ]}
                label="Số điện thoại:"
              >
                <Input placeholder="Nhập số điện thoại " />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="position_id"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ !" }]}
                label="Vị trí"
              >
                <Select
                  className="w-full"
                  placeholder="chức vụ"
                  options={Object.entries(
                    positions?.filter((a) => a?.code !== "GIAM_DOC")
                  )?.map((e) => ({
                    value: e[1].id,
                    label: e[1].name,
                  }))}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="department_id" label="Phòng ban">
                <Select
                  showSearch
                  className="w-full"
                  placeholder="Phòng ban"
                  options={Object.entries(departments)?.map((e) => ({
                    value: e[1].id,
                    label: e[1].name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="start_working"
                label="Ngày bắt đầu làm việc:"
                
              >
                <Col >

                  <DatePicker
                    onChange={(date) => setTimeWork(date)}
                    allowClear={false}
                    format={DATE_FORMAT}
                    className="w-full"
                    defaultValue={
                      dayjs(moment(editUser?.start_working * 1000).format(DATE_FORMAT), 'DD-MM-YYYY')}
                  />
                </Col>

              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="telegram_chat_id" label="Telegram ID:">
                <Input placeholder="Nhập telegram id " />
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </SpinCutom>
    </Modal>
  );
};

export default EditUser;