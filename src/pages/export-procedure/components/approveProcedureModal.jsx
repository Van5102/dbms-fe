
import { actionGetUsers } from "pages/home/actions";
import {
  Modal,
  Row,
  Col,
  Button,
  Form,
  Input, Select,
  Spin
} from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux"

const ApproveProcedureModal = ({ onCancel, onOk }) => {
  const [users, setUsers] = useState([]);
  const [spining, setSpinning] = useState(false);
  const userLogin = useSelector(state => state?.profile)

  const handleApproveProcedure = async (values) => {
    onOk(
      values?.implementer || null,
       values?.description);
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

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Ghi chú"
      className="form-modal"
      width={350}
      footer={false}
    >
      <Spin spinning={spining}>
        <Form
          layout="vertical"
          className="commom-form"
          onFinish={handleApproveProcedure}
        >
          {
            userLogin?.position_code === "P_GIAM_DOC" &&
            <Col span={24}>
              <Form.Item
                name="implementer"
                rules={[
                  { required: true, message: "Vui lòng chọn người thực hiện" },
                ]}
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
                  {users?.map((e) => (
                    <Select.Option key={e?.id} value={e.id}>
                      {e?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          }


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
      </Spin>

    </Modal>
  );
};

export default ApproveProcedureModal;
