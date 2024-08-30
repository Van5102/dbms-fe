import { DATE_FORMAT, THU_TAB } from "utils/constants/config";
import { Col, DatePicker, Input, Layout, Row, Select, Tabs } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleSetUrlParam } from "utils/helps";
import SpinCutom from "components/spin-custom";
import Tab1 from "./components/tab-items/tab1";
import Tab2 from "./components/tab-items/tab2";

const LeaveProcessV2 = () => {
  const userLogin = useSelector((state) => state?.profile);
  const departments = useSelector((state) => state?.departments);
  const [searchParams] = useSearchParams();
  const [spinning, setSpinning] = useState(false);
  const [tabKey, setTabKey] = useState(searchParams.get("tabKey") || "tab-1");


  // biến để kiểm tra quyền
  const isLanhDao = userLogin?.position_code === "GIAM_DOC" || userLogin?.position_code === "P_GIAM_DOC";
  const isHCNS = userLogin?.department_code === 'PB6' && userLogin?.position_code !== "LAI_XE";
  const isTruongPhuong = userLogin?.position_code === "TRUONG_PHONG";


  // biến bộ lọc
  const [time_start, setTimeStart] = useState(searchParams.get("time-start"))
  const [time_end, setTimeEnd] = useState(searchParams.get("time-end"))
  const [department_id, setDepartment_id] = useState(searchParams.get("department_id"))
  const [name, setName] = useState(searchParams.get("name"))
  const [procedure_id, setProcedureId] = useState(searchParams.get("procedure_id"))


  // tab item 
  const TabItem = [
    !isLanhDao && {
      key: "tab-1",
      label: "Đề xuất của tôi",
      children: <Tab1
        setProcedureId={setProcedureId}
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        setSpinning={setSpinning}
        spinning={spinning}
      />,
    },
    (isHCNS || isTruongPhuong || isLanhDao) && {
      key: "tab-2",
      label: "Đề xuất tôi duyệt",
      children: <Tab2
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

            {tabKey == "tab-2" &&
              <>
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
              </>
            }
          </Row>
        </div>

        <div className="common-layout--content">
          <Tabs
            items={TabItem}
            defaultActiveKey={searchParams.get("tabKey") || "tab-1"}
            onTabClick={(e) => {
              setTabKey(e);
              handleSetUrlParam("tabKey", e)
            }} />


        </div>
      </SpinCutom>

    </Layout>
  )
}
export default LeaveProcessV2