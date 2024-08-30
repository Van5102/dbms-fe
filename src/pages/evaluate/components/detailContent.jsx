
import { Button,Form, Modal, } from "antd";
import FormEvaluate from "./formEvaluate";
import { usePDF } from "react-to-pdf";

const DetailContent = ({ record, onCancel }) => {
  const { toPDF, targetRef } = usePDF({ filename: 'Đánh giá' , orientation: 'portrait' });
  const [form] = Form.useForm();

  return (
    <>
      <Modal
        className="common-modal"
        style={{ top: 10 }}
        width="100vw"
        title="Danh sách"
        footer={
          <>
            <Button onClick={onCancel} className="w-120">
              Thoát
            </Button>

            <Button onClick={() => toPDF()} type="primary" className="w-120">
              Xuất PDF
            </Button>
          </>

        }
        open={true}
      >

        <Form
          layout="vertical"
          initialValues={record?.content}
          form={form}
        >
          <div ref={targetRef} style={{ padding: "20px", "@page": { size: "landscape" } }}>

            <FormEvaluate />
          </div>

        </Form>
      </Modal>

    </>
  );
};

export default DetailContent;
