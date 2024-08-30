import {  useState } from "react"
import { Modal, Table, Button } from "antd"

import {
   CHECK_GOODS_TYPE
} from "utils/constants/config"

import DetailFile from './detailFile'

const ProcedureDeviceDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })
  const [openDetail, setOpenDetail] = useState(false);

  const arrRecord = [record];

  const columns = [
    {
      width: 15,
      align: "center",
      title: "STT",
      key: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size
    },

    {
      title: "Người yêu cầu",
      dataIndex: "user_request_name",
      key: "user_request_name",
      align: "center",
    },

    {
      title: "Số hợp đồng mua",
      dataIndex: "contract_number",
      key: "contract_number",
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      align: "center",
    },
    {
      title: "Số hợp đồng bán",
      dataIndex: "contract_number_attached",
      key: "contract_number_attached",
      align: "center",
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
      title: "Địa điểm kiểm hàng",
      dataIndex: "address_checking",
      key: "address_checking",
      align: "center",
    },
    {
      title: "Kết quả kiểm hàng",
      dataIndex: "result_checking",
      key: "result_checking",
      render: (v) => CHECK_GOODS_TYPE[v],
      align: "center",
    },


  ]

  return (
    <>
      <Modal
        className="common-modal"
        style={{ top: 10 }}
        title="Danh sách"
        footer={<Button onClick={onCancel} className="w-120">
          Thoát
        </Button>}
        open={true}
        width={1200}

      >
        <Table
          dataSource={arrRecord}
          columns={columns}
          rowKey={record => record?.id}
          pagination={{
            position: ["bottomCenter"],
            current: pagination.page_num,
            pageSize: pagination.page_size,
            total: record.length,
            onChange: (page_num, page_size) => {
              setPagination({ page_num, page_size })
            }
          }}
          scroll={{ x: 3000 }}
        />
      </Modal>
      <>
        {openDetail && (
          <DetailFile
            openDetail={openDetail}
            onCancel={() => setOpenDetail(false)}
          />
        )}
      </>
    </>
  )
}

export default ProcedureDeviceDetailModal