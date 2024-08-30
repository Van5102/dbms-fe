import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { useSelector } from "react-redux";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import dayjs from "dayjs";
import { DEATAIL_STATUS } from "utils/constants/config";
import ApproveProcedureModal from "./components/approveProcedureModal";
import ShowProcessingModal from "./components/showProcessingModal";
import {
  RejectProcedureModal,
  DetailProcurementModal,
  AddProcurementProcedure,
  ExportPdfProcurementModal,
} from "components";

import {
  actionGetProcurementProcedures,
  actionGetPendingProcurementProcedures,
  actionApproveProcurementProcedure,
  actionCreateProcurementProcedure,
  actionCanCelProcedure,
  actionGetStatusProcedures,
  actionGetImplementerPendingProcurementProposalProcedures,
} from "./actions";
import { MdOutlineAttachMoney } from "react-icons/md";

import {
  Layout,
  Table,
  Select,
  Row,
  Col,
  Button,
  Space,
  Tabs,
  DatePicker,
  message,
} from "antd";

import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdAddCircleOutline } from "react-icons/md";

const ProcurementProposal = () => {
  const [spinning, setSpinning] = useState(false);
  const userLogin = useSelector((state) => state?.profile);

  //status
  const procedureStatus = useSelector((state) => state?.procedureStatus);
  const proceduresDetailStatus = useSelector(
    (state) => state?.proceduresDetailStatus
  );
  const [searchParams] = useSearchParams();
  const procedureId = searchParams.get("procedure_id");
  const [statusProcedures, setStatusProceduress] = useState([]);

  //id
  const [approveProcedureId, setApproveProcedureId] = useState();
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();

  //modal
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isRecordShowDetail, setRecordShowDetail] = useState();

  const [recordShowProcessing, setRecordShowProcessing] = useState();

  //export
  const [dataExport, setDataExport] = useState();
  const [selectedStatus, setSelectedStatus] = useState(null);

  //filter
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));

  //procedure
  const [proceduresFinished, setProceduressFinished] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);

  // table 1
  const [dataTb1, setDataTb1] = useState([]);
  const [totalRecordTb1, setTotalRecordTb1] = useState(0);
  const [statusSelectedTb1, setStatusSelectedTb1] = useState(1);

  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });
  const tab = searchParams.get("tabKey");

  const [tabKey, setTabKey] = useState(tab || "tab-1");

  // table 3
  const [dataTb3, setDataTb3] = useState([]);
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();

  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });

  // table 2
  const [dataTb2, setDataTb2] = useState([]);
  const [totalRecordTb2, setTotalRecordTb2] = useState(0);
  const [statusSelectedTb2, setStatusSelectedTb2] = useState();
  //tab4
  const [paginationTab4, setPaginationTab4] = useState({
    page_num: 1,
    page_size: 10,
  });
  const [totalRecordTb4, setTotalRecordTb4] = useState(0);

  //Nguoi thuc hien
  const [implementerProcedures, setImplementerProcedures] = useState([]);

  const [totalProduceFinished, setTotalProduceFinished] = useState(0);

  const [paginationTab2, setPaginationTab2] = useState({
    page_num: 1,
    page_size: 10,
  });
  const [approveProcedureIdPrice, setApproveProcedureIdPrice] = useState();

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

  const handlePendingProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab1({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingProcurementProcedures(
        params
      );
      if (status == 200) {
        setDataTb1(data?.procedures);
        setTotalRecordTb1(
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
      };

      const { data, status } = await actionGetPendingProcurementProcedures(
        params
      );
      if (status === 200) {
        setDataTb1(data?.procedures);
        setTotalRecordTb1(
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

  const handleGetPendingProcurementProposal = async (page_num, page_size) => {
    try {
      setPaginationTab1({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingProcurementProcedures(
        params
      );

      if (status === 200) {
        setDataTb1(data?.procedures);
        setTotalRecordTb1(
          data?.procedures.filter((item) => {
            return (
              item.detail_status_id === DEATAIL_STATUS.PENDING ||
              (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                item.status_id === DEATAIL_STATUS.PENDING)
            );
          }).length
        );
        setProceduressFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.SUPPLIER ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetProcurementProposal = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetProcurementProcedures(params);

      if (status === 200) {
        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleApproveProcurementProposal = async (
    procdect_id,
    isStatus,
    description
  ) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApproveProcurementProcedure(
        procdect_id,
        isStatus,
        { description }
      );
      if (status === 200) {
        message.success(data?.message);

        // get new data
        handleGetPendingProcurementProposal(1, 10);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCreateProcurementProposal = async (req) => {
    setSpinning(true);
    setOpenAddModal(false);
    try {
      const { data, status } = await actionCreateProcurementProcedure({
        equipments: req,
      });

      if (status === 200) {
        message.success(data?.message);
        setDataTb2(data?.procedures);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  // const handleExportPdfTb1 = async () => {
  //   setSpinning(false);
  //   try {
  //     const params = {
  //       procedure_id: procedureId || null,
  //       detail_status_id: statusSelectedTb1,
  //       time_start: dayjs(timeStart).startOf("D").unix(),
  //       time_end: dayjs(timeEnd).endOf("D").unix(),
  //     };

  //     const { data, status } = await actionGetPendingProcurementProcedures(
  //       params
  //     );

  //     if (status === 200) {
  //       setDataExport(data?.procedures);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setSpinning(false);
  // };

  const handleExportPdfTb2 = async () => {
    setSpinning(false);
    try {
      const params = {
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetProcurementProcedures(params);

      if (status === 200) {
        setDataExport(data?.procedures);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCancleProcedure = async (procedure_id, description) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num: 1, page_size: 10 });

      const params = {
        page_num: 1,
        page_size: 10,
        procedure_id: procedureId || null,
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
        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  //function show list nguoi thuc hien
  const handleGetListImplementer = async (page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab4({ page_num, page_size });

      const params = {
        // page_num: procedurePagination.page_num,
        // page_size: procedurePagination.page_size,
        detail_status_id: DEATAIL_STATUS.SUPPLIER,
        page_num,
        page_size,
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };
      const { data, status } =
        await actionGetImplementerPendingProcurementProposalProcedures(params);
      if (status === 200) {
        setImplementerProcedures(data?.procedures);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetListImplementerChangePage = async (page_num, page_size) => {
    setPaginationTab4({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        detail_status_id: DEATAIL_STATUS.SUPPLIER,
        page_num,
        page_size,
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } =
        await actionGetImplementerPendingProcurementProposalProcedures(params);
      if (status === 200) {
        // setDataTb1(data?.procedures);
        setTotalRecordTb4(data?.procedures.length);
      }
    } catch (error) {
      console.log(error);
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
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
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
          case "SUPPLIER":
            statusClass = "process--success";
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
      width: 250,

      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {v === "PENDING" && r?.approved_by === userLogin?.id && (
            <>
              <Button
                className="btn-with-icon success-btn"
                onClick={() => setApproveProcedureId(r?.id)}
                type="primary"
              >
                <GiConfirmed />
                <span className="btn-text">Xác nhận</span>
              </Button>

              <Button
                className="btn-with-icon danger-btn"
                onClick={() => setRejectProcedureId(r?.id)}
                type="cancel"
              >
                <MdOutlineCancel />
                <span className="btn-text">Từ chối</span>
              </Button>
            </>
          )}
         
          {
            <>
              <Button
                className="btn-with-icon "
                onClick={() => setRecordShowProcessing(r)}
              >
                <MdOutlineRemoveRedEye />
                <span className="btn-text">Xem trạng thái</span>
              </Button>

              <Button
                className="btn-with-icon pdf-btn"
                onClick={() => setDataExport([r])}
                type="primary"
              >
                <TbFileExport /> <span className="btn-text">Xuất PDF</span>
              </Button>
            </>
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
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
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
      width: 150,
      title: "",
      dataIndex: "status",
      key: "operator",
      align: "center",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            className="btn-with-icon pdf-btn"
            onClick={() => setDataExport([r])}
            type="primary"
          >
            <TbFileExport /> <span className="btn-text">Xuất PDF</span>
          </Button>

          {r?.status_code === "PENDING" && (
            <Button
              className="btn-with-icon cancel-btn"
              type="cancel"
              onClick={() => setProcedureIdCancel(r?.id)}
            >
              <RiDeleteBinLine />
              <span className="btn-text">Hủy</span>
            </Button>
          )}

          <Button
            className="btn-with-icon "
            onClick={() => setRecordShowProcessing(r)}
          >
            <MdOutlineRemoveRedEye />{" "}
            <span className="btn-text">Xem trạng thái</span>
          </Button>
        </Space>
      ),
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
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
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
          case "SUPPLIER":
            statusClass = "process--waiting";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    },
    {
      width: 150,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <>
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              className="btn-with-icon "
              onClick={(e) => {
                e.stopPropagation();
                setRecordShowProcessing(r);
              }}
            >
              <MdOutlineRemoveRedEye />{" "}
              <span className="btn-text">Xem trạng thái</span>
            </Button>

            <Button
              className="btn-with-icon pdf-btn"
              onClick={() => setDataExport([r])}
              type="primary"
            >
              <TbFileExport /> <span className="btn-text">Xuất PDF</span>
            </Button>
          </Space>
        </>
      ),
      align: "center",
    },
  ];

  const columns4 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab4.page_num - 1) * paginationTab4.page_size,
    },

    {
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
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      width: 180,
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
          case "SUPPLIER":
            statusClass = "process--waiting";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    },
    {
      width: 150,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <>
          <Space onClick={(e) => e.stopPropagation()}>
            <Button
              className="btn-with-icon pdf-btn
                "
              onClick={() => setDataExport([r])}
              type="primary"
            >
              <TbFileExport /> <span className="btn-text">Xuất PDF</span>
            </Button>
          </Space>
        </>
      ),
      align: "center",
    },
  ];

  const Tab1 = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col>
          <Button
            className="btn-with-icon pdf-btn"
            type="primary"
            onClick={() =>
              setDataExport(
                dataTb1.filter((item) => {
                  return item.status_id === DEATAIL_STATUS.PENDING;
                })
              )
            }
          >
            <TbFileExport /> <span className="btn-text">Xuất PDF</span>
          </Button>
        </Col>

        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns1}
            dataSource={dataTb1.filter((item) => {
              return (
                item.detail_status_id === DEATAIL_STATUS.PENDING ||
                (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                  item.status_id === DEATAIL_STATUS.PENDING)
              );
            })}
            onRow={(r) => ({
              onClick: () => setRecordShowDetail(r),
            })}
            pagination={{
              current: paginationTab1.page_num,
              pageSize: paginationTab1.page_size,
              total: totalRecordTb1,
              onChange: handlePendingProcedureChangePage,
            }}
            scroll={{ x: 1324 }}
          />
        </Col>
      </Row>
    );
  };

  const Tab2 = () => (
    <Row gutter={[8, 8]}>
      {userLogin.position_code !== "GIAM_DOC" && (
        <Col>
          <Button
            className="btn-with-icon request-btn"
            onClick={() => setOpenAddModal(true)}
            type="primary"
          >
            <MdAddCircleOutline /> <span className="btn-text">Đề xuất</span>
          </Button>
        </Col>
      )}

      {procedureStatus && (
        <Col>
          <Select
            className="w-full"
            placeholder="Chọn trạng thái"
            allowClear
            onChange={(v) => {
              window.navigatePage("procurement-proposal");
              setStatusSelectedTb2(v);
            }}
            value={statusSelectedTb2}
          >
            {procedureStatus.map((item) => (
              <Select.Option key={item?.id} value={item?.id}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}

      <Col>
        <Button
          className="btn-with-icon pdf-btn"
          onClick={handleExportPdfTb2}
          type="primary"
        >
          <TbFileExport /> <span className="btn-text">Xuất PDF</span>
        </Button>
      </Col>

      <Col span={24}>
        <Table
          className="tb-click-row"
          width="100%"
          rowKey={(r) => r.id}
          columns={columns2}
          dataSource={dataTb2}
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r),
          })}
          pagination={{
            current: paginationTab2.page_num,
            pageSize: paginationTab2.page_size,
            total: totalRecordTb2,
            onChange: handleGetProcurementProposal,
          }}
          scroll={{ x: 1024 }}
        />
      </Col>
    </Row>
  );

  const Tab3 = () => {
    return (
      <Row gutter={[8, 8]}>
        {proceduresDetailStatus && (
          <Col>
            <Select
              className="w-full"
              placeholder="Chọn trạng thái"
              allowClear
              onChange={(v) => {
                window.navigatePage("procurement-proposal");
                setStatusSelectedTb1(v);
                handleStatusChange(v);
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
        )}

        <Col>
          <Button
            className="btn-with-icon pdf-btn"
            onClick={() =>
              setDataExport(
                selectedStatus !== null
                  ? filteredProcedures
                  : proceduresFinished
              )
            }
            type="primary"
          >
            <TbFileExport /> <span className="btn-text">Xuất PDF</span>
          </Button>
        </Col>

        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns3}
            dataSource={
              selectedStatus !== null ? filteredProcedures : proceduresFinished
            }
            onRow={(r) => ({
              onClick: () => setRecordShowDetail(r),
            })}
            pagination={{
              current: paginationTab3.page_num,
              pageSize: paginationTab3.page_size,
              total: totalProduceFinished,
              onChange: handleFinishedProcedureChangePage,
            }}
            scroll={{ x: 1324 }}
          />
        </Col>
      </Row>
    );
  };

  const Tab4 = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Table
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns4}
            dataSource={implementerProcedures}
            onRow={(r) => ({
              onClick: () => setRecordShowDetail(r),
            })}
            pagination={{
              current: paginationTab4.page_num,
              pageSize: paginationTab4.page_size,
              total: totalRecordTb4,
              onChange: handleGetListImplementerChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </Col>
      </Row>
    );
  };

  const TabItem = [
    // (userLogin.position_code === "GIAM_DOC" ||
    //   userLogin.position_code === "P_GIAM_DOC" ||
    //   userLogin.position_code === "HANH_CHINH" ||
    //   userLogin.position_code === "TRUONG_PHONG" ||
    //   userLogin.position_code === "KE_TOAN" ||
    //   userLogin.position_code === "THU_QUY" ||
    //   userLogin.department_id === 6) &&
    {
      key: "tab-1",
      label: "Danh sách chờ duyệt",
      children: <Tab1 />,
    },

    // (userLogin.position_code === "GIAM_DOC" ||
    //   userLogin.position_code === "P_GIAM_DOC" ||
    //   userLogin.position_code === "HANH_CHINH" ||
    //   userLogin.position_code === "TRUONG_PHONG" ||
    //   userLogin.position_code === "KE_TOAN" ||
    //   userLogin.position_code === "THU_QUY" ||
    //   userLogin.department_id === 6) &&
    {
      key: "tab-2",
      label: "Danh sách thực hiện",
      children: <Tab3 />,
    },

    userLogin.position_code !== "GIAM_DOC" && {
      key: "tab-3",
      label: "Danh sách đã đề xuất",
      children: <Tab2 />,
    },
    {
      key: "tab-4",
      label: "Người thực hiện",
      children: <Tab4 />,
    },
  ];
  const handleSelectedTabKey = (e) => {
    if (tabKey) {
      window.history.pushState(null, null, `?tabKey=${tabKey}`);
    } else {
      setTabKey(e);
      window.history.pushState(null, null, `?tabKey=${e}`);
    }
  };
  useEffect(() => {
    handleGetStatusProcedures();
  }, []);
  useEffect(() => {
    handleGetListImplementer(1, 10);
  }, [procedureId, timeStart, timeEnd]);
  useEffect(() => {
    handleGetPendingProcurementProposal(1, 10);
  }, [procedureId, timeStart, timeEnd, statusSelectedTb1]);

  useEffect(() => {
    if (userLogin.position_code !== "GIAM_DOC") {
      handleGetProcurementProposal(1, 10);
    }
  }, [procedureId, timeStart, timeEnd, statusSelectedTb2]);

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
                      window.navigatePage("procurement-proposal");
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
                      window.navigatePage("procurement-proposal");
                      setTimeEnd(v);
                    }}
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
        {isOpenAddModal && (
          <AddProcurementProcedure
            onCancel={() => setOpenAddModal(false)}
            onSubmit={handleCreateProcurementProposal}
            title={"Đề xuất mua thiết bị"}
          />
        )}

        {approveProcedureId && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureId(null);
            }}
            onOk={(description) => {
              handleApproveProcurementProposal(
                approveProcedureId,
                1,
                description
              );
              setApproveProcedureId(null);
            }}
          />
        )}

        {recordShowProcessing && (
          <ShowProcessingModal
            showProcessingModal={recordShowProcessing}
            onClose={() => setRecordShowProcessing(null)}
          />
        )}

        {isRecordShowDetail && (
          <DetailProcurementModal
            onCancel={() => setRecordShowDetail(null)}
            record={isRecordShowDetail}
          />
        )}

        {rejectProcedureId && (
          <RejectProcedureModal
            onCancel={() => setRejectProcedureId(null)}
            onRejection={(description) => {
              handleApproveProcurementProposal(
                rejectProcedureId,
                2,
                description
              );
              setRejectProcedureId(null);
            }}
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

        {approveProcedureIdPrice && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureIdPrice(null);
            }}
            onOk={(description) => {
              handleApproveProcurementProposal(
                approveProcedureIdPrice,
                3,
                description
              );
              setApproveProcedureIdPrice(null);
            }}
          />
        )}

        {dataExport && (
          <ExportPdfProcurementModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
            title={"Mua thiết bị"}
          />
        )}
      </>
    </Layout>
  );
};
export default ProcurementProposal;
