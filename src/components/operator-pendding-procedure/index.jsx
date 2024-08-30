import { Button, Space } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TbFileExport } from "react-icons/tb";

const OperatorPenddingProcedure = ({ record, onConfirm, onReject, onShowProcess, onExportPDF, userLogin, children }) => {
  return (
    <Space onClick={(e) => e.stopPropagation()}>
      {record?.detail_status_code === "PENDING" && record?.approved_by === userLogin?.id && (
        <>
          <Button
            className="btn-with-icon success-btn"
            onClick={onConfirm}
            type="primary"
          >
            <GiConfirmed />
            <span className="btn-text">Xác nhận</span>
          </Button>

          <Button
            className="btn-with-icon"
            onClick={onReject}
            type="cancel"
          >
            <MdOutlineCancel />
            <span className="btn-text">Từ chối</span>
          </Button>
        </>
      )}

      <Button
        className="btn-with-icon "
        onClick={onShowProcess}
      >
        <MdOutlineRemoveRedEye />
        <span className="btn-text">Xem trạng thái</span>
      </Button>

      {onExportPDF && <Button
        className="btn-with-icon pdf-btn"
        onClick={onExportPDF}
        type="primary"
      >
        <TbFileExport />
        <span className="btn-text">Xuất PDF</span>
      </Button>}

      {children}
    </Space>
  )
}

export default OperatorPenddingProcedure;