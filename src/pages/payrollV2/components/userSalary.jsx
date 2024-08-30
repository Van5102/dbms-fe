import { useState } from "react";
import { Layout, Space, Table, InputNumber, Col, Row, Input } from "antd";

const PayRollUser = ({
  workingStand,
  setWorkingStand,
  setData,
  data

}) => {
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

  const format = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };





  const handleGetSumData = (r, name) => {
    let E2 = r?.working_standard || 0
    let F = r?.basic_salary_hd || 0
    let G = r?.hqcv_hd || 0
    let H = r?.allowance_gas_hd || 0
    let I = r?.allowance_responsibility_hd || 0
    let J = F + G + H + I
    // let K = 22
    let K = r.actual_workday
    let L = r?.holiday || 0
    let M = r?.total_leave_allow_day || 0
    let Z = r?.day_bussiness || 0
    let T = F / E2 * (K + L + M + Z)
    let S = r?.kpi || 0
    let U = ((G / E2) * (K + L + Z)) * S
    let V = H / E2 * (K + L + Z)
    let N = r?.total_leave_not_allow_day || 0
    let O = r?.total_overtime_during_week || 0
    let P = r?.total_overtime_day_off || 0
    let Q = r?.total_overtime_on_holidays || 0
    let X = ((J / E2 / 480) * O * 1.5) + ((J / E2 / 480 * P * 2) + ((J / E2 / 480 * Q * 3)))
    let W = I
    let Y = T + U + V + W + X
    let AA = F * (10.5) / 100
    let R = r?.total_freetime || 0
    // let R = 520
    let AB = J / E2 / 480 * R
    let AD = r?.add_sub_salary || 0
    let AE = Y - AA - AB + AD



    // console.log(J, E2, N);

    switch (name) {
      case 'salary_total': return parseInt(J)
      case 'salary_basic_current': return parseInt(T)
      case 'hqcv_reward': return parseInt(U)
      case 'allowance_gas_tt': return parseInt(V)
      case 'over_time': return parseInt(X)
      case 'salary_total_tt': return parseInt(Y)
      case 'social_insurance_105': return parseInt(AA)
      case 'free_time_pay': return parseInt(AB)
      case 'salary_final': return parseInt(AE)

      default:
        break;
    }



  }

  const handleSetData = (value, column_name, r) => {
    console.log(value, column_name, r?.user_id);
    if (setData) {
      setData(prev =>
        prev?.map(item => {

          if (item?.user_id == r?.user_id) {

            let new_item = { ...r }
            new_item[column_name] = value
            return new_item
          }

          else return item;
        })
      )
    }
  }

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
      dataIndex: "user_id",
      key: "user_id",
      align: "center",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    {
      title: "Chức vụ",
      dataIndex: "position_name",
      key: "position_name",
      align: "center",
    },
    {
      title: "Họ và tên",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
    },

    {
      title: "Lương cơ bản(theo HĐ)",
      dataIndex: "basic_salary_hd",
      key: "basic_salary_hd",
      align: "center",
      render: (v, r, index) => {
        return (
          <InputNumber
            min={0}
            max={1000000000}
            value={format(v || 0)}
            onChange={(value) => handleSetData(value, "basic_salary_hd", r)}
          />
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
            value={format(v || 0)}
            onChange={(value) => handleSetData(value, "hqcv_hd", r)}
          />
        );
      },
    },
    {
      title: "Phụ cấp xăng xe, điện thoại(theo HĐ)",
      dataIndex: "allowance_gas_hd",
      key: "allowance_gas_hd",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={1000000000}
          value={format(v || 0)}
          onChange={(value) => handleSetData(value, "allowance_gas_hd", r)}
        />
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
          value={format(v || 0)}
          onChange={(value) => handleSetData(value, "allowance_responsibility_hd", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Tổng lương(theo HĐ)",
      dataIndex: "salary_total",
      key: "salary_total",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'salary_total'))


    },
    {
      title: "Tổng ngày công",
      dataIndex: "working_standard",
      key: "working_standard",
      align: "center",
    },
    {
      title: "Công thực tế làm việc",
      dataIndex: "actual_workday",
      key: "actual_workday",
      align: "center",
    },
    {
      title: "Nghỉ làm ngày lễ tết",
      dataIndex: "holiday",
      key: "holiday",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={31}
          value={v || 0}
          onChange={(value) => handleSetData(value, "holiday", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Nghỉ làm hưởng phép năm(ngày)",
      dataIndex: "total_leave_allow_day",
      key: "total_leave_allow_day",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={10000}
          value={v || 0}
          onChange={(value) => handleSetData(value, "total_leave_allow_day", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Nghỉ không lương(ngày)",
      dataIndex: "total_leave_not_allow_day",
      key: "total_leave_not_allow_day",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={10000}
          value={v || 0}
          onChange={(value) => handleSetData(value, "total_leave_not_allow_day", r)}
        />
      ),
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
          value={v || 0}
          onChange={(value) => handleSetData(value, "day_bussiness", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày thường(Phút)",
      dataIndex: "total_overtime_during_week",
      key: "total_overtime_during_week",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={10000}
          value={v || 0}
          onChange={(value) => handleSetData(value, "total_overtime_during_week", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày nghỉ(chủ nhật)(Phút)",
      dataIndex: "total_overtime_day_off",
      key: "total_overtime_day_off",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={10000}
          value={v || 0}
          onChange={(value) => handleSetData(value, "total_overtime_day_off", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Làm thêm giờ ngày lễ tết(Phút)",
      dataIndex: "total_overtime_on_holidays",
      key: "total_overtime_on_holidays",
      render: (v, r, index) => (
        <InputNumber
          min={0}
          max={10000}
          value={v || 0}
          onChange={(value) => handleSetData(value, "total_overtime_on_holidays", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Phút việc riêng(PVR)",
      dataIndex: "total_freetime",
      key: "total_freetime",
      align: "center",
    },
    {
      title: "Hệ số đánh giá (KPI)",
      dataIndex: "kpi",
      key: "kpi",
      render: (v, r, index) => (
        <InputNumber
          value={v || 0}
          onChange={(value) => handleSetData(parseFloat(value), "kpi", r)}
        />
      ),
      align: "center",
    },
    {
      title: "Lương cơ bản(Thực tế)",
      dataIndex: "salary_basic_current",
      key: "salary_basic_current",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'salary_basic_current'))


    },
    {
      title: "Thưởng HQCV(Thực tế)",
      dataIndex: "hqcv_reward",
      key: "hqcv_reward",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'hqcv_reward'))


    },
    {
      title: "Phụ cấp xăng xe(Thực tế)",
      dataIndex: "allowance_gas_tt",
      key: "allowance_gas_tt",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'allowance_gas_tt'))

    },
    {
      title: "Phụ cấp trách nhiệm(Thực tế)",
      dataIndex: "allowance_responsibility_hd",
      key: "allowance_responsibility_hd",
      align: "center",
      render: (v, r) => v ? format(v) : null,
    },
    {
      title: "Lương làm thêm giờ",
      dataIndex: "over_time",
      key: "over_time",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'over_time'))

    },
    {
      title: "Tổng lương theo thực tế",
      dataIndex: "salary_total_tt",
      key: "salary_total_tt",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'salary_total_tt'))

    },
    {
      title: "Lương BHXH",
      dataIndex: "basic_salary_hd",
      key: "basic_salary_hd",
      align: "center",
      render: (v, r) =>
        format(v || 0)

    },
    {
      title: "10.5% mức BHXH",
      dataIndex: "social_insurance_105",
      key: "social_insurance_105",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'social_insurance_105'))

    },
    {
      title: "Khoản cộng/trừ khác",
      dataIndex: "add_sub_salary",
      key: "add_sub_salary",
      render: (v, r, index) => (
        <InputNumber
          max={10000000000}
          min={-10000000000}
          value={format(v || 0)}
          onChange={(value) => handleSetData((value), "add_sub_salary", r)}
        />

      ),
      align: "center",
    },
    {
      title: "Trừ phút việc riêng",
      dataIndex: "free_time_pay",
      key: "free_time_pay",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'free_time_pay'))

    },
    {
      title: "Lương được nhận",
      dataIndex: "salary_final",
      key: "salary_final",
      align: "center",
      render: (v, r) => format(handleGetSumData(r, 'salary_final'))
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
              ></InputNumber>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={[8, 0]} align="middle">
            <Col>
              <Table
                width="100%"
                dataSource={data}
                rowKey={(r) => r.user_id}
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
