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
import {
  actionApprove,
  actionGetProcedures,
  actionGetProceduresPending,
} from "../action";
import { useSelector } from "react-redux";
import { DEPARTMENTS_CODE } from "utils/constants/config";
import { SpinCustom } from "components";
import { actionGetUsers } from "pages/home/actions";

const { TextArea } = Input;
const ApproveProcedureModal = ({
  driver,
  approveProcedure,
  onClose,
  setProcedures,
  handleGetProceduresPending,
  onDriverChange,
}) => {
  const userLogin = useSelector((state) => state?.profile);
  const [description, setDescription] = useState("");
  const [totalProduce, setTotalProduce] = useState(0);
  const [callingApi, setCallApi] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [users, setUsers] = useState([]);

  const [driverName, setDriverName] = useState(null); // Initial driver name state

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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleApproveProcedure = async (values) => {
    setCallApi(true)
    try {
      const { data, status } = await actionApprove(approveProcedure?.id, 1, {
        description: values?.reason,
        new_drive: parseInt(values?.driver),
      });

      if (status === 200) {
        const { data: updatedData, status: updatedStatus } =
          await actionGetProceduresPending();

        if (updatedStatus === 200) {
          message.success(data?.message);
          setProcedures(updatedData?.procedures);
          setTotalProduce(data?.total);
          onClose();
        } else {
        }
      } else {
        console.log("err");
      }
      handleGetProceduresPending();
    } catch (error) {
      console.log(error);
    }
    setCallApi(false)
  };

  useEffect(() => {
    handleGetUser();
  }, []);

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
                  placeholder="Ghi chú (không bắt buộc)"
                  onChange={handleDescriptionChange}
                />
              </Form.Item>
            </Col>
            {userLogin?.department_name === DEPARTMENTS_CODE[6] && (
              <Col span={24}>
                Điều chuyển người lái xe:
                <Form.Item
                  name="driver"
                  // rules={[
                  //   { required: true, message: "Vui lòng chọn người lái xe" },
                  // ]}
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
                    defaultValue={driver}
                  >
                    {users.map((e) => (
                      <Select.Option key={e?.id} value={e.id}>
                        {e?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
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
                    onClick={() => handleApproveProcedure}
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
