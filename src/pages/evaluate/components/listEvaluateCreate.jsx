import { Button, Col, Row, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import CreateEvaluate from "./CreateFeedBackModal";
import { actionGetListEvaluate } from '../action';
import DetailContent from "./detailContent";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  ProcedureProcessing,
} from "components";
import dayjs from "dayjs";
import { actionCancelEvaluate } from "../action";
import RejectEvaluateModal from "./rejectEvaluate";
const EvaluateCreate = ({ column, setSpinning, timeStart, timeEnd }) => {
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [openModalAddEvaluate, setOpenModalAddEvaluate] = useState()
  const [listEvaluate, setListEvaluate] = useState([])
  const [isRecordShowDetail, setRecordShowDetail] = useState();
  const [procedureIdCancel, setProcedureIdCancel] = useState();

  const handleGetListEvaluate = async () => {
    setSpinning(true)
    try {
      const params = {
        time_start: dayjs(timeStart).startOf("D").unix(),
        time_end: dayjs(timeEnd).endOf("D").unix(),
      };
      const { data, status } = await actionGetListEvaluate(params);
      if (status === 200) {
        setListEvaluate(data?.list_evaluate)
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  const handleCancelEvaluate = async (procedure_id, rejection) => {
    setSpinning(true);
    try {

      const { data, status } = await actionCancelEvaluate(
        procedure_id,
        {
          description: rejection,
        }
      );

      if (status === 200) {
        message.success("Hủy đánh giá thành công");
        handleGetListEvaluate()

      } else {
        message.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      message.error(error);

    }
    setSpinning(false);
  };


  column = column.concat([
    {
      width: 240,
      title: "",
      dataIndex: "status",
      key: "operator",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {["D_CONFIRMED", "PENDING"].includes(r?.status_code) && (
            <Button
              type="cancel"
              onClick={() => {
                setProcedureIdCancel(r?.id);
                console.log('id', r?.id);
              }}
              className="btn-with-icon"
            >
              <RiDeleteBinLine />
              <span className="btn-text">Hủy đơn</span>
            </Button>
          )}

          <Button
            onClick={() => {
              setShowProcessingModal(r);
            }}
            className="btn-with-icon "
          >
            <MdOutlineRemoveRedEye />
            <span className="btn-text">Xem trạng thái</span>
          </Button>


        </Space>
      ),
      align: "center",
    },
  ])
  useEffect(() => {
    handleGetListEvaluate()
  }, [timeStart, timeEnd])

  return (
    <Row gutter={[8, 8]}>
      <Col>
        <Button
          className="btn-with-icon "
          type="primary"
          onClick={() => setOpenModalAddEvaluate(true)}
        >
          <MdAddCircleOutline />
          <span className="btn-text">Đánh giá mới</span>
        </Button>
      </Col>

      <Col span={24}>
        <Table
          dataSource={listEvaluate}
          columns={column}
          className="tb-click-row"
          onRow={(r) => ({
            onClick: () => setRecordShowDetail(r),
          })}
        />
      </Col>

      {
        openModalAddEvaluate && <CreateEvaluate
          // html={html}
          setSpinning={setSpinning}
          setListEvaluate={setListEvaluate}
          onCancel={() => { setOpenModalAddEvaluate(false) }}
        />
      }
      {isRecordShowDetail && (
        <DetailContent
          onCancel={() => setRecordShowDetail(null)}
          record={isRecordShowDetail}
        />
      )}
      {showProcessingModal && (
        <ProcedureProcessing
          record={showProcessingModal}
          onCancel={() => {
            setShowProcessingModal(null);
          }}
        />
      )}
      {procedureIdCancel && (
        <RejectEvaluateModal
          onCancel={() => setProcedureIdCancel(null)}
          onRejection={(description) => {
            handleCancelEvaluate(
              procedureIdCancel,
              description,
            );
            setProcedureIdCancel(null);
          }}
        />
      )}

    </Row>
  )
}

export default EvaluateCreate;