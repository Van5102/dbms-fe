import { DATETIME_REQUEST, DATE_FORMAT, DATE_FORMAT_EN, DEPARTMENTS_CODE, THU_TAB } from "utils/constants/config";
import { Button, Col, DatePicker, Input, Layout, Row, Select, Tabs } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleSetUrlParam } from "utils/helps";
import SpinCutom from "components/spin-custom";
import HistoryTimeKeeping from "./components/tab-items/tab1";
import ListTimeKeeping from "./components/tab-items/tab3";
import DetailTimeKeeping from "./components/tab-items/tab2";

const KeepingTimeV2 = () => {
  const userLogin = useSelector((state) => state?.profile);
  const departments = useSelector((state) => state?.departments);
  const [searchParams] = useSearchParams();
  const [spinning, setSpinning] = useState(false);

  // biến để kiểm tra quyền
  const isLanhDao = userLogin?.position_code === "GIAM_DOC" || userLogin?.position_code === "P_GIAM_DOC";
  const isHCNS = userLogin?.department_code === 'PB6' && userLogin?.position_code !== "LAI_XE";
  const isTruongPhuong = userLogin?.position_code === "TRUONG_PHONG";


  // biến bộ lọc
  const [time_start, setTimeStart] = useState(searchParams.get("time-start") ||dayjs().startOf('day'))
  const [time_startT3, setTimeStartT3] = useState(searchParams.get("time-start"))
  const [time_end, setTimeEnd] = useState(searchParams.get("time-end")||dayjs().endOf('day'))
  const [department_id, setDepartment_id] = useState(searchParams.get("department_id"))
  const [name, setName] = useState(searchParams.get("name"))
  const [tabKey, setTabKey] = useState(searchParams.get("tabKey") || "tab-1");

  // tab item 
  const TabItem1 = [
    !isLanhDao && {
      key: "tab-1",
      label: "Lịch sử chấm công của tôi",
      children: <HistoryTimeKeeping
        time_start={time_start}
        time_end={time_end}
        setSpinning={setSpinning}
        tabKey={tabKey}
        spinning={spinning}
      />,
    },
    (isHCNS || isTruongPhuong || isLanhDao) && {
      key: "tab-3",
      label: "Danh sách chấm công",
      children: <ListTimeKeeping
        time_startT3={time_startT3}
        name={name}
        department_id={department_id}
        setSpinning={setSpinning}
        spinning={spinning}
        tabKey={tabKey}


      />,
    },
    (isHCNS || isTruongPhuong || isLanhDao) && {
      key: "tab-2",
      label: "Chi tiết chấm công",
      children: <DetailTimeKeeping
        time_start={time_start}
        time_end={time_end}
        name={name}
        tabKey={tabKey}
        department_id={department_id}
        setSpinning={setSpinning}
        spinning={spinning}

      />,
    },

  ];
       
  return (
    <Layout className="common-layout">
      <SpinCutom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]} >
            <Col className="filler--item">
              {
                tabKey == 'tab-3' &&

                <Row gutter={[8, 0]} align="middle">
                  <Col>Ngày: </Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={time_startT3 && dayjs(time_startT3)}
                    onChange={(v) => {
                      // Cập nhật start_end
                      handleSetUrlParam("time-start", v ? dayjs(v).format(DATE_FORMAT_EN) : null)
                      setTimeStartT3(v ? dayjs(v).format(DATE_FORMAT_EN) : null)
                    }}
                  />

                </Row>

              }
              {tabKey != "tab-3" &&
                <Row gutter={[8, 8]}>
                  <Col>
                    <Row gutter={[8, 0]} align="middle">
                      <Col>Từ</Col>
                      <DatePicker
                        format={DATE_FORMAT}
                        defaultValue={time_start && dayjs(time_start)}
                        onChange={(v) => {
                          // Cập nhật start_end
                          handleSetUrlParam("time-start", v ? dayjs(v).format(DATETIME_REQUEST) : null)
                          setTimeStart(v ? dayjs(v).format(DATETIME_REQUEST) : null)

                          // Cập nhật procedure_id
                          handleSetUrlParam("procedure_id", null)

                        }}
                      />

                    </Row>
                  </Col>

                  <Col className="align--center">
                    <Col>Đến</Col>
                    <DatePicker
                      format={DATE_FORMAT}
                      defaultValue={time_end && dayjs(time_end)}
                      onChange={(v) => {
                        // Cập nhật time_end
                        handleSetUrlParam("time-end", v ? dayjs(v).format(DATETIME_REQUEST) : null)
                        setTimeEnd(v ? dayjs(v).format(DATETIME_REQUEST) : null)

                        // Cập nhật procedure_id
                        handleSetUrlParam("procedure_id", null)
                      }}
                    />
                  </Col>
                </Row>
              }

            </Col>

            {tabKey != "tab-1" &&
              <>
                <Col className="filler--item">
                  <Input.Search
                    defaultValue={name}
                    onSearch={(v) => {
                      // Cập nhật tên
                      handleSetUrlParam("name", v ? v : null)
                      setName(v)
                    }}
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
            items={TabItem1}
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
export default KeepingTimeV2