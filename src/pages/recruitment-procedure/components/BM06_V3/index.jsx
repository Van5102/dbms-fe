

import { DATE_FORMAT, TRY_WORK_TIME } from 'utils/constants/config';
import moment from 'moment';
import { Col, Input, Radio, Row, Form } from 'antd';

const BM06V3 = ({ openFeedBackV3 })=> {
  
  return (
    <Form
      initialValues={{
        ...openFeedBackV3,
        birthday: moment(openFeedBackV3?.birthday * 1000).format(DATE_FORMAT),
        criteria_9: openFeedBackV3?.review_round_1?.criteria_9
      }}
    >
      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item name='applicant_name' label='Họ tên ứng viên:'>
            <Input disabled />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name='position_name' label=' Vị trí dự tuyển:'>
            <Input disabled />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name='dep_name' label='Phòng ban:'>
            <Input disabled />
          </Form.Item>

        </Col>

        <Col>
          <Form.Item name='birthday' label='Năm sinh:'>
            <Input disabled />
          </Form.Item>

        </Col>

        <Col span={24}>

          <Form.Item name='criteria_9' label=' Thời gian thử việc:'>
            <Radio.Group className="w-full">
              <Row gutter={[6, 6]}>
                {Object.keys(TRY_WORK_TIME).map((key) =>
                  <Col key={key} md={12} xs={12}>
                    <Radio value={key}>
                      {TRY_WORK_TIME[key]}
                    </Radio>
                  </Col>
                )}
              </Row>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Form>




  );
}

export default BM06V3;