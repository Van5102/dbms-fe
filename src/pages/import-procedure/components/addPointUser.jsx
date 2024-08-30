
import { useEffect, useState } from "react";
import { SpinCustom } from "components";

import {
    Modal,
    Form,
    Row,
    Col,
    Button,
    Select,
    message,
} from "antd";

import { actionGetUsers } from "pages/home/actions";
import { actionHandlePointUser } from "../actions";


const PointUser = ({ onCancel, point,handleGetListCheckGoods}) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [users, setUsers] = useState([]);

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

    const handleAddPointUser = async (values) => {
        setSpinning(true)
        const params={
            warehouse_import:values?.id,
            request_checking:null,
        }

        try {
          
            const { data, status } = await actionHandlePointUser(point?.id, {list_implementer:values?.list_implementer}, params);
            if (status === 200) {

                message.success(data?.message);
                onCancel()
    handleGetListCheckGoods();

            }
        } catch (error) {
            console.log(error);
        }
        setSpinning(false)

    };



    return (
        <Modal
            className="common-long-modal"
            footer={false}
            open={true}
            title="Người chỉ định"
            width={350}
        >
            <SpinCustom spinning={spinning}>
                <Form form={form} onFinish={handleAddPointUser} layout="vertical">
                    <Col span={24}>
                        <Form.Item
                            name="list_implementer"
                            rules={[
                                { required: true, message: "Vui lòng chọn " },
                            ]}
                        >
                            <Select
                                className="w-full"
                                placeholder="Người được chỉ định"
                                showSearch
                                mode="multiple"
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
                    <Row gutter={[8, 0]} justify={"center"}>
                        <Col span={6}>
                            <Button className="w-full" onClick={onCancel}>
                                Thoát
                            </Button>
                        </Col>

                        <Col span={6}>
                            <Button htmlType="submit" type="primary" className="w-full">
                                Đề xuất
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </SpinCustom>

        </Modal>
    );
};

export default PointUser;
