import { useState, useEffect } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import {
  DATE_FORMAT,
  GENDER,
  INTERVIEW_STATUS,
  STATUS,
} from "utils/constants/config";
import { useRef } from "react";
import {
  actionGetListInterview,
  actionHandleInterviewCalendar,
} from "../actions";
import "antd-button-color/dist/css/style.css";
import ExportPdfModal from "./exportPdfReceiveModal";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { IoPersonAddOutline } from "react-icons/io5";
const ReceiveJob = ({ timeStart, timeEnd }) => {
  const [dataTb, setDataTb] = useState([]);
  const [statusJob, setStatusJob] = useState();
  const [dataExport, setDataExport] = useState();
  const userLogin = useSelector((state) => state?.profile);

  const [paginationTab, setPaginationTab] = useState({
    page_num: 1,
    page_size: 10,
  });

  const handleReceiveJob = async (id, stt) => {
    try {
      const params = {
        status: statusJob,
        tab: 0,
        imterview_time_start: dayjs(timeStart).startOf("D").unix() || null,
        imterview_time_end: dayjs(timeEnd).endOf("D").unix() || null,
      };

      const body = {
        review_round_1: null,
        review_round_2:null,
        review_round_3:null,
        status: stt,
        salary:  null,
        description: null,
       
      };

      const { data, status } = await actionHandleInterviewCalendar(
        id,
        params,
        body
      );
      if (status === 200) {
        message.success(data?.message);
        setDataTb(data?.list_interview);
      }
    } catch (error) {
      message.error("bad request!");
    }
  };

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (v, r, index) =>
        index + 1 + (paginationTab.page_num - 1) * paginationTab.page_size,
    },
    {
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "applicant_name",
      key: "applicant_name",
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (v) => moment(v * 1000).format(DATE_FORMAT),
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (v) => GENDER[v],
      align: "center",
    },
    {
      title: "Ngày nhận việc ",
      dataIndex: "start_working",
      key: "start_working",
      render: (v) => moment(v * 1000).format(DATE_FORMAT),
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "dep_name",
      key: "dep_name",
      align: "center",
    },
    {
      title: "Vị trí",
      dataIndex: "position_name",
      key: "position_name",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      width: 180,
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            statusClass = "process--waiting";
            break;

          case 5:
            statusClass = "process--success";
            break;
          case 6:
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }
        return <span className={statusClass}>{INTERVIEW_STATUS[v]}</span>;
      },
      align: "center",
    },
    {
      width: 250,
      title: "Thao tác",
      dataIndex: "t",
      key: "t",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {r?.status === 4 && (
            <Popconfirm
              title={"Bạn chắc chắn?"}
              okText={"Hoàn thành"}
              cancelText="Hủy"
              onConfirm={() => handleReceiveJob(r.id, STATUS["RECEIVED_JOB"])}
            >
              <Button
                type="primary"
                className="btn-with-icon success-btn"
              >
                <IoPersonAddOutline />
                <span className="btn-text">Nhận việc</span>
              </Button>
            </Popconfirm>
          )}

          {r?.status === 4 && (
            <Popconfirm
              title={"Bạn chắc chắn?"}
              okText={"Hoàn thành"}
              cancelText="Hủy"
              onConfirm={() => handleReceiveJob(r.id, STATUS["REFUSE"])}
            >
              <Button className="btn-with-icon" type="cancel">
                <MdCancel />
                <span className="btn-text">Từ chối</span>
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      align: "center",
    },
  ];
  const handleGetListInterviewCalendar = async () => {
    try {
      const params = {
        status: statusJob,
      };
      const { data, status } = await actionGetListInterview(params);
      if (status === 200) {
        setDataTb(data?.list_interview);
      }
    } catch (err) {
      message.error(err);
    }
  };

  const handleChange = (value) => {
    setStatusJob(value);
  };

  useEffect(() => {
    handleGetListInterviewCalendar();
  }, [timeStart, timeEnd, statusJob]);
  const targetRef = useRef();
  return (
    <>
      <>
        <Row gutter={[8, 8]}>
          <Col>
            <Select
              className="w-full"
              allowClear
              placeholder="Chọn trạng thái"
              optionFilterProp="children"
              onChange={handleChange}
              options={[
                {
                  value: 4,
                  label: "Chờ nhận việc",
                },
                {
                  value: 5,
                  label: "Đã nhận việc",
                },
                {
                  value: 6,
                  label: "Chưa nhận việc",
                },
              ]}
            />
          </Col>
          <Col>
            <Button
              className="btn-with-icon pdf-btn
"
              onClick={() => setDataExport(dataTb)}
              type="primary"
            >
              <TbFileExport /> <span className="btn-text">Xuất PDF</span>
            </Button>
          </Col>

          <Col span={24} ref={targetRef}>
            <Table
              className="tb-click-row"
              width="100%"
              rowKey={(r) => r.id}
              columns={columns}
              dataSource={dataTb}
              // onRow={(r) => ({
              //     onClick: () => setRecordShowDetail(r)
              // })}
              pagination={{
                current: paginationTab.page_num,
                pageSize: paginationTab.page_size,
                // total: totalRecordTb,
                // onChange: handleGetCv,
              }}
              scroll={{ x: 2000 }}
            />
          </Col>
        </Row>
      </>
      <>
        {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
            userLogin={userLogin}
          />
        )}
      </>
    </>
  );
};

export default ReceiveJob;
