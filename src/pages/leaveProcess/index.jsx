import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Space,
  Table,
  Row,
  Col,
  Select,
  Tabs,
  Input,
  DatePicker,
} from "antd";
import { TbTableExport } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdAddCircleOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import AddLeaveProcess from "./components/addLeaveProcessModal";
import { useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import RejectProcedureModal from "./components/rejectProdureModal";
import ApproveProcedureModal from "./components/approveProcedureModal";
import ShowProcessingModal from "./components/showProcessingModal";
import {
  SpinCustom,
  RejectProcedureModal as CanCelProcedureModal,
} from "components";
import { DEATAIL_STATUS } from "utils/constants/config";
import { DATE_FORMAT, DATETIME_FORMAT } from "utils/constants/config";

import {
  actionGetProcedures,
  actionGetCarRequestList,
  actionGetStatusProceduresDetails,
  actionGetStatusProcedures,
  actionCanCelProcedure,
} from "./action";

const LeaveProcess = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [spinning, setSpinning] = useState(false);
  const [searchParams] = useSearchParams();

  // procedure
  const [procedures, setProcedures] = useState([]);
  const [totalProduce, setTotalProduce] = useState(0);
  const [procedureIdCancel, setProcedureIdCancel] = useState();
  const procedureId = searchParams.get("procedure_id");
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [proceduresFinished, setProceduressFinished] = useState([]);
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);

  //car
  const [listCars, setListCars] = useState([]);
  const [totalListCar, setTotalListCar] = useState(0);

  //action
  const [approveProcedure, setApproveProcedure] = useState(false);
  const [rejectProcedure, setRejectProcedure] = useState(false);

  //modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [addLeaveProcess, setAddLeaveProcessModal] = useState(false);

  //status
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusProceduresDetails, setStatusProceduresDetails] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusSelectedTb2, setStatusSelectedTb2] = useState();
  const [statusSelectedTb1, setStatusSelectedTb1] = useState(1);
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();

  //timefilter
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));
  const [nameSeach, setNameSeach] = useState("");
  const tab = searchParams.get("tabKey");
  const [tabKey, setTabKey] = useState(tab || "tab-1");

  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });

  const [paginationTab2, setPaginationTab2] = useState({
    page_num: 1,
    page_size: 10,
  });

  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });
  const [carPagination, setCarPagination] = useState({
    page_num: 1,
    page_size: 10,
  });

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (!value) {
      setFilteredProcedures(proceduresFinished);
    } else {
      const filteredData = proceduresFinished.filter(
        (procedure) => procedure.status_id === value
      );

      setFilteredProcedures(filteredData);
    }
  };

  const handleExportToExcelProduce = (data) => {
    const tmp = data.map((e, index) => {
      return {
        STT: index + 1,
        "Người tạo": e?.created_by,
        "Thời gian tạo": moment(parseInt(e?.time_created) * 1000).format(
          DATETIME_FORMAT
        ),
        "Trạng thái đơn": e?.status,
        "Lý do nghỉ": e?.reason,
        "Số ngày nghỉ có phép": e?.allow_day,
        "Số ngày nghỉ không phép": e?.not_allow_day,
        "Thời gian bắt đầu nghỉ": moment(parseInt(e?.time_start) * 1000).format(
          DATETIME_FORMAT
        ),
        "Thời gian kết thúc nghỉ": moment(parseInt(e?.time_end) * 1000).format(
          DATETIME_FORMAT
        ),
        "Ngày tạo": moment(e?.time_created * 1000).format(DATETIME_FORMAT),
        "Ghi chú ": e?.description,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_xin_nghi");
    XLSX.writeFile(workbook, "Danh_sach_xin_nghi.xlsx");
  };

  const handleGetStatusProcedures = async () => {
    try {
      const { data, status } = await actionGetStatusProcedures();
      if (status === 200) {
        const newData = data.slice(2, 4);

        setStatusProceduress(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStatusProceduresDetails = async () => {
    try {
      const { data, status } = await actionGetStatusProceduresDetails();
      if (status === 200) {
        setStatusProceduresDetails(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePendingProcedureChangePage = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab1({ page_num, page_size });

      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };

      const { data, status } = await actionGetProcedures(params);
      if (status === 200) {
        setProcedures(data?.procedures);
        setTotalProduce(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );

        setTotalProduceFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleFinishedProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab3({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };

      const { data, status } = await actionGetProcedures(params);
      if (status === 200) {
        setProcedures(data?.procedures);
        setTotalProduce(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );

        setTotalProduceFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleMyProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab2({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };
      const { data, status } = await actionGetCarRequestList(params);

      if (status === 200) {
        setListCars(data?.procedures);
        setTotalListCar(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetProcedures = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab1({ page_num, page_size });
      setPaginationTab3({ page_num, page_size });
      const params = {
        // page_num: procedurePagination.page_num,
        // page_size: procedurePagination.page_size,
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };
      const { data, status } = await actionGetProcedures(params);
      if (status == 200) {
        setProcedures(data?.procedures);

        setProceduressFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );

        setTotalProduce(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );

        setTotalProduceFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          ).length
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetCarRequestList = async (page_num, page_size) => {
    setSpinning(true);

    try {
      const params = {
        status_id: statusSelectedTb2,
        // page_num: carPagination.page_num,
        // page_size: carPagination.page_size,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };
      const { data, status } = await actionGetCarRequestList(params);

      if (status === 200) {
        setListCars(data?.procedures);
        setTotalListCar(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCancleProcedure = async (procedure_id, description) => {
    setSpinning(true);
    try {
      setCarPagination({ page_num: 1, page_size: 10 });

      const params = {
        status_id: statusSelectedTb2,
        page_num: carPagination.page_num,
        page_size: carPagination.page_size,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionCanCelProcedure(
        procedure_id,
        description,
        params
      );

      if (status === 200) {
        setListCars(data?.procedures);
        setTotalListCar(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  useEffect(() => {
    handleGetStatusProceduresDetails();
    handleGetStatusProcedures();
  }, []);

  useEffect(() => {
    handleGetProcedures(1, 10);
    handleGetCarRequestList(1, 10);
  }, [
    procedureId,
    timeStart,
    timeEnd,
    statusSelectedTb1,
    statusSelectedTb2,
    nameSeach,
  ]);

  const columns = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, index) =>
        index + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
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
      width: 150,
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
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
    {
      width: 150,
      title: "Tổng số ngày nghỉ có phép đã sử dụng",
      dataIndex: "total_allow_day",
      key: "total_allow_day",
      align: "center",
    },
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
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    },
  ];

  const columns1 = columns.concat([
    {
      width: 450,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <Space>
          {v === "PENDING" && r?.approved_by === userLogin?.id && (
            <>
              {/* <Popconfirm
                title="Bạn chắc chắn muốn xác nhận?"
                okText="Đồng ý"
                cancelText="Hủy"
                onConfirm={() => setApproveProcedure(r)}
              > */}

              <Button
                onClick={() => setApproveProcedure(r)}
                className="btn-with-icon success-btn"
                type="primary"
              >
                <GiConfirmed />
                <span className="btn-text">Xác nhận</span>
              </Button>

              <Button
                type="cancel"
                onClick={() => setRejectProcedure(r)}
                className="btn-with-icon"
              >
                <MdOutlineCancel />
                <span className="btn-text">Từ chối</span>
              </Button>
            </>
          )}{" "}
          {
            <Button
              onClick={() => {
                setShowProcessingModal(r);
              }}
              className="btn-with-icon "
            >
              <MdOutlineRemoveRedEye />
              <span className="btn-text">Xem trạng thái</span>
            </Button>
          }
        </Space>
      ),
      align: "center",
    },
  ]);

  const columns2 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, index) =>
        index + 1 + (paginationTab2.page_num - 1) * paginationTab2.page_size,
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
      width: 150,
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
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
    {
      width: 150,
      title: "Tổng số ngày nghỉ có phép đã sử dụng",
      dataIndex: "total_allow_day",
      key: "total_allow_day",
      align: "center",
    },
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
      width: 150,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    },
  ].concat([
    {
      width: 100,
      title: "",
      dataIndex: "status",
      key: "operator",
      render: (v, r) => (
        <Space>
          {r?.status_code == "PENDING" && (
            <Button
              type="cancel"
              className="btn-with-icon"
              onClick={() => setProcedureIdCancel(r?.id)}
            >
              <RiDeleteBinLine />
              <span className="btn-text">Hủy</span>
            </Button>
          )}

          <Button
            onClick={() => {
              setShowProcessingModal(r);
            }}
            className="btn-with-icon "
          >
            <MdOutlineRemoveRedEye />
            <span className="btn-text">Xem trạng thái</span>
          </Button>
        </Space>
      ),
      align: "center",
    },
  ]);

  const columns3 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, index) =>
        index + 1 + (paginationTab3.page_num - 1) * paginationTab3.page_size,
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
      width: 150,
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
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
    {
      width: 150,
      title: "Tổng số ngày nghỉ có phép đã sử dụng",
      dataIndex: "total_allow_day",
      key: "total_allow_day",
      align: "center",
    },
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
      width: 400,
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }

        return (
          <Space>
            <div className={statusClass}>{r?.status}</div>

            <Button
              onClick={() => {
                setShowProcessingModal(r);
              }}
              className="btn-with-icon "
            >
              <MdOutlineRemoveRedEye />
              <span className="btn-text">Xem trạng thái</span>
            </Button>
          </Space>
        );
      },
      align: "center",
    },
  ];
  const Tab1 = () => (
    <Row gutter={[8, 8]}>
      {
        // userLogin?.position_code === "TRUONG_PHONG" &&
        //  userLogin.department_id === 6 &&
        <Col>
          <Button
            onClick={() =>
              handleExportToExcelProduce(
                procedures.filter((item) => {
                  return (
                    item.detail_status_id === DEATAIL_STATUS.PENDING ||
                    (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                      item.status_id === DEATAIL_STATUS.PENDING)
                  );
                })
              )
            }
            className="btn-with-icon pdf-btn"
            type="primary"
          >
            <TbTableExport />
            <span className="btn-text">Xuất Excel</span>
          </Button>
        </Col>
      }

      <Col span={24}>
        <Table
          width="100%"
          dataSource={procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          })}
          rowKey={(r) => r.id}
          columns={columns1}
          pagination={{
            pageSize: paginationTab1.page_size,
            current: paginationTab1.page_num,
            onChange: handlePendingProcedureChangePage,
            total: totalProduce,
          }}
          scroll={{ x: 2000 }}
        />
      </Col>
    </Row>
  );

  const Tab2 = () => (
    <Row gutter={[8, 0]}>
      {userLogin.position_code !== "GIAM_DOC" && (
        <Col>
          <Button
            className="btn-with-icon request-btn"
            onClick={() => setAddLeaveProcessModal(true)}
            type="primary"
          >
            <MdAddCircleOutline />
            <span className="btn-text">Đề xuất xin nghỉ</span>
          </Button>
        </Col>
      )}

      <Col>
        <Select
          className="w-full"
          placeholder="Chọn trạng thái"
          onChange={(v) => {
            handleGetCarRequestList(v);
            window.navigatePage("leaveprocess");
            setStatusSelectedTb2(v);
          }}
          allowClear
          value={statusSelectedTb2}
        >
          {statusProcedures.map((item) => (
            <Select.Option key={item?.id} value={item?.id}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Col>
        <Button
          onClick={() =>
            handleExportToExcelProduce(
              listCars
            )
          }
          className="btn-with-icon pdf-btn"
          type="primary"
        >
          <TbTableExport />
          <span className="btn-text">Xuất Excel</span>
        </Button>
      </Col>

      <Col span={24}>
        <Table
          width="100%"
          dataSource={listCars}
          rowKey={(r) => r.id}
          columns={columns2}
          pagination={{
            pageSize: paginationTab2.page_size,
            current: paginationTab2.page_num,
            onChange: handleMyProcedureChangePage,
            total: totalListCar,
          }}
          scroll={{ x: 1800 }}
        />
      </Col>
    </Row>
  );

  const Tab3 = () => (
    <Row gutter={[8, 8]}>
      <Col>
        <Select
          className="w-full"
          placeholder="Chọn trạng thái"
          allowClear
          onChange={(v) => {
            setStatusSelectedTb3(v);
            handleStatusChange(v);
            window.navigatePage("leaveprocess");
          }}
          value={statusSelectedTb3}
        >
          {statusProcedures.map((item) => (
            <Select.Option key={item?.id} value={item?.id}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      {
        // userLogin?.position_code === "TRUONG_PHONG" &&
        //  userLogin.department_id === 6 &&
        <Col>
          <Button
            onClick={() =>
              handleExportToExcelProduce(
                selectedStatus !== null ? filteredProcedures : proceduresFinished
              )
            }
            className="btn-with-icon pdf-btn"
            type="primary"
          >
            <span className="btn-text">Xuất Excel</span>
            <TbTableExport />
          </Button>
        </Col>
      }

      <Col span={24}>
        <Table
          width="100%"
          dataSource={
            selectedStatus !== null ? filteredProcedures : proceduresFinished
          }
          rowKey={(r) => r.id}
          columns={columns3}
          pagination={{
            pageSize: paginationTab3.page_size,
            current: paginationTab3.page_num,
            onChange: handleFinishedProcedureChangePage,

            total: totalProduceFinished,
          }}
          scroll={{ x: 1280 }}
        />
      </Col>
    </Row>
  );

  const TabItem = [
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "HANH_CHINH" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-1",
      label: "Danh sách chờ duyệt",
      children: <Tab1 />,
    },
    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "HANH_CHINH" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.position_code === "KE_TOAN" ||
      userLogin.position_code === "THU_QUY" ||
      userLogin.department_id === 6) && {
      key: "tab-2",
      label: "Danh sách thực hiện",
      children: <Tab3 />,
    },
    userLogin.position_code !== "GIAM_DOC" && {
      key: "tab-3",
      label: "Danh sách xin nghỉ",
      children: <Tab2 />,
    },
  ];

  const handleSelectedTabKey = (e) => {
    setTabKey(e);
    window.history.pushState(null, null, `?tabKey=${e}`);
  };

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row gutter={[8, 8]}>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Từ</Col>

                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={timeStart}
                    onChange={(v) => {
                      window.navigatePage("leaveprocess");
                      setTimeStart(v);
                    }}
                  />
                </Col>
              </Row>
            </Col>

            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Đến</Col>
                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={timeEnd}
                    onChange={(v) => {
                      window.navigatePage("leaveprocess");
                      setTimeEnd(v);
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>
                  <Input.Search
                    onSearch={(v) => {
                      setNameSeach(v);
                    }}
                    placeholder="Nhập tên ..."
                    allowClear
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="common-layout--content">
          <Tabs
            items={TabItem}
            defaultActiveKey={tabKey}
            onTabClick={(e) => handleSelectedTabKey(e)}
          />
        </div>
      </SpinCustom>
      <>
        {addLeaveProcess && (
          <AddLeaveProcess
            onClose={() => {
              setAddLeaveProcessModal(false);
            }}
            setListCars={setListCars}
          />
        )}
        {approveProcedure && (
          <ApproveProcedureModal
            approveProcedure={approveProcedure}
            onClose={() => {
              setApproveProcedure(null);
            }}
            setProcedures={setProcedures}
          />
        )}
        {rejectProcedure && (
          <RejectProcedureModal
            rejectProcedure={rejectProcedure}
            onClose={() => {
              setRejectProcedure(null);
            }}
            setProcedures={setProcedures}
          />
        )}

        {procedureIdCancel && (
          <CanCelProcedureModal
            onCancel={() => setProcedureIdCancel(null)}
            onRejection={(description) => {
              handleCancleProcedure(procedureIdCancel, description);
              setProcedureIdCancel(null);
            }}
          />
        )}

        {showProcessingModal && (
          <ShowProcessingModal
            showProcessingModal={showProcessingModal}
            onClose={() => {
              setShowProcessingModal(null);
            }}
          />
        )}
      </>
    </Layout>
  );
};

export default LeaveProcess;
