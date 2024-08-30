
import { UploadFile, SpinCustom } from "components";
import { useState } from "react";
import { actionAddDocument } from "../action"
import {
  Modal, Input, Form,
  Row, Col, Button,
  message
} from "antd";

const AddDocument = ({ idDocumentAdd, onCancel, handleGetListDocument, handleGetChildFolder }) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState([]);
  const [spinning, setSpinning] = useState(false)

  const hadleAddDocument = async (values) => {
    setSpinning(true);

    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key])
      })
      files.forEach((file) => {
        formData.append("files", file);
      });
      // formData.append("type", formData.getAll("files").length === 1 ? 2 : 1)
      formData.append("ascc_id", 2)
      if (idDocumentAdd) {
        formData.append("document_id", idDocumentAdd)
      }
      const { data, status } = await actionAddDocument(formData);
      if (status === 200) {
        if (idDocumentAdd) {
          const idAdd = {
            id: idDocumentAdd
          }
          await handleGetChildFolder(idAdd)
        }
        else {
          await handleGetListDocument()
        }
        message.success(data?.message);
        onCancel()
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  return (
    <Modal
      className="form-modal"
      footer={false}
      open={true}
      width={350}
    >
      <SpinCustom spinning={spinning}>
        <Form form={form} onFinish={hadleAddDocument}>
          <Form.Item name="name_folder"
          >
            <Input placeholder="Tên tài liệu" />
          </Form.Item>
          <Form.Item>
            <UploadFile
              setFiles={setFiles}
              files={files}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Button className="w-full"
                onClick={onCancel}
              >Thoát</Button>
            </Col>

            <Col span={12}>
              <Button className="w-full" type="primary" htmlType="submit">
                Tạo tài liệu
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  );
};

export default AddDocument;
