// imports page
import HomePage from "./home";
import LoginPage from "./login";
import FilePreviewPage from "./file-preview";
import Procedure from "./procedure";
import LeaveProcess from "./leaveProcess";
import ManageVehicles from "./vehicles";
import CommonDocument from "./common-document";
import DepartmentDocument from "./department_document";
import ProcurementProcedure from "./procurement-procedure";
import NotarizationProcedure from "./notarization-procedure";
import RecruitmentProcedure from "./recruitment-procedure";
import GeneralPurchaseProcedure from "./general-purchase-procedure";
import OfficeProcurementProcedure from "./office-procurement-procedure";
import OvertimeProcedure from "./overtime-procedure";
import ManagerKeeping from "./keepingtimes";
import PayRoll from "./payroll";
import PayRollV2 from "./payrollV2";
import SupplierProcedure from "./supplier-procedure";
import ImportProcedure from "./import-procedure";
import Evaluate from './evaluate';
import Contract from './contracts';
import ExportProcedure from "./export-procedure";
import Payment from "./payment";
import KeepingTimeV2 from "./keepingtimesV2";
// icons
import {
  UsergroupAddOutlined,
  FolderOutlined,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import LeaveProcessV2 from "./leaveProcessV2";


/** pages
 * page hiển thị trên menu thi có thêm 2 thuộc tính icon và label
 * page không hiển thị trên menu bỏ icon và lable
 */

const pages = [
  {
    name: "login",
    path: "/login",
    auth: false,
    element: <LoginPage />,
  },
  {
    name: "file-preview",
    path: "/file-preview/:fileId",
    auth: true,
    element: <FilePreviewPage />,
  },
  {
    name: "home",
    path: "/",
    auth: true,
    label: "Quản lý nhân viên",
    element: <HomePage />,
    icon: <UsergroupAddOutlined />,
  },
  {
    name: "document",
    path: "/document",
    auth: true,
    label: "Tài liệu",
    icon: <FolderOutlined />,
  },
  {
    name: "common-document",
    path: "/common-document",
    auth: true,
    label: "Tài liệu chung",
    element: <CommonDocument />,
    icon: null,
    parent: "document",
  },
  {
    name: "department-document",
    path: "/department-document",
    auth: true,
    label: "Tài liệu phòng ban",
    element: <DepartmentDocument />,
    icon: null,
    parent: "document",
  },
  {
    name: "procedure",
    path: "/procedure",
    auth: true,
    label: "Quản lý quy trình",
    icon: <IssuesCloseOutlined />,
  },
  {
    name: "evaluate",
    path: "/evaluate-procedure",
    auth: true,
    label: "Quy trình đánh giá",
    element: <Evaluate />,
    parent: "procedure",
  },
  {
    name: "vehicle-procedure",
    path: "/vehicle-procedure",
    auth: true,
    label: "Quy trình xin xe",
    element: <Procedure />,
    parent: "procedure",
  },
  {
    name: "leaveprocess",
    path: "/leaveprocess",
    auth: true,
    label: "Quy trình nghỉ phép",
    element: <LeaveProcess />,
    parent: "procedure",
  },
  // {
  //   name: "leaveprocessV2",
  //   path: "/leaveprocessV2",
  //   auth: true,
  //   label: "Quy trình nghỉ phép V2",
  //   element: <LeaveProcessV2 />,
  //   parent: "procedure",
  // },
  {
    name: "payment",
    path: "/payment",
    auth: true,
    label: "Tạm ứng-hoàn ứng-thanh toán",
    element: <Payment />,
    parent: "procedure",
  },
 
  {
    name: "overtime-procedure",
    path: "/overtime-procedure",
    auth: true,
    label: "Đề xuất làm thêm giờ",
    element: <OvertimeProcedure />,
    parent: "procedure",
  },
  {
    name: "recruitment-procedure",
    path: "/recruitment-procedure",
    auth: true,
    label: "Đề xuất tuyển dụng",
    element: <RecruitmentProcedure />,
    parent: "procedure",
  },
  {
    name: "general-purchase-procedure",
    path: "/general-purchase-procedure",
    auth: true,
    label: "Đề xuất chung",
    element: <GeneralPurchaseProcedure />,
    parent: "procedure",
  },
  {
    name: "office-procurement-procedure",
    path: "/office-procurement-procedure",
    auth: true,
    label: "Mua văn phòng phẩm",
    element: <OfficeProcurementProcedure />,
    parent: "procedure",
  },
  {
    name: "procurement-proposal",
    path: "/procurement-proposal-procedure",
    auth: true,
    label: "Mua trang thiết bị",
    element: <ProcurementProcedure />,
    parent: "procedure",
  },
  {
    name: "supplier",
    path: "/supplier",
    auth: true,
    label: "Duyệt nhà cung cấp",
    element: <SupplierProcedure />,
    parent: "procedure",
  },
  {
    name: "notarization-procedure",
    path: "/notarization-procedure",
    auth: true,
    label: "Công chứng/dịch thuật",
    element: <NotarizationProcedure />,
    parent: "procedure",
  },
  {
    name: "vehicles",
    path: "/vehicles",
    auth: true,
    label: "Quản lý xe",
    icon: <IssuesCloseOutlined />,
    element: <ManageVehicles />,
  },
  
  {
    name: "keepingtimesV2",
    path: "/keepingtimesV2",
    auth: true,
    label: "Chấm công V2",
    icon: <IssuesCloseOutlined />,
    element: <KeepingTimeV2 />,
  },
  {
    name: "payrollV2",
    path: "/payrollV2",
    auth: true,
    label: "Bảng lương V2",
    icon: <IssuesCloseOutlined />,
    element: <PayRollV2 />,
  },
  {
    name: "keepingtimes",
    path: "/keepingtimes",
    auth: true,
    label: "Chấm công",
    icon: <IssuesCloseOutlined />,
    element: <ManagerKeeping />,
  },
  {
    name: "payroll",
    path: "/payroll",
    auth: true,
    label: "Bảng lương",
    icon: <IssuesCloseOutlined />,
    element: <PayRoll />,
  },

  {
    name: "import-procedure",
    path: "/import-procedure",
    auth: true,
    label: "Quy trình thực hiện HĐ",
    parent: "procedure",
    element: <ImportProcedure />,
  },
  {
    name: "export-procedure",
    path: "/export-procedure",
    auth: true,
    label: "Quy trình xuất kho",
    parent: "procedure",
    element: <ExportProcedure />,
  },
  {
    name: "contracts",
    path: "/contracts",
    // auth: true,
    // parent: "procedure",
    element: <Contract />,
  },

];

export default pages;
