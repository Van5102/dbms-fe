import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { STATUS_KEEPING, SECOND_FORMAT } from "utils/constants/config";
import { actionGetListKeeping } from "../action";
import { Layout, Space, Table, message } from "antd";
import moment from "moment";
import dayjs from "dayjs";

const KeepingHistory = ({ start, end, nameSeach }) => {
  const [spinning, setSpinning] = useState(false);
  const [listHisKeeping, setListHisKeeping] = useState([]);

  //paginate
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const handleGetListKeeping = async () => {
    setSpinning(true);
    try {
      const params = {
        time_start: dayjs(start).startOf("D").unix() || null,
        time_end: dayjs(end).endOf("D").unix() || null,
        name: nameSeach,
      };

      const { data, status } = await actionGetListKeeping(params);
      if (status === 200) {
        setListHisKeeping(data?.list_keeping_time);
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }

    setSpinning(false);
  };

  useEffect(() => {
    handleGetListKeeping();
  }, [start, end, nameSeach]);

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <Space>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </Space>
      ),
    },
    {
      title: "Tên",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
    },
    {
      title: "Giờ chấm",
      dataIndex: "time_keeping",
      key: "time_keeping",
      align: "center",
      render: function (text, record, index) {
        return moment(record?.time_keeping * 1000).format(SECOND_FORMAT);
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "PVR(tháng)",
      dataIndex: "free_time",
      key: "free_time",
      align: "center",
      render: (text, record, index) => {
        return parseInt(record?.free_time / 60);
      },
    },
    {
      title: "Công hiện tại",
      dataIndex: "total_working",
      key: "total_working",
      align: "center",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      key: "status",
      align: "center",
      render: (text, record, index) => {
        let status = null;
        switch (record.status) {
          case 1:
            status = "process--success";
            break;

          case 0:
            status = "process--cancel";
            break;

          case 2:
            status = "process--waiting";
            break;

          default:
            status = "process";
        }
        return <span className={status}>{STATUS_KEEPING[record?.status]}</span>;
      },
    },
  ];

  return (
    <Layout className="common-layout">
      <div className="common-layout--content">
        <SpinCustom spinning={spinning}>
          <Table
            width="100%"
            dataSource={listHisKeeping}
            rowKey={(r) => r.id}
            columns={columns}
            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange: handleChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </SpinCustom>
      </div>
    </Layout>
  );
};

export default KeepingHistory;
