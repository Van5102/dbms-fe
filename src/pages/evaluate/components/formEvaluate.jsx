import { EVALATE_RANK } from "utils/constants/config";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, Row } from "antd";


const FormEvaluate = () => {
  return (
    <Row gutter={[16, 16] }  style={{ fontSize: 'calc(var(--base-font-size) * 3)'}} >
      <Col span={24} style={{ textAlign: "center", fontSize: "large" }}><strong>ĐÁNH GIÁ KẾT QUẢ THỰC TẬP/HỌC VIỆC/THỬ VIỆC</strong> </Col>
      <Col span={24} style={{ textAlign: "center", fontSize: "medium" }}><strong>Sau 7 ngày/ 30 ngày/ kết thúc quá trình.</strong> </Col>
      <Col span={24}>
      <Row justify={'center'}>
         <Col md={12} xs={24} style={{ textAlign: "center", fontSize: "medium" }} >
        <Form.Item
          name='start_end'
        >
          <Input type="text" style={{ border: 'none', outline: 'none', resize: 'none',textAlign: 'center', height: "100%" }} defaultValue={"Từ ngày…..tháng…..năm….. đến ngày…..tháng……năm…….."} />
        </Form.Item>
      </Col>
      </Row>
      </Col>
     
      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>I.NGƯỜI ĐƯỢC ĐÁNH GIÁ</strong>
      </Col>


      <Col>
        <strong>Họ & tên</strong>
        <Form.Item
          name='applicant_name'

        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>

      <Col>
        <strong>Chức danh</strong>
        <Form.Item
          name='applicant_position'
        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>

      <Col >
        <strong>Bộ phận</strong>
        <Form.Item
          name='applicant_department'

        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>

      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>II.NGƯỜI TIẾN HÀNH ĐÁNH GIÁ</strong>
      </Col>

      <Col>
        <strong>Họ & tên</strong>
        <Form.Item
          name="name"
        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>
      <Col >
        <strong>Chức danh</strong>
        <Form.Item
          name="pos_name"
        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>
      <Col >
        <strong>Bộ phận</strong>
        <Form.Item
          name="des_name"
        >
          <Input type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }} defaultValue={"..........."} />
        </Form.Item>
      </Col>

      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>I. NỘI DUNG ĐÁNH GIÁ</strong>
      </Col>

      <Col span={24}><i>1    Các công việc, nhiệm vụ trong thời gian thực tập/học việc/thử việc:</i> </Col>

      <Col span={24}>
        <table border="1" style={{ minWidth: "1024px", overflowX: "auto", width: '100%', borderCollapse: 'collapse' }}>
          <tr>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "16%" }}>Nội dung công việc</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "4%" }}>Trọng số<br />(tỷ lệ %)</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "20%" }}>Yêu cầu/mục tiêu công việc</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "16%" }}>Kết quả</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "12%" }}>Thời gian thực hiện</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "12%" }}>Nhân viên tự đánh giá</th>
            <th style={{ textAlign: 'center', fontWeight: 'bold', width: "16%" }}>Phụ trách đánh giá</th>
          </tr>

        </table>
      </Col>
      <Col span={24}>

        <Form.List name="table1">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={[8, 0]} key={key}>
                  <Col>STT: {index + 1}</Col>

                  <Col>
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      danger
                    />
                  </Col>

                  <Col span={24}>
                    <table border="1" style={{ minWidth: "1024px", overflowX: "auto", width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr >
                          <Row gutter={[0, 0]}>
                            <Col span={4}>
                              <td style={{ textAlign: 'center', height: ' 200px', width: "310px" }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale1"]}
                                  style={{ marginBottom: "0" }}
                                >

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                            <Col span={1}>
                              <td style={{ textAlign: 'center', height: '200px' }}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale2"]}
                                  style={{ marginBottom: "0" }}
                                >

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>

                            </Col>
                            <Col span={5}>
                              <td style={{ textAlign: 'center', height: '200px', width: "380px" }} >

                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale3"]}
                                  style={{ marginBottom: "0" }}
                                >

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                            <Col span={4}>
                              <td style={{ textAlign: 'center', height: '200px', width: '380px' }}>

                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale4"]}
                                  style={{ marginBottom: "0" }}
                                >


                                  <Input.TextArea defaultValue="
                              a.Kết quả chi tiết/tình hình thực hiện: 
                                ...............
                              b.Khó khăn, vướng mắc và kiến nghị:
                                ...............
                              c.Đề xuất hướng giải quyết, xin ý kiến chỉ đạo:" type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                            <Col span={3}>
                              <td style={{ textAlign: 'center', height: '200px', width: "300px" }}>

                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale5"]}
                                  style={{ marginBottom: "0" }} >

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                            <Col span={3}>
                              <td style={{ textAlign: 'center', height: '200px', width: "300px" }}>

                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale6"]}
                                  style={{ marginBottom: "0" }}>

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                            <Col span={4}>
                              <td style={{ textAlign: 'center', height: '200px', width: "320px" }}>

                                <Form.Item
                                  {...restField}
                                  name={[name, "textTbale7"]}
                                  style={{ marginBottom: "0" }}
                                >

                                  <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "200px" }} />
                                </Form.Item>
                              </td>
                            </Col>
                          </Row>

                        </tr>
                      </tbody>
                    </table>


                  </Col>

                </Row>
              ))}

              <Form.Item>
                <Button icon={<PlusOutlined />} onClick={add}>
                  Thêm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </Col>

      <Col span={24}><i>2.Đánh giá kỹ năng và các vấn đề liên quan:</i> </Col>

      <Col>
        <Row>
          <Col md={12} xs={24}>
            <strong>Nhân viên tự đánh giá</strong>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                Tinh thần trách nhiệm
                <Form.Item name="radio1">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>

              </Col>

              <Col span={24}>
                Chất lượng công việc
                <Form.Item name="radio2">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Thời gian hoàn thành công việc
                <Form.Item name="radio3">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>

                </Form.Item>

              </Col>

              <Col span={24}>
                Kết quả công việc
                <Form.Item name="radio4">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>

                </Form.Item>

              </Col>

              <Col span={24}>
                Hỗ trợ đồng nghiệp
                <Form.Item name="radio5">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Văn hóa công ty
                <Form.Item name="radio6">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Nội quy công ty
                <Form.Item name="radio7">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>



            </Row>
          </Col>

          <Col md={12} xs={24}>
            <strong>Phụ trách bộ phận</strong>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                Tinh thần trách nhiệm
                <Form.Item name="radio8">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>

              </Col>

              <Col span={24}>
                Chất lượng công việc
                <Form.Item name="radio9">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Thời gian hoàn thành công việc
                <Form.Item name="radio10">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Kết quả công việc
                <Form.Item name="radio11">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Hỗ trợ đồng nghiệp
                <Form.Item name="radio12">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Văn hóa công ty
                <Form.Item name="radio13">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
                          </Radio>
                        </Col>
                      )}
                    </Row>
                  </Radio.Group>
                </Form.Item>


              </Col>

              <Col span={24}>
                Nội quy công ty
                <Form.Item name="radio14">
                  <Radio.Group className="w-full">
                    <Row gutter={[6, 6]}>
                      {Object.keys(EVALATE_RANK).map((key) =>
                        <Col key={key} md={4} xs={12}>
                          <Radio value={key}>
                            {EVALATE_RANK[key]}
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
      </Col>





      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>I. Ý kiến và đề xuất của NLĐ </strong>
      </Col>

      <Col span={24}>
        <Form.Item name="yk1">
          <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }}
            defaultValue={".............................................................................."} />
        </Form.Item>

      </Col>

      <Col span={24}><strong>Đề xuất</strong></Col>
      <Col span={24}>
        <Row gutter={[60, 16]}>
          <Col>
            <Row >
              <Col>
                Tuyển dụng chính thức:
              </Col>
              <Col>
                <Form.Item name="ct1">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />
                </Form.Item>

              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thử việc thêm:
              </Col>
              <Col>
                <Form.Item name="tv1">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng học việc thêm:
              </Col>
              <Col>
                <Form.Item name="hv1">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thực tập thêm:
              </Col>
              <Col>
                <Form.Item name='tt1'>
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Kết thúc /đến:
              </Col>
              <Col>
                <Form.Item name="kt1">
                  <Input type="text" style={{ border: 'none', outline: 'none' }} defaultValue={"..................."} />

                </Form.Item>

              </Col>
            </Row>


          </Col>
        </Row>
      </Col>

      <Col>
        <Row>
          <Col>
            Tiền lương:
          </Col>
          <Col>
            <Form.Item name="salary1">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>
      <Col>
        <Row>
          <Col>
            Thời gian tham gia BHXH:
          </Col>
          <Col>
            <Form.Item name="bhxh1">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>



      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>II.	Ý kiến của Trưởng bộ phận </strong>
      </Col>

      <Col span={24}>
        <Form.Item name="yk2">

          <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }}
            defaultValue={".............................................................................."} />
        </Form.Item>
      </Col>

      <Col span={24}><strong>Đề xuất</strong></Col>
      <Col span={24}>
        <Row gutter={[60, 16]}>
          <Col>
            <Row >
              <Col>
                Tuyển dụng chính thức:
              </Col>
              <Col>
                <Form.Item name="ct2">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />
                </Form.Item>

              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thử việc thêm:
              </Col>
              <Col>
                <Form.Item name="tv2">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng học việc thêm:
              </Col>
              <Col>
                <Form.Item name="hv2">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thực tập thêm:
              </Col>
              <Col>
                <Form.Item name='tt2'>
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Kết thúc /đến:
              </Col>
              <Col>
                <Form.Item name="kt2">
                  <Input type="text" style={{ border: 'none', outline: 'none' }} defaultValue={"..................."} />

                </Form.Item>

              </Col>
            </Row>


          </Col>
        </Row>
      </Col>

      <Col>
        <Row>
          <Col>
            Tiền lương:
          </Col>
          <Col>
            <Form.Item name="salary2">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>
      <Col>
        <Row>
          <Col>
            Thời gian tham gia BHXH:
          </Col>
          <Col>
            <Form.Item name="bhxh2">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>



      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>III.	Ý kiến của Trưởng phòng nhân sự </strong>
      </Col>

      <Col span={24}>
        <Form.Item name="yk3">

          <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }}
            defaultValue={".............................................................................."} />
        </Form.Item>
      </Col>

      <Col span={24}><strong>Đề xuất</strong></Col>
      <Col span={24}>
        <Row gutter={[60, 16]}>
          <Col>
            <Row >
              <Col>
                Tuyển dụng chính thức:
              </Col>
              <Col>
                <Form.Item name="ct3">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />
                </Form.Item>

              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thử việc thêm:
              </Col>
              <Col>
                <Form.Item name="tv3">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>



          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng học việc thêm:
              </Col>
              <Col>
                <Form.Item name="hv3">
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Số tháng thực tập thêm:
              </Col>
              <Col>
                <Form.Item name='tt3'>
                  <Input type="text" style={{ border: 'none', outline: 'none', width: "40px" }} defaultValue={"..."} />

                </Form.Item>
              </Col>
            </Row>


          </Col>
          <Col>
            <Row>
              <Col>
                Kết thúc /đến:
              </Col>
              <Col>
                <Form.Item name="kt3">
                  <Input type="text" style={{ border: 'none', outline: 'none' }} defaultValue={"..................."} />

                </Form.Item>

              </Col>
            </Row>


          </Col>
        </Row>
      </Col>

      <Col>
        <Row>
          <Col>
            Tiền lương:
          </Col>
          <Col>
            <Form.Item name="salary3">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>
      <Col>
        <Row>
          <Col>
            Thời gian tham gia BHXH:
          </Col>
          <Col>
            <Form.Item name="bhxh3">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>



      <Col style={{ fontSize: "medium" }} span={24}>
        <strong>IV.	Phê duyệt của Giám đốc </strong>
      </Col>

      <Col span={24}>
        <Form.Item name="yk4">

          <Input.TextArea type="text" style={{ border: 'none', outline: 'none', width: "100%", resize: 'none', height: "100%" }}
            defaultValue={".............................................................................."} />
        </Form.Item>
      </Col>



      <Col>
        <Row>
          <Col>
            Tiền lương:
          </Col>
          <Col>
            <Form.Item name="salary4">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>
      <Col>
        <Row>
          <Col>
            Thời gian tham gia BHXH:
          </Col>
          <Col>
            <Form.Item name="bhxh4">

              <Input style={{ border: 'none', outline: 'none' }} type='text' defaultValue={"..........................."}></Input>
            </Form.Item>
          </Col>
        </Row>


      </Col>

    </Row>
  )
}
export default FormEvaluate