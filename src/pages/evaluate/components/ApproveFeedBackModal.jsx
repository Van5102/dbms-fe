
import React from 'react';
import { Button, Col, Form, Modal, Row, message } from 'antd';

import FormEvaluate from './formEvaluate';
import { actionApproveEvaluate } from '../action';
import { STATUS } from 'utils/constants/config';
const ApproveEvaluate = ({ setSpinning, onCancel, setlistEvaluatePeding ,approveProcedure}) => {
  // console.log(approveProcedure);

  const [form] = Form.useForm();

  const handleApproveEvaluate = async () => {
    await form.validateFields().then(async () => {

      setSpinning(true)
      try {
        const params = {}
        const { data, status } = await  actionApproveEvaluate(approveProcedure?.id, STATUS['ACCEPT'], { content: JSON.stringify(await form.validateFields())  }, params)
       
        if (status === 200) {

          onCancel()
          setlistEvaluatePeding(data?.list_evaluate_pending);
          message.success(data?.message);
         
        }
      } catch (err) {
        console.log(err)
      }
      setSpinning(false)

    })
   
  }

  return (
   
    
    <Modal
      title="ĐÁNH GIÁ KẾT QUẢ THỰC TẬP/HỌC VIỆC/THỬ VIỆC"
      open={true}
      className="fullscreen-modal"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button
            className="w-120"
            onClick={onCancel}
          >Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleApproveEvaluate}
            type="primary"
          >
            Tiếp nhận
          </Button>
        </Col>
      </Row>}

      onCancel={onCancel}
      width="100vw"
    >
     <Form
          layout="vertical"
          initialValues={approveProcedure?.content}
          form={form}
        >

        <FormEvaluate/>

        </Form>
    </Modal>
  );
};

export default ApproveEvaluate;
