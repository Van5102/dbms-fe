import { useState } from "react";
import { Layout, Space, Table, InputNumber, Col, Row } from "antd";

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
            max={1000000000}
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
            max={1000000000}
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
          max={1000000000}
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
          max={1000000000}
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
          max={31}
          value={format(
            holiday[index + pagination.pageSize * (pagination.current - 1)] || 0
          )}
          onChange={(value) =>
            handleHolidayChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
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
      title: "Ngày tồn phép trong năm",
      dataIndex: "leave_allow_remaining",
      key: "leave_allow_remaining",
      align: "center",
    },
    {
      title: "Ngày công tác",
      dataIndex: "day_bussiness",
      key: "day_bussiness",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={30}
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
      title: "Hệ số đánh giá (KPI)",
      dataIndex: "kpi",
      key: "kpi",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          value={format(
            kpi[index + pagination.pageSize * (pagination.current - 1)] || 0
          )}
          max={1}
          onChange={(value) =>
            handleKpiChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Lương cơ bản(Thực tế)",
      dataIndex: "salary_basic_current",
      key: "salary_basic_current",
      align: "center",
      render: (v, r) => {
        return format(r?.salary_basic_current || 0);
      },
    },
    {
      title: "Thưởng HQCV(Thực tế)",
      dataIndex: "hqcv_reward",
      key: "hqcv_reward",
      align: "center",
      render: (v, r) => {
        return format(r?.hqcv_reward || 0);
      },
    },
    {
      title: "Phụ cấp xăng xe(Thực tế)",
      dataIndex: "allowance_gas_tt",
      key: "allowance_gas_tt",
      align: "center",
      render: (v, r) => {
        return format(r?.allowance_gas_tt || 0);
      },
    },
    {
      title: "Phụ cấp trách nhiệm(Thực tế)",
      dataIndex: "allowance_responsibility_tt",
      key: "allowance_responsibility_tt",
      align: "center",
      render: (v, r) => {
        return format(r?.allowance_responsibility_tt || 0);
      },
    },
    {
      title: "Lương làm thêm giờ",
      dataIndex: "over_time",
      key: "over_time",
      align: "center",
      render: (v, r) => {
        return format(r?.over_time || 0);
      },
    },
    {
      title: "Tổng lương theo thực tế",
      dataIndex: "salary_total_tt",
      key: "salary_total_tt",
      align: "center",
      render: (v, r) => {
        return format(r?.salary_total_tt || 0);
      },
    },
    {
      title: "Lương BHXH",
      dataIndex: "social_insurance",
      key: "social_insurance",
      align: "center",
      render: (v, r) => {
        return format(r?.social_insurance || 0);
      },
    },
    {
      title: "10.5% mức BHXH",
      dataIndex: "social_insurance_105",
      key: "social_insurance_105",
      align: "center",
      render: (v, r) => {
        return format(r?.social_insurance_105 || 0);
      },
    },
    {
      title: "Khoản cộng/trừ khác",
      dataIndex: "add_sub_salary",
      key: "add_sub_salary",
      render: (v, r, index) => (
        <InputNumber
        max={10000000000}
        min={-10000000000}
          value={format(
            addSub[index + pagination.pageSize * (pagination.current - 1)] || 0
          )}
          onChange={(value) =>
            handleAddSubChange(
              value,
              index + pagination.pageSize * (pagination.current - 1)
            )
          }
        ></InputNumber>
      ),
      align: "center",
    },
    {
      title: "Trừ phút việc riêng",
      dataIndex: "free_time_pay",
      key: "free_time_pay",
      align: "center",
      render: (v, r) => {
        return format(r?.free_time_pay || 0);
      },
    },
    {
      title: "Lương được nhận",
      dataIndex: "salary_final",
      key: "salary_final",
      align: "center",
      render: (v, r) => {
        return format(r?.salary_final || 0);
      },
    },
    // {
    //   title: "Thao tác ",
    //   dataIndex: "edit",
    //   key: "edit",
    //   render: (v, r, index) => <Space onClick={e => e.stopPropagation()}>
    //     <Button type="info"
    //       onClick={() => {

    //         handleUpdateSalaryForUser(index + pagination.pageSize * (pagination.current - 1))
    //       }
    //       }>
    //       Cập nhật
    //     </Button>
    //   </Space>,
    //   align: "center",
    // }
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
                scroll={{ x: 4000 }}
              />
            </Col>
          </Row>
        </Col>
      </div>
    </Layout>
  );
};

export default PayRollUser;
