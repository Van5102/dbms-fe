import { Modal, Row, Col, Button, Form, Input } from "antd";

const ApproveProcedureModal = ({ onCancel, onApprove }) => {
  const handleApproveProcedure = async (values) => {
    onApprove(values?.description);
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
          rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea rows={3} placeholder="Ghi chú" />
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
