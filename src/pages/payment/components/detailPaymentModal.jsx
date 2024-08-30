import { useState } from "react";
import { Modal, Table, Button, Image, Row, Col, } from "antd";
import { formatCurrency, getFullUrlStaticFile } from "utils/helps";
import { DATE_FORMAT, PAGINATION, PAYMENT_TYPE } from "utils/constants/config";
import dayjs from "dayjs";
const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: PAGINATION['PAGE_NUM'],
    page_size: PAGINATION['PAGE_SIZE'],
  });



  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) =>
        i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
    {
      title: "Mã số",
      dataIndex: "id",
      align: "center",
      key: "id",
    },
    {
      title: "Nội dung thanh toán",
      dataIndex: "details",
      align: "center",
      key: "details",
    },

    {
      align: "center",
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      align: "center",
      title: "Số tiền",
      dataIndex: "cost",
      key: "cost",
      render: (v) => (v ? formatCurrency(v) : ""),
    },
    {
      title: "Hồ sơ/chứng từ",
      dataIndex: "attachments",
      key: "attachments",
      align: "center",
      width: 300,

      render: e => (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {e && e?.map((url, index) => (
            <div key={index} >
              {url?.path?.split('.').pop()?.toLowerCase() === 'pdf' ?
                <Button type="info" onClick={() => window.open(getFullUrlStaticFile(url?.path), "_blank")}>Mở PDF</Button>
                :
                <Image src={getFullUrlStaticFile(url?.path)} width={100} style={{ "paddingBottom": "8px" }} />
              }
            </div>
          ))}
        </div>
      ),
    },
    {
      align: "center",
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },

  ];

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={1200}
      title="Danh sách"
      footer={
        <Button onClick={onCancel} className="w-120">
          Thoát
        </Button>
      }
      open={true}
    >
      <Row gutter={[8,8]}>
        <Col span={24}>
        
        <Col span={24}>
          <strong>Nội dung thanh toán: </strong>{record?.content}
        </Col>
        
          <strong>Tổng số tiền thanh toán: </strong>
          {formatCurrency(record?.accounting_details.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))}
        </Col>

        <Col span={24}>
          <strong>Hình thức thanh toán: </strong>
          {PAYMENT_TYPE[record?.type_payment]}
        </Col>


      </Row>
      <Table
        dataSource={record?.accounting_details}
        columns={columns}
        rowKey={(record) => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: record?.accounting_details.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size });
          },
        }}
        scroll={{ x: 1024 }}

      />
    </Modal>
  );
};

export default ProcedureDetailModal;
