import { DATETIME_FORMAT, PAGINATION } from "utils/constants/config";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, Row, Select, Table } from "antd";
import { MdAddCircleOutline } from "react-icons/md";
import CreatePaymentProcedure from "../createPaymentProcedure";
import { formatCurrency, handleGetProcedureStatusClassName, handleSetUrlParam } from "utils/helps";
import { OperatorProcedure, ProcedureProcessing, RejectProcedureModal } from "components";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { actionCanCelProcedure, actionGetPaymentProcedures } from "../../actions";
import ProcedureDetailModal from "../detailPaymentModal";


const MyProcedureTT = ({ setProcedureId, procedure_id, time_start, time_end, setSpinning }) => {
  const [searchParams] = useSearchParams();

  // Rexdux
  const procedureStatus = useSelector((state) => {
    return state?.procedureStatus?.filter(item => ["PENDING", "SUCCESS", "CANCEL"].includes(item?.code)) || []
  });

  // filter
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status"));
  const [pagination, setPagination] = useState({ page_num: PAGINATION['PAGE_NUM'], page_size: PAGINATION['PAGE_SIZE'] })

  //biến danh sách tạo bởi tôi
  const [myProcedures, setMyProcedures] = useState([])
  const [totalProcedures, setTotalProcedures] = useState(0)
  // check tab quy trình
  const [CheckTabItem3, setCheckTabItem3] = useState()
  const [openModalAdd, setOpenModalAdd] = useState()
  const [isRecordShowProcessing, setRecordShowProcessing] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();
  const [isRecordShowDetail, setRecordShowDetail] = useState()



  // Lây danh sách đễ xuất của tôi
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
        page_size,
      }

      const { data, status } = await actionGetPaymentProcedures(params)

      if (status === 200) {
        setMyProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }

    } catch (error) {
      console.log(error);
    }

    setSpinning(false)
  }

  // hủy đề xuất
  const handleCancleProcedure = async (procedure_id, description) => {
    setSpinning(true);
    try {
      setPagination({ page_num: PAGINATION['PAGE_NUM'], page_size: PAGINATION['PAGE_SIZE'] });
      // params
      const params = {
        status_id: selectedStatus,
        time_start,
        time_end,

      }
      const { data, status } = await actionCanCelProcedure(
        procedure_id,
        description,
        params
      );

      if (status === 200) {
        setMyProcedures(data?.procedures)
        setTotalProcedures(data?.total)
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };



  useEffect(() => {
    handleGetMyProcedures(PAGINATION['PAGE_NUM'], PAGINATION['PAGE_SIZE']);
  }, [time_start, time_end, selectedStatus])

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
      title: "Nội dung thanh toán",
      dataIndex: "content",
      key: "content",

      align: "center",
    },
    {
      width: 200,
      title: "Tổng số tiền",
      dataIndex: "sum_money",
      key: "sum_money",
      render: (v, r) => formatCurrency(r?.accounting_details.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0)),
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
      align: "center",
    }
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Button
          className="btn-with-icon "
          type="primary"
          onClick={() => {
            setCheckTabItem3(true)
            setOpenModalAdd(true)
          }}
        >
          <MdAddCircleOutline />
          <span className="btn-text">Thêm đề xuất</span>
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
          dataSource={myProcedures}
          columns={columns}
          className="tb-click-row"
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r),
          })}
          pagination={{
            pageSize: pagination.page_size,
            current: pagination.page_num,
            onChange: handleGetMyProcedures,
            total: totalProcedures,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50],
          }}
          scroll={{ x: 2000 }}

        />
      </Col>

      {
        openModalAdd && <CreatePaymentProcedure
          setSpinning={setSpinning}
          onCancel={() => { setOpenModalAdd(false) }}
          setMyProcedures={setMyProcedures}
          CheckTabItem3={CheckTabItem3}

        />
      }
      {isRecordShowProcessing && (
        <ProcedureProcessing
          record={isRecordShowProcessing}
          onCancel={() => {
            setRecordShowProcessing(null);
          }}
        />
      )}

      {procedureIdCancel && (
        <RejectProcedureModal
          onCancel={() => setProcedureIdCancel(null)}
          onRejection={(description) => {
            handleCancleProcedure(
              procedureIdCancel,
              description,
            );
            setProcedureIdCancel(null);
          }}
        />
      )}



      {isRecordShowDetail && (
        <ProcedureDetailModal
          onCancel={() => setRecordShowDetail(null)}
          record={isRecordShowDetail}
        />
      )}

    </Row>
  )
}
export default MyProcedureTT