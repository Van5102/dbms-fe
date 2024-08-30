
import React, { useState } from 'react';
import { Modal, Row, Col, Button, Form, Input, Radio, InputNumber } from 'antd'
import { formatCurrency } from 'utils/helps';
import { DATE_FORMAT, POINT_RANK, RANK, TRY_WORK_TIME } from 'utils/constants/config';

import moment from 'moment';

const DetailFeedBack = ({ openDetailRound, statusRound, onCancel }) => {
  const [desiredSalary, setDesiredSalary] = useState('');

  const format = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
      width={1200}
    >
      <Form
        initialValues={{
          ...openDetailRound.review_round_1,
          birthday: moment(openDetailRound?.birthday * 1000).format(DATE_FORMAT),
          interview_time: moment(openDetailRound?.interview_time * 1000).format(DATE_FORMAT)
        }}
      >
        {statusRound === 1 && openDetailRound?.review_round_1 &&
          <>
            <Col md={8} xs={24} >
              <Form.Item label="Mức lương đề xuất:" >
                <Input
                  value={formatCurrency(openDetailRound?.salary)}
                  disabled
                />
              </Form.Item>


            </Col>

            <Row gutter={[8, 8]}>
              <Col span={24}>
                <strong>Phỏng vấn Vòng 1: Phòng Hành chính Nhân sự</strong>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='applicant_name' label=' Họ tên ứng viên:'>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='position_name' label='Vị trí dự tuyển:'>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='dep_name' label='Phòng ban:'>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='birthday' label='Năm sinh:'>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='criteria_10' label='Mức lương ứng viên đề nghị:'>
                  <InputNumber
                    min={1}
                    max={1000000000}
                    className="w-full"
                    value={desiredSalary}
                    onChange={(value) => {
                      value &&
                        setDesiredSalary(format(value));
                    }}
                    disabled
                    formatter={(value) => value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value && value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col md={6} xs={12}>
                <Form.Item name='interview_time' label='Ngày phỏng vấn:'>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={24}>
                <strong>Tiêu chí đánh giá</strong>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    Tác phong, ngoại hình, trang phục.
                    <Form.Item name='criteria_1'>

                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>

                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Tinh thần, thái độ
                    <Form.Item name='criteria_2'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Chủ động trong công tác chuẩn bị
                    <Form.Item name='criteria_3'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Khả năng thích nghi với môi trường làm việc
                    <Form.Item name='criteria_4'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Khả năng lãnh đạo, năng lực tổ chức quản lý
                    <Form.Item name='criteria_5'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Sự gắn bó với Công ty
                    <Form.Item name='criteria_6'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    Bằng cấp chuyên môn phù hợp
                    <Form.Item name='criteria_7'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(POINT_RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio  value={key}>
                                {POINT_RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col >
                    Điểm đánh giá (test năng lực)
                    <Form.Item name='criteria_8'>
                      <Input disaled placeholder='VD:50'></Input>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <strong>Thời gian thử việc:</strong>
                    <Form.Item name='criteria_9'>
                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(TRY_WORK_TIME).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio value={key}>
                                {TRY_WORK_TIME[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <strong>Kết quả</strong>
                    <Form.Item name='result_final'>

                      <Radio.Group className="w-full">
                        <Row gutter={[6, 6]}>
                          {Object.keys(RANK).map((key) =>
                            <Col key={key} md={4} xs={12}>
                              <Radio value={key}>
                                {RANK[key]}
                              </Radio>
                            </Col>
                          )}
                        </Row>
                      </Radio.Group>

                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      </Form>

      <Form
        initialValues={openDetailRound.review_round_2}
      >
        {statusRound === 2 && openDetailRound?.review_round_2 &&
          <Row gutter={[16, 16]}>
            <Col>
              Mức lương dự kiến chính thức:
              <Input
                value={formatCurrency(openDetailRound?.salary)}
                disabled
              />
            </Col>

            {/* <Col >
            Mức lương thử việc(85% chính thức):
            <Input className="input-format-currency"
              value={formatCurrency(openDetailRound?.salary * (85 / 100))}
              disabled />
          </Col> */}

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Phỏng vấn Vòng 1: Phụ trách bộ phận Chuyên môn</strong>
              </Col>

              <Col span={24}>
                1. Kiến thức chuyên môn, khả năng đáp ứng các nhiệm vụ trong mô tả công việc.
                <Form.Item name='criteria_11'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                2. Kinh nghiệm liên quan đến vị trí ứng tuyển.
                <Form.Item name='criteria_12'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                3. Năng lực tại vị trí ứng tuyển.
                <Form.Item name='criteria_13'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                4. Kỹ năng giao tiếp (khả năng lập luận, tư duy, mạch lạc, trình bày có sức thuyết phục).
                <Form.Item name='criteria_14'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>

              </Col>

              <Col span={24}>
                5. Kỹ năng phân tích, ra quyết định.
                <Form.Item name='criteria_15'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>

              </Col>

              <Col span={24}>
                6. Kỹ năng làm việc độc lập và theo nhóm.
                <Form.Item name='criteria_16'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                7. Kỹ năng xử lý và giải quyết tình huống.
                <Form.Item name='criteria_17'>
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(POINT_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {POINT_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col span={24}>
                <strong>Kết quả</strong>
                <Form.Item name='result_final'>

                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>

                </Form.Item>
              </Col>
            </Row>

          </Row>

        }</Form>

      <Form
        initialValues={{
          ...openDetailRound,
          birthday: moment(openDetailRound?.birthday * 1000).format(DATE_FORMAT),
          criteria_9: openDetailRound?.review_round_1?.criteria_9,
          t: openDetailRound?.salary * (85 / 100)
        }}
      >
        {statusRound === 3 && openDetailRound?.review_round_3 &&
          <Row gutter={[8, 8]}>
            <Col md={8} xs={24}>
              <Form.Item name='salary' label='Mức lương dự kiến chính thức:'>
                <Input />
              </Form.Item>
            </Col>

            {/* <Col >
              <Form.Item name='t' label=' Mức lương thử việc(85% chính thức):' >
                <Input className="input-format-currency"
                  value={formatCurrency(openDetailRound?.salary * (85 / 100))}
                  disabled />
              </Form.Item>


            </Col> */}


            <Col md={8} xs={24}>
              <Form.Item name='applicant_name' label="  Họ tên ứng viên:">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item name='position_name' label=" Vị trí dự tuyển:">
                <Input disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item name='dep_name' label=' Phòng ban:'>
                <Input disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={24}>
              <Form.Item name='birthday' label='Năm sinh:'>
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              Thời gian thử việc:
              <Form.Item name='criteria_9'>
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
        }
      </Form>





    </Modal>
  );
};

export default DetailFeedBack;
