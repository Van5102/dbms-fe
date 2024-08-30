import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import { RejectProcedureModal, SpinCustom } from "components";
import { useSelector } from "react-redux";
import { CHECK_GOODS_TYPE, DATETIME_FORMAT, DATE_FORMAT, PAYMENT_TYPE } from "utils/constants/config";
import { useSearchParams } from "react-router-dom";
import { LiaFileContractSolid } from "react-icons/lia";
import { TbTableExport } from "react-icons/tb";
import { IoOpenOutline } from "react-icons/io5";
import ListDevice from './components/listDevice'

import moment from "moment";
import dayjs from "dayjs";
import { DEATAIL_STATUS } from "utils/constants/config";
import AddProcedureModal from "./components/addProcedureModal";
import ExportPdfGoodsModal from "./components/exportPdfGoods";
import {
  actionGetPendingWareHouseProcedures,
  actionCreateGeneralPurchaseProcedure,
  actionCanCelProcedure,
  actionGetStatusProcedures,
  actionGetWarehouse,
  actionApproveWareHouseProcedure,
  actionGetImplementerPendingWareHouseProcedures,
  actionGetCheckingGoodsProcedures,
} from "./actions";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
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
  message,Input
} from "antd";
import ShowProcessingModal from "./components/showProcessingModal";
import ApproveProcedureModal from "./components/approveProcedureModal";
import {  InfoCircleOutlined } from "@ant-design/icons";
import AddCheckGoods from "./components/addCheckGoodsModal";
import PointUser from "./components/addPointUser";
import AddReportCheck from "./components/addReportCheckModal";
import ExportPdfContractModal from "./components/exportPdfContract";
import DetailFile from "./components/detailFile";
import ProcedureDetailModal from './components/procedureDetailModal';
import ProcedureDeviceDetailModal from './components/procedureDeviceDetailModal';

