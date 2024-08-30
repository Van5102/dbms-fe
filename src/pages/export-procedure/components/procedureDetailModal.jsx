import { useState } from "react"
import { Modal, Table, Button,Col,Row } from "antd"
import moment from "moment"
import {
  DATE_FORMAT, PAYMENT_TYPE
} from "utils/constants/config"
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
  // const arrRecord = [record];
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
      render: (v,r) =>(
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
      width: 40,
      title: "Model",
      dataIndex: "model",
      align: "center",
      key: "model",
    },
    {
      width: 40,
      title: "Hãng sản xuất",
      dataIndex: "manufactor",
      align: "center",
      key: "manufactor",
    },
    {
      width: 40,
      title: "Xuất xứ",
      dataIndex: "origin",
      align: "center",
      key: "origin",
    },
    {
      width: 400,
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
        style={{ top: 10 }}f
        title={<h3 style={{textAlign: "center"}}>Đề xuất xuất kho</h3>}
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
        Thời gian giao hàng:{ moment(record?.delivery_day * 1000).format(DATE_FORMAT)}
        </Col>
        <Col span={24}>
        Giao hàng tại: {record?.delivery_place}
        </Col>
        <Col span={24}>
          <b>Điều kiện thanh toán</b>
        </Col>
        <Col span={6}>
        Lần 1: {record?.pay_t1} %
        </Col>
        <Col span={6}>
        Lần 2: {record?.pay_t2} %
        </Col>
        <Col span={6}>
        Lần 3: {record?.pay_t3} %
        </Col>
        <Col span={6}>
        Lần 4: {record?.pay_t4} %
        </Col>

        <Col span={24}>
          <b>Tài liệu đính kèm bao gồm:</b>:
        </Col>

       
       
        <Col lg={12} md={12} xs={12}>
        1.Thông tin liên hệ: {record?.contact_name}
        </Col>
        <Col lg={12} md={12} xs={12}>
        SĐT: {record?.contract_phone}
        </Col>
        
        <Col lg={12} md={12} xs={12}>
        2.Chứng từ cung cấp : 
        </Col>
        <Col lg={12} md={12} xs={12}>
        Hóa đơn đỏ: {record?.invoice_VAT != null ? "Có" : "Không"}
        </Col>
        
      
        
        
        <Col lg={12} md={12} xs={12}>
        CO (PTM or NSX): {record?.receipt_CO != null ? "Có" : "Không"}
        </Col>
       
        <Col lg={12} md={12} xs={12}>
        CQ NSX: {record?.date_of_manufacture != null ? "Có" : "Không"}
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