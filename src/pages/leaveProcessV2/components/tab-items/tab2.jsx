import { DATETIME_FORMAT, PAGINATION, STATUS } from "utils/constants/config";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, Row, Select, Table, message } from "antd";
import { handleGetProcedureStatusClassName, handleSetUrlParam } from "utils/helps";
import { OperatorPenddingProcedure, ProcedureProcessing, RejectProcedureModal } from "components";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { actionApprove, actionGetProcedures } from "../../action";
import { TbTableExport } from "react-icons/tb";
import handleExportToExcelProduce from "../exportExcel";


const Tab2 = ({ procedure_id, time_start, setProcedureId, time_end, setSpinning, name, department_id }) => {
  const [searchParams] = useSearchParams();
  const userLogin = useSelector(state => state?.profile)


  // Rexdux
  const procedureStatus = useSelector((state) => {
    return state?.procedureStatus?.filter(item => ["PENDING", "SUCCESS", "CANCEL"].includes(item?.code)) || []
  });

  // filter
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("detail_status_id"));
  const [pagination, setPagination] = useState({ page_num: PAGINATION['PAGE_NUM'], page_size: PAGINATION['PAGE_SIZE'] })

  //biến danh sách tôi duyệt
  const [approveProcedures, setApproveProcedures] = useState([])

  const [totalProcedures, setTotalProcedures] = useState(0)
  const [isIsReject, setIdReject] = useState();

  const [isRecordShowProcessing, setRecordShowProcessing] = useState();




  // Lây danh sách đễ xuất tôi duyệt
  const handleGetPenddingProcedures = async (page_num, page_size) => {
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
        page_size,
        department_id,
        name

      }

      const { data, status } = await actionGetProcedures(params)

      if (status === 200) {
        setApproveProcedures(data?.procedures.sort((a, b) => {
          // Đặt các status_code "PENDING" lên đầu
          if (a.status_code === "PENDING" && b.status_code !== "PENDING") {
              return -1; // a sẽ xuất hiện trước b trong mảng kết quả
          } else if (a.status_code !== "PENDING" && b.status_code === "PENDING") {
              return 1; // b sẽ xuất hiện trước a trong mảng kết quả
          } else {
              return 0; // giữ nguyên thứ tự ban đầu của a và b
          }
      }))
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // Hàm duyệt hoặc từ chối đề xuất
  const handleApprovePaymentProcedure = async (id, procedure_status, req_data) => {
    setSpinning(true)

    try {
      // params
      const params = {
        detail_status_id: selectedStatus,
        time_start,
        time_end,
        procedure_id,
        department_id,
        name,
        ...pagination
      }
      // console.log(id, procedure_status, { description: req_data?.description || null }, params);
      const { data, status } = await actionApprove(id, procedure_status, { description: req_data?.description || null }, params)

      if (status === 200) {
        message.success(data?.message)
        handleGetPenddingProcedures(PAGINATION['PAGE_NUM'], PAGINATION['PAGE_SIZE'])
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  const handleConfrim = (r) => {
    handleApprovePaymentProcedure(r?.id, STATUS.ACCEPT, null)
  }

  useEffect(() => {
    handleGetPenddingProcedures(PAGINATION['PAGE_NUM'], PAGINATION['PAGE_SIZE']);
  }, [time_start, time_end, selectedStatus, department_id, name])

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
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      width: 150,
      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "center",
    },
    {
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
      width: 150,
    },
    {
      width: 200,
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      align: "center",
    },
    {
      width: 150,
      title: "Nghỉ từ ngày",
      dataIndex: "time_start",
      key: "time_start",
      render: (v) => moment(parseInt(v) * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      width: 150,
      title: "Đến ngày",
      dataIndex: "time_end",
      key: "time_end",
      render: (v) => moment(parseInt(v) * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    // {
    //   width: 150,
    //   title: "Tổng số ngày nghỉ có phép đã sử dụng",
    //   dataIndex: "total_allow_day",
    //   key: "total_allow_day",
    //   align: "center",
    // },
    {
      width: 150,
      title: "Số ngày nghỉ có phép",
      dataIndex: "allow_day",
      key: "allow_day",
      align: "center",
    },
    {
      width: 150,
      title: "Số ngày nghỉ không phép",
      dataIndex: "not_allow_day",
      key: "not_allow_day",
      align: "center",
    },
    {
      width: 150,
      title: "Nội dung bàn giao",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      width: 200,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) =>
        <span className={handleGetProcedureStatusClassName(v)}>{r?.status}</span>,
      align: "center",
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
      />
    }
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Button
          onClick={() =>
            handleExportToExcelProduce(approveProcedures)
          }
          className="btn-with-icon pdf-btn"
          type="primary"
        >
          <TbTableExport />
          <span className="btn-text">Xuất Excel</span>
        </Button>
      </Col>
      {/* <Col>

        {procedureStatus && (
          <Select
            allowClear
            className="w-full"
            placeholder="Chọn trạng thái"
            defaultValue={selectedStatus ? parseInt(selectedStatus) : null}
            onChange={(v) => {
              handleSetUrlParam("detail_status", v);
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
      </Col> */}

      <Col span={24}>
        <Table
          dataSource={approveProcedures}
          columns={columns}
          className="tb-click-row"
          pagination={{
            pageSize: pagination.page_size,
            current: pagination.page_num,
            onChange: handleGetPenddingProcedures,
            total: totalProcedures,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
          scroll={{ x: 2000 }}
        />
      </Col>



      {/* Xem tiến trình  */}
      {isRecordShowProcessing && (
        <ProcedureProcessing
          record={isRecordShowProcessing}
          onCancel={() => {
            setRecordShowProcessing(null);
          }}
        />
      )}

      {/* từ chối đề xuất*/}
      {isIsReject && (
        <RejectProcedureModal
          onCancel={() => setIdReject(null)}
          onRejection={(description) => {
            handleApprovePaymentProcedure(isIsReject, STATUS.REFUSE_PROCEDURE, { description });
            setIdReject(null);
          }}
        />
      )}

      

    </Row>
  )
}
export default Tab2
