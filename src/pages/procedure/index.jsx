import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import {
  SpinCustom,
  RejectProcedureModal,
  ProcedureProcessing,
} from "components";
import AddProcedure from "./components/addProcedureModal";
import ConfirmProcedureModal from "./components/confirmProcedureModal";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import DetailProcedureModal from "./components/detailProcedure";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import { actionGetVehicles } from "pages/vehicles/action";
import { actionGetStatusTripDetails } from "./action";
import moment from "moment";
import dayjs from "dayjs";
import { DEATAIL_STATUS } from "utils/constants/config";
import {
  actionGetProceduresPending,
  actionApprove,
  actionGetCarRequestList,
  actionGetStatusProceduresDetails,
  actionGetStatusProcedures,
  actionCanCelProcedure,
} from "./action";
import { RiArrowTurnBackFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdAddCircleOutline } from "react-icons/md";
import { IoCarSportOutline } from "react-icons/io5";
import {
  Button,
  Layout,
  Space,
  Table,
  Select,
  Row,
  Col,
  Popconfirm,
  message,
  Tabs,
  Input,
  DatePicker,
  Tooltip,
} from "antd";
import ApproveProcedureModal from "./components/approveProcedureModal";
import { TbTableExport } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MdNoteAdd } from "react-icons/md";

