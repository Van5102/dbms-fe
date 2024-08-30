import { Button, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
// import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel, MdOutlineRemoveRedEye } from "react-icons/md";
import { actionApproveEvaluate, actionGetPendingEvaluateProcedures } from '../action';
import { ProcedureProcessing } from "components";
import ApproveEvaluate from "./ApproveFeedBackModal";
import RejectEvaluateModal from "./rejectEvaluate";
import dayjs from "dayjs";
import DetailContent from "./detailContent";

const EvaluatePending = ({ column, setSpinning, timeStart, timeEnd }) => {
  const userLogin = useSelector((state) => state?.profile);
  const [isRecordShowDetail, setRecordShowDetail] = useState();

  const [listEvaluatePeding, setlistEvaluatePeding] = useState([]);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [rejectProcedureId, setRejectProcedureId] = useState();
  const [approveProcedure, setApproveProcedure] = useState(false);
  const [paginationTab1, setPaginationTab1] = useState({
    page_num: 1,
    page_size: 10,
  });

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

  const handleRejectEvaluate = async (procdect_id, isStatus, description) => {
    setSpinning(true);
    try {
      const { data, status } = await actionApproveEvaluate(procdect_id, isStatus, { content: JSON.stringify("") }, { description })
      if (status === 200) {
        message.success(data?.message);
        handleGetPendingEvaluateProcedures();
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  useEffect(() => {
    handleGetPendingEvaluateProcedures()
  }, [timeStart, timeEnd])

  const columns1 = [
    {
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
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
            {(r?.detail_status_code === "PENDING" && r?.approved_by === userLogin?.id) && (
              <>
                <Button
                  className="btn-with-icon success-btn"
                  onClick={() => setApproveProcedure(r)}
                  type="primary"
                >
                  <GiConfirmed />
                  <span className="btn-text">Đánh giá</span>
                </Button>

                <Button
                  className="btn-with-icon"
                  type="cancel"
                  onClick={() => setRejectProcedureId(r?.id)}
                >
                  <MdOutlineCancel />
                  <span className="btn-text">Từ chối</span>
                </Button>
              </>
            )}
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

  return (
    <>
      <Table
        columns={columns1}
        width="100%"
        rowKey={(r) => r.id}
        className="tb-click-row"
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r),
          })}
        dataSource={listEvaluatePeding?.filter((item) => {
          return (
            item.status_code === 'PENDING'
          );
        })}
        scroll={{ x: 1024 }}
      />
      {
        approveProcedure && <ApproveEvaluate
          onCancel={() => setApproveProcedure()}
          setlistEvaluatePeding={setlistEvaluatePeding}
          approveProcedure={approveProcedure}
          setSpinning={setSpinning}
        />
      }

      {showProcessingModal && (
        <ProcedureProcessing
          record={showProcessingModal}
          onCancel={() => {
            setShowProcessingModal(null);
          }}
        />
      )}

      {rejectProcedureId && (
        <RejectEvaluateModal
          onCancel={() => setRejectProcedureId(null)}
          onRejection={(description) => {
            handleRejectEvaluate(
              rejectProcedureId,
              0,
              description
            );
            setRejectProcedureId(null);
          }}
        />
      )}
       {isRecordShowDetail && (
        <DetailContent
          onCancel={() => setRecordShowDetail(null)}
          record={isRecordShowDetail}
        />
      )}
    </>
  )
}

export default EvaluatePending;