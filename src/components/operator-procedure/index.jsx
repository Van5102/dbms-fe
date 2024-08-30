import { Button, Space } from "antd";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const OperatorProcedure = ({r, onCancel, onShowProcess}) => {
  return (
    <Space onClick={(e) => e.stopPropagation()}>

      {r?.status_code === "PENDING" && (
        <Button
          className="btn-with-icon"
          type="cancel"
          onClick={onCancel}
        >
          <RiDeleteBinLine />
          <span className="btn-text">Hủy</span>
        </Button>
      )}

      <Button
        className="btn-with-icon"
        onClick={onShowProcess}
      >
        <MdOutlineRemoveRedEye />
        <span className="btn-text">Xem trạng thái</span>
      </Button>
    </Space>
  )
}

export default OperatorProcedure;