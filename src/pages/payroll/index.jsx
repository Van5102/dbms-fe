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

import { useEffect, useState } from "react";
import { DATE_FORMAT, DEPARTMENTS_CODE } from "utils/constants/config";
import dayjs from "dayjs";

import PayRollUser from "./components/userSalary";
import { message } from "antd";
import { SpinCustom } from "components";
import { IsJsonString } from 'utils/helps/index'

const PayRoll = () => {
  const userLogin = useSelector((state) => state?.profile);

  const [spinning, setSpinning] = useState(false);
  const checkRole = () => {
    return userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ||
      (userLogin.position_code === "TRUONG_PHONG" && userLogin.department_code === "PB6")
  }

  const [tab, setTab] = useState((userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC") ? '2' : '1')
  const [id, setId] = useState([]);
  const [listUserSalary, setListUserSalary] = useState([]);
  const [basicSalaries, setBasicSalaries] = useState([]);
  const [hqcvhd, sethqcvhd] = useState([]);
  const [allGasHd, setAllGasHd] = useState([]);
  const [allResponHd, setAllResponHd] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [dayBussiness, setdayBussiness] = useState([]);
  const [kpi, setKpi] = useState([]);
  const [addSub, setAddSub] = useState([]);
  const [workingStand, setWorkingStand] = useState(0);

  const [start, setStart] = useState(dayjs().startOf("day"));
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [nameSeach, setNameSeach] = useState("");

  const handleExportToExcelProduce = (listUserSalary) => {
    const tmp = listUserSalary.map((e, index) => {
      return {
        STT: index + 1,
        "Mã số": e?.id,
        "Họ và tên": e?.name,
        "Bộ phận": e?.dep_name,
        "Chức danh": e?.pos_name,
        "Lương cơ bản/BH(HĐ)": e?.basic_salary_hd,
        "Thưởng HQCV(HĐ)": e?.hqcv_hd,
        "Phụ cấp xăng xe(HĐ)": e?.allowance_gas_hd,
        "Phụ cấp trách nhiệm(HĐ)": e?.allowance_responsibility_hd,
        "Tổng lương HĐ(HĐ)": e?.salary_total,
        "Tổng ngày công ": e?.working_standard,
        "Ngày công thực tế ": e?.total_working_day,
        "Ngày nghỉ lễ tết ": e?.holiday,
        "Ngày nghỉ phép(hưởng phép năm) ": e?.leave_allow_day,
        "Ngày nghỉ không phép": e?.leave_not_allow_day,
        "Ngày công tác": e?.day_bussiness,
        "Làm thêm giờ ngày thường": e?.over_time_weekday,
        "Làm thêm giờ ngày nghỉ(chủ nhật)": e?.over_time_weeken,
        "Làm thêm giờ ngày lễ tết": e?.over_time_holiday,
        "Phút việc riêng(PVR)": e?.free_time_day,
        "Hệ số đánh giá (KPI)": e?.kpi,
        "Lương cơ bản(Thực tế)": e?.salary_basic_current,
        "Thưởng HQCV(Thực tế)": e?.hqcv_reward,
        "Phụ cấp xăng xe(Thực tế)": e?.allowance_gas_tt,
        "Phụ cấp trách nhiệm(Thực tế)": e?.allowance_responsibility_tt,
        "Lương làm thêm giờ": e?.over_time,
        "Tổng lương theo thực tế": e?.salary_total_tt,
        "Lương BHXH": e?.social_insurance,
        "10.5% mức BHXH": e?.social_insurance_105,
        "Khoản cộng/trừ khác": e?.add_sub_salary,
        "Trừ phút việc riêng": e?.free_time_pay,
        "Lương được nhận": e?.salary_final,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
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
        department: selectedStatus,
        user_id: tab === '1' ? userLogin.id : null
      };

      const body = {
        id: id,
        basic_salary_hd: basicSalaries,
        hqcv_hd: hqcvhd,
        allowance_gas_hd: allGasHd,
        allowance_responsibility_hd: allResponHd,
        holiday: holiday,
        day_bussiness: dayBussiness,
        add_sub_salary: addSub,
        kpi: kpi,
      };
      await actionHandleAddSalaryUser(
        dayjs(start).startOf("D").unix(),
        { data: body, working_standard: workingStand },
        params
      ).then((res) => {
        const { data, status } = res;
        if (status === 200) {
          const list_salary = IsJsonString(data?.list_slary) ? JSON.parse(data?.list_slary) : data?.list_slary
          setListUserSalary(list_salary);
          setWorkingStand(data?.working_standard)
          setBasicSalaries(list_salary.map(e => e?.basic_salary_hd))
          sethqcvhd(list_salary.map(e => e?.hqcv_hd))
          setAllGasHd(list_salary.map(e => e?.allowance_gas_hd))
          setAllResponHd(list_salary.map(e => e?.allowance_responsibility_hd))
          setdayBussiness(list_salary.map(e => e?.day_bussiness))
          setKpi(list_salary.map(e => e?.kpi))
          setAddSub(list_salary.map(e => e?.add_sub_salary))
          setHoliday(list_salary.map(e => e?.holiday))
          setId(list_salary.map(e => e?.id))

          message.success(data?.message);
        }
      })
        .catch((err) => { })

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
        department: selectedStatus,
      };
      await actionHandleGetSalaryUser(dayjs(start).startOf("D").unix(), params)
        .then((response) => {
          const { data, status } = response;

          if (status === 200) {
            const list_slary = IsJsonString(data?.list_slary) ? JSON.parse(data?.list_slary) : data?.list_slary

            setWorkingStand(data?.working_standard);
            setListUserSalary(list_slary);
            setBasicSalaries(list_slary.map((e) => e?.basic_salary_hd));
            sethqcvhd(list_slary.map((e) => e?.hqcv_hd));
            setAllGasHd(list_slary.map((e) => e?.allowance_gas_hd));
            setAllResponHd(list_slary.map((e) => e?.allowance_responsibility_hd));
            setdayBussiness(list_slary.map((e) => e?.day_bussiness));
            setKpi(list_slary.map((e) => e?.kpi));
            setAddSub(list_slary.map((e) => e?.add_sub_salary));
            setHoliday(list_slary.map((e) => e?.holiday));
            setId(list_slary.map((e) => e?.id));
          }
        })

        .catch((respone) => {
          const data = respone?.response?.data;
          const list_slary = IsJsonString(data?.list_slary) ? JSON.parse(data?.list_slary) : []
          const filterData = new Array(list_slary.length).fill();

          setListUserSalary(list_slary);
          setBasicSalaries(list_slary.map((e) => e?.basic_salary_hd));
          sethqcvhd(list_slary.map((e) => e?.hqcv_hd));
          setAllGasHd(list_slary.map((e) => e?.allowance_gas_hd));
          setAllResponHd(list_slary.map((e) => e?.allowance_responsibility_hd));
          setdayBussiness(
            filterData.map(() => {
              return 0;
            })
          );
          setKpi(
            filterData.map(() => {
              return 1;
            })
          );
          setAddSub(
            filterData.map(() => {
              return 0;
            })
          );
          setHoliday(
            filterData.map(() => {
              return 0;
            })
          );
          setId(list_slary.map((e) => e?.id));
        });

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
        handleUpdateSalary={handleUpdateSalary}
        basicSalaries={[basicSalaries[id.indexOf(userLogin.id)]] || []}
        listUserSalary={listUserSalary.filter((item) => item.id === userLogin.id) || []}
        hqcvhd={[hqcvhd[id.indexOf(userLogin.id)]] || []}
        allGasHd={[allGasHd[id.indexOf(userLogin.id)]] || []}
        holiday={[holiday[id.indexOf(userLogin.id)]] || []}
        dayBussiness={[dayBussiness[id.indexOf(userLogin.id)]] || []}
        kpi={[kpi[id.indexOf(userLogin.id)]] || []}
        addSub={[addSub[id.indexOf(userLogin.id)]] || []}
        id={[id[id.indexOf(userLogin.id)]] || []}
        setId={setId}
        setBasicSalaries={setBasicSalaries}
        setAddSub={setAddSub}
        setKpi={setKpi}
        setdayBussiness={setdayBussiness}
        setHoliday={setHoliday}
        setAllResponHd={setAllResponHd}
        setAllGasHd={setAllGasHd}
        sethqcvhd={sethqcvhd}
        setListUserSalary={setListUserSalary}
        allResponHd={[allResponHd[id.indexOf(userLogin.id)]] || []}
        setWorkingStand={setWorkingStand}
        workingStand={workingStand}
      />,
    },
    (checkRole()) &&
    {
      key: '2',
      label: 'Bảng lương Công ty',
      children: <PayRollUser
        handleUpdateSalary={handleUpdateSalary}
        basicSalaries={basicSalaries}
        listUserSalary={listUserSalary}
        hqcvhd={hqcvhd}
        allGasHd={allGasHd}
        holiday={holiday}
        dayBussiness={dayBussiness}
        kpi={kpi}
        addSub={addSub}
        id={id}
        setId={setId}
        setBasicSalaries={setBasicSalaries}
        setAddSub={setAddSub}
        setKpi={setKpi}
        setdayBussiness={setdayBussiness}
        setHoliday={setHoliday}
        setAllResponHd={setAllResponHd}
        setAllGasHd={setAllGasHd}
        sethqcvhd={sethqcvhd}
        setListUserSalary={setListUserSalary}
        allResponHd={allResponHd}
        setWorkingStand={setWorkingStand}
        workingStand={workingStand}
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
                    window.navigatePage("payroll");
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
              {Object.keys(DEPARTMENTS_CODE).map((key) => (
                <Select.Option key={key} value={key}>
                  {DEPARTMENTS_CODE[key]}
                </Select.Option>
              ))}
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
              onClick={() => handleExportToExcelProduce(listUserSalary)}
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

export default PayRoll;
