import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { render } from "@testing-library/react";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { useSelector } from "react-redux";

import {
  actionGetListTimeKeeping,
  actionApproveBusinessTrip,
  actionGetListTimeKeepingDetail
} from "../../actions";

import {
  DATETIME_FORMAT, DEATAIL_STATUS,
  PAGINATION, STATUS, TYPE_KEEPING,
  COME_TYPE, STATUS_BUSINESS,
  DATETIME_REQUEST
} from "utils/constants/config";
import { useSearchParams } from "react-router-dom";

import {
  Button, Col, Row, Space,
  Table, message, Popconfirm
} from "antd";

const DetailTimeKeeping = ({ time_start, time_end, setSpinning, department_id, name,tabKey }) => {
  const [searchParams] = useSearchParams();

  const timeKeepingId = useState(searchParams.get("timkeeping_id"))
  const userLogin = useSelector((state) => state?.profile);

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
        name,
        tabKey,
        timkeeping_id:timeKeepingId||null
      }
      if (time_start) {
        params.time_start = dayjs(time_start).format(DATETIME_REQUEST)
      }
      if (time_end) {
        params.time_end = dayjs(time_end).format(DATETIME_REQUEST)
      }

      const { data, status } = await actionGetListTimeKeepingDetail(params)

      if (status === 200) {
        setMyListHistory(data?.timekeepings)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // Hàm duyệt hoặc từ chối đề xuất
  const handleConfrim = async (id, req_status) => {
    setSpinning(true)
    try {
      const { data, status } = await actionApproveBusinessTrip(id, req_status, {})

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
  }, [time_start, time_end, department_id, name])

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
    {
      width: 150,
      title: "Thao tác",
      dataIndex: "status_approve",
      key: "status_approve",
      align: "center",
      render: (v, r) => (
        v && <Space>
          {userLogin?.id == r?.approve_id && v == DEATAIL_STATUS.PENDING ?
            <>{console.log(r)}
              <Popconfirm
                title="Xác nhận đi công tác"
                onConfirm={() => handleConfrim(r?.id, STATUS.ACCEPT)}
              >
                <Button type="primary" >
                  Duyệt
                </Button>
              </Popconfirm>

              <Button
                type="cancel"
                onClick={() => handleConfrim(r?.id, STATUS.REFUSE)}
              >
                Từ chối
              </Button>
            </> :
            (
              renderStatusBusiness(v)
            )

          }
        </Space>
      )
    },
  ];

  const renderStatusBusiness = (v) => {
    let statusClass;
    switch (v) {
      case 1:
        statusClass = "process--waiting";
        break;
      case 2:
        statusClass = "process--success";
        break;
      case 3:
        statusClass = "process--cancel";
        break;
      default:
        statusClass = "process";
    }

    return <span className={statusClass}>{STATUS_BUSINESS[v]}</span>;
  }
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
export default DetailTimeKeeping