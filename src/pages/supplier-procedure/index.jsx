import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { useSelector } from "react-redux";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import AddProcedureModal from "./components/addProcedureModal";
import { RejectProcedureModal } from "components";
import { useSearchParams } from "react-router-dom";
import ProcedureDetailModal from "./components/procedureDetailModal";
import moment from "moment";
import dayjs from "dayjs";
import ExportPdfModal from "./components/exportPdf";
import { DEATAIL_STATUS } from "utils/constants/config";
import ApproveProcedureModal from "./components/approveProcedureModal";
import ShowProcessingModal from "./components/showProcessingModal";
import {
  actionGetPendingGeneralPurchaseProcedures,
  actionApproveGeneralPurchaseProcedure,
  actionCreateGeneralPurchaseProcedure,
  actionCanCelProcedure,
  actionGetStatusProcedures,
  actionGetSupplierProcedures,
} from "./actions";

import { GiConfirmed } from "react-icons/gi";
import { MdAddCircleOutline, MdOutlineCancel } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
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
import { actionCanCelProcedureSupllier } from "../general-purchase-procedure/actions";
import AddQuoteProcedure from "./components/addQuoteModal";

const SupplierProcedure = () => {
  const [spinning, setSpinning] = useState(false);
  const userLogin = useSelector((state) => state?.profile);
  const proceduresDetailStatus = useSelector(
    (state) => state?.proceduresDetailStatus
  );
  const [searchParams] = useSearchParams();
  //id
  const [approveProcedureId, setApproveProcedureId] = useState();
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();
  const procedureId = searchParams.get("procedure_id");
  //status
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusProceduresRequested, setStatusProceduressRequested] = useState(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState(null);
  //procedure
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [quoteModal, setQuoteModal] = useState(false);
  const [isRecordShowDetail, setRecordShowDetail] = useState();
  const [recordShowProcessing, setRecordShowProcessing] = useState();
  const [dataExport, setDataExport] = useState();
  //filter time
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));
  const [filteredDataTb3, setFilteredDataTb3] = useState([]);
  //procedure
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);
  const [proceduresFinished, setProceduressFinished] = useState([]);
  // table 1
  const [dataTb1, setDataTb1] = useState([]);
  const [totalRecordTb1, setTotalRecordTb1] = useState(0);
  // const [statusSelectedTb1, setStatusSelectedTb1] = useState();
  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });
  // table 2
  const [dataTb2, setDataTb2] = useState([]);
  const [totalRecordTb2, setTotalRecordTb2] = useState(0);
  const [statusSelectedTb2, setStatusSelectedTb2] = useState();
  const [paginationTab2, setPaginationTab2] = useState({
    page_num: 1,
    page_size: 10,
  });
  // table 3
  const [statusSelectedTb3, setStatusSelectedTb3] = useState();

  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });
  const tab = searchParams.get("tabKey");
  const [tabKey, setTabKey] = useState(tab || "tab-1");

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

  const handleGetPendingGeneralPurchaseProcedures = async (
    page_num,
    page_size
  ) => {
    setSpinning(true);
    try {
      setPaginationTab1({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingGeneralPurchaseProcedures(
        params
      );

      if (status === 200) {
        setDataTb1(data?.procedures);
        setProceduressFinished(
          data?.procedures.filter(
            (item) =>
              item.detail_status_id !== DEATAIL_STATUS.PENDING &&
              (item.status_id === DEATAIL_STATUS.SUCCESS ||
                item.status_id === DEATAIL_STATUS.CANCEL)
          )
        );
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

  const handleOptionChange = (selectedOption) => {
    setFilteredDataTb3(
      filteredDataTb3.filter(
        (item) => item.detail_status_id === selectedOption - 1
      )
    );
  };

  const handleGetStatusProcedures = async () => {
    try {
      const { data, status } = await actionGetStatusProcedures();
      if (status === 200) {
        const newData1 = data.slice(2, 4);
        setStatusProceduress(newData1);
        const newData2 = data.slice(0, 1).concat(data.slice(2));
        setStatusProceduressRequested(newData2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetSupplierProcedures = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetSupplierProcedures(params);

      if (status === 200) {
        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleApproveGeneralPurchaseProcedure = async (
    procdect_id,
    isStatus,
    description
  ) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApproveGeneralPurchaseProcedure(
        procdect_id,
        isStatus,
        { description }
      );
      if (status === 200) {
        message.success(data?.message);

        // get new data
        handleGetPendingGeneralPurchaseProcedures(1, 10);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCreateGeneralPurchaseProcedure = async (req) => {
    setSpinning(true);
    setOpenAddModal(false);
    try {
      const { data, status } = await actionCreateGeneralPurchaseProcedure({
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
  //       // detail_status_id: statusSelectedTb1,
  //       time_start: dayjs(timeStart).startOf("D").unix(),
  //       time_end: dayjs(timeEnd).endOf("D").unix(),
  //     };

  //     const { data, status } = await actionGetPendingGeneralPurchaseProcedures(
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

      const { data, status } = await actionGetSupplierProcedures(params);

      if (status === 200) {
        setDataExport(data?.procedures);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
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

      const { data, status } = await actionGetPendingGeneralPurchaseProcedures(
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

  const handleFinishedProcedureChangePage = async (page_num, page_size) => {
    setPaginationTab3({ page_num, page_size });
    setSpinning(true);
    try {
      const params = {
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingGeneralPurchaseProcedures(
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

      const { data, status } = await actionCanCelProcedureSupllier(
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

  const handleSelectedTabKey = (e) => {
    setTabKey(e);
    window.history.pushState(null, null, `?tabKey=${e}`);
  };

  const columns = [
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
  ];

  const columns1 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
    },
  ]
    .concat(columns)
    .concat([
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
                  className="btn-with-icon "
                  onClick={() => setRejectProcedureId(r?.id)}
                  type="cancel"
                >
                  <MdOutlineCancel /> <span className="btn-text">Từ chối</span>
                </Button>
              </>
            )}

            {
              <>
                <Button
                  className="btn-with-icon "
                  onClick={() => setRecordShowProcessing(r)}
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
      render: (v, r, i) =>
        i + 1 + (paginationTab2.page_num - 1) * paginationTab2.page_size,
    },
  ]
    .concat(columns)
    .concat([
      {
        width: 180,
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
                className="btn-with-icon "
                onClick={() => setProcedureIdCancel(r?.id)}
                type="cancel"
              >
                <RiDeleteBinLine /> <span className="btn-text">Hủy</span>
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
      render: (v, r, i) =>
        i + 1 + (paginationTab3.page_num - 1) * paginationTab3.page_size,
    },

    {
      title: "Người thực hiện",
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

  const Tab1 = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col>
          <Button
            className="pdf-btn btn-with-icon"
            type="primary"
            onClick={() =>
              setDataExport(
                dataTb1.filter((item) => {
                  return (
                    item.detail_status_id === DEATAIL_STATUS.PENDING ||
                    (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                      item.status_id === DEATAIL_STATUS.PENDING)
                  );
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
            scroll={{ x: 1024 }}
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
            onClick={() => setQuoteModal(true)}
            type="primary"
          >
            <MdAddCircleOutline /> <span className="btn-text">Đề xuất</span>
          </Button>
        </Col>
      )}

      {statusProceduresRequested && (
        <Col>
          <Select
            className="w-full"
            placeholder="Chọn trạng thái"
            allowClear
            onChange={(v) => {
              setStatusSelectedTb2(v);
            }}
            value={statusSelectedTb2}
          >
            {statusProceduresRequested.map((item) => (
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
            onChange: handleGetSupplierProcedures,
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
                setStatusSelectedTb3(v);
                handleOptionChange(v);
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
  ];

  useEffect(() => {
    handleGetPendingGeneralPurchaseProcedures(1, 10);
  }, [procedureId, timeStart, timeEnd]);
  useEffect(() => {
    handleGetStatusProcedures();
  }, []);

  useEffect(() => {
    if (userLogin.position_code !== "GIAM_DOC") {
      handleGetSupplierProcedures(1, 10);
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
            onTabClick={(e) => handleSelectedTabKey(e)}
            defaultActiveKey={tabKey}
          />
        </div>
      </SpinCustom>

      <>
        {isOpenAddModal && (
          <AddProcedureModal
            onCancel={() => setOpenAddModal(false)}
            onSubmit={handleCreateGeneralPurchaseProcedure}
            title={"Đề xuất chung"}
          />
        )}

        {recordShowProcessing && (
          <ShowProcessingModal
            record={recordShowProcessing}
            onCancel={() => setRecordShowProcessing(null)}
          />
        )}

        {isRecordShowDetail && (
          <ProcedureDetailModal
            onCancel={() => setRecordShowDetail(null)}
            record={isRecordShowDetail}
          />
        )}

        {approveProcedureId && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureId(null);
            }}
            onOk={(description) => {
              handleApproveGeneralPurchaseProcedure(
                approveProcedureId,
                1,
                description
              );
              setApproveProcedureId(null);
            }}
          />
        )}

        {rejectProcedureId && (
          <RejectProcedureModal
            onCancel={() => setRejectProcedureId(null)}
            onRejection={(description) => {
              handleApproveGeneralPurchaseProcedure(
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

        {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
          />
        )}
        {quoteModal && (
        <AddQuoteProcedure
          onCancel={() => setQuoteModal(false)}
          quoteModal={quoteModal}
          setDataTb2={setDataTb2}
        />
      )}
      </>
    </Layout>
  );
};

export default SupplierProcedure;
