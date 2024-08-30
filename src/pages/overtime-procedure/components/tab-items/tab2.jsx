import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { handleGetProcedureStatusClassName } from "utils/helps";
import { useSearchParams } from "react-router-dom";
import { handleSetUrlParam } from "utils/helps";
import DetailModal from "../detailModal";
import UpdateActualTimesModal from "../updateActualTimesModal";
import dayjs from "dayjs";

import {
  getDscriptions,
  getEstimatedStartTime
} from "../../commonsFunctions"

import {
  DATETIME_FORMAT,
  PAGINATION,
  STATUS
} from "utils/constants/config";

import {
  RejectProcedureModal,
  ProcedureProcessing,
  OperatorPenddingProcedure
} from "components";

import {
  actionGetListPendingOvertimeProcedures,
  acctionApproveOvertimeProcedure
} from "../../actions"

import {
  Row, Col, Button, Table,
  message, Select
} from "antd";

const Tab2 = ({ setProcedureId, procedure_id, time_start, time_end, setSpinning }) => {
  const [searchParams] = useSearchParams();

  // Rexdux
  const userLogin = useSelector((state) => state?.profile);
  const procedureStatus = useSelector((state) => {
    return state?.proceduresDetailStatus || []
  });

  // Danh sách duyệt
  const [pendingProcedures, setPendingProcedures] = useState([])
  const [totalProcedures, setTotalProcedures] = useState(0)

  // const params filter
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("detail-status"));
  const [pagination, setPagination] = useState({ page_num: PAGINATION.PAGE_NUM, page_size: PAGINATION.PAGE_SIZE })

  // modal 
  const [isRecordShowDetail, setRecordShowDetail] = useState()
  const [isRecordShowProcessing, setRecordShowProcessing] = useState();
  const [isIsReject, setIdReject] = useState();
  const [isRecordUpdateActualTimes, setRecordUpdateActualTimes] = useState();

  // Lấy danh chờ duyệt
  const handleGetPendingProcedures = async (page_num, page_size) => {
    setSpinning(true)

    try {
      // Cập nhật phân trang
      setPagination({ page_num, page_size })

      // params
      const params = {
        detail_status_id: selectedStatus,
        time_start,
        time_end,
        procedure_id,
        page_num,
        page_size
      }

      const { data, status } = await actionGetListPendingOvertimeProcedures(params)

      if (status === 200) {
        setPendingProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // Hàm duyệt hoặc từ chối đề xuất
  const handleApproveOvertimeProcedure = async (id, procedure_status, req_data) => {
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

      const { data, status } = await acctionApproveOvertimeProcedure(id, procedure_status, req_data, params)

      if (status === 200) {
        message.success(data?.message)
        setPendingProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // Xử lý ấn nút xác nhận
  const handleConfrim = (r) => {
    // số lần giám đốc duyệt
    const count_director_approves = r?.details.filter(v => v?.position_code == "GIAM_DOC")?.length;

    // check để mở form cập nhật lại thời gian thực tế
    const isOpenFormUpdateTime = r?.created_by_id == userLogin?.id && count_director_approves == 1;
   
    // Mỏ form để cập nhật lại thời gian làm thực tế
    if (isOpenFormUpdateTime) {
      setRecordUpdateActualTimes(r)
    }
    
    // Duyệt bình thường
    else {
      handleApproveOvertimeProcedure(r?.id, STATUS.ACCEPT, null)
    }
  }

  useEffect(() => {
    handleGetPendingProcedures(PAGINATION.PAGE_NUM, PAGINATION.PAGE_SIZE);
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
      width: 150,
      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
    },
    {
      width: 150,
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
      title: "Trạng thái cả đơn",
      dataIndex: "status_code",
      key: "status_code",
      align: "center",
      render: (v, r) =>
        <span className={handleGetProcedureStatusClassName(v)}>
          {r?.status}
        </span>
    },
    {
      width: 250,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      align: "center",
      render: (v, r) => <OperatorPenddingProcedure
        record={r}
        userLogin={userLogin}
        onConfirm={() => handleConfrim(r)}
        onReject={() => setIdReject(r.id)}
        onShowProcess={() => setRecordShowProcessing(r)}
      // onExportPDF
      />
    },
  ]

  return (
    <Row gutter={[8, 8]}>
      <Col>

      </Col>

      <Col>
        {procedureStatus && (
          <Select
            allowClear
            className="w-full"
            placeholder="Chọn trạng thái"
            defaultValue={selectedStatus ? parseInt(selectedStatus) : null}
            onChange={(v) => {
              handleSetUrlParam("detail-status", v);
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
          dataSource={pendingProcedures}
          scroll={{ x: 1800 }}
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r)
          })}
          pagination={{
            pageSize: pagination.page_size,
            current: pagination.page_num,
            onChange: handleGetPendingProcedures,
            total: totalProcedures,
            showSizeChanger: true,
          }}
        />
      </Col>

      <>
        {/* Modal xem chi tiết trạng thái */}
        {isRecordShowProcessing && (
          <ProcedureProcessing
            record={isRecordShowProcessing}
            onCancel={() => setRecordShowProcessing(null)}
          />
        )}

        {/* Modal từ chối đề xuất */}
        {isIsReject && (
          <RejectProcedureModal
            onCancel={() => setIdReject(null)}
            onRejection={(description) => {
              handleApproveOvertimeProcedure(isIsReject, STATUS.REFUSE, { description });
              setIdReject(null);
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

        {isRecordUpdateActualTimes && (
          <UpdateActualTimesModal
            record={isRecordUpdateActualTimes}
            onCancel={() => setRecordUpdateActualTimes(null)}
            onConfirm={handleApproveOvertimeProcedure}
          />
        )}
      </>
    </Row>
  )
}

export default Tab2