
import { ProcedureProcessing } from "components";
import ExportPdfModal from "./exportPDF";

import { Button, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import DetailContent from "./detailContent";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { actionGetPendingEvaluateProcedures } from "../action";
import dayjs from "dayjs";
const EvaluateFinish = ({ column, setSpinning, timeStart, timeEnd }) => {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [isRecordShowDetail, setRecordShowDetail] = useState();
  const [listEvaluatePeding, setlistEvaluatePeding] = useState([]);
  const [dataExport, setDataExport] = useState();

  const handleGetPendingEvaluateProcedures = async () => {
    setSpinning(true);
    try {

      const params = {
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };

      const { data, status } = await actionGetPendingEvaluateProcedures(
        params
      );

      if (status === 200) {
        setlistEvaluatePeding(data?.list_evaluate_pending);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const columns2 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      //   render: (v, r, i) =>
      //     i + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
    },
  ]
    .concat(column)
    .concat([
      {
        width: 250,
        title: "",
        dataIndex: "detail_status_code",
        key: "operator",
        render: (v, r) => (
          <Space onClick={(e) => e.stopPropagation()}>
            {
              <>
                <Button
                  className="btn-with-icon"
                  onClick={() => {
                    setShowProcessingModal(r);
                  }}
                >
                  <MdOutlineRemoveRedEye />
                  <span className="btn-text">Xem trạng thái</span>
                </Button>

              </>
            }
          </Space>
        ),
        align: "center",
      },
    ]);

  useEffect(() => {
    handleGetPendingEvaluateProcedures()
  }, [timeStart, timeEnd])
  return (
    <>
      <Table
            className="tb-click-row"

        columns={columns2}
        onRow={(r) => ({
          onClick: () => setRecordShowDetail(r),
        })}

        width="100%"
        rowKey={(r) => r.id}
        dataSource={listEvaluatePeding?.filter((item) => {
          return (
            item.status_code === 'SUCCESS' ||
            item.status_code === 'CANCEL'
          );
        })}
        // dataSource={listEvaluatePeding}
        scroll={{ x: 1024 }}
      />

      {showProcessingModal && (
        <ProcedureProcessing
          record={showProcessingModal}
          onCancel={() => {
            setShowProcessingModal(null);
          }}
        />
      )}

      {isRecordShowDetail && (
        <DetailContent
          onCancel={() => setRecordShowDetail(null)}
          record={isRecordShowDetail}
        />
      )}

      {dataExport && (
          <ExportPdfModal
            data={dataExport}
            onCancel={() => setDataExport(null)}
          />
        )}
        
    </>
  )
}

export default EvaluateFinish;