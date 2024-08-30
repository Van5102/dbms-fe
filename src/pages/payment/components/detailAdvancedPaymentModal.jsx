import { useState } from "react";
import { Modal, Table, Button, Image, Row, Col, } from "antd";
import { formatCurrency, getFullUrlStaticFile } from "utils/helps";
import { DATE_FORMAT, PAGINATION, PAYMENT_TYPE } from "utils/constants/config";
import dayjs from "dayjs";
const ProcedureDetailAdvancedModal = ({ record, onCancel }) => {
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
      title: "Nội dung chi tiết tạm ứng",
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

  const columns1 = [
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
      title: "Nội dung chi tiết hoàn ứng",
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
      width: 200,
      title: "Ngày chi",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (v, r) => dayjs(v * 1000).format(DATE_FORMAT),
      align: "center",
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

  let tongTienTamUng = (record?.accounting_details[0]?.list_items.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))
  let tongHoanUng = (record?.accounting_details[1]?.list_items.map(e => e.cost).reduce((accumulator, currentValue) => accumulator + currentValue, 0,))
  let tienThuaThieu =tongTienTamUng - tongHoanUng
  // console.log(tongHoanUng);
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
      <Row gutter={[8, 8]}>
        <Col style={{ fontSize: "larger" }}><strong>I.Khoản đã tạm ứng</strong></Col>

        <Col span={24}>
          Lý do tạm ứng:{record?.accounting_details[0]?.content}
        </Col>


        <Col span={24}>
          Hình thức thanh toán:
          {PAYMENT_TYPE[record?.accounting_details[0].type_payment]}
        </Col>



        <Col span={24}>
          Thời hạn thanh toán: {dayjs(record?.accounting_details[0]?.payment_term * 1000).format(DATE_FORMAT)}
        </Col>

        <Col span={24}>
          <strong>Tổng số tiền tạm ứng: </strong>
          {formatCurrency(tongTienTamUng)}  
                </Col>



        <Col span={24} >
          <Table
            dataSource={record?.accounting_details[0]?.list_items}
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
        </Col>

        <Col span={24}>
          <strong>II. Các khoản đã chi</strong>
        </Col>

        <Col span={24}>
          <strong>Tổng số tiền hoàn ứng: {formatCurrency(tongHoanUng)}</strong>
        </Col>

        <Col span={24}>
            Hình thức thanh toán:  {PAYMENT_TYPE[record?.accounting_details[1].type_payment]}
          </Col>

        <Col span={24}>
              <strong> {tienThuaThieu >0 ? `Số tiền thừa: ${formatCurrency(Math.abs(tienThuaThieu))}` : `Số tiền thiếu: ${formatCurrency(Math.abs(tienThuaThieu))}`} </strong>
            </Col>
        <Col span={24} >
          <Table
            dataSource={record?.accounting_details[1]?.list_items}
            columns={columns1}
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
        </Col>
      </Row>

    </Modal>
  );
};

export default ProcedureDetailAdvancedModal;
