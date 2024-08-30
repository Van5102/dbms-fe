import { useState, useEffect, useRef } from "react";

import "jspdf-autotable";

import {
  Table,
  Row,
  Col,
  Button,
  Space,
  Modal,
  message,
  Menu,
  Dropdown,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import {
  DATE_FORMAT,
  EDUCATION_LEVEL,
  EXPERIENCE,
  GENDER,
  INTERVIEW_STATUS,
  TYPE_CV,
} from "utils/constants/config";
import { actionDeleteCv, actionGetCv } from "../actions";
import "antd-button-color/dist/css/style.css";
import DetailFile from "./detailFile";
import UpdateCvModal from "./updateCv";
import AddScheduleModal from "./addScheduleModal";
import { IoOpenOutline } from "react-icons/io5";
import ExportPdfModal from "./exportPdfCVModal";
import { useSelector } from "react-redux";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { TbFileExport } from "react-icons/tb";
const CvTab = ({
  setTabKey,
  recruitmentId,
  nameSeach,
  selectedStatus,
  dataTb,
  setDataTb,
  setRecruitmentId,
  timeStart,
  timeEnd,
  positionSeach,
}) => {
  const { confirm } = Modal;

  const [spinning, setSpinning] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openUpdateCv, setOpenUpdateCv] = useState(false);
  const [openScheduleCv, setOpenScheduleCv] = useState(false);
  const [totalRecordTb, setTotalRecordTb] = useState(0);
  const userLogin = useSelector((state) => state?.profile);

  const targetRef = useRef();
  const [dataExport, setDataExport] = useState();

  const [paginationTab, setPaginationTab] = useState({
    page_num: 1,
    page_size: 10,
  });

  const handleGetCv = async (page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab({ page_num, page_size });
      const params = {
        page_num,
        page_size,
        position_name: positionSeach,
        create_start: dayjs(timeStart).startOf("D").unix() || null,
        create_end: dayjs(timeEnd).endOf("D").unix() || null,
        recruitment_id: recruitmentId || null,
        name: nameSeach,
        deparment: selectedStatus,
      };

      const { data, status } = await actionGetCv(params);

      if (status === 200) {
        setDataTb(data?.list_appliant);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }

    setSpinning(false);
  };

  const handleDeleteCv = async (id, page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab({ page_num, page_size });
      const params = {
        page_num,
        position_name: positionSeach,
        page_size,
        recruitment_id: recruitmentId || null,
      };
      const { status, data } = await actionDeleteCv(id, 3, params);

      if (status === 200) {
        message.success(data?.message);
        setDataTb(data?.list_appliant);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }

    setSpinning(false);
  };
  const handleDeleteCvWithEmail = async (id, page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab({ page_num, page_size });
      const params = {
        page_num,
        position_name: positionSeach,
        page_size,
        recruitment_id: recruitmentId || null,
      };
      const { status, data } = await actionDeleteCv(id, 2, params);

      if (status === 200) {
        message.success(data?.message);
        setDataTb(data?.list_appliant);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }

    setSpinning(false);
  };

  const handleMenuClick = (key, id) => {
    const title =
      key === "delete"
        ? "Bạn chắc chắn muốn xóa?"
        : "Bạn chắc chắn muốn xóa và gửi mail?";
    confirmDelete(
      id,
      title,
      key === "delete" ? handleDeleteCv : handleDeleteCvWithEmail
    );
  };

  const confirmDelete = (id, title, deleteHandler) => {
    confirm({
      title: title,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk() {
        deleteHandler(id, paginationTab.page_num, paginationTab.page_size);
      },
    });
  };

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key, idToDelete)}>
      <Menu.Item key="delete">Xóa</Menu.Item>
      <Menu.Item key="delete-email">Xóa gửi email</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    handleGetCv(1, 10);
    setRecruitmentId(null);
  }, [nameSeach, selectedStatus, timeStart, timeEnd, positionSeach]);

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
      dataIndex: "name",
      key: "name",
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
      title: "Loại hồ sơ",
      dataIndex: "cv_type",
      key: "cv_type",
      render: (v) => TYPE_CV[v],
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
      title: "Trình độ học vấn",
      dataIndex: "education_level",
      key: "education_level",
      render: (v) => EDUCATION_LEVEL[v],
      align: "center",
    },
    {
      title: "Kinh nghiệm",
      dataIndex: "experience",
      key: "experience",
      render: (v) => EXPERIENCE[v],
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
      title: "Link cv",
      dataIndex: "cv",
      key: "cv",
      render: (v, r) => (
        <Button
          className="btn-with-icon"
          onClick={() => setOpenDetail(r)}
          type="primary"
        >
          <IoOpenOutline />
          <span className="btn-text">Mở</span>
        </Button>
      ),
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
      width: 280,
      title: "Thao tác",
      dataIndex: "t",
      key: "t",
      render: (v, r) => (

        <Space onClick={(e) => e.stopPropagation()}>
          {r?.status == null && (userLogin?.position_code === "NHAN_SU" ||
            (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")) && (
              <>
                <Button
                  className="btn-with-icon success-btn"
                  onClick={() => setOpenScheduleCv(r)}
                  type="primary"
                >
                  <AiOutlineSchedule />
                  <span className="btn-text">Đặt lịch</span>
                </Button>
              </>
            )}


          {(userLogin?.position_code === "NHAN_SU" || (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")) &&
            <Button
              className="btn-with-icon pdf-btn"
              onClick={() => setOpenUpdateCv(r)}
              type="info"
            >
              <FaRegEdit />
              <span className="btn-text">Sửa</span>
            </Button>
          }
          {(r?.status == null || r?.status === 5 || r?.status === 6) && (userLogin?.position_code === "NHAN_SU" ||
            (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")) && (
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  className="btn-with-icon"
                  type="cancel"
                  onClick={() => setIdToDelete(r.id)}
                >
                  <MdDelete />
                  <span className="btn-text">Xóa</span>
                </Button>
              </Dropdown>
            )}
        </Space>


      ),
      align: "center",
    },
  ];

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col>
          <Button
            className="btn-with-icon pdf-btn"
            onClick={() => setDataExport(dataTb)}
            type="primary"
          >
            <TbFileExport /> <span className="btn-text">Xuất PDF</span>
          </Button>
        </Col>

        <Col span={24} ref={targetRef}>
          <Table
            id="my-table"
            className="tb-click-row"
            width="100%"
            rowKey={(r) => r.id}
            columns={columns}
            dataSource={dataTb}
            loading={spinning}
            pagination={{
              current: paginationTab.page_num,
              pageSize: paginationTab.page_size,
              total: totalRecordTb,
              onChange: handleGetCv,
            }}
            scroll={{ x: 2000 }}
          />
        </Col>
      </Row>
      <>
        {openDetail && (
          <DetailFile
            openDetail={openDetail}
            onCancel={() => setOpenDetail(false)}
          />
        )}
        {openUpdateCv && (
          <UpdateCvModal
            openUpdateCv={openUpdateCv}
            setDataTb={setDataTb}
            setTotalRecordTb={setTotalRecordTb}
            onCancel={() => setOpenUpdateCv(false)}
          />
        )}
        {openScheduleCv && (
          <AddScheduleModal
            openScheduleCv={openScheduleCv}
            onCancel={() => setOpenScheduleCv(false)}
            setTabKey={setTabKey}
            setDataTb={setDataTb}
            page_num={paginationTab.page_num}
            page_size={paginationTab.page_size}
          />
        )}
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
export default CvTab;
