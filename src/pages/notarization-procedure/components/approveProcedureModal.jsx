import { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  Select,
  message,
  Spin,
} from "antd";

import { SpinCustom } from "components";
const { TextArea } = Input;
const ApproveProcedureModal = ({ onCancel, onOk }) => {
  const handleApproveProcedure = async (values) => {
    onOk(values?.description);
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Ghi chú"
      className="form-modal"
      width={350}
      footer={false}
    >
      <Form
        layout="vertical"
        className="commom-form"
        onFinish={handleApproveProcedure}
      >
        <Form.Item
          name="description"
          rules={[{ required: false, message: "Vui lòng nhập Ghi chú" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Button className="w-full" onClick={onCancel}>
              Thoát
            </Button>
          </Col>

          <Col span={12}>
            <Button className="w-full" htmlType="submit" type="primary">
              Lưu
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ApproveProcedureModal;
