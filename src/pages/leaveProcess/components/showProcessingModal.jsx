import { useState, useEffect } from "react";
import { Modal, Col, Row, Button, Form, Steps } from "antd";
import { DATETIME_FORMAT } from "utils/constants/config";
import moment from "moment";

const { Step } = Steps;
const ShowProcessingModal = ({ showProcessingModal, onClose }) => {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const lastNonErrorApprovalIndex = showProcessingModal?.details.findIndex(
      (approval) => approval.status_code !== "CANCEL"
    );
    setCurrent(
      lastNonErrorApprovalIndex !== -1 ? lastNonErrorApprovalIndex : 0
    );
  }, [showProcessingModal.details]);

  return (
    <Modal
      open={true}
      closeIcon={false}
      title="Tình trạng"
      className="form-modal"
      width={350}
      footer={false}
    >
      <Row className="w-full">
        <Col span={24}>
          <Steps current={current} direction="vertical" responsive={true}>
            {showProcessingModal?.details.map((approval, index) => (
              <Step
                key={index}
                title={approval?.approved_by_name}
                status={
                  index === showProcessingModal?.details.length - 1
                    ? approval?.status_code === "PENDING"
                      ? "wait"
                      : approval?.status_code === "CONFIRMED"
                      ? "process"
                      : "error"
                    : "process"
                }
                description={
                  <div>
                    {approval.status_code === "CONFIRMED" &&
                      approval.time_update && (
                        <>
                          <p style={{ color: "rgb(135 135 135)" }}>
                            Thời gian duyệt:{" "}
                            {moment(approval.time_update * 1000).format(
                              DATETIME_FORMAT
                            )}
                          </p>
                          {approval.description && (
                            <p style={{ color: "rgb(135 135 135)" }}>
                              Ghi chú: {approval.description}
                            </p>
                          )}
                        </>
                      )}
                    {approval.status_code === "CANCEL" && (
                      <p style={{ color: "red" }}>
                        Lý do từ chối: {approval.description}
                      </p>
                    )}
                  </div>
                }
              />
            ))}
          </Steps>
        </Col>

        <Col span={10}>
          <Button className="w-full" onClick={onClose}>
            Thoát
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default ShowProcessingModal;
