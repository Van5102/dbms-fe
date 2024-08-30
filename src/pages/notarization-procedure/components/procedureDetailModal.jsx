import { useMemo, useState } from "react"
import { Modal, Table, Button } from "antd"
import moment from "moment"
import { 
  NOTARIZATION_PROCEDURE_TYPES, 
  DATE_FORMAT 
} from "utils/constants/config"

const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })

  const papers = useMemo(() => {
    return record?.papers || []
  }, [record])

  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size 
    },
    {
      width: 240,
      title: "Tên hồ sơ giấy tờ cần công chứng/dịch thuật",
      dataIndex: "name",
      key: "name",
    },
    {
      width: 240,
      title: "Mục đích",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      width: 120,
      align: "center",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      width: 180,
      align: "center",
      title: "Hình thức công chứng",
      dataIndex: "type_notariza",
      key: "type_notariza",
      render: v => NOTARIZATION_PROCEDURE_TYPES[v]
    },
    {
      width: 120,
      align: "center",
      title: "Ngày cần",
      dataIndex: "day_need",
      key: "day_need",
      render: v => v ? moment(v * 1000).format(DATE_FORMAT) : ''
    },
    {
      width: 200,
      align: "center",
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    }
  ]

  return (
    <Modal
      className="common-modal"
      style={{top: 10}}
      width={1280}
      title="Danh sách hồ sơ giấy tờ cần công chứng/dịch thuật"
      footer={<Button onClick={onCancel} className="w-120">
        Thoát
      </Button>}
      open={true}
    >
      <Table 
        dataSource={papers}
        columns={columns}
        rowKey={record => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: papers.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size })
          }
        }}
      />
    </Modal>
  )
}

export default ProcedureDetailModal