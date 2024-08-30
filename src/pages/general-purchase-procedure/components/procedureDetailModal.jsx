import { useMemo, useState } from "react";
import { Modal, Table, Button, } from "antd";
import { formatCurrency } from "utils/helps";
import { DATE_FORMAT } from "utils/constants/config";
import moment from "moment";
const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10,
  });


  const equipments = useMemo(() => {
    return record?.equipments || [];
  }, [record]);

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
      title: "Nội dung",
      dataIndex: "name",
      align: "center",
      key: "name",
    },
    {
      title: "Người thực hiện",
      dataIndex: "implementer_name",
      align: "center",
      key: "implementer_name",

    },
    {
      width: 200,
      title: "Mục đích",
      dataIndex: "purpose",
      align: "center",
      key: "purpose",
    },
    {
      // width: 280,
      title: "Mô tả",
      dataIndex: "specifications",
      align: "center",
      key: "specifications",
    },
    {
      align: "center",
      title: "Số lượng cần",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      align: "center",
      title: "Giá dự tính(1 chiếc,...)",
      dataIndex: "estimated_price",
      key: "estimated_price",
      render: (v) => (v ? formatCurrency(v) : ""),
    },
    {
      align: "center",
      title: "Số lượng tồn",
      dataIndex: "inventory",
      key: "inventory",
    },
    {
      align: "center",
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (v, r) => (formatCurrency(r?.estimated_price * r?.quantity)),
    },
    {
      title: "Ngày cần",
      dataIndex: "day_need",
      align: "center",
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

export default ProcedureDetailModal;
