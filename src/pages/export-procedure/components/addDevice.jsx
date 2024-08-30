
import { SpinCustom } from "components";
import {
    Modal,
    Form,
    Row,
    Col,
    Button,
    Input,
    Select,
    message,
} from "antd";

import { actionGetDevices, actionHandleAddDevice } from "../actions";
import { useEffect, useState } from "react";

const AddDevice = ({ onCancel,setDevices,devices}) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);

    const handleAddProcedure = async (values) => {

        try {
            const data_rq = {
                ...values,
                attachment: values?.attachment || null
            }
            const { data, status } = await actionHandleAddDevice(data_rq);
            if(status===200)
            {
                message.success(data?.message);
                setDevices(data?.list_service)
                onCancel()
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetDevice = async () => {
        setSpinning(true);
        try {
            const { data, status } = await actionGetDevices();

            if (status === 200) {
                setDevices(data?.list_service);
            }
        } catch (error) {
            console.log(error);
        }
        setSpinning(false);
    };

    useEffect(() => {
        handleGetDevice();
    }, []);

    return (
        <Modal
            className="common-long-modal"
            footer={false}
            open={true}
            title="Thêm thiết bị"
            width={350}
        >
            <SpinCustom spinning={spinning}>
                <Form form={form} onFinish={handleAddProcedure} layout="vertical">
                    <Row gutter={[16,8]}>
                        <Col span={24}>
                            <Form.Item
                                name="device_name"
                                label="Tên thiết bị"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên" },
                                ]}
                            >
                                <Input placeholder="Tên thiết bị" ></Input>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Thiết bị đi kèm"
                                name="attachment"
                            >
                                <Select
                                    className="w-full"
                                    placeholder="Thiết bị đi kèm"
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        `${option.children}`
                                            .toLocaleLowerCase()
                                            .includes(input.toLocaleLowerCase())
                                    }
                                >
                                    {devices.map((e) => (
                                        <Select.Option key={e?.id} value={e.id}>
                                            {e?.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Button className="w-full" onClick={onCancel}>
                                Thoát
                            </Button>
                        </Col>

                        <Col span={12}>
                            <Button htmlType="submit" type="primary" className="w-full">
                                Thêm
                            </Button>
                        </Col>
                    </Row>


                </Form>
            </SpinCustom>

        </Modal>
    );
};

export default AddDevice;
