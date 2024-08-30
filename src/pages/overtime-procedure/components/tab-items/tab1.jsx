import { useState, useEffect } from "react";
import CreateOvertimeProcedureModal from "../createProcedureModal";
import { PlusCircleOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { handleGetProcedureStatusClassName } from "utils/helps";
import { useSearchParams } from "react-router-dom";
import { handleSetUrlParam } from "utils/helps";
import DetailModal from "../detailModal";
import dayjs from "dayjs";

import { 
  getDscriptions, 
  getEstimatedStartTime 
} from "../../commonsFunctions"

import { 
  DATETIME_FORMAT, 
  PAGINATION 
} from "utils/constants/config";

import {
  RejectProcedureModal,
  ProcedureProcessing,
  OperatorProcedure
} from "components";

import {
  actionGetOvertimeProcedures,
  actionCancelOvertimeProcedure
} from "../../actions"

import {
  Row, Col, Button, Table,
  message, Select
} from "antd";

const Tab1 = ({ setProcedureId, procedure_id, time_start, time_end, setSpinning }) => {
  const [searchParams] = useSearchParams();

  // Rexdux
  const procedureStatus = useSelector((state) => {
    return state?.procedureStatus?.filter(item => ["PENDING", "SUCCESS", "CANCEL"].includes(item?.code)) || []
  });

  // Danh sách đề xuất được tạo bời userLogin
  const [myProcedures, setMyProcedures] = useState([])
  const [totalProcedures, setTotalProcedures] = useState(0)

  // const params filter
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status"));
  const [pagination, setPagination] = useState({ page_num: PAGINATION.PAGE_NUM, page_size: PAGINATION.PAGE_SIZE })

  // modal 
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false)
  const [isRecordShowDetail, setRecordShowDetail] = useState()
  const [isRecordShowProcessing, setRecordShowProcessing] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();

  // Lấy danh sách đã đề xuất
  const handleGetMyProcedures = async (page_num, page_size) => {
    setSpinning(true)

    try {
      // Cập nhật phân trang
      setPagination({ page_num, page_size })

      // params
      const params = {
        status_id: selectedStatus,
        time_start,
        time_end,
        procedure_id,
        page_num,
        page_size
      }

      const { data, status } = await actionGetOvertimeProcedures(params)

      if (status === 200) {
        setMyProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // Hủy đề xuất
  const handleCancleProcedure = async (procedureIdCancel, description) => {
    setSpinning(true)

    try {
      // params
      const params = {
        status_id: selectedStatus,
        time_start,
        time_end,
        procedure_id,
        ...pagination
      }

      const { data, status } = await actionCancelOvertimeProcedure(procedureIdCancel, { description }, params)

      if (status === 200) {
        message.success(data?.message)
        setMyProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  useEffect(() => {
    handleGetMyProcedures(PAGINATION.PAGE_NUM, PAGINATION.PAGE_SIZE);
  }, [time_start, time_end, selectedStatus])

  const columns = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) => i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
    {
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      width: 180,
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => dayjs.unix(v).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 240,
      title: "Mô tả công việc",
      dataIndex: "description",
      key: "description",
      render: (_, r) => <div dangerouslySetInnerHTML={{ __html: getDscriptions(r) }} />,
    },
    {
      width: 240,
      title: "Thời gian dự kiến bắt đầu",
      dataIndex: "description",
      key: "description",
      render: (_, r) => <div dangerouslySetInnerHTML={{ __html: getEstimatedStartTime(r) }} />,
    },
    {
      width: 180,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      align: "center",
      render: (v, r) =>
        <span className={handleGetProcedureStatusClassName(v)}>
          {r?.status}
        </span>
    },
    {
      width: 180,
      title: "",
      dataIndex: "status",
      key: "operator",
      render: (_, r) =>
        <OperatorProcedure
          r={r}
          onCancel={() => setProcedureIdCancel(r?.id)}
          onShowProcess={() => setRecordShowProcessing(r)}
        />,
    }
  ]

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setIsOpenModalCreate(true)}
        >
          Tạo đề xuất
        </Button>
      </Col>

      <Col>
        {procedureStatus && (
          <Select
            allowClear
            className="w-full"
            placeholder="Chọn trạng thái"
            defaultValue={selectedStatus ? parseInt(selectedStatus) : null}
            onChange={(v) => {
              handleSetUrlParam("status", v);
              setSelectedStatus(v);

              // Cập nhật procedure_id
              handleSetUrlParam("procedure_id", null)
              setProcedureId(null)
            }}
          >
            {procedureStatus?.map(item =>
              <Select.Option key={item?.id} value={item?.id}>
                {item?.name}
              </Select.Option>
            )}
          </Select>
        )}
      </Col>

      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          rowKey={(r) => r.id}
          columns={columns}
          dataSource={myProcedures}
          scroll={{ x: 1400 }}
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r)
          })}
          pagination={{
            pageSize: pagination.page_size,
            current: pagination.page_num,
            onChange: handleGetMyProcedures,
            total: totalProcedures,
            showSizeChanger: true,
          }}
        />
      </Col>

      <>
        {/* Modal tạo đề xuất */}
        {isOpenModalCreate && (
          <CreateOvertimeProcedureModal
            onCancel={() => setIsOpenModalCreate(false)}
            setMyProcedures={setMyProcedures}
          />
        )}

        {/* Modal xem chi tiết trạng thái */}
        {isRecordShowProcessing && (
          <ProcedureProcessing
            record={isRecordShowProcessing}
            onCancel={() => setRecordShowProcessing(null)}
          />
        )}

        {/* Modal hủy đề xuất */}
        {procedureIdCancel && (
          <RejectProcedureModal
            title={"Hủy đề xuất"}
            onCancel={() => setProcedureIdCancel(null)}
            onRejection={(description) => {
              handleCancleProcedure(procedureIdCancel, description);
              setProcedureIdCancel(null);
            }}
          />
        )}

        {/* Modal xem chi tiết đề xuất */}
        {isRecordShowDetail && (
          <DetailModal
            record={isRecordShowDetail}
            onCancel={() => setRecordShowDetail(null)}
          />
        )}
      </>
    </Row>
  )
}

export default Tab1