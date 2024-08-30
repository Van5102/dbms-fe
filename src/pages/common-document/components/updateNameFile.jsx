import React, { useState } from 'react';
import { SpinCustom } from 'components';
import { actionUpdateNameFile, actionGetListFolderChid } from '../action';
import { Modal, Form, Input, Row, Button, Col, message, } from 'antd';


const UpdateNameFile = ({ oldName, onCancel, idFile, idDocumentAdd, handleGetListDocument, setListDocument }) => {

  const [form] = Form.useForm();
  const [spining, setSpinning] = useState(false)
  const [newName, setNewName] = useState()

  const hanleEditNameFile = async () => {
    setSpinning(true)
    try {
      const body = {
        doc_id: idFile,
        new_name: newName,
        accessScope: 2
      }
      const { data, status } = await actionUpdateNameFile(body);
      if (status === 200) {
        if (!idDocumentAdd) {
          await handleGetListDocument()
        } else {
          const body1 = {
            document_id: idDocumentAdd,
            accessScope: 2
          };
          const { data, status } = await actionGetListFolderChid(body1);
          if (status === 200) {
            setListDocument(data?.data);
          }
        }
        onCancel()
        message.success(data?.message)
      } else {
        message.error(data?.message)
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }
  
  return (
    <Modal
      className="form-modal"
      width={350}
      footer={false}
      open={true}
    >
      <SpinCustom spinning={spining}>
        <Form
          form={form}
          onFinish={hanleEditNameFile}
        >
          <Form.Item>
            <Input
              defaultValue={oldName}
              onChange={(event) => setNewName(event.target.value)}
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
                Đổi tên
              </Button>
            </Col>
          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  );
};

export default UpdateNameFile;