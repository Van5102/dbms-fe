import React, { useState, useEffect } from 'react';
import { actionGetImage } from '../action';
import { Modal, Row, Col, Button } from 'antd';
import { SpinCustom } from "components";

const DetailFile = ({ pathDoc, documentId, onCancel }) => {
    const [spinning, setSpinning] = useState(true);

    useEffect(() => {
        const iframe = document.getElementById('document-viewer');
        const handleLoad = () => {
            setSpinning(false);
        };

        const handleError = () => {
            setSpinning(false);
        };

        iframe.addEventListener('load', handleLoad);
        iframe.addEventListener('error', handleError);

        return () => {
            iframe.removeEventListener('load', handleLoad);
            iframe.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <Modal
            title="Chi tiết file"
            open={true}
            footer={<Row justify={"end"} >
                <Col span={4}>
                    <Button onClick={onCancel} className="w-full" >Thoát</Button>
                </Col>
            </Row>}
            className="fullscreen-modal"
            width="100vw"
        >
            <SpinCustom spinning={spinning}>
                <Row gutter={[0, 12]}>
                    <Col span={24}>
                        <iframe id="document-viewer"
                            src={`https://docs.google.com/viewer?embedded=true&url=${actionGetImage(documentId, 2)}`}
                            style={{ width: '100%', height: '600px', border: 'none' }}>
                        </iframe>
                    </Col>

               
                </Row>
            </SpinCustom>
        </Modal>
    );
};

export default DetailFile;
