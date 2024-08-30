import { useState } from "react"
import { Modal, Table, Button,Col,Row } from "antd"
import moment from "moment"
import {
  DATE_FORMAT, PAYMENT_TYPE
} from "utils/constants/config"
import { IoOpenOutline } from "react-icons/io5";
import DetailFile from './detailFile'

import DeviceDetailModal from './deviceDetailModal';
import AddQuoteProcedure from "pages/supplier-procedure/components/addQuoteModal";
const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })
  const [quoteModal, setQuoteModal] = useState(false);
  const [openDeviceDetail, setOpenDeviceDetail] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const columns = [
    {
      width: 15,
      align: "center",
      title: "STT",
      key: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size
    },
    {
      width: 200,
      title: "THIẾT BỊ VÀ PHỤ KIỆN",
      align: "center",
      key: "device_name",
      render: (v) =>(
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>

        <span style={{ fontWeight: v?.attachment_id === null ? 'bold' : 'normal' }}>
          {v?.device_name}
        </span>
        </div>
      )
    },
    {
      width: 40,
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      key: "quantity",
    },
    {
      width: 200,
      title: "Ghi chú",
      dataIndex: "description",
      align: "center",
      key: "description",
      render: (v) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>

          {v}
        </div>
      ),
    },
   
  
  ]

  return (
    <>
      <Modal
        className="common-long-modal"
        style={{ top: 10 }}
        title={<h3 style={{textAlign: "center"}}>PHIẾU ĐỀ NGHỊ HỢP ĐỒNG</h3>}
        footer={<Button onClick={onCancel} className="w-120">
          Thoát
        </Button>}
        closeIcon={null}
        open={true}
        width={700}

      >
       <Row gutter={[12, 12]}>

       <Col span={24}>
          <b>Họ và tên người đề nghị:  {record?.created_by}</b>
        </Col>
        <Col span={24}>
          <b>Bộ phận:{record?.department_name} </b>
        </Col>
       <Col span={24}>
          <b>I.THÔNG TIN BÁN HÀNG</b>
        </Col>
       
        <Col span={24}>
          Tên khách hàng: {record?.customer_name}
        </Col>
        <Col span={24}>
        Địa chỉ: {record?.customer_address}
        </Col>
       
        
        <Col lg={10} xs={14}>
          <b>Hình thức thanh toán:</b>

        </Col>
        <Col lg={8} xs={6}>
        {PAYMENT_TYPE[record?.payment]}

        </Col>
        
        <Col span={24}>
        Thời gian giao hàng: { moment(record?.delivery_day * 1000).format(DATE_FORMAT)}
        </Col>
        <Col span={24}>
        Giao hàng tại: {record?.delivery_place}
        </Col>
        <Col span={24}>
          <b>Điều kiện thanh toán</b>
        </Col>
        <Col md={6} xs={12}>
        Lần 1: {record?.pay_t1} %
        </Col>
        <Col md={6} xs={12}>
        Lần 2: {record?.pay_t2} %
        </Col>
        <Col md={6} xs={12}>
        Lần 3: {record?.pay_t3} %
        </Col>
        <Col md={6} xs={12}>
        Lần 4: {record?.pay_t4} %
        </Col>

        <Col span={24}>
          <b>Tài liệu đính kèm bao gồm:</b>:
        </Col>

        <Col  md={12} xs={24}>
        1.HĐ số: {record?.contract_number}
        </Col>
        <Col  md={12} xs={24}>
        Ngày: {moment(record?.contract_day* 1000).format(DATE_FORMAT)}
        </Col>
        <Col  md={12} xs={24}>
        2.Thông tin liên hệ: {record?.contact}
        </Col>
        <Col  md={12} xs={24}>
        SĐT: {record?.contract_phone_number}
        </Col>
        <Col  md={12} xs={24}>
        Email: {record?.contract_email}
        </Col>
        <Col  md={12} xs={24}>
        Tệp đính kèm:
        {record?.attachments ? (<Button
          className="btn-with-icon"
          onClick={() => setOpenDetail(record?.attachments)}
          type="primary"
        >
          <IoOpenOutline />
          <span className="btn-text">Mở</span>
        </Button>)  : "Không có"} 
        
        </Col>
      

        <Col span={24}>
          3.<b>Chứng từ cung cấp:</b>:
        </Col>
        <Col lg={12} md={12} xs={12}>
        Hoá đơn GTGT: {record?.invoice_VAT != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        Packing list xoá giá: {record?.invoice_VAT != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        CO (PTM or NSX): {record?.receipt_CO != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        Tờ khai hải quan xoá giá: {record?.customs_declaration_price_clearance != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        CQ NSX: {record?.date_of_manufacture != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        Invoice xoá giá: {record?.invoice_price_clearance != null ? "Có" : "Không"}
        </Col>
        <Col lg={12} md={12} xs={12}>
        Chứng từ khác: {record?.receipt_defference}
        </Col>

        

        <Col span={24}>
          <b>II.HÀNG HÓA YÊU CẦU</b>
        </Col>
      
        <Table
          dataSource={record?.devices}
          columns={columns}
          style={{  margin: '0 auto' }} 
          scroll={{ x: 600 }}

        />
      </Row>
      <Col span={24}>
      Người thực hiện : {record?.implementer_name}
        </Col>
      </Modal>
      <>
        {openDetail && (
          <DetailFile
            openDetail={openDetail}
            onCancel={() => setOpenDetail(false)}
          />
        )}

        {quoteModal && (
          <AddQuoteProcedure
            onCancel={() => setQuoteModal(false)}
            quoteModal={quoteModal}
          />
        )}
        {openDeviceDetail && (
          <DeviceDetailModal
            onCancel={() => setOpenDeviceDetail(false)}
            openDeviceDetail={openDeviceDetail}
          />
        )}
      </>
    </>
  )
}

export default ProcedureDetailModal