import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { STATUS_KEEPING, SECOND_FORMAT } from "utils/constants/config";
import { actionGetListKeepingByDate } from "../action";
import { Button, Col, Layout, Row, Space, Table } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const ListKeeping = ({ start, end, nameSeach, selectedStatus,selectedStatusCome }) => {
  const [spinning, setSpinning] = useState(false);
  const [listKeeping, setListKeeping] = useState([]);

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
        department: selectedStatus,
        name: nameSeach,
        time_start: dayjs(start).startOf("D").unix() || null,
        time_end: dayjs(end).endOf("D").unix() || null,
        status: selectedStatusCome,
        // page_num: pagination.current
      };
      const { data, status } = await actionGetListKeepingByDate(
        dayjs(start).startOf("D").unix() || new Date().getTime(),
        params
      );
      if (status === 200) {
        setListKeeping(data?.list_keeping_time);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const exprortExcel = () => {
    const tmp = listKeeping?.map((e, index) => {
      return {
        STT: index + 1,
        "Họ và Tên": e?.user_name,
        "Giờ chấm": moment(e?.time_keeping * 1000).format(SECOND_FORMAT),
        "Ghi chú": e?.description,
        "PVR(tháng)": Number(e?.free_time / 60),
        "Công hiện tại": e?.total_working
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 5 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },

    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cham_cong");
    XLSX.writeFile(workbook, "Cham_cong.xlsx");
  };

  useEffect(() => {
    handleGetListKeeping();
  }, [start, end, nameSeach, selectedStatus,selectedStatusCome]);

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
      key: "status",
      width: 150,
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
          <Row gutter={[8, 8]}>
            <Col>
              <Button
                onClick={() => exprortExcel()}
                type="primary"
              >
                Xuất Excel
              </Button>
            </Col>

            <Col span={24}>
              <Table
                width="100%"
                dataSource={listKeeping}
                columns={columns}
                rowKey={(r) => r.id}
                pagination={{
                  pageSize: pagination.pageSize,
                  current: pagination.current,
                  onChange: handleChangePage,
                }}
                scroll={{ x: 1024 }}
              />
            </Col>
          </Row>
        </SpinCustom>
      </div>
    </Layout>
  );
};

export default ListKeeping;
