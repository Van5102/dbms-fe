
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,

} from "antd";

import { SpinCustom } from "components";

const { TextArea } = Input;
const ApproveProcedureModal = ({ onOk, onClose, spinning }) => {
  const handleApproveProcedure = async (values) => {
    onOk(values.reason);
  };

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Xác nhận"
      className="form-modal"
      width={350}
      footer={false}
    >
      <SpinCustom spinning={spinning}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleApproveProcedure}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="reason"
                rules={[{ required: false, message: "Vui lòng nhập ghi chú" }]}
              >
                <TextArea
                  rows={2}
                  placeholder="Ghi chú"
                // onChange={handleDescriptionChange}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Button className="w-full" onClick={onClose}>
                    Thoát
                  </Button>
                </Col>

                <Col span={12}>
                  <Button htmlType="submit" type="primary" className="w-full">
                    Lưu
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  );
};

export default ApproveProcedureModal;
