import { useState, useEffect } from "react";
import { useRef } from "react";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";

import {
  Table,
  Row,
  Col,
  Button,
  Space,
  message,
  Dropdown,
  Menu,
  Modal
} from "antd";
import { TbSquareRoundedNumber1 } from "react-icons/tb";
import { TbSquareRoundedNumber2 } from "react-icons/tb";


import moment from "moment";
import { DATETIME_FORMAT, INTERVIEW_STATUS } from "utils/constants/config";
import { useSearchParams } from "react-router-dom";
import { actionGetScheldule, actionHandleReview } from "../actions";
import "antd-button-color/dist/css/style.css";
import FeedBackModal from "./feedBackModal";
import ExportPdfModal from "./exportPdfScheduleModal";
import FeedBackModalV3 from "./feedBackModalV3";
import { useSelector } from "react-redux";
import DetailFeedBack from "./detailFeedBack";
import SendEmailReceiveJob from "./uploadFileReceiveJob";
import { IoOpenOutline } from "react-icons/io5";
import DetailFile from "./detailFile";
const { confirm } = Modal;
const ScheduleTab = ({  timeStart, timeEnd, nameSeach }) => {
  const [spinning, setSpinning] = useState(false);
  const userLogin = useSelector((state) => state?.profile);
  const [searchParams] = useSearchParams();
  const [openFeedBack, setOpenFeedBack] = useState(false);
  const [openFeedBackV3, setOpenFeedBackV3] = useState(false);
  const [interviewId, setInterviewId] = useState();
  const [interviewer, setInterviewer] = useState();
  const [openDetailRound, setOpenDetailRound] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [openDetailSchedule, setOpenDetailSchedule] = useState(false);

  const [statusRound, setStatusRound] = useState(0);
  const [openModalSendEmail, SetOpenModalSendEmail] = useState(false);
  const [par, setPar] = useState();

  const targetRef = useRef();
  const [dataExport, setDataExport] = useState();

  const [dataTb, setDataTb] = useState([]);
  const [totalRecordTb, setTotalRecordTb] = useState(0);

  const [paginationTab, setPaginationTab] = useState({
    page_num: 1,
    page_size: 10,
  });

  const applicant_id = searchParams.get("applicant_id");
  const tabKey = searchParams.get("tabKey");

  const handleGetScheldule = async (page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab({ page_num, page_size });

      const params = {
        page_num,
        page_size,
        name: nameSeach,
        tabKey:tabKey||null,
        applicant_id:applicant_id||null,
        imterview_time_start: dayjs(timeStart).startOf("D").unix() || null,
        imterview_time_end: dayjs(timeEnd).endOf("D").unix() || null,
        tab: 1,
      };
      setPar(params);

      const { data, status } = await actionGetScheldule(params);

      if (status === 200) {
        setDataTb(data?.list_interview);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };



  useEffect(() => {
    handleGetScheldule(1, 10);
  }, [applicant_id, timeStart, nameSeach, timeEnd]);


  // const check_role = (record) => {

  //   if (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6" && (record?.status === 0 && record?.review_round_1 == null)) {
  //     return false
  //   } else if ((record?.interviewer.includes(userLogin.id)) && (record?.status === 0 && record?.review_round_2 == null)) {
  //     return false
  //   } else if (userLogin.position_code === "NHAN_SU") {
  //     if (record?.status !== 0 || record?.review_round_1 == null) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   } else {
  //     return true
  //   }


  // }

  const menu = (
    <Menu onClick={({ key }) => handleMenuClick(key, idToDelete)}>
      <Menu.Item key="delete">Xóa</Menu.Item>
      <Menu.Item key="delete-email">Xóa gửi email</Menu.Item>
    </Menu>
  );

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

  // const handleReview = async (id, page_num, page_size) => {
  //   setSpinning(true);
  //   try {
  //     setPaginationTab({ page_num, page_size });
  //     const params = {
  //       page_num,
  //       page_size,
  //       // recruitment_id: applicant_id || null,
  //       tab: 1,
  //     };
  //     setPar(params);
  //     const req_data = {
  //       form_review: null,
  //       status: 0,
  //       interview_time: null,
  //       interviewer: null,
  //       salary: null,
  //       start_working: null,
  //       description: null,
  //       interview_action: null,
  //     };
  //     const { status, data } = await actionHandleReview(id, req_data, params);

  //     if (status === 200) {
  //       message.success(data?.message);
  //       setDataTb(data?.list_interview);
  //       setTotalRecordTb(data?.total);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setSpinning(false);
  // };

  const handleDeleteCv = async (id, page_num, page_size) => {
    setSpinning(true);

    try {
      setPaginationTab({ page_num, page_size });
      const params = {
        page_num,
        tab: 1,
        page_size,
        applicant_id: applicant_id || null,
      };
      const req_data = {
        status: 2,
      };
      const { status, data } = await actionHandleReview(id, req_data, params);

      if (status === 200) {
        message.success(data?.message);
        setDataTb(data?.list_interview);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }

    setSpinning(false);
  };

  const checkPv1 = (r) =>{
    // console.log(r);
    if (userLogin.position_code == "GIAM_DOC" ||
      userLogin.position_code == "P_GIAM_DOC" ||
       ((userLogin.position_code == "TRUONG_PHONG" && userLogin.department_code == "PB6" && !r.review_round_1) || (userLogin.department_id ==  r.department_id && !r.review_round_2))||
     (r.interviewer.includes(userLogin.id) && !r.review_round_2)||
     (userLogin.position_code =="NHAN_SU")
      )

       return true;
    
    return false
  }

    



  const handleDeleteCvWithEmail = async (id, page_num, page_size) => {
    setSpinning(true);
    try {
      setPaginationTab({ page_num, page_size });
      const params = {
        page_num,
        page_size,
      };
      setPar(params);
      const req_data = {
        review_round_1:null ,
        review_round_2:null,
        review_round_3:null,
        status: 2,
        salary: null,
        description: null,
      };
      const { status, data } = await actionHandleReview(id, req_data, params);

      if (status === 200) {
        message.success(data?.message);
        setDataTb(data?.list_interview);
        setTotalRecordTb(data?.total);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
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
      title: "Phòng ban",
      dataIndex: "dep_name",
      key: "dep_name",
      align: "center",
    },
    {
      title: "Thời gian phỏng vấn",
      dataIndex: "interview_time",
      key: "interview_time",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
    },
    {
      title: "Vị trí dự tuyển",
      dataIndex: "position_name",
      key: "position_name",
      align: "center",
    },
    {
      title: "Người phỏng vấn",
      dataIndex: "interviewer_name",
      key: "interviewer_name",
      render: (v, r) =>
        r?.interviewer_name
          .map((e) => e)
          .toLocaleString()
          .replace(/,/g, ", "),
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
          onClick={() => setOpenDetailSchedule(r)}
          type="primary"
        >
          <IoOpenOutline />
          <span className="btn-text">Mở</span>
        </Button>
      ),
      align: "center",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Đánh giá của phòng Hành chính Nhân sự",
      dataIndex: "cvreview_round_1",
      key: "review_round_1",
      render: (v, r) =>
        r?.review_round_1 &&
        (
          <Button
            className="btn-update success-btn"
            onClick={() => {
              setStatusRound(1);
              setOpenDetailRound(r);
            }}
          >
            Mở
          </Button>
        ),
      align: "center",
    },
    {
      title: "Đánh giá của phụ trách bộ phận Chuyên môn",
      dataIndex: "cvreview_round_2",
      key: "cvreview_round_2",
      render: (v, r) =>
        r?.review_round_2 &&
        (
          <Button
            className="btn-update success-btn"
            onClick={() => {
              setStatusRound(2);
              setOpenDetailRound(r);
            }}
          >
            Mở
          </Button>
        ),
      align: "center",
    },
    {
      title: "Đánh giá của ban giám đốc",
      dataIndex: "cvreview_round_3",
      key: "review_round_3",
      render: (v, r) =>
        r?.review_round_3 &&
        (
          <Button
            className="btn-update success-btn"
            onClick={() => {
              setStatusRound(3);
              setOpenDetailRound(r);
            }}
          >
            Mở
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
      width: 450,
      title: "Thao tác",
      dataIndex: "t",
      key: "t",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          
          {checkPv1(r) &&  <Button
            className="btn-with-icon request-btn"
            onClick={() => {
              setOpenFeedBack(r);
              setInterviewId(r.id);
              setInterviewer(r.interviewer);
            }}
            // disabled={
            //   check_role(r)

            // }
           
            type="info"
          >
            <TbSquareRoundedNumber1 />
            <span className="btn-text">Vòng 1</span>
          </Button>}
         

          <Button
            className="btn-with-icon request-btn"
            onClick={() => {
              setOpenFeedBackV3(r);
              setInterviewId(r.id);
            }}
            disabled={
              (userLogin.position_code !== "GIAM_DOC"&&userLogin.position_code !== "P_GIAM_DOC") 
            }
            type="info"
          >
            <TbSquareRoundedNumber2 />
            <span className="btn-text">Vòng 2</span>
          </Button>

          

          {(userLogin?.position_code === "NHAN_SU" ||
            (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6"))
            && r?.status === 3 && (
              <Button
                className="btn-with-icon status-btn"
                onClick={() => {
                  setInterviewId(r.id);
                  SetOpenModalSendEmail(true);
                }}
                type="info"
              >
                <MdOutlineEmail />
                <span className="btn-text">Gửi email nhận việc </span>
              </Button>
            )}

          {/* {
            // userLogin?.position_code !== "GIAM_DOC" && 
            (

              <Popconfirm
                title={"Bạn chắc chắn muốn loại?"}
                okText={"Loại"}
                cancelText="Hủy"
                // onConfirm={() => handleReview(r.id, paginationTab.page_num, paginationTab.page_size)}
                onConfirm={() => handleReview(r.id)}
              >
                <Button className="btn-with-icon" type="cancel">
                  <BiSolidDislike />
                  <span className="btn-text">Loại</span>
                </Button>
              </Popconfirm>
            )} */}

          {(userLogin?.position_code === "NHAN_SU" ||
            (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")) && (
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  className="btn-with-icon"
                  type="cancel"
                  onClick={() => setIdToDelete(r.id)}
                >
                  <MdDelete />
                  <span className="btn-text">Loại</span>
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
            onClick={() => {
              setDataExport(dataTb);
            }}
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
            loading={spinning}
            columns={columns}
            dataSource={dataTb}
            scroll={{ x: 2000 }}
            pagination={{
              current: paginationTab.page_num,
              pageSize: paginationTab.page_size,
              total: totalRecordTb,
              onChange: handleGetScheldule,
            }}
          />
        </Col>
      </Row>

      <>
      {openDetailSchedule && (
          <DetailFile
            openDetailSchedule={openDetailSchedule}
            onCancel={() => setOpenDetailSchedule(false)}
          />
        )}
        {openFeedBack && (
          <FeedBackModal
            openFeedBack={openFeedBack}
            onCancel={() => setOpenFeedBack(false)}
            setDataTb={setDataTb}
            interviewId={interviewId}
            page_num={paginationTab.page_num}
            page_size={paginationTab.page_size}
            interviewer={interviewer}
          />
        )}

       

        {openFeedBackV3 && (
          <FeedBackModalV3
            openFeedBackV3={openFeedBackV3}
            onCancel={() => setOpenFeedBackV3(false)}
            setDataTb={setDataTb}
            interviewId={interviewId}
          />
        )}
        {openDetailRound && (
          <DetailFeedBack
            openDetailRound={openDetailRound}
            statusRound={statusRound}
            onCancel={() => {
              setOpenDetailRound(false)

            }}
          />
        )}
        {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
            userLogin={userLogin}
          />
        )}
        {openModalSendEmail && (
          <SendEmailReceiveJob
            interviewId={interviewId}
            setDataTb={setDataTb}
            par={par}
            onCancel={() => SetOpenModalSendEmail(false)}
          />
        )}
      </>
    </>
  );
};
export default ScheduleTab;