const Procedure = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [spinning, setSpinning] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [listCars, setListCars] = useState([]);
  const [vehiclesJoin, setVehiclesJoin] = useState([]);
  const [searchParams] = useSearchParams();
  const tabKey = searchParams.get("tabKey");

  //status
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusProceduresFinished, setStatusProceduressFinished] = useState([]);
  const [statusProceduresDetails, setStatusProceduresDetails] = useState([]);

  //procedure
  const [procedures, setProcedures] = useState([]);
  const [procedureIdCancel, setProcedureIdCancel] = useState();
  const [processingProcedure, setProcessingProcedure] = useState(false);
  const [totalProduce, setTotalProduce] = useState(0);
  const [totalListCar, setTotalListCar] = useState(0);
  const [totalJoin, setTotalJoin] = useState(0);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [proceduresFinished, setProceduressFinished] = useState([]);
  const [approveProcedure, setApproveProcedure] = useState(false);
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);

  //id
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const procedureId = searchParams.get("procedure_id");
  const vehicleId = searchParams.get("vehicle_id");

  //modal
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [isOpenDetailModal, setOpenDetailModal] = useState(false);
  const [addProcedure, setAddProcedureModal] = useState(false);

  //filter
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));
  const [nameSeach, setNameSeach] = useState("");

  //driver
  const [driver, setDriver] = useState();
  const [changedDriver, setChangedDriver] = useState(null);

  //status
  const [statusSelectedTb2, setStatusSelectedTb2] = useState();
  const [statusSelectedTb1, setStatusSelectedTb1] = useState();
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();
  const [statusSelectedTb4, setStatusSelectedTb4] = useState();
  const [tab, setTab] = useState(tabKey || "2");
  const [selectedStatus, setSelectedStatus] = useState(null);

  //tab1
  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });

  //tab2
  const [paginationTab2, setPaginationTab2] = useState({
    page_num: 1,
    page_size: 10,
  });

  //tab3
  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });

  //tab4
  const [paginationTab4, setPaginationTab4] = useState({
    page_num: 1,
    page_size: 10,
  });

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

  // const handleDriverChangeFromApproval = async (driverId) => {
  //   setChangedDriver(driverId);
  //   // You can perform additional actions with the received driverName here
  // };

  const handleGetStatusProceduresDetails = async () => {
    try {
      const { data, status } = await actionGetStatusProceduresDetails();
      if (status === 200) {
        const newData = data.slice(1, 3);

        setStatusProceduresDetails(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleExportToExcelProduce = async (data) => {
    // const params = {
    //   status_id: statusSelectedTb1,
    //   time_start: dayjs(timeStart).startOf("D").unix(),
    //   time_end: dayjs(timeEnd).endOf("D").unix(),
    //   name: nameSeach
    // };
    // const { data, status } = await actionGetProceduresPending(params);
    // const tmp = data?.procedures.map((e, index) => {
    const tmp = data.map((e, index) => {
      return {
        STT: index + 1,
        "Người tạo": e?.created_by,
        "Lý do": e?.reason,
        "Biển số": e?.license_plate,
        "Địa điểm xuất phát": e?.departure,
        "Địa điểm làm việc": e?.destination,
        // "Ngày tạo đơn": moment(e?.time_created * 1000).format(DATETIME_FORMAT),
        "Thời gian đi thực tế": e?.departure_time
          ? moment(parseInt(e?.departure_time) * 1000).format(DATETIME_FORMAT)
          : "",
        "Thời gian kết thúc thực tế": e?.trip_end_time
          ? moment(parseInt(e?.trip_end_time) * 1000).format(DATETIME_FORMAT)
          : "",
        "KM bắt đầu": e?.km_start || "chưa có",
        "KM kết thúc": e?.km_end || "chưa có",
        "Thành viên tham gia": e?.members.map((i) => i?.name).toLocaleString(),
        "Người lái xe": e?.driver_name,
        "Ghi chú chuyến đi": e?.driver_destination || "chưa có",
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      // { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_xin_xe");
    XLSX.writeFile(workbook, "Danh_sach_xin_xe.xlsx");
  };

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

  const handlePendingProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab1({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };

      const { data, status } = await actionGetProceduresPending(params);
      if (status == 200) {
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
    setPaginationTab4({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetProceduresPending(params);
      if (status == 200) {
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

  const handleCarChangePage = async (page_num, page_size) => {
    setPaginationTab2({
      page_num,
      page_size,
    });

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

  const handleCarChangePage3 = async (page_num, page_size) => {
    setPaginationTab3({
      page_num,
      page_size,
    });

    setSpinning(true);
    try {
      const params = {
        status_id: statusSelectedTb3,

        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };
      const { data, status } = await actionGetStatusTripDetails(params);

      if (status === 200) {
        setVehiclesJoin(data?.procedures);
        setTotalListCar(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetProceduresPending = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab1({ page_num, page_size });

      const params = {
        procedure_id: procedureId,

        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };

      const { data, status } = await actionGetProceduresPending(params);
      if (status === 200) {
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

  const handleGetCarRequestList = async () => {
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
        setTotalListCar(data?.procedures.length);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleRejectProcedure = async (id, description) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApprove(id, 2, { description });

      if (status === 200) {
        const params = {
          procedure_id: procedureId,
          vehicle_id: vehicleId,
          detail_status_id: statusSelectedTb1,
          time_start: dayjs(timeStart).startOf("D").unix(),
          time_end: dayjs(timeEnd).endOf("D").unix(),
          name: nameSeach,
        };

        const { data: updatedData, status: updatedStatus } =
          await actionGetProceduresPending(params);

        if (updatedStatus === 200) {
          message.success(data?.message);
          setProcedures(updatedData?.procedures);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCancleProcedure = async (procedure_id, description) => {
    setSpinning(true);
    try {
      const params = {
        status_id: statusSelectedTb2,
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

  const handleGetVehicles = async () => {
    setSpinning(true);
    try {
      const { data, status } = await actionGetVehicles();

      if (status === 200) {
        setVehicles(data);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetVehiclesJoin = async () => {
    setSpinning(true);

    try {
      const params = {
        status_id: statusSelectedTb3,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        name: nameSeach,
      };
      const { data, status } = await actionGetStatusTripDetails(params);
      if (status === 200) {
        setVehiclesJoin(data?.procedures);
        setTotalJoin(data?.total);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

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
      width: 100,
      title: "Tên xe",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
      align: "center",
    },
    {
      width: 180,
      title: "Địa điểm làm việc",
      dataIndex: "destination",
      key: "destination",
      align: "center",
    },
    {
      width: 170,
      title: "Thời gian đi (dự kiến)",
      dataIndex: "time_start",
      key: "time_start",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      width: 150,
      title: "Người lái xe",
      dataIndex: "driver_name",
      key: "driver_name",
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
            statusClass = "process--success ";
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
      width: 150,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {r?.status_code === "D_CONFIRMED" &&
            r?.details.length > 1 &&
            r?.driver === userLogin?.id && (
              <Button
                onClick={() => setProcessingProcedure(r)}
                className="btn-with-icon "
                type="primary"
              >
                <IoCarSportOutline />
                <span className="btn-text">Kết thúc chuyến</span>
              </Button>
            )}
          {v === "PENDING" && r?.approved_by === userLogin?.id && (
            <>
              <Button
                onClick={() => {
                  setApproveProcedure(r);
                  setDriver(r.driver_name);
                }}
                className="btn-with-icon"
                type="primary"
              >
                <GiConfirmed />
                <span className="btn-text">Xác nhận</span>
              </Button>

              <Button
                type="cancel"
                className="btn-with-icon"
                onClick={() => setRejectProcedureId(r?.id)}
              >
                <MdOutlineCancel />
                <span className="btn-text">Từ chối</span>
              </Button>
            </>
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
      width: 100,
      title: "Tên xe",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
      align: "center",
    },
    {
      width: 180,
      title: "Địa điểm làm việc",
      dataIndex: "destination",
      key: "destination",
      align: "center",
    },
    {
      width: 170,
      title: "Thời gian đi (dự kiến)",
      dataIndex: "time_start",
      key: "time_start",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      width: 150,
      title: "Người lái xe",
      dataIndex: "driver_name",
      key: "driver_name",
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
  ].concat([
    {
      width: 240,
      title: "",
      dataIndex: "status",
      key: "operator",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {["D_CONFIRMED", "PENDING"].includes(r?.status_code) && (
            <Button
              type="cancel"
              onClick={() => setProcedureIdCancel(r?.id)}
              className="btn-with-icon"
            >
              <RiDeleteBinLine />
              <span className="btn-text">Hủy đơn</span>
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
      width: 100,
      title: "Tên xe",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
      align: "center",
    },
    {
      width: 180,
      title: "Địa điểm làm việc",
      dataIndex: "destination",
      key: "destination",
      align: "center",
    },
    {
      width: 170,
      title: "Thời gian đi (dự kiến)",
      dataIndex: "time_start",
      key: "time_start",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      width: 150,
      title: "Người lái xe",
      dataIndex: "driver_name",
      key: "driver_name",
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

  const columns4 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, index) =>
        index + 1 + (paginationTab4.page_num - 1) * paginationTab4.page_size,
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
      width: 100,
      title: "Tên xe",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
      align: "center",
    },
    {
      width: 180,
      title: "Địa điểm làm việc",
      dataIndex: "destination",
      key: "destination",
      align: "center",
    },
    {
      width: 170,
      title: "Thời gian đi (dự kiến)",
      dataIndex: "time_start",
      key: "time_start",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      width: 150,
      title: "Người lái xe",
      dataIndex: "driver_name",
      key: "driver_name",
      align: "center",
    },
    {
      width: 100,
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
    },
    {
      width: 50,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <>
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={() => {
                setShowProcessingModal(r);
              }}
              className="btn-with-icon"
            >
              <MdOutlineRemoveRedEye />
              <span className="btn-text">Xem trạng thái</span>
            </Button>
          </Space>
        </>
      ),
      align: "center",
    },
  ];
  
  const handleTabChange = (key) => {
    setTab(tabKey);
    window.history.pushState(null, null, `?tabKey=${key}`);
  };


  const Tab1 = () => (
    <Row gutter={[8, 8]}>
      <Col>
        <Button
          type="primary"
          className="btn-with-icon "
          onClick={() =>
            handleExportToExcelProduce(
              procedures.filter((item) => {
                return (
                  item.status_code == "PENDING" || item.status_code == 'D_CONFIRMED' 
                );
              })
            )
          }
        >
          <TbTableExport />
          <span className="btn-text"> Xuất Excel</span>
        </Button>
      </Col>

      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          dataSource={
            procedures.filter((item) => {
              return (
                item.status_code == "PENDING" || item.status_code == 'D_CONFIRMED' 
              
              );
            })
          }
          rowKey={(r) => r.id}
          columns={columns1}
          onRow={(r) => ({
            onClick: () => setOpenDetailModal(r),
          })}
          pagination={{
            current: paginationTab1.page_num,
            pageSize: paginationTab1.page_size,
            onChange: handlePendingProcedureChangePage,
            total: totalProduce,
          }}
          scroll={{ x: 2000 }}
        />
      </Col>
    </Row>
  );

  const Tab2 = () => (
    <Row gutter={[8, 8]}>
      {userLogin.position_code !== "GIAM_DOC" && (
        <Col>
          <Button
            onClick={() => setAddProcedureModal(true)}
            className="btn-with-icon "
            type="primary"
          >
            <MdAddCircleOutline />
            <span className="btn-text"> Đề xuất xin xe</span>
          </Button>
        </Col>
      )}

      <Col>
        <Select
          className="w-full"
          placeholder="Chọn trạng thái"
          onChange={(v) => {
            // window.navigatePage('vehicle-procedure')
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

      <Button
        type="primary"
        className="btn-with-icon "
        onClick={() => handleExportToExcelProduce(listCars)}
      >
        <TbTableExport />
        <span className="btn-text">Xuất Excel</span>
      </Button>

      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          dataSource={listCars}
          rowKey={(r) => r.id}
          columns={columns2}
          onRow={(r) => ({
            onClick: () => setOpenDetailModal(r),
          })}
          pagination={{
            current: paginationTab2.page_num,
            pageSize: paginationTab2.page_size,
            onChange: handleCarChangePage,
            total: totalListCar,
          }}
          scroll={{ x: 1280 }}
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
          onChange={(v) => {
            // window.navigatePage('vehicle-procedure')
            setStatusSelectedTb3(v);
          }}
          allowClear
          value={statusSelectedTb3}
        >
          {statusProcedures.map((item) => (
            <Select.Option key={item?.id} value={item?.id}>
              {item?.name}
            </Select.Option>
          ))}
        </Select>
      </Col>

      <Button
        className="btn-with-icon "
        onClick={() => handleExportToExcelProduce(vehiclesJoin)}
        type="primary"
      >
        <TbTableExport />
        <span className="btn-text">Xuất Excel</span>
      </Button>

      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          dataSource={vehiclesJoin}
          rowKey={(r) => r.id}
          columns={columns3}
          onRow={(r) => ({
            onClick: () =>setOpenDetailModal(r),
          })}
          pagination={{
            pageSize: paginationTab3.page_size,
            current: paginationTab3.page_num,
            onChange: handleCarChangePage3,
            total: totalJoin,
          }}
          scroll={{ x: 1280 }}
        />
      </Col>
    </Row>
  );

  const Tab4 = () => (
    <>
      <Row gutter={[8, 8]}>
        <Col>
          <Select
            className="w-full"
            placeholder="Chọn trạng thái"
            onChange={(v) => {
              setStatusSelectedTb4(v);
              handleStatusChange(v);
            }}
            allowClear
            value={statusSelectedTb4}
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
            type="primary"
            className="btn-with-icon "
            onClick={() =>
              handleExportToExcelProduce(
                selectedStatus !== null
                  ? filteredProcedures
                  : proceduresFinished
              )
            }
          >
            <TbTableExport />
            <span className="btn-text">Xuất Excel</span>
          </Button>
        </Col>

        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            dataSource={
              selectedStatus !== null ? filteredProcedures : proceduresFinished
            }
            rowKey={(r) => r.id}
            columns={columns4}
            onRow={(r) => ({
              onClick: () => setOpenDetailModal(r),
            })}
            pagination={{
              current: paginationTab4.page_num,
              pageSize: paginationTab4.page_size,
              total: totalProduceFinished,
              onChange: handleFinishedProcedureChangePage,
            }}
            scroll={{ x: 2200 }}
          />
        </Col>
      </Row>
    </>
  );

  const TabItem = [
    {
      key: "tab-1",
      label: "Danh sách chờ duyệt",
      children: <Tab1 />,
    },
    {
      key: "tab-2",
      label: "Danh sách thực hiện",
      children: <Tab4 />,
    },
    userLogin.position_code !== "GIAM_DOC" && {
      key: "tab-3",
      label: "Danh sách xin xe",
      children: <Tab2 />,
    },
    {
      key: "tab-4",
      label: "Danh sách chuyến đi",
      children: <Tab3 />,
    },
  ];

  useEffect(() => {
    handleGetVehicles();
    handleGetStatusProceduresDetails();
    handleGetStatusProcedures();
  }, []);

  useEffect(() => {
    handleGetProceduresPending(1, 10);
  }, [procedureId, timeStart, timeEnd, statusSelectedTb1, nameSeach]);

  useEffect(() => {
    handleGetCarRequestList();
  }, [procedureId, timeStart, timeEnd, statusSelectedTb2, nameSeach]);

  useEffect(() => {
    handleGetVehiclesJoin();
  }, [procedureId, timeStart, timeEnd, statusSelectedTb3, nameSeach]);

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
                      window.navigatePage("vehicle-procedure");
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
                      window.navigatePage("vehicle-procedure");
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
            defaultActiveKey={tab}
            onChange={handleTabChange}
          />
        </div>
      </SpinCustom>

      <>
        {addProcedure && (
          <AddProcedure
            vehicles={vehicles}
            onClose={() => {
              setAddProcedureModal(false);
            }}
            setListCars={setListCars}
          />
        )}

        {rejectProcedureId && (
          <RejectProcedureModal
            onCancel={() => setRejectProcedureId(null)}
            onRejection={(description) => {
              handleRejectProcedure(rejectProcedureId, description);
              setRejectProcedureId(null);
            }}
          />
        )}

        {approveProcedure && (
          <ApproveProcedureModal
            driver={driver}
            approveProcedure={approveProcedure}
            onClose={() => {
              setApproveProcedure(null);
            }}
            setProcedures={setProcedures}
          />
        )}

        {procedureIdCancel && (
          <RejectProcedureModal
            onCancel={() => setProcedureIdCancel(null)}
            onRejection={(description) => {
              handleCancleProcedure(procedureIdCancel, description);
              setProcedureIdCancel(null);
            }}
          />
        )}

        {processingProcedure && (
          <ConfirmProcedureModal
            vehicles={vehicles}
            processingProcedure={processingProcedure}
            setProcedures={setProcedures}
            handleGetProcedures={handleGetProceduresPending}
            onClose={() => {
              setProcessingProcedure(null);
            }}
          />
        )}

        {showProcessingModal && (
          <ProcedureProcessing
            record={showProcessingModal}
            onCancel={() => {
              setShowProcessingModal(null);
            }}
          />
        )}

        {isOpenDetailModal && (
          <DetailProcedureModal
            isOpenDetailModal={isOpenDetailModal}
            onClose={() => {
              setOpenDetailModal(false);
            }}
          />
        )}
      </>
    </Layout>
  );
};

export default Procedure;