const ImportProcedure = () => {
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
  const [openDetail, setOpenDetail] = useState(false);

  //status
  const [statusProcedures, setStatusProceduress] = useState([]);
  const [statusProceduresRequested, setStatusProceduressRequested] = useState(
    []
  );
  const [selectedStatus, setSelectedStatus] = useState(null);

  //procedure
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [isOpenAddModal, setOpenAddModal] = useState(false);
  const [isRecordShowDetail, setRecordShowDetail] = useState();
  const [isRecordShowDeviceDetail, setRecordShowDeviceDetail] = useState();
  const [recordShowProcessing, setRecordShowProcessing] = useState();
  const [dataExportContract, setDataExportContract] = useState();
  const [dataExportGoods, setDataExportGoods] = useState();

  //filter time
  const [timeStart, setTimeStart] = useState(
    dayjs().startOf("day").subtract(30, "day")
  );
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"));
  const [filteredDataTb3, setFilteredDataTb3] = useState([]);
  const [procedurePagination, setProcedurePagination] = useState({
    page_num: 1,
    page_size: 10,
  });

  const [approveProcedureIdPrice, setApproveProcedureIdPrice] = useState();
  const [deviceSeach,setDeviceSeach] = useState();
  //procedure
  const [totalProduceFinished, setTotalProduceFinished] = useState(0);
  const [proceduresFinished, setProceduressFinished] = useState([]);
  // table 1
  const [dataTb1, setDataTb1] = useState([]);
  const [totalRecordTb1, setTotalRecordTb1] = useState(0);

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

  //add device

  // table 3

  const [statusSelectedTb3, setStatusSelectedTb3] = useState();

  const [paginationTab3, setPaginationTab3] = useState({
    page_num: 1,
    page_size: 10,
  });

  //tab4
  const [paginationTab4, setPaginationTab4] = useState({
    page_num: 1,
    page_size: 10,
  });
  const [totalRecordTb4, setTotalRecordTb4] = useState(0);

  //tab5
  const [paginationTab5, setPaginationTab5] = useState({
    page_num: 1,
    page_size: 10,
  });
  const [totalRecordTb5] = useState(0);
  const [point, setPoint] = useState(false);
  const [reportCheckRequest, setReportCheckRequest] = useState(false);


  //Nguoi thuc hien
  const [implementerProcedures, setImplementerProcedures] = useState([]);

  //kiểm hàng
  const [checkGoods, setCheckGoods] = useState(false);
  const [listCheckGoodsProcedures, setListCheckGoodsProcedures] = useState([]);


  const tab = searchParams.get("tabKey");

  
  const [tabKey, setTabKey] = useState(tab || "tab-1");


  const handleExportToExcelContract = async (data) => {

    const tmp = data?.map((e, index) => {
      return {
        STT: index + 1,
        "Người tạo": e?.created_by,
        "Thời gian tạo": moment(parseInt(e?.time_created) * 1000).format(
          DATETIME_FORMAT
        ),
        "Trạng thái đơn": e?.status,
        "Tên khách hàng": e?.customer_name,
        "Địa chỉ khách hàng": e?.customer_address,
        "Mô tả": e?.description || "chưa có",
        "Số hợp đồng	": e?.contract_number,
        "Loại thanh toán":
          PAYMENT_TYPE[e?.payment]
        ,
        "Thông tin liên hệ": e?.contact || "chưa có",

        "Ngày hợp đồng": moment(parseInt(e?.contract_day) * 1000).format(
          DATETIME_FORMAT
        ),
        "Ngày giao hàng": moment(parseInt(e?.delivery_day) * 1000).format(
          DATETIME_FORMAT
        ),
        "Email liên hệ	": e?.contract_email || "chưa có",
        "Hoá đơn GTGT": "Có" || "Không",
        "CO (PTM or NSX)": "Có" || "Không",
        "Packing list xóa giá": "Có" || "Không",
        "Tờ khai hải quan xóa giá": "Có" || "Không",
        "CQ NSX:	": "Có" || "Không",
        "Invoice xóa giá": "Có" || "Không",
        "Chứng từ khác:	": e?.receipt_defference || "Không",

        "Điều kiện thanh toán lần 1": e?.pay_t1 || "chưa có",
        "Điều kiện thanh toán lần 2": e?.pay_t2 || "chưa có",
        "Điều kiện thanh toán lần 3": e?.pay_t3 || "chưa có",
        "Điều kiện thanh toán lần 4": e?.pay_t4 || "chưa có",
        "Địa điểm giao hàng": e?.delivery_place || "chưa có",
        "SDT liên hệ HD:	": e?.contract_phone_number || "chưa có",
        "Thiết bị": e?.devices[0]?.device_name || "chưa có",
        "Số lượng": e?.devices[0]?.quantity || "chưa có",

      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_nhap_kho");
    XLSX.writeFile(workbook, "Danh_sach_nhap_kho.xlsx");
  };


  //xuat excel kiem hang
  const handleExportToExcelCheckGoods = async (data) => {

    const tmp = data?.map((e, index) => {
      return {
        STT: index + 1,

        "Người yêu cầu": e?.user_request_name,
        "Tên khách hàng": e?.customer_name,
        "Số hợp đồng mua": e?.contract_number,
        "Lô hàng	": e?.batch,
        "Số lượng	": e?.device_item,
        "Địa điểm kiểm hàng": e?.address_checking,
        "Kết quả kiểm hàng	": CHECK_GOODS_TYPE[e?.result_checking],


      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },

    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_kiem_hang");
    XLSX.writeFile(workbook, "Danh_sach_kiem_hang.xlsx");
  };

 

  //xuat excel nguoi thuc  hien
  const handleExportToPDFImplementer = async (data) => {

    const tmp = data?.map((e, index) => {
      return {
        STT: index + 1,
        "Người tạo": e?.created_by,
        "Thời gian tạo": moment(parseInt(e?.time_created) * 1000).format(
          DATETIME_FORMAT
        ),
        "Trạng thái đơn": e?.status,
        "Tên khách hàng": e?.customer_name,
        "Địa chỉ khách hàng": e?.customer_address,
        "Mô tả": e?.description || "chưa có",
        "Số hợp đồng	": e?.contract_number,
        "Loại thanh toán":
          PAYMENT_TYPE[e?.payment]
        ,
        "Thông tin liên hệ": e?.contact || "chưa có",

        "Ngày hợp đồng": moment(parseInt(e?.contract_day) * 1000).format(
          DATETIME_FORMAT
        ),
        "Ngày giao hàng": moment(parseInt(e?.delivery_day) * 1000).format(
          DATETIME_FORMAT
        ),
        "Email liên hệ	": e?.contract_email || "chưa có",
        "Hoá đơn GTGT": "Có" || "Không",
        "CO (PTM or NSX)": "Có" || "Không",
        "Packing list xóa giá": "Có" || "Không",
        "Tờ khai hải quan xóa giá": "Có" || "Không",
        "CQ NSX:	": "Có" || "Không",
        "Invoice xóa giá": "Có" || "Không",
        "Chứng từ khác:	": e?.receipt_defference || "Không",

        "Điều kiện thanh toán lần 1": e?.pay_t1 || "chưa có",
        "Điều kiện thanh toán lần 2": e?.pay_t2 || "chưa có",
        "Điều kiện thanh toán lần 3": e?.pay_t3 || "chưa có",
        "Điều kiện thanh toán lần 4": e?.pay_t4 || "chưa có",
        "Địa điểm giao hàng": e?.delivery_place || "chưa có",
        "SDT liên hệ HD:	": e?.contract_phone_number || "chưa có",
        "Người thực hiện:	": e?.implementer_name || "chưa có",

      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },

    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_thuc_hien_dx");
    XLSX.writeFile(workbook, "Danh_sach_nguoi_thuc_hien.xlsx");
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

  const handleGetPendingWareHouseProcedures = async (
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

      const { data, status } = await actionGetPendingWareHouseProcedures(
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

  const handleGetWareHouseProcedures = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab2({ page_num, page_size });

      const params = {
        procedure_id: procedureId || null,
        status_id: statusSelectedTb2,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetWarehouse(params);

      if (status === 200) {

        setDataTb2(data?.procedures);
        setTotalRecordTb2(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleApproveWareHouseProcedure = async (
    procdect_id,
    isStatus,
    implementer,
    description
  ) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApproveWareHouseProcedure(
        procdect_id,
        isStatus,
        { implementer },
        { description }
      );
      if (status === 200) {
        message.success(data?.message);
        // get new data
        handleGetPendingWareHouseProcedures(1, 10);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCreateWareHouseProcedure = async (req) => {
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

  const handleGetListImplementer = async (page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab4({ page_num, page_size });

      const params = {
        // page_num: procedurePagination.page_num,
        // page_size: procedurePagination.page_size,
        page_num,
        page_size,
        procedure_id: procedureId || null,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };
      const { data, status } =
        await actionGetImplementerPendingWareHouseProcedures(params);
      if (status === 200) {
        setImplementerProcedures(data?.procedures);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetListCheckGoods = async () => {
    setSpinning(true);

    try {

      const params = {
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        request_checking: null,
        warehouse_import: null
      };
      const { data, status } =
        await actionGetCheckingGoodsProcedures(params);
      if (status === 200) {
        setListCheckGoodsProcedures(data?.list_request);
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
        page_num,
        page_size,
        procedure_id: procedureId,
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } =
        await actionGetImplementerPendingWareHouseProcedures(params);
      if (status === 200) {
        // setDataTb1(data?.procedures);
        setTotalRecordTb4(data?.procedures.length);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetListCheckGoodsChangePage = async (page_num, page_size) => {

    setSpinning(true);
    try {
      setPaginationTab5({ page_num, page_size })
      const params = {
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
        request_checking: null,
        warehouse_import: null,
      };

      const { data, status } = await actionGetCheckingGoodsProcedures(params);
      if (status === 200) {
        setListCheckGoodsProcedures(data?.list_request);

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

      const { data, status } = await actionGetPendingWareHouseProcedures(
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

      const { data, status } = await actionGetPendingWareHouseProcedures(
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
                  className="btn-with-icon "
                  onClick={() => setApproveProcedureId(r?.id)}
                  type="primary"

                >
                  <GiConfirmed /> <span className="btn-text">Xác nhận</span>

                </Button>

                <Button
                  className="btn-with-icon danger-btn"
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


              </>
            }


            {
              <>

                <Button
                  className="pdf-btn btn-with-icon"
                  type="primary"
                  onClick={
                    () => setDataExportContract([r])

                  }

                >
                  <TbTableExport /> <span className="btn-text">Xuất PDF</span>
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


            {r?.status_code === "PENDING" && (
              <Button
                className="btn-with-icon cancel-btn"
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

            <Button
              className="pdf-btn btn-with-icon"
              type="primary"
              onClick={
                () => setDataExportContract([r])
              }

            >
              <TbTableExport /> <span className="btn-text">Xuất PDF</span>
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
              className="pdf-btn btn-with-icon"
              type="primary"
              onClick={
                () => setDataExportContract([r])

              }

            >
              <TbTableExport /> <span className="btn-text">Xuất PDF</span>
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
      render: (_v, r, i) =>
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


            {
              (r?.status_code === "SUCCESS" || r?.status_code === "SUPPLIER") && <Button
                className="btn-with-icon pdf-btn
                "
                onClick={() => setCheckGoods(r)}
                type="primary"
              >
                <InfoCircleOutlined />Kiểm hàng
              </Button>
            }

            <Button
              className="pdf-btn btn-with-icon"
              type="primary"
              onClick={
                () => setDataExportContract([r])
              }

            >
              <TbTableExport /> <span className="btn-text">Xuất PDF</span>
            </Button>

          </Space>
        </>
      ),
      align: "center",
    },
  ];

  const columns5 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab5.page_num - 1) * paginationTab5.page_size,
    },

    {
      width: 150,
      title: "Người yêu cầu",
      dataIndex: "user_request_name",
      key: "user_request_name",
      align: "center",
    },

    {
      width: 150,
      title: "Số hợp đồng mua",
      dataIndex: "contract_number",
      key: "contract_number",
      align: "center",
    },
    {
      width: 150,
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      align: "center",
    },
    {
      width: 150,
      title: "Hợp đồng đính kèm(PDF)",
      dataIndex: "contract_number_attached",
      key: "contract_number_attached",
      align: "center",
      render: (v, r) => (
        <Button
          className="btn-with-icon"
          onClick={(e) => {
            e.stopPropagation()
            setOpenDetail(r)
          
          }
          }
          type="primary"
        >
          <IoOpenOutline />
          <span className="btn-text">Mở</span>
        </Button>
      ),
    },
    {
      title: "Lô hàng",
      dataIndex: "batch",
      key: "batch",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "device_item",
      key: "device_item",
      align: "center",
    },
    {
      width: 150,
      title: "Người được chỉ định",
      dataIndex: "list_implementer",
      key: "list_implementer",
      render: (v, r) => r?.list_implementer.map((i) => i?.name).toLocaleString(),
      align: "center",
    },
    {
      width: 150,
      title: "Địa điểm kiểm hàng",
      dataIndex: "address_checking",
      key: "address_checking",
      align: "center",
    },
    {
      width: 150,
      title: "Kết quả kiểm hàng",
      dataIndex: "result_checking",
      key: "result_checking",
      render: (v) => CHECK_GOODS_TYPE[v],
      align: "center",
    },
   

    {
      width: 150,
      title: "",
      dataIndex: "detail_status_code",
      key: "operator",
      render: (v, r) => (
        <>
          {/* {console.log(r?.list_implementer)} */}
          <Space onClick={(e) => e.stopPropagation()}>

            {
              ((userLogin?.position_code === "TRUONG_PHONG" &&
                userLogin?.department_code === "PB1") ||
                userLogin?.position_code === "GIAM_DOC")
              &&
              <Button
                onClick={() => setPoint(r)}
              >
                
                Chỉ định
              </Button>

            }

            {r?.list_implementer.map(e => e.id).includes(userLogin?.id) &&
              <Button
                onClick={() => setReportCheckRequest(r)}
              >
                Kết quả
              </Button>

            }

            <Button
              className="pdf-btn btn-with-icon"
              type="primary"
              onClick={
                () => setDataExportGoods([r])
              }

            >
              <TbTableExport /> <span className="btn-text">Xuất PDF</span>
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
            onClick={
              () => handleExportToExcelContract(dataTb1.filter((item) => {
                return (
                  item.detail_status_id === DEATAIL_STATUS.PENDING ||
                  (item.detail_status_id === DEATAIL_STATUS.D_CONFIRMED &&
                    item.status_id === DEATAIL_STATUS.PENDING)
                );
              }))
            }
          >
            <TbTableExport /> <span className="btn-text">Xuất Excel</span>
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
      
      <Col>
        <Button
          type="primary"
          onClick={() => setOpenAddModal(true)}
          className="btn-with-icon"

        >
          <LiaFileContractSolid />
          Thêm hợp đồng
        </Button>
      </Col>
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
          onClick={

            () => { handleExportToExcelContract(dataTb2) }
          }
          type="primary"
        >
          <TbTableExport /> <span className="btn-text">Xuất Excel</span>
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
            current: procedurePagination.page_num,
            pageSize: procedurePagination.page_size,
            total: totalRecordTb2,
            onChange: handleGetWareHouseProcedures,
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
            type="primary"
       
            onClick={

              () => {
                handleExportToExcelContract(
                  selectedStatus !== null
                    ? filteredProcedures
                    : proceduresFinished
                )
              }
            }

          >
            <TbTableExport /> <span className="btn-text">Xuất Excel</span>
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

  const Tab4 = () => {
    return (
      <Row gutter={[8, 8]}>
        <Col>
          <Button
            className="pdf-btn btn-with-icon"
            type="primary"
            onClick={() =>
              handleExportToPDFImplementer(implementerProcedures)
            }
          >
            <TbTableExport /> <span className="btn-text">Xuất Excel</span>
          </Button>
        </Col>
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
  const Tab5 = () => {
    return (
      <Row gutter={[8, 8]}>
        {
          // userLogin?.position_code === "TRUONG_PHONG" &&
          //  userLogin.department_id === 6 &&
          <Col>
            <Button
              onClick={() =>
                handleExportToExcelCheckGoods(
                  listCheckGoodsProcedures
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
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns5}
            dataSource={listCheckGoodsProcedures}
            onRow={(r) => ({
              onClick: () => setRecordShowDeviceDetail(r),

            })}
            pagination={{
              current: paginationTab5.page_num,
              pageSize: paginationTab5.page_size,
              total: totalRecordTb5,
              onChange: handleGetListCheckGoodsChangePage,
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
    {
      key: "tab-5",
      label: "Danh sách kiểm hàng",
      children: <Tab5 />,
    },
    {
      key: "tab-6",
      label: "Danh sách thiết bị",
      children: <ListDevice
        setSpinning={setSpinning}
        deviceSeach={deviceSeach}
      />,
    },
  ];

 

  useEffect(() => {
    handleGetPendingWareHouseProcedures(1, 10);

  }, [procedureId, timeStart, timeEnd]);
  useEffect(() => {
    handleGetStatusProcedures();
    // handleGetDevice();
  }, []);
  useEffect(() => {
    handleGetListImplementer(1, 10);
  }, [procedureId, timeStart, timeEnd]);
  useEffect(() => {
    handleGetListCheckGoods();
  }, [
    // warehouse_import, request_checking,
    timeStart, timeEnd]);


  useEffect(() => {

    handleGetWareHouseProcedures(1, 10);
  }, [procedureId, timeStart, timeEnd, statusSelectedTb2]);

  // console.log(isRecordShowDetail);
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

            <>
            {tabKey === "tab-6" && (
              <Col className="filler--item">
                <Input.Search
                  onSearch={(v) => {
                    setDeviceSeach(v);
                  }}
                  placeholder="Nhập tên thiết bị..."
                  allowClear
                />
              </Col>
            )}
            </>
          </Row>

        </div>

        <div className="common-layout--content">
          <Tabs
            defaultActiveKey={tabKey}
            items={TabItem}
            onTabClick={(e) => handleSelectedTabKey(e)}
          />
        </div>
      </SpinCustom>

      <>
        {openDetail && (
          <DetailFile
            openDetail={openDetail}
            onCancel={() => setOpenDetail(false)}
          />
        )}
       
        {isOpenAddModal && (
          <AddProcedureModal
            onCancel={() => setOpenAddModal(null)}
            onSubmit={handleCreateWareHouseProcedure}
            title={"Đề xuất thực hiện hợp đồng"}
            // devices={devices}
            // setDevices={setDevices}
            setDataTb2={setDataTb2}
          />
        )}

        {approveProcedureIdPrice && (
          <ApproveProcedureModal
            onCancel={() => {
              setApproveProcedureIdPrice(null);
            }}
            onOk={(implementer, description) => {
              handleApproveWareHouseProcedure(
                approveProcedureIdPrice,
                3,
                implementer,
                description
              );
              setApproveProcedureIdPrice(null);
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
            onOk={(implementer, description) => {
              handleApproveWareHouseProcedure(
                approveProcedureId,
                1,
                implementer,
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
              handleApproveWareHouseProcedure(
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

        {checkGoods && (
          <AddCheckGoods
            checkGoods={checkGoods}
            onCancel={() => setCheckGoods(null)}
            setTabKey={setTabKey}
            setListCheckGoodsProcedures={setListCheckGoodsProcedures}
           
          />
        )}
        {reportCheckRequest && (
          <AddReportCheck
            reportCheckRequest={reportCheckRequest}
            onCancel={() => setReportCheckRequest(null)}
            // isRecordShowDeviceDetail={isRecordShowDeviceDetail}
            setListCheckGoodsProcedures={setListCheckGoodsProcedures}

          />
        )}

        {point && (
          <PointUser
            point={point}
            handleGetListCheckGoods={handleGetListCheckGoods}
            onCancel={() => setPoint(null)}

          />
        )}
        {
          isRecordShowDeviceDetail && (
            <ProcedureDeviceDetailModal
              onCancel={() => setRecordShowDeviceDetail(null)}
              record={isRecordShowDeviceDetail}
            />
          )
        }

        {dataExportContract && (
          <ExportPdfContractModal
            data={dataExportContract}
            onCancel={() => setDataExportContract(null)}
          />
        )}

        {dataExportGoods && (
          <ExportPdfGoodsModal
            data={dataExportGoods}
            onCancel={() => setDataExportGoods(null)}
          />
        )}


      </>
    </Layout>
  );
};

export default ImportProcedure;
