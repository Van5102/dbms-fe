import { Modal, Button, Steps } from "antd";
import { DATETIME_FORMAT } from "utils/constants/config";
import dayjs from "dayjs";
const { Step } = Steps;

const ProcedureProcessing = ({ record, onCancel }) => {
  const getCurrentStep = () => {
    let index = record?.details?.length - 1;

    if (record?.details?.[index].status_code == "PENDING") {
      index -= 1;
    }

    return index;
  }

  return (
    <Modal
      style={{ top: 10 }}
      open={true}
      closeIcon={false}
      title="Tình trạng"
      className="common-modal"
      width={500}
      footer={
        <Button className="w-120" onClick={onCancel}>
          Thoát
        </Button>
      }
    >
      <Steps current={getCurrentStep()} direction="vertical" responsive={true}>
        {record?.details.map((item, index) => (
          <Step
            key={index}
            title={item?.approved_by_name}
            description = {
              <div>
                {item?.time_update && <p style={{ color: "rgb(135 135 135)" }}>
                  Thời gian duyệt: {dayjs.unix(item?.time_update).format(DATETIME_FORMAT)}
                </p>}

                {item?.description && item?.status_code !== "CANCEL" && (
                  <p style={{ color: "rgb(135 135 135)" }}>
                    Ghi chú: {item?.description}
                  </p>
                )}

                {item?.status_code === "CANCEL" && (
                  <p style={{ color: "red" }}>
                    Lý do từ chối: {item?.description}
                  </p>
                )}
              </div>
            }
          />
        ))}
      </Steps>
    </Modal>
  );
};

export default ProcedureProcessing;
