import { useMemo, useState } from "react";
import { Modal, Table, Button,  } from "antd";
import { formatCurrency } from "utils/helps";
import { DATE_FORMAT } from "utils/constants/config";
import moment from "moment";
const DetailProcurementModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10,
  });
  const equipments = useMemo(() => {
    return record?.equipments || [];
  }, [record]);
  const columns = [
    {
      width: 10,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) =>
        i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
       {
      width: 10,

      title: "Mã số",
      dataIndex: "id",
      align: "center",
      key: "id",
    },
    {
      width: 60,

      title: "Trang thiết bị",
      dataIndex: "name",
      align: "center",
      key: "name",
    },
    {
      width: 150,

      title: "Người thực hiện",
      dataIndex: "implementer_name",
      align: "center",
      key: "implementer_name",
    },
    {
      width: 80,
      title: "Mục đích",
      dataIndex: "purpose",
      align: "center",
      key: "purpose",
    },
    {
      width: 140,
      title: "Thông số, đặc điểm",
      dataIndex: "specifications",
      align: "center",
      key: "specifications",
    },
    {
      width: 20,
      align: "center",
      title: "Số lượng cần",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      width: 60,
      align: "center",
      title: "Giá dự tính(1 chiếc,cái...)",
      dataIndex: "estimated_price",
      key: "estimated_price",
      render: (v) => formatCurrency(v),
    },
    {
      width: 20,
      align: "center",
      title: "Số lượng tồn",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      width: 100,
      align: "center",
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (v,r) => ( formatCurrency(r?.estimated_price * r?.quantity) ),
    },
    {
      width: 60,
      align: "center",
      title: "Ngày cần",
      dataIndex: "day_need",
      key: "day_need",
      render: (v) => moment(v * 1000).format(DATE_FORMAT),
    },
   
  ];

  return (
    <>
      <Modal
        className="common-modal"
        style={{ top: 10 }}
        width="100vw"
        title="Danh sách"
        footer={
          <Button onClick={onCancel} className="w-120">
            Thoát
          </Button>
        }
        open={true}
      >
        <Table
          dataSource={equipments}
          columns={columns}
          rowKey={(record) => record?.id}
          pagination={{
            position: ["bottomCenter"],
            current: pagination.page_num,
            pageSize: pagination.page_size,
            total: equipments.length,
            onChange: (page_num, page_size) => {
              setPagination({ page_num, page_size });
            },
          }}
        />
      </Modal>
      
    </>
  );
};

export default DetailProcurementModal;
