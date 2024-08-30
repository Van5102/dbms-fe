import { useState } from "react";

import { Layout, Space, Table, InputNumber, Col, Row, Button } from "antd";

const PayRollUser = ({
  basicSalaries,
  listUserSalary,
  hqcvhd,
  allGasHd,
  holiday,
  dayBussiness,
  kpi,
  addSub,
  setBasicSalaries,
  sethqcvhd,
  setAllGasHd,
  setAllResponHd,
  setdayBussiness,
  setKpi,
  setAddSub,
  setHoliday,
  allResponHd,
  setId,
  id,
  workingStand,
  setWorkingStand,
}) => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const handleFieldChange = (value, recordIndex) => {
    const a = [...basicSalaries];
    a[recordIndex] = value;
    if (value > 0) {
      setBasicSalaries(a);
    } else {
    }
  };

  const handleGetIdChange = (value, recordIndex) => {
    const a = [...id];
    a[recordIndex] = value;
    setId(a);
  };

  const handleHQCVHDChange = (value, recordIndex) => {
    const a = [...hqcvhd];
    a[recordIndex] = value;
    sethqcvhd(a);
  };

  const handleAllGasHdChange = (value, recordIndex) => {
    const a = [...allGasHd];
    a[recordIndex] = value;
    setAllGasHd(a);
  };

  const handleAllResponHdChange = (value, recordIndex) => {
    const a = [...allResponHd];
    a[recordIndex] = value;
    setAllResponHd(a);
  };

  const handleHolidayChange = (value, recordIndex) => {
    const a = [...holiday];
    a[recordIndex] = value;
    setHoliday(a);
  };

  const handleDayBussinessChange = (value, recordIndex) => {
    const a = [...dayBussiness];
    a[recordIndex] = value;
    setdayBussiness(a);
  };

  const handleKpiChange = (value, recordIndex) => {
    const a = [...kpi];
    a[recordIndex] = value;
    setKpi(a);
  };

  const handleAddSubChange = (value, recordIndex) => {
    const a = [...addSub];
    a[recordIndex] = value;
    setAddSub(a);
  };

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const format = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
      title: "Mã số",
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
      title: "Lương cơ bản/Lương đóng BH(theo HĐ)",
      dataIndex: "basic_salary_hd",
      key: "basic_salary_hd",
      align: "center",
      render: (v, r, index) => {
        return (
          <InputNumber
            min={0}
            value={format(
              basicSalaries[
                index + pagination.pageSize * (pagination.current - 1)
              ] || 0
            )}
            onChange={(value) => {
              handleFieldChange(
                value,
                index + pagination.pageSize * (pagination.current - 1)
              );
              handleGetIdChange(
                r.id,
                index + pagination.pageSize * (pagination.current - 1)
              );
            }}
            disabled
          ></InputNumber>
        );
      },
    },
    {
      title: "Thưởng HQCV(theo HĐ)",
      dataIndex: "hqcv_hd",
      key: "hqcv_hd",
      align: "center",
      render: (v, r, index) => {
        return (
          <InputNumber
            min={0}
            value={format(
              hqcvhd[index + pagination.pageSize * (pagination.current - 1)] ||
                0
            )}
            onChange={(value) =>
              handleHQCVHDChange(
                value,
                index + pagination.pageSize * (pagination.current - 1)
              )
            }
            disabled
          ></InputNumber>
        );
      },
    },
    {
      title: "Phụ cấp xăng xe(theo HĐ)",
      dataIndex: "allowance_gas_hd",
      key: "allowance_gas_hd",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          value={format(
            allGasHd[index + pagination.pageSize * (pagination.current - 1)] ||
              0
          )}
          onChange={(value) =>
            handleAllGasHdChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
          disabled
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Phụ cấp trách nhiệm(theo HĐ)",
      dataIndex: "allowance_responsibility_hd",
      key: "allowance_responsibility_hd",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          value={format(
            allResponHd[
              index + pagination.pageSize * (pagination.current - 1)
            ] || 0
          )}
          onChange={(value) =>
            handleAllResponHdChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
          disabled
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Tổng lương HĐ(theo HĐ)",
      dataIndex: "salary_total",
      key: "salary_total",
      align: "center",
      render: (v, r) => {
        return format(r?.salary_total || 0);
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
      render: (v, r, index) => (
        <InputNumber
          min={0}
          value={format(
            holiday[index + pagination.pageSize * (pagination.current - 1)] || 0
          )}
          onChange={(value) =>
            handleHolidayChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
          disabled
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Ngày nghỉ phép(hưởng phép năm)",
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
      title: "Ngày công tác",
      dataIndex: "day_bussiness",
      key: "day_bussiness",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          value={format(
            dayBussiness[
              index + pagination.pageSize * (pagination.current - 1)
            ] || 0
          )}
          onChange={(value) =>
            handleDayBussinessChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
          disabled
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày thường",
      dataIndex: "over_time_weekday",
      key: "overtime_weekday",
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày nghỉ(chủ nhật)",
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
      title: "Phút việc riêng(PVR)",
      dataIndex: "free_time_day",
      key: "free_time_day",
      align: "center",
    },

    {
      title: "Thao tác ",
      dataIndex: "edit",
      key: "edit",

      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="primary"
            // onClick={() => {
            //   handleFreeTime(r?.id, STATUS["ACCEPT"]);
            // }}
          >
            Xác nhận
          </Button>

          <Button
            type="info"
            // onClick={() => {
            //   handleFreeTime(r?.id, STATUS["REFUSE"]);
            // }}
          >
            Kiến nghị
          </Button>
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <Layout className="common-layout">
      <div className="common-layout--content">
        <Col>
          <Row gutter={[8, 0]} align="middle">
            <Col>
              <b>Công chuẩn: </b>
            </Col>
            <Col>
              <InputNumber
                min={1}
                value={workingStand}
                onChange={(e) => {
                  setWorkingStand(e);
                }}
                disabled
              ></InputNumber>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={[8, 0]} align="middle">
            <Col>
              <Table
                width="100%"
                dataSource={listUserSalary}
                rowKey={(r) => r.id}
                columns={columns}
                pagination={{
                  pageSize: pagination.pageSize,
                  current: pagination.current,
                  onChange: handleChangePage,
                }}
                scroll={{ x: 2500 }}
              />
            </Col>
          </Row>
        </Col>
      </div>
    </Layout>
  );
};

export default PayRollUser;
