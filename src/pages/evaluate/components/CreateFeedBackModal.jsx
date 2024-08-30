
import React from 'react';
import { Button, Col, Form, Modal, Row, message } from 'antd';

import { actionCreateEvaluate } from '../action';
import FormEvaluate from './formEvaluate';

const CreateEvaluate = ({ setSpinning, onCancel, setListEvaluate }) => {
  const [form] = Form.useForm();

  const handleAddEvaluate = async () => {
    form.validateFields().then(async (values) => {
      const items = values?.table1?.map((v) => ({
        textTbale1: v?.textTbale1,
        textTbale2: v?.textTbale2,
        textTbale3: v?.textTbale3,
        textTbale4: v?.textTbale4,
        textTbale5: v?.textTbale5,
        textTbale6: v?.textTbale6,
        textTbale7: v?.textTbale7,
      }))
      const req_data = {
        ...values,
        table1: items
      }

      setSpinning(true)
      try {
        const params = {}
        const { data, status } = await actionCreateEvaluate({ content: JSON.stringify(req_data) }, params)
        if (status === 200) {

          setListEvaluate(data?.list_evaluate);
          message.success(data?.message);
          onCancel()
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
            onClick={handleAddEvaluate}
            type="primary"
          >
            Đề xuất
          </Button>
        </Col>
      </Row>}
      onCancel={onCancel}
      width="100vw"
    >
      <Form
        layout="vertical"
        form={form}
      >

        <FormEvaluate/>

      </Form>
    </Modal >
  );
};

export default CreateEvaluate;
