import { SpinCustom, UploadFile } from "components"
import { Button, Col, Modal, Row, Form, message } from "antd"
import { useState } from "react"
import { actionEditFile } from "../action"

const UpdateFile = ({ onCancel, documentId, setCheckDepartmentID }) => {
    const [spinning, setSpinning] = useState(false)
    const [form] = Form.useForm()
    const [files, setFiles] = useState([])

    // if (!documentId) {
    //     setCheckDepartmentID(true)
    // }
    const handleEditFile = async (values) => {
        setSpinning(true)

        try {
            const formData = new FormData()
            Object.keys(values).forEach(key => {
                formData.append(key, values[key])
            })
            files.forEach((file) => {
                formData.append("files", file);
            });
            formData.append("doc_id", documentId)
            let { data, status } = await actionEditFile(formData)
            if (status === 200) {
                onCancel()
                message.success(data?.message)
            }
        } catch (err) {
            console.log(err)
        }
        setSpinning(false)
    }
    return (
        <Modal
            className="form-modal"
            footer={false}
            open={true}
            width={500}
        >
            <SpinCustom spinning={spinning}>
                <Form form={form} onFinish={handleEditFile}>
                    <Form.Item>
                        <UploadFile
                            setFiles={setFiles}
                            files={files}
                        />
                    </Form.Item>
                    <Row gutter={[16, 0]}>
                        <Col span={12}>
                            <Button
                                className="w-full"
                                onClick={onCancel}
                            >Thoát</Button>
                        </Col>
                        <Col span={12}>
                            <Button className="w-full" type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </SpinCustom>
        </Modal>
    )
}
export default UpdateFile 