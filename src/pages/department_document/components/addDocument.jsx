
import { UploadFile, SpinCustom } from "components";
import { useState } from "react";
import { actionAddDocument, actionGetListDocument, actionGetListFolderChid } from "../action"
import {
    Modal, Input, Form,
    Row, Col, Button,
    message
} from "antd";
import { useSelector } from "react-redux"

const AddDocument = ({ onCancel,
    idDocumentAdd,
    handleGetChildFolder,
    department,
    setCheckDepartmentID,
 }) => {

    const userLogin = useSelector(state => state?.profile)
    const [form] = Form.useForm();
    const [files, setFiles] = useState([]);
    const [spinning, setSpinning] = useState(false)

    if (!idDocumentAdd) {
        setCheckDepartmentID(true)
    }

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
            // formData.append("type", (formData.getAll("files").length === 1) ? 2 : 1)
            formData.append("ascc_id", 1)
            if (idDocumentAdd) {
                formData.append("document_id", idDocumentAdd)
            }
            if (department && (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC")) {
                formData.append("department_id", department)
            } else {
                formData.append("department_id", userLogin.department_id)
            }
            const { data, status } = await actionAddDocument(formData)
            if (status === 200) {
                if (idDocumentAdd) {
                    handleGetChildFolder({ id: idDocumentAdd })
                } else {
                    await handleGetChildFolder({ id: department || userLogin.department_id })
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
            width={500}
        >
            <SpinCustom spinning={spinning}>
                <Form form={form}
                    onFinish={(value) => {
                        hadleAddDocument(value)
                    }}>
                    <Form.Item name="name_folder">
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
