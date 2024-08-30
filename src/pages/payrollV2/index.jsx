import {
  Layout,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  Button,
  Tabs
} from "antd";
import * as XLSX from "xlsx";
import {
  actionHandleAddSalaryUser,
  actionHandleGetSalaryUser,
} from "./action";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { DATE_FORMAT, DATE_FORMAT_EN, DEPARTMENTS_CODE, YEAR_MONTH_FORMAT } from "utils/constants/config";
import dayjs from "dayjs";

import PayRollUser from "./components/userSalary";
import { message } from "antd";
import { SpinCustom } from "components";

const PayRollV2 = () => {
  const userLogin = useSelector((state) => state?.profile);
  const departments = useSelector((state) => state?.departments);
  const [spinning, setSpinning] = useState(false);
  const checkRole = () => {
    return userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ||
      (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")
  }

  const [data, setData] = useState([]);
  const [tab, setTab] = useState((userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC") ? '2' : '1')
  const [workingStand, setWorkingStand] = useState(0);
  const [start, setStart] = useState(dayjs().startOf("day"));
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [nameSeach, setNameSeach] = useState("");

  
  const format = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleExportToExcelProduce = () => {
    const tmp = data.map((e, index) => {
      return {
        STT: index + 1,
        "Mã số": e?.id,
        "Họ và tên": e?.user_name,
        "Phòng ban": e?.department_name,
        "Chức vụ": e?.position_name,
        "Lương cơ bản/BH(HĐ)": format(e?.basic_salary_hd) ,
        "Thưởng HQCV(HĐ)": format(e?.hqcv_hd),
        "Phụ cấp xăng xe(HĐ)": format(e?.allowance_gas_hd),
        "Phụ cấp trách nhiệm(HĐ)": format(e?.allowance_responsibility_hd),
        "Tổng lương HĐ(HĐ)": format(e?.salary_total),
        "Tổng ngày công ": e?.working_standard,
        "Ngày công thực tế ": e?.total_working_day,
        "Ngày nghỉ lễ tết ": e?.holiday,
        "Ngày nghỉ phép(hưởng phép năm) ": e?.total_leave_allow_day,
        "Ngày nghỉ không phép": e?.total_leave_not_allow_day,
        "Ngày công tác": e?.day_bussiness,
        "Làm thêm giờ ngày thường(phút)": e?.total_overtime_during_week,
        "Làm thêm giờ ngày nghỉ(chủ nhật)(phút)": e?.total_overtime_day_off,
        "Làm thêm giờ ngày lễ tết(phút)": e?.total_overtime_on_holidays,
        "Phút việc riêng(PVR)": e?.total_freetime,
        "Hệ số đánh giá (KPI)": e?.kpi,
        "Lương cơ bản(Thực tế)": format(e?.salary_basic_current),
        "Thưởng HQCV(Thực tế)": format(e?.hqcv_reward),
        "Phụ cấp xăng xe(Thực tế)": format(e?.allowance_gas_tt),
        "Phụ cấp trách nhiệm(Thực tế)": format(e?.allowance_responsibility_tt),
        "Lương làm thêm giờ": format(e?.over_time),
        "Tổng lương theo thực tế": format(e?.salary_total_tt),
        "Lương BHXH": format(e?.social_insurance),
        "10.5% mức BHXH": format(e?.social_insurance_105),
        "Khoản cộng/trừ khác": format(e?.add_sub_salary),
        "Trừ phút việc riêng": format(e?.free_time_pay),
        "Lương được nhận": format(e?.salary_final),
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bang_luong");
    XLSX.writeFile(workbook, "Bang_luong.xlsx");
  };

  const handleUpdateSalary = async () => {
    setSpinning(true);
    try {
      const params = {
        name: nameSeach,
        department_id: selectedStatus,
        user_id: tab === '1' ? userLogin.id : null
      };

      const req_data = data?.map(item => ({
        ...item,
        working_standard: workingStand
      }))


      const { data: res_data, status } = await actionHandleAddSalaryUser(req_data, params)
      if (status === 200) {
        message.success(res_data?.message)
        setData(res_data?.payrolls)
        setWorkingStand(res_data?.payrolls[0]?.working_standard)
      }

    } catch (err) {
      message.error(err)
    }
    setSpinning(false);
  };

  const handleGetListKeeping = async () => {
    setSpinning(true);
    try {

      const params = {
        name: nameSeach,
        department_id: selectedStatus,
      };
      if(start){
        params.month =dayjs(start).format(DATE_FORMAT_EN) 
      }

      const { data: res_data, status } = await actionHandleGetSalaryUser(params)
      if (status == 200) {
        setData(res_data?.payrolls)
        setWorkingStand(res_data?.payrolls[0]?.working_standard)
      }


    } catch (err) {
      message.error(err)

    }

    setSpinning(false);
  };

  useEffect(() => {
    handleGetListKeeping();
  }, [start, nameSeach, selectedStatus]);

  const items = [
    (userLogin.position_code !== "GIAM_DOC" && userLogin.position_code !== "P_GIAM_DOC") && {
      key: '1',
      label: 'Bảng lương cá nhân',
      children: <PayRollUser
        // setData={setData}
        data={data?.filter(item => item?.user_id == userLogin.id)}
        workingStand={workingStand}
        setWorkingStand={setWorkingStand}

      />,
    },
    (checkRole()) &&
    {
      key: '2',
      label: 'Bảng lương Công ty',
      children: <PayRollUser
        setData={setData}
        data={data}
        workingStand={workingStand}
        setWorkingStand={setWorkingStand}

      />
    },
  ];

  const onChange = (key) => {
    setTab(key)
  };

  return (
    <Layout className="common-layout">
      <div className="common-layout--header">
        <Row className="filler" gutter={[8, 8]}>
          <Col className="filler--item">
            <Row gutter={[8, 8]}>
              <Col className="align--center">
                <DatePicker
                  defaultValue={start}
                  onChange={(v) => {
                    setStart(v);
                  }}
                  allowClear={false}
                  format={DATE_FORMAT}
                />
              </Col>
            </Row>
          </Col>

          {tab === '2' && <Col className="filler--item">
            <Input.Search
              onSearch={(v) => {
                setNameSeach(v);
              }}
              placeholder="Nhập tên ..."
              allowClear
            />
          </Col>}

          {tab === '2' && <Col>
            <Select
              className="w-full"
              placeholder="Phòng ban"
              onChange={setSelectedStatus}
              allowClear
            >
              {departments.map((dep) => {
                  return (
                    <Select.Option key={dep.id} value={dep.id}>
                      {dep?.name}
                    </Select.Option>
                  );
                })
                }
            </Select>
          </Col>}

          {
            tab === '2' && (checkRole()) &&
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  handleUpdateSalary();
                }}
              >
                Cập nhật
              </Button>
            </Col>
          }

          <Col>
            <Button
              onClick={handleExportToExcelProduce}
              type="primary"
            >
              Xuất Excel
            </Button>
          </Col>

        </Row>
      </div>

      <div className="common-layout--content">

        <SpinCustom spinning={spinning}>
          <Row gutter={[0, 8]}>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>
                  <Tabs
                    defaultActiveKey={tab}
                    items={items}
                    onChange={onChange}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

        </SpinCustom>

      </div>

    </Layout>
  );
};

export default PayRollV2;
