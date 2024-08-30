
import {
    Modal,
    Row,
    Table,
    Col,
    Button,

} from "antd";

import moment from "moment";
import { DATE_FORMAT } from "utils/constants/config";

const DetailDevice = ({ onCancel, detailDevice }) => {

    const columns = [
        {
            width: 60,
            title: "Id",
            dataIndex: "id",
            key: "id",

        },

        {
            title: "Tên thiết bị",
            dataIndex: "device_name",
            key: "device_name",
            align: "center",
        },

        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
        },

        {
            title: "Ngày hoàn thành ",
            dataIndex: "deadline",
            key: "deadline",
            render: (v) => moment(v * 1000).format(DATE_FORMAT),
            align: "center",
        },

    ];
    return (
        <Modal
            className="common-long-modal"
            footer={false}
            open={true}
            title="Thiết bị"
            width={500}
        >

            <Row gutter={[8,8]}>
             
                <Col span={24}>
                    <Table
                        className="tb-click-row"
                        width="100%"
                        rowKey={(r) => r.id}
                        columns={columns}
                        dataSource={detailDevice}

                    />
                </Col>
                
                <Col span={6}>
                    <Button className="w-full" onClick={onCancel}>
                        Thoát
                    </Button>
                </Col>
            </Row>

        </Modal>
    );
};

export default DetailDevice;
