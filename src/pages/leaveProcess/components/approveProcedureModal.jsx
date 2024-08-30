import { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
} from "antd";
import { actionApprove, actionGetProcedures } from "../action";
import { SpinCustom } from "components";
const { TextArea } = Input;
const ApproveProcedureModal = ({
  approveProcedure,
  onClose,
  setProcedures,
  handleGetProcedures,
}) => {
  const [description, setDescription] = useState("");
  const [callingApi, setCallApi] = useState(false);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleApproveLeaveProcedure = async (values) => {
    setCallApi(true)
    try {
      const { data, status } = await actionApprove(approveProcedure?.id, 1, {
        description: values?.reason,
      });

      if (status === 200) {
        const { data: updatedData, status: updatedStatus } =
          await actionGetProcedures({ detail_status: 0 });

        if (updatedStatus === 200) {
          message.success(data?.message);
          setProcedures(updatedData?.procedures);
          onClose();
        } else {
        }
        handleGetProcedures();
      } else {
        console.log("err");
      }
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
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
      <SpinCustom spinning={callingApi}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleApproveLeaveProcedure}
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
                  onChange={handleDescriptionChange}
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
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="w-full"
                    onClick={() => handleApproveLeaveProcedure}
                  >
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
