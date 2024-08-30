import { SpinCustom, RejectProcedureModal } from "components";
import ApproveProcedureModal from "./approveProcedureModal";
import { Layout, Row, Col, Button, Table, Space, message } from "antd";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { actionHandleGetSalaryUser } from "../../payroll/action";
import { actionCreatePropose, actionHandlePropose } from "../action";
import { PROPOSE_STATUS, PROPOSE_DISPLAY } from "utils/constants/config";
import { useSelector } from "react-redux";
import { IsJsonString } from "utils/helps/index";
const SumTotalWorking = ({ start, end, nameSeach, row, selectedStatus }) => {

  const userLogin = useSelector((state) => state?.profile);
  const [spinning, setSpinning] = useState(false);

  const [listWorking, setListWorking] = useState([]);
  const [salaryid, setSalaryId] = useState();
  const [existsSalary, setExistsSalary] = useState();
  const [openModalApprove, setOpenModalApprove] = useState(false);
  const [openModalReject, setOpenModalReject] = useState();
  const [approve, setApprove] = useState();

  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });


  console.log(listWorking);
  const checkRole = () => {
    return (
      userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      (userLogin.position_code === "TRUONG_PHONG" &&
        userLogin.department_code === "PB6")
    );
  };

  const createPropose = async (describe, salary_id, stt) => {
    setSpinning(true);
    try {
      const params = {
        description: describe,
      };

      const { data, status } = await actionCreatePropose(
        salary_id,
        stt,
        params
      );

      if (status === 200) {
        setListWorking(
          IsJsonString(data?.list_slary)
            ? JSON.parse(data?.list_slary)
            : data?.list_slary
        );
        message.success(data?.message);
      }
    } catch (err) {
      message.error(err);
    }
    setSpinning(false);
  };

  const handlePropose = async (describe, stt) => {
    setSpinning(true);
    try {
      const { data, status } = await actionHandlePropose(salaryid, stt, {
        feedback: describe,
      });
      if (status === 200) {
        setListWorking(
          IsJsonString(data?.list_slary)
            ? JSON.parse(data?.list_slary)
            : [...data?.list_slary]
        );
        message.success(data?.message);
      }
    } catch (err) {
      message.error(err);
    }
    setSpinning(false);
  };

  const columns = [
    {
      fixed: "left",
      width: "1.7%",
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
      title: "MS",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Bộ phận",
      dataIndex: "dep_name",
      key: "dep_name",
      align: "center",
    },
    {
      title: "Chức danh",
      dataIndex: "pos_name",
      key: "pos_name",
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
      title: "Tổng ngày công",
      dataIndex: "working_standard",
      key: "working_standard",
      align: "center",
    },
    {
      title: "Ngày công thực tế",
      dataIndex: "total_working_day",
      key: "total_working_day",
      align: "center",
    },
    {
      title: "Ngày nghỉ lễ tết",
      dataIndex: "holiday",
      key: "holiday",
      align: "center",
    },
    {
      title: "Ngày nghỉ phép",
      dataIndex: "leave_allow_day",
      key: "leave_allow_day",
      align: "center",
    },
    {
      title: "Ngày nghỉ không phép",
      dataIndex: "leave_not_allow_day",
      key: "leave_not_allow_day",
      align: "center",
    },
    {
      title: "Ngày tồn phép trong năm",
      dataIndex: "leave_allow_remaining",
      key: "leave_allow_remaining",
      align: "center",
    },
    {
      title: "Ngày công tác",
      dataIndex: "day_bussiness",
      key: "day_bussiness",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày thường",
      dataIndex: "over_time_weekday",
      key: "overtime_weekday",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày nghỉ",
      dataIndex: "over_time_weeken",
      key: "over_time_weeken",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày lễ tết",
      dataIndex: "over_time_holiday",
      key: "over_time_holiday",
      align: "center",
    },
    {
      title: "Phút việc riêng",
      dataIndex: "free_time_day",
      key: "free_time_day",
      align: "center",
    },
    {
      title: "Kiến nghị",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Phản hồi",
      dataIndex: "feedback",
      key: "feedback",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (v, r) => {
        let statusClass;
        switch (r?.status) {
          case 0:
            statusClass = "process--success";
            break;
          case 1:
            statusClass = "process--waiting";
            break;
          case 2:
            statusClass = "process--success";
            break;
          case 3:
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }

        return (
          <span className={statusClass}>{PROPOSE_DISPLAY[r?.status]}</span>
        );
      },
      // render: (v, r) => {
      //   return PROPOSE_DISPLAY[r?.status];
      // },
    },
    {
      title: "Thao tác ",
      dataIndex: "edit",
      key: "edit",
      render: (v, r) => (
        <Space>
          {userLogin.id === r?.id && existsSalary && r?.status === null && (
            <Button
              type="primary"
              onClick={() => {
                setSalaryId(r?.salary_id);
                setOpenModalApprove(true);
                // createPropose(null, r?.salary_id, PROPOSE_STATUS.ACCEPT);
              }}
            >
              Xác nhận
            </Button>
          )}

          {userLogin.id === r?.id && existsSalary && r?.status === null && (
            <Button
              type="info"
              onClick={() => {
                setSalaryId(r?.salary_id);
                // setStatus(PROPOSE_STATUS.PROPOSE);
                setOpenModalReject(true);
                // setOpenModalCreatePopose(true);
              }}
            >
              Kiến nghị
            </Button>
          )}

          {checkRole() &&
            userLogin.id !== r?.id &&
            r?.status === PROPOSE_STATUS.PROPOSE && (
              <Button
                Button
                type="primary"
                onClick={() => {
                  setSalaryId(r?.salary_id);
                  // setStatus(PROPOSE_STATUS.ACCEPT_PROPOSE);
                  setOpenModalApprove(true);
                  setApprove(true);
                }}
              >
                Đồng ý
              </Button>
            )}

          {checkRole() &&
            userLogin.id !== r?.id &&
            r?.status === PROPOSE_STATUS.PROPOSE && (
              <Button
                Button
                type="cancel"
                onClick={() => {
                  setSalaryId(r?.salary_id);
                  // setStatus(PROPOSE_STATUS.REFUSE_PROPOSE);
                  setOpenModalReject(true);
                  setApprove(true);
                }}
              >
                Từ chối
              </Button>
            )}
        </Space>
      ),
      align: "center",
    },
  ];

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const handleGetListWorking = async () => {
    setSpinning(true);
    try {
      const params = {
        user_id: checkRole() ? null : userLogin.id,
        time_start: dayjs(start).startOf("D").unix() || null,
        time_end: dayjs(end).endOf("D").unix() || null,
        name: nameSeach,
        department: selectedStatus,
        salary_id: row,
      };
      await actionHandleGetSalaryUser(dayjs(start).startOf("D").unix(), params)
        .then((response) => {
          const { data, status } = response;

          if (status === 200) {
            setExistsSalary(true);
            const list_salary = IsJsonString(data?.list_slary)
              ? JSON.parse(data?.list_slary)
              : data?.list_slary;
            setListWorking(list_salary);
          }
        })

        .catch((respone) => {
          setExistsSalary(false);
          const data = respone.response.data;
          const list_salary = IsJsonString(data?.list_slary)
            ? JSON.parse(data?.list_slary)
            : data?.list_slary;
          setListWorking(list_salary);
        });
    } catch (err) {
      message.error(err);
    }
    setSpinning(false);
  };

  useEffect(() => {
    handleGetListWorking();
  }, [start, end, nameSeach, selectedStatus]);

  return (
    <Layout className="common-layout">
      <div className="common-layout--content">
        <SpinCustom spinning={spinning}>
          <Col>
            <Row gutter={[8, 0]} align="middle">
              <Col>
                <Table
                  width="100%"
                  dataSource={listWorking}
                  rowKey={(r) => r.id}
                  columns={columns}
                  pagination={{
                    pageSize: pagination.pageSize,
                    current: pagination.current,
                    onChange: handleChangePage,
                  }}
                  scroll={{ x: 1900 }}
                />
              </Col>
            </Row>
          </Col>
        </SpinCustom>
      </div>
      <>
        {openModalReject && salaryid && (
          <RejectProcedureModal
            onCancel={() => setOpenModalReject(false)}
            onRejection={(describe) => {
              approve
                ? handlePropose(describe, PROPOSE_STATUS.REFUSE_PROPOSE)
                : createPropose(describe, salaryid, PROPOSE_STATUS.PROPOSE);
              setSalaryId(null);
              setOpenModalReject(false);
            }}
          />
        )}

        {openModalApprove && salaryid && (
          <ApproveProcedureModal
            onClose={() => setOpenModalApprove(false)}
            onOk={(describe) => {
              approve
                ? handlePropose(describe, PROPOSE_STATUS.ACCEPT_PROPOSE)
                : createPropose(describe, salaryid, PROPOSE_STATUS.ACCEPT);
              setSalaryId(null);
              setOpenModalApprove(false);
            }}
            spinning={spinning}
          />
        )}
      </>
    </Layout>
  );
};

export default SumTotalWorking;
