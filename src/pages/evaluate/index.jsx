import { SpinCustom } from "components";
import { Col, DatePicker, Layout, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import EvaluateCreate from './components/listEvaluateCreate';
import EvaluateFinish from './components/listEvaluateFinish';
import EvaluatePending from './components/listEvaluatePeding';
import moment from "moment";
import { DATETIME_FORMAT, DATE_FORMAT } from "utils/constants/config";
import { actionGetPendingEvaluateProcedures } from "./action";
import dayjs from "dayjs";

const Evaluate = () => {
  const [listEvaluatePeding, setlistEvaluatePeding] = useState([]);
  const [spinning, setSpinning] = useState(null)
  const [timeStart, setTimeStart] = useState(dayjs().startOf("day").subtract(7, "day"))
  const [timeEnd, setTimeEnd] = useState(dayjs().endOf("day"))

  const column = [

    {
      width: '8%',
      title: "Mã số",
      dataIndex: "id",
      key: "id",
      align: "center"
    },
    {
      width: '20%',
      title: "Người đề xuất",
      dataIndex: "created_by",
      key: "created_by",
      align: "left",
    },
    {
      width: '20%',
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      align: "left",
    },
    {
      title: "Thời gian đề xuất",
      dataIndex: "time_created",
      key: "time_created",
      render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
      align: "center",
      width: '20%',
    },

    {
      width: '20%',
      title: "Trạng thái",
      dataIndex: "status_code",
      key: "status_code",
      render: (v, r) => {
        let statusClass;
        switch (v) {
          case "PENDING":
            statusClass = "process--waiting";
            break;
          case "D_CONFIRMED":
            statusClass = "process--waiting";
            break;
          case "SUCCESS":
            statusClass = "process--success";
            break;
          case "CANCEL":
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }

        return <span className={statusClass}>{r?.status}</span>;
      },
      align: "center",
    }
  ]

  const handleGetPendingEvaluateProcedures = async () => {
    setSpinning(true);
    try {
      const params = {
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingEvaluateProcedures(params);
      if (status === 200) {
        setlistEvaluatePeding(data?.list_evaluate_pending);
      }

    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const items = [
    {
      key: '1',
      label: 'Đánh giá chờ duyệt',
      children: <EvaluatePending
        setlistEvaluatePedin={setlistEvaluatePeding}
        listEvaluatePeding={listEvaluatePeding}
        column={column}
        setSpinning={setSpinning}
        timeStart={timeStart}
        timeEnd={timeEnd}

      />,
    },
    {
      key: '2',
      label: 'Đánh giá đã duyệt',
      children: <EvaluateFinish
        listEvaluatePeding={listEvaluatePeding}
        column={column}
        setSpinning={setSpinning}
        timeStart={timeStart}
        timeEnd={timeEnd}
      />,
    },
    {
      key: '3',
      label: 'Đánh giá',
      children: <EvaluateCreate
        column={column}
        setSpinning={setSpinning}
        timeStart={timeStart}
        timeEnd={timeEnd}
      />,
    },
  ];

  useEffect(() => {
    handleGetPendingEvaluateProcedures()
  }, [])

  return (
    <Layout className="common-layout">
      <SpinCustom
        spinning={spinning}>
        <div className="common-layout--header">
          <Row gutter={[8, 8]}>
            <Col>
              <Row gutter={[8, 0]} align="middle">
                <Col>Từ</Col>

                <Col>
                  <DatePicker
                    format={DATE_FORMAT}
                    defaultValue={timeStart}
                    onChange={(v) => {
                      setTimeStart(v);
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
                    defaultValue={timeEnd}
                    onChange={(v) => {
                      setTimeEnd(v);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="common-layout--content">
          <Tabs
            items={items}
          // onTabClick={(e) => handleSelectedTabKey(e)} 

          />
        </div>
        <div className='common-layout--footer'></div>
      </SpinCustom>

    </Layout>
  )
}

export default Evaluate;