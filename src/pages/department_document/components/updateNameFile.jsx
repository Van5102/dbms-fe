import React, { useEffect, useRef, useState } from 'react';
import { SpinCustom } from 'components';
import { actionUpdateNameFile } from '../action';
import { Modal, Form, Input, Row, Button, Col, message, } from 'antd';
import { actionGetListFolderChid } from '../action';
const UpdateNameFile = ({
    oldName,
    idFile,
    onCancel,
    idDocumentAdd,
    handleGetListDocument,
    setCheckDepartmentID ,
    setListDocument}) => {
    const [form] = Form.useForm();
    const [spining, setSpinning] = useState(false)
    const [newName, setNewName] = useState()
    const passwordInput = useRef(null);

    if (!idDocumentAdd) {
        setCheckDepartmentID(true)
    } else {
        setCheckDepartmentID(false)
    }

    const hanleEditNameFile = async () => {
        setSpinning(true)
        const body = {
            doc_id: idFile,
            new_name: newName,
            accessScope: 1
        }
        try {
            const { data, status } = await actionUpdateNameFile(body);
            if (status === 200) {
                if (!idDocumentAdd) {
                    await handleGetListDocument()
                } else {
                    const body = {
                        document_id: idDocumentAdd,
                        accessScope: 1
                    };
                    const { data, status } = await actionGetListFolderChid(body);
                    if (status === 200) {
                        setCheckDepartmentID(false);
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

    useEffect(() => {
        if (passwordInput.current) {
            passwordInput.current.focus();
        }
    }, [passwordInput]);
    
    return (
        <Modal
            className="form-modal"
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
                            ref={passwordInput}
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