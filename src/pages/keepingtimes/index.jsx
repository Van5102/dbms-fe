import { Layout, Row, Col, DatePicker, Input, Tabs, Select } from "antd";
import KeepingHistory from "./components/historyKeeping";
import ListKeeping from "./components/ListKeeping";
import { useState } from "react";
import { DATE_FORMAT, DEPARTMENTS_CODE,COME_TYPE } from "../../utils/constants/config";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import FreeTime from "./components/FreeTime";
import SumTotalWorking from "./components/sumTotalWorking";
import { useSearchParams } from "react-router-dom";

const ManagerKeeping = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedStatusCome, setSelectedStatusCome] = useState(null);
  const [nameSeach, setNameSeach] = useState("");
  const [searchParams] = useSearchParams();
  let row = searchParams.get("tabKey");
  row = row ? row?.split("?row=") : [];
  const [tabKey, setTabKey] = useState(row[0] || "1");
  const userLogin = useSelector((state) => state?.profile);
  const [timeStart, setTimeStart] = useState(dayjs().startOf());
  const [timeEnd, setTimeEnd] = useState(dayjs().startOf());

  const items = [
    userLogin.position_code !== "GIAM_DOC" &&
    userLogin.position_code !== "P_GIAM_DOC" && {
      key: "1",
      label: "Lịch sử chấm công",
      children: (
        <KeepingHistory
          start={timeStart}
          end={timeEnd}
          nameSeach={nameSeach}
        />
      ),
    },

    (userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "TRUONG_PHONG" ||
      userLogin.department_code === 'PB6') && {
      key: "2",
      label: "Danh sách chấm công",
      children: (
        <ListKeeping
          start={timeStart}
          end={timeEnd}
          selectedStatus={selectedStatus}
          selectedStatusCome={selectedStatusCome}

          nameSeach={nameSeach}
        />
      ),
    },

    {
      key: "3",
      label: "Phút việc riêng",
      children: (
        <FreeTime
          start={timeStart}
          end={timeEnd}
          nameSeach={nameSeach}
          row={row[0] === "3" ? row[1] : null}
        />
      ),
    },

    {
      key: "4",
      label: "Tổng ngày công",
      children: (
        <SumTotalWorking
          start={timeStart}
          end={timeEnd}
          nameSeach={nameSeach}
          selectedStatus={selectedStatus}
          row={row[0] === "4" ? row[1] : null}
        />
      ),
    },
  ];

  const onChange = (key) => {
    setTabKey(key);
  };

  const handleDateChange = (newEndDate) => {
    setTimeEnd(newEndDate);
  };

  return (
    <Layout className="common-layout">
      <div className="common-layout--header">
        <Row className="filler" gutter={[8, 8]}>
          <Col className="filler--item">
            <Row gutter={[8, 8]}>
              <Col>
                <Row gutter={[8, 0]} align="middle">
                  <Col>Từ</Col>

                  <Col>
                    <DatePicker
                      format={DATE_FORMAT}
                      value={timeStart}
                      allowClear={false}
                      onChange={(v) => {
                        window.navigatePage("keepingtimes");
                        setTimeStart(v);
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col className="align--center">
                <Col>Đến</Col>
                <DatePicker
                  onChange={(v) => {
                    window.navigatePage("keepingtimes");

                    handleDateChange(v);
                  }}
                  value={timeEnd}
                  allowClear={false}
                  format={DATE_FORMAT}
                />
              </Col>
            </Row>
          </Col>

          <>
            {tabKey === "1" && userLogin?.id == "1" && (
              <Col className="filler--item">
                <Input.Search
                  onSearch={(v) => {
                    setNameSeach(v);
                  }}
                  placeholder="Nhập tên ..."
                  allowClear
                />
              </Col>
            )}

            {(tabKey === "2" || tabKey === "3") && (
              <Col className="filler--item">
                <Input.Search
                  onSearch={(v) => {
                    setNameSeach(v);
                  }}
                  placeholder="Nhập tên ..."
                  allowClear
                />
              </Col>
            )}
            {(tabKey === "2") && (
              <Col className="filler--item">
                 <Select
                  className="w-full"
                  placeholder="Trạng thái"
                  onChange={setSelectedStatusCome}
                  allowClear
                >
                  {Object.keys(COME_TYPE)?.map((key) => (
                    <Select.Option key={key} value={key}>
                      {COME_TYPE[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            )}

            {(tabKey === "2" || tabKey === "4") && (
              <Col>
                <Select
                  className="w-full"
                  placeholder="Phòng ban"
                  onChange={setSelectedStatus}
                  allowClear
                >
                  {Object.keys(DEPARTMENTS_CODE)?.map((key) => (
                    <Select.Option key={key} value={key}>
                      {DEPARTMENTS_CODE[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            )}
          </>
        </Row>
      </div>

      <div className="common-layout--content">
        <Tabs defaultActiveKey={tabKey} items={items} onChange={onChange} />
      </div>
    </Layout>
  );
};

export default ManagerKeeping;
