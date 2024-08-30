import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { render } from "@testing-library/react";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { useSelector } from "react-redux";

import {
    actionGetListTimeKeeping,
    actionApproveBusinessTrip
} from "../../actions";

import {
    PAGINATION,   
    DATETIME_REQUEST,
    TIME_FORMAT,
    DATE_FORMAT,
    DATE_FORMAT_EN
} from "utils/constants/config";

import {
     Col, Row,Table,
} from "antd";

const ListTimeKeeping = ({ time_startT3, setSpinning, department_id, name }) => {
    // filter
    const [pagination, setPagination] = useState({ page_num: PAGINATION['PAGE_NUM'], page_size: PAGINATION['PAGE_SIZE'] })

    //biến danh sách tạo bởi tôi
    const [myListHistory, setMyListHistory] = useState([])
    const [totalProcedures, setTotalProcedures] = useState(0)

    // Lây danh sách đễ xuất của tôi
    const handleGetMyHistory = async (page_num, page_size) => {
        setSpinning(true)

        try {
            // Cập nhật phân trang
            setPagination({ page_num, page_size })

            // params
            const params = {
                page_num,
                page_size,
                department_id,
                name
            }
            if (time_startT3) {
                params.day = dayjs(time_startT3).format(DATE_FORMAT_EN)
            }
            

            const { data, status } = await actionGetListTimeKeeping(params)

            if (status === 200) {
                setMyListHistory(data?.timekeepings)
                setTotalProcedures(data?.total)
            }

        } catch (error) {
            console.log(error);
        }

        setSpinning(false)
    }


    useEffect(() => {
        handleGetMyHistory(PAGINATION['PAGE_NUM'], PAGINATION['PAGE_SIZE']);
    }, [time_startT3, department_id, name])

    const columns = [
        {
            width: 60,
            title: "STT",
            dataIndex: "id",
            key: "id",
            render: (v, r, index) =>
                index + 1 + (pagination.page_num - 1) * pagination.page_size,
        },
        {
            title: "Người chấm công",
            dataIndex: "user_name",
            key: "user_name",
            align: "center",
            width: 150,
        },
        {
            title: "Phòng ban",
            dataIndex: "department_name",
            key: "department_name",
            align: "center",
            width: 150,
        },
        {
            title: "Ngày chấm công",
            dataIndex: "day",
            key: "day",
            render: (v,r) => dayjs(r?.time_start_keeping).format(DATE_FORMAT),
            align: "center",
            width: 150,
        },
        {
            title: "Số lần chấm công",
            dataIndex: "count_keeping",
            key: "count_keeping",
            align: "center",
            width: 150,
        },

        {
            title: "Thời gian chấm lần đầu",
            dataIndex: "time_start_keeping",
            key: "time_start_keeping",
            render: (v) => v ? dayjs(v).format(TIME_FORMAT) : "Chưa chấm",
            align: "center",
            width: 150,
        },
        {
            title: "Thời gian chấm lần cuối",
            dataIndex: "time_end_keeping",
            key: "time_end_keeping",
            render: (v,r) =>{
                if(r?.time_end_keeping == r?.time_start_keeping ){
                    return "chưa chấm"
                }
                else return dayjs(v).format(TIME_FORMAT)
             
            } ,
            align: "center",
            width: 150,
        },

        {
            width: 200,
            title: "Tổng số PVR",
            dataIndex: "total_freetime",
            key: "total_freetime",
            align: "center",
        },

    ];

    return (
        <Row gutter={[8, 8]}>
            <Col span={24}>
                <Table
                    dataSource={myListHistory}
                    columns={columns}
                    className="tb-click-row"
                    rowKey={(r) => r.user_id}
                    pagination={{
                        pageSize: pagination.page_size,
                        current: pagination.page_num,
                        onChange: handleGetMyHistory,
                        total: totalProcedures,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50],
                    }}
                />
            </Col>
        </Row>
    )
}
export default ListTimeKeeping