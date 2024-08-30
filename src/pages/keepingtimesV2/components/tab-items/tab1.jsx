import { useEffect, useState } from "react";
import {  Col, Row,  Table } from "antd";
import dayjs from "dayjs";
import { actionGetMyHistoryTimeKeeping } from "../../actions";

import { 
  DATETIME_FORMAT, PAGINATION, 
  TYPE_KEEPING, COME_TYPE, 
  DATETIME_REQUEST
} from "utils/constants/config";

const HistoryTimeKeeping = ({ time_start, time_end, setSpinning }) => {
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
      }
      if(time_start){
        params.time_start = dayjs(time_start).format(DATETIME_REQUEST)
      }
      if(time_end){
        params.time_end = dayjs(time_end).format(DATETIME_REQUEST)
      }

      const { data, status } = await actionGetMyHistoryTimeKeeping(params)

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
  }, [time_start, time_end])

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
      title: "Thời gian chấm công",
      dataIndex: "time_keeping",
      key: "time_keeping",
      render: (v) => v ? dayjs(new Date(v)).format(DATETIME_FORMAT) : "Chưa chấm",
      align: "center",
      width: 150,
    },
    {
      width: 200,
      title: "Kiểu chấm công",
      dataIndex: "type_keeping",
      key: "type_keeping",
      render: (v) => TYPE_KEEPING[v],
      align: "center",
    },
    {
      width: 200,
      title: "PVR (Phút)",
      dataIndex: "freetime",
      key: "freetime",
      align: "center",
    },
    {
      width: 200,
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      width: 150,
      title: "Trạng thái",
      dataIndex: "status_keeping",
      key: "status_keeping",
      render: (v) => {
        let statusClass;
        switch (v) {
          case 0:
            statusClass = "process--cancel";
            break;
          case 1:
            statusClass = "process--success";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{COME_TYPE[v]}</span>;
      },
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
          rowKey={(r) => r.id}
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
export default HistoryTimeKeeping