import { DATE_FORMAT, THU_TAB } from "utils/constants/config";
import { Button, Col, DatePicker, Input, Layout, Row, Select, Tabs } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleSetUrlParam } from "utils/helps";
import SpinCutom from "components/spin-custom";
import MyProcedureTH from "./components/tab-items1/tab1";
import ApproveProcedureTH from "./components/tab-items1/tab2";
import MyProcedureTT from "./components/tab-items2/tab3";
import ApproveProcedureTT from "./components/tab-items2/tab4";

const Payment = () => {
  const userLogin = useSelector((state) => state?.profile);
  const departments = useSelector((state) => state?.departments);
  const [searchParams] = useSearchParams();
  const [spinning, setSpinning] = useState(false);

  // Chọn tab quy trình
  const [selectedTab, setSelectedTab] = useState(searchParams.get("tab") || THU_TAB['T_H_PROCEDURE']);
  // console.log(searchParams.get("tab"));

  // biến để kiểm tra quyền
  const isLanhDao = userLogin?.position_code === "GIAM_DOC" || userLogin?.position_code === "P_GIAM_DOC";
  const isHCNS = userLogin?.department_code === 'PB6' && userLogin?.position_code !== "LAI_XE";
  const isTruongPhuong = userLogin?.position_code === "TRUONG_PHONG";
  const isKeToan = userLogin?.position_code === "KE_TOAN";
  const isThuQuy = userLogin?.position_code === "THU_QUY";

  // biến bộ lọc
  const [time_start, setTimeStart] = useState(searchParams.get("time-start"))
  const [time_end, setTimeEnd] = useState(searchParams.get("time-end"))
  const [department_id, setDepartment_id] = useState(searchParams.get("department_id"))
  const [name, setName] = useState(searchParams.get("name"))
  const [procedure_id, setProcedureId] = useState(searchParams.get("procedure_id"))

  // tab item tạm ứng-hoàn ứng
  const TabItem1 = [
    !isLanhDao && {
      key: "tab-1",
      label: "Đề xuất của tôi",
      children: <MyProcedureTH
        setProcedureId={setProcedureId}
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        setSpinning={setSpinning}
        spinning={spinning}
      />,
    },
    {
      key: "tab-2",
      label: "Đề xuất tôi duyệt",
      children: <ApproveProcedureTH
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        name={name}
        department_id={department_id}
        setSpinning={setSpinning}
        spinning={spinning}
        setProcedureId={setProcedureId}

      />,
    },
  ];

  // tab item thanh toán
  const TabItem2 = [
    !isLanhDao && {
      key: "tab-3",
      label: "Đề xuất của tôi",
      children: <MyProcedureTT
        setProcedureId={setProcedureId}
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        setSpinning={setSpinning}
        spinning={spinning}
      />,
    },
    (isHCNS || isTruongPhuong || isLanhDao || isThuQuy || isKeToan) && {
      key: "tab-4",
      label: "Đề xuất tôi duyệt",
      children: <ApproveProcedureTT
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        name={name}
        department_id={department_id}
        setSpinning={setSpinning}
        spinning={spinning}
        setProcedureId={setProcedureId}

      />,
    },
  ];



  return (
    <Layout className="common-layout">
      <SpinCutom spinning={spinning}>
        <div className="common-layout--header">
          <Row gutter={[16, 16]} justify={'center'}>
            <Col span={24} style={{ textAlign: "center", fontSize: "larger" }}>
              <strong>Lựa chọn quy trình</strong>

            </Col>
            {/* Lựa chọn quy trình */}
            <Col className="pay-switch" >
              <Button
                className={`btn-switch ${selectedTab == THU_TAB['T_H_PROCEDURE'] ? 'selected-procedure' : ''}`}
                onClick={() => {
                  setSelectedTab(THU_TAB['T_H_PROCEDURE'])
                  handleSetUrlParam("tab", THU_TAB['T_H_PROCEDURE'])
                  handleSetUrlParam("tabKey", 'tab-1')
                }}>
                Tạm/Hoàn ứng
              </Button>

              <Button
                className={`btn-switch ${selectedTab == THU_TAB['T_T_PROCEDURE'] ? 'selected-procedure' : ''}`}
                onClick={() => {
                  handleSetUrlParam("tab", THU_TAB['T_T_PROCEDURE'])
                  setSelectedTab(THU_TAB['T_T_PROCEDURE'])
                  handleSetUrlParam("tabKey", 'tab-3')

                }
                } >
                Thanh toán
              </Button>
            </Col>

          </Row>

          <Row className="filler" gutter={[8, 8]} >
            <Col >
              <Row gutter={[8, 8]}>
                <Col>
                  <Row gutter={[8, 0]} align="middle">
                    <Col>Từ</Col>
                    <DatePicker
                      format={DATE_FORMAT}
                      defaultValue={time_start && dayjs.unix(time_start)}
                      onChange={(v) => {
                        // Cập nhật start_end
                        handleSetUrlParam("time-start", v ? v.unix() : null)
                        setTimeStart(v ? v.unix() : null)

                        // Cập nhật procedure_id
                        handleSetUrlParam("procedure_id", null)
                        setProcedureId(null)

                      }}
                    />

                  </Row>
                </Col>

                <Col className="align--center">
                  <Col>Đến</Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={time_end && dayjs.unix(time_end)}
                    onChange={(v) => {
                      // Cập nhật time_end
                      handleSetUrlParam("time-end", v ? v.unix() : null)
                      setTimeEnd(v ? v.unix() : null)

                      // Cập nhật procedure_id
                      handleSetUrlParam("procedure_id", null)
                      setProcedureId(null)
                    }}
                  />
                </Col>
              </Row>
            </Col>


            <Col>
              <Input.Search
                defaultValue={name}
                onSearch={(v) => {
                  // Cập nhật tên
                  handleSetUrlParam("name", v ? v : null)
                  setName(v)
                }}
                className="w-full"
                placeholder="Nhập tên ..."
                allowClear
              />
            </Col>

            <Col>
              <Select
                className="w-full"
                placeholder="Phòng ban"
                defaultValue={department_id}
                onChange={v => {
                  // Cập nhật phòng ban
                  handleSetUrlParam("department_id", v ? v : null)
                  setDepartment_id(v)
                }}
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
            </Col>

          </Row>
        </div>

        <div className="common-layout--content">
          {selectedTab == THU_TAB['T_H_PROCEDURE'] && <Tabs
            items={TabItem1}
            defaultActiveKey={searchParams.get("tabKey") || "tab-1"}
            onTabClick={(e) => {
              handleSetUrlParam("tab", THU_TAB['T_H_PROCEDURE'])
              handleSetUrlParam("tabKey", e)
            }} />
          }

          {selectedTab == THU_TAB['T_T_PROCEDURE'] && <Tabs
            items={TabItem2}
            defaultActiveKey={searchParams.get("tabKey") || "tab-3"}
            onTabClick={(e) => {
              handleSetUrlParam("tab", THU_TAB['T_T_PROCEDURE'])
              handleSetUrlParam("tabKey", e)
            }} />
          }

        </div>
      </SpinCutom>

    </Layout>
  )
}
export default Payment