
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button } from 'antd';
import { SpinCustom } from "components";
import { REACT_APP_SERVER_BASE_URL } from 'utils/constants/config';
import { actionGetLinkCv } from '../actions';
import { getFullUrlStaticFile } from "utils/helps";

const DetailFile = ({ openDetailSchedule, openDetail, onCancel }) => {
    
    const [spinning, setSpinning] = useState(true);
    // const pathFile =openDe
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
                <Col span={4} >
                    <Button onClick={onCancel} className="w-full" >Thoát</Button>
                </Col>
            </Row>}
            className="fullscreen-modal"
            width="100vw"
        >
            <SpinCustom spinning={spinning}>
                <Row gutter={[0, 12]}>
                    
                    <Col span={24}>
                    {openDetail &&  <iframe id="document-viewer"
                            src={`https://docs.google.com/viewer?embedded=true&url=${getFullUrlStaticFile(`/get-cv-applicant/${openDetail?.id}`)}`}
                            style={{ width: '100%', height: '600px', border: 'none' }}>
                        </iframe>}

                        {
                            openDetailSchedule && <iframe id="document-viewer"
                            src={`https://docs.google.com/viewer?embedded=true&url=${getFullUrlStaticFile(`/get-cv-applicant/${openDetailSchedule?.applicant_id}`)}`}
                            style={{ width: '100%', height: '600px', border: 'none' }}></iframe>
                        }
                       
                    </Col>

               
                </Row>
            </SpinCustom>
        </Modal>
    );
};

export default DetailFile;
