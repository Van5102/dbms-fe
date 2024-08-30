import { useState } from "react";
import { Modal, Table, Button, } from "antd";
import { DATETIME_FORMAT, TYPE_OVER_TIME } from "utils/constants/config";
import { convertMinutesToHoursAndMinutes } from "utils/helps";
import dayjs from "dayjs";

const DetailModal = ({ record, onCancel }) => {
  // data table
  const dataSource = record?.over_time || [];

  // Phân trang 
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  });

  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) => i + 1 + (pagination.page_num - 1) * pagination.page_size,
    },
    {
      width: 240,
      align: "center",
      title: "Mô tả công việc",
      dataIndex: "description",
      key: "description",
    },
    {
      width: 180,
      align: "center",
      title: "Loại làm thêm giờ",
      dataIndex: "type_overtime",
      key: "type_overtime",
      render: (v) => TYPE_OVER_TIME[v]
    },
    {
      title: "Thời gian dự kiến bắt đầu làm",
      dataIndex: "estimated_start_time",
      align: "center",
      key: "estimated_start_time",
      render: (v) => v ? dayjs.unix(v).format(DATETIME_FORMAT) : "",
    },
    {
      title: "Thời gian dự kiến kết thúc làm",
      dataIndex: "estimated_end_time",
      align: "center",
      key: "estimated_end_time",
      render: (v) => v ? dayjs.unix(v).format(DATETIME_FORMAT) : "",
    },
    {
      title: "Thời gian thực tế bắt đầu làm",
      dataIndex: "actual_start_time",
      align: "center",
      key: "actual_start_time",
      render: (v) => v ? dayjs.unix(v).format(DATETIME_FORMAT) : "",
    },
    {
      title: "Thời gian thực tế kết thúc làm",
      dataIndex: "actual_end_time",
      align: "center",
      key: "actual_end_time",
      render: (v) => v ? dayjs.unix(v).format(DATETIME_FORMAT) : "",
    },
    {
      title: "Tổng thời gian làm thực tế (Phút)",
      dataIndex: "total_minute",
      align: "center",
      key: "total_minute",
    },
    {
      title: "Tổng thời gian làm thực tế (Phút)",
      dataIndex: "total_minute",
      align: "center",
      key: "total_hours",
      render: (v) => convertMinutesToHoursAndMinutes(v || 0),
    },
  ];

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={"100%"}
      title="Chi tiết đề xuất làm thêm giờ"
      footer={<Button className="w-120" onClick={onCancel}>Thoát</Button>}
      open={true}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: dataSource.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size });
          },
        }}
      />
    </Modal>

  );
};

export default DetailModal;
