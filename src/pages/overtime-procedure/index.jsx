import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { DATE_FORMAT } from "utils/constants/config";
import Tab1 from "./components/tab-items/tab1";
import Tab2 from "./components/tab-items/tab2";
import { handleSetUrlParam } from "utils/helps";
import SpinCutom from "components/spin-custom";
import dayjs from "dayjs";

import {
  Layout, Row, Col,
  Tabs, DatePicker
} from "antd";

const OverTimeProcedure = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [searchParams] = useSearchParams();
  const [spinning, setSpinning] = useState(false);

  // biến để kiểm tra quyền
  const isLanhDao = userLogin?.position_code === "GIAM_DOC" || userLogin?.position_code === "P_GIAM_DOC";
  const isHCNS = userLogin?.department_code === 'PB6' && userLogin?.position_code !== "LAI_XE";
  const isTruongPhuong = userLogin?.position_code === "TRUONG_PHONG";

  // const params filter
  const [time_start, setTimeStart] = useState(searchParams.get("time-start"))
  const [time_end, setTimeEnd] = useState(searchParams.get("time-end"))
  const [procedure_id, setProcedureId] = useState(searchParams.get("procedure_id"))

  // Tabs
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
      />,
    },
    {
      key: "tab-2",
      label: "Đề xuất tôi duyệt",
      children: <Tab2
        setProcedureId={setProcedureId}
        procedure_id={procedure_id}
        time_start={time_start}
        time_end={time_end}
        setSpinning={setSpinning}
      />,
    },
  ];

  return (
    <Layout className="common-layout">
      <SpinCutom spinning={spinning}>
        <div className="common-layout--header">
          <Row gutter={[8, 8]}>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Từ</Col>

                <Col>
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
                </Col>
              </Row>
            </Col>

            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Đến</Col>

                <Col>
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
          </Row>
        </div>

        <div className="common-layout--content">
          <Tabs
            items={TabItem}
            defaultActiveKey={searchParams.get("tabKey") || "tab-1"}
            onTabClick={(e) => handleSetUrlParam("tabKey", e)}
          />
        </div>
      </SpinCutom>
    </Layout>
  );
};

export default OverTimeProcedure;
