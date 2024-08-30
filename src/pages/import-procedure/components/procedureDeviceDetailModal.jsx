import { useState } from "react"
import { Modal, Table, Button, Col, Row } from "antd"
import { RANK } from "utils/constants/config"
import {
  CHECK_GOODS_TYPE, DATE_FORMAT
} from "utils/constants/config"

import DetailFile from './detailFile'
import moment from "moment";

const ProcedureDeviceDetailModal = ({ record, onCancel }) => {
  console.log(record);
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })
  const [openDetail, setOpenDetail] = useState(false);

  const columns1 = [
    {
      width: 15,
      align: "center",
      title: "STT",
      key: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size
    },

    {
      width: 140,
      title: "Tên thiết bị",
      align: "center",
      key: "device_name",
      render: (v, r) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>

          <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
            {v?.device_name}
          </span>
        </div>
      )

    },
    {
      width: 140,
      title: "Số lượng",
      align: "center",
      key: "quantity",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.quantity}
        </span>
      )
    },
    {
      width: 140,
      title: "Ngày hoàn thành",
      align: "center",
      key: "deadline",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {moment(v?.deadline * 1000).format(DATE_FORMAT)}
        </span>
      )
    },
    {
      width: 140,
      title: "Model",
      align: "center",
      key: "model",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.model}
        </span>
      )
    },

    {
      width: 140,
      title: "Nhà sản xuất",
      align: "center",
      key: "manufactor",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.manufactor}
        </span>
      )
    },

    {
      width: 140,
      title: "Năm sản xuất",
      align: "center",
      key: "manufactor_year",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.manufactor_year !== null ? moment(v?.manufactor_year * 1000).format(DATE_FORMAT) : null}
        </span>
      )
    },
    {
      width: 140,
      title: "Serial",
      align: "center",
      key: "serial",
      render: (v, r) => (
        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.serial}
        </span>
      )
    },
    {
      width: 140,
      title: "Kết quả",
      align: "center",
      key: "result",
      render: (v, r) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>

          <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
            {RANK[v?.result]}
          </span>
        </div>

      )
    },
    {
      width: 140,
      title: "Ghi chú",
      align: "center",
      key: "description",
      render: (v, r) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>

          <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
            {v?.description}
          </span>
        </div>
      )
    }




  ]


  return (
    <>
      <Modal
        // className="fullscreen-modal"
        style={{ top: 10 }}
        title={<h3 style={{ textAlign: "center" }}>DANH SÁCH KIỂM HÀNG</h3>}
        footer={<Button onClick={onCancel} className="w-120">
          Thoát
        </Button>}
        closeIcon={null}
        open={true}
        width={1000}

      >
        <Row gutter={[20, 20]}>

          <Col span={12}>
            Người yêu cầu:  {record?.user_request_name}
          </Col>
          <Col span={12}>
            Ngày yêu cầu:  {
              moment(record?.time_create * 1000).format(DATE_FORMAT)}
          </Col>
          <Col span={12}>
            Số hợp đồng mua:{record?.contract_number}
          </Col>

          <Col lg={12} md={12} xs={12}>
            Hợp đồng đính kèm:
            {record?.contract_number_attached ? (<Button
              className="btn-with-icon"
              onClick={() => setOpenDetail(record?.contract_number_attached)}
              type="primary"
            >
              <span className="btn-text">Mở</span>
            </Button>) : "Không có"}

          </Col>
          <Col span={12}>
            Hàng về đợt thứ: {record?.batch}
          </Col>


          <Col span={12}>
            Số mục thiết bị: {record?.device_item}
          </Col>
          <Col span={12}>
            Khách hàng: {record?.customer_name}
          </Col>

          <Col span={12}>
            Địa điểm kiểm hàng tại: {record?.address_checking}
          </Col>
          <Col span={12}>
            Kết quả kiểm hàng: {CHECK_GOODS_TYPE[record?.result_checking]}
          </Col>
          <Col span={24}>
            Ghi chú: {record?.description}
          </Col>




          <Table
            dataSource={record?.list_items
            }
            columns={columns1}
            style={{ margin: '0 auto' }}
            scroll={{ x: 1200 }}
          />


        </Row>
        <Col span={24}>
          Người được chỉ định: {record?.list_implementer[0]?.name}
        </Col>
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