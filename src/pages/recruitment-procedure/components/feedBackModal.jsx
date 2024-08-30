import { useState, useRef, useEffect } from "react"
import { actionCreateSchedule, actionHandleReview } from "../actions"
import { SpinCustom } from "components"
import {
  Modal, Form, Row, Col,
  Button, Input,
  message, InputNumber,
  Radio,
  Select
} from "antd"
import { useSelector } from "react-redux";


import { formatCurrency } from "utils/helps";
import moment from "moment";
import { DATE_FORMAT, INTERVIEW_ACTION, POINT_RANK, RANK, TRY_WORK_TIME } from "utils/constants/config";
import { actionGetUsers } from "pages/home/actions";
import DatePickerCustom from "components/datePickerCustom";
import dayjs from "dayjs";
import BM06V3 from "./BM06_V3";
const { TextArea } = Input;

const FeedBackModal = ({ onCancel, openFeedBack, setDataTb, interviewId, interviewer }) => {
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [form3] = Form.useForm()
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)
  const [selectedInterviewAction, setSelectedInterviewAction] = useState(null)
  const [desiredSalary, setDesiredSalary] = useState('');
  const [users, setUsers] = useState([])
  const [probationarySalary, setProbationarySalary] = useState();



  const bm06Ref = useRef()
  const userLogin = useSelector((state) => state?.profile);
  const handleChangeFormData = (v) => {
    form3.setFieldValue('interview_time', v)
  }
  const handleRadioBtnChange = (e) => {
    setSelectedInterviewAction(e?.target?.value);
  };

  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }
  const handleGetUser = async () => {
    setSpinning(true)
    try {
      const { data, status } = await actionGetUsers()

      if (status === 200) {
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }
  useEffect(() => {
    handleGetUser()
  }, [])

  //đánh giá phỏng vấn
  const handleAddFeedBack = async () => {

    // const text = await bm06Ref.current.handleSave();
    form1.validateFields().then(async (values) => {

      setSpinning(true)
      const req_data = {
        review_round_1: JSON.stringify(await form1.validateFields()),
        review_round_2: JSON.stringify(await form2.validateFields()),
        review_round_3: JSON.stringify(await form.validateFields()),
        status: 1,
        salary: parseInt(values?.salary) || null,
        description: values?.description || " ",
      }

      // nếu là trưởng phòng nhân sự hoặc sếp
      // if ((userLogin?.department_id === 6 && userLogin?.position_code === "TRUONG_PHONG") || userLogin.position_code == "GIAM_DOC") {
      //   req_data.review_round_1 = JSON.stringify(await form1.validateFields());
      //   req_data.review_round_2 = null;
      //   req_data.review_round_3 = null
      // }


      //nếu là người tham gia phỏng vấn hoặc sếp  hoặc thuộc cùng phòng ban
      // if (interviewer.includes(userLogin?.id) ||
      //   userLogin.position_code == "GIAM_DOC" ||
      //   (userLogin.department_id == openFeedBack.department_id)
      // ) {
      //   req_data.review_round_1 = null;
      //   req_data.review_round_2 = JSON.stringify(await form2.validateFields());
      //   req_data.review_round_3 = null
      // }



      const { data, status } = await actionHandleReview(openFeedBack?.id, req_data, { tab: 1 })
      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        onCancel()
      }

    })
      .catch(err => console.log(err))
      .finally(() => setSpinning(false));

    // if (interviewer.includes(userLogin?.id) ||
    //   userLogin.position_code == "GIAM_DOC" ||
    //   userLogin.position_code == "P_GIAM_DOC" ||
    //   (userLogin.department_id == openFeedBack.department_id)) {
    //   form2.validateFields().then(async (values) => {

    //     setSpinning(true)
    //     const req_data = {
    //       review_round_1: null,
    //       review_round_2: JSON.stringify(await form2.validateFields()),
    //       review_round_3: null,
    //       status: 1,
    //       salary: parseInt(values?.salary) || null,
    //       description: values?.description || " ",
    //     }

    //     const { data, status } = await actionHandleReview(openFeedBack?.id, req_data)
    //     if (status === 200) {
    //       message.success(data?.message)
    //       setDataTb(data?.list_interview)
    //       onCancel()
    //     }

    //   })
    //     .catch(err => console.log(err))
    //     .finally(() => setSpinning(false));
    // }





    if (userLogin?.position_code === "NHAN_SU") {

      form3.validateFields().then(async (values) => {
        console.log(values);
        setSpinning(true)
        //nếu mời sếp đánh giá luôn mà không phỏng vấn vòng 2
        if (selectedInterviewAction == 0) {
          const req_data = {
            review_round_1: null,
            review_round_2: null,
            review_round_3: null,
            status: 3,
            salary: parseInt(values?.salary) || null,
            description: values?.description || " ",

          }
          const { data, status } = await actionHandleReview(openFeedBack?.id, req_data)
          if (status === 200) {
            message.success(data?.message)
            setDataTb(data?.list_interview)
            onCancel()
          }
        }

        //nếu phỏng vấn vòng 2 (đặt lịch)
        if (selectedInterviewAction == 1) {
          const data_req = {
            ...values,
            description: values?.description || " ",
            interview_time: (parseInt(values.interview_time)) / 1000 || null
          }
          const { data, status } = await actionCreateSchedule(openFeedBack?.id, data_req)

          if (status === 200) {
            message.success(data?.message)
            setDataTb(data?.list_interview)
            onCancel()
            setSpinning(false)
          } else {
            message.err(data?.message)
          }
        }



      })
        .catch(err => console.log(err))
        .finally(() => setSpinning(false));
    }




  }


  const setEstimatedPriceFormatCurrency = (value) => {
    setItemValue(formatCurrency(value || 0));
  };

  const setItemValue = (value) => {
    form1.setFieldsValue({ "cost_price_render": value });
  };
  const format = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  console.log(openFeedBack);
  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      open={true}
      title="Đánh giá phỏng vấn "
      width={1200}
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={() => {
              handleAddFeedBack();
            }}
            type="primary"
          >
            Tiếp nhận
          </Button>
        </Col>

      </Row>}
    >
      <SpinCustom spinning={spinning}>


        {/* là trưởng phòng hcns hoặc sếp */}
        {((userLogin?.department_id === 6 && userLogin?.position_code === "TRUONG_PHONG")
          || userLogin.position_code == "GIAM_DOC" ||
          userLogin.position_code == "P_GIAM_DOC"
        )
          && (
            <Form
              layout="vertical"
              className="commom-form"
              // onFinish={handleAddProcedure}
              initialValues={{
                ...openFeedBack,
                birthday: moment(openFeedBack?.birthday * 1000).format(DATE_FORMAT),
                interview_time: moment(openFeedBack?.interview_time * 1000).format(DATE_FORMAT)
              }}
              form={form1}
              name='form1'
            >
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


                <Col md={6} xs={12}>
                  <Form.Item name="salary"
                    rules={[
                      { required: true, message: "Vui lòng nhập" }
                    ]}
                    label="Mức lương đề xuất"
                  >
                    <InputNumber
                      min={1}
                      max={1000000000}
                      className="w-full"
                      onChange={(v) =>
                        setEstimatedPriceFormatCurrency(v)
                      }
                    />
                  </Form.Item>

                </Col>

                <Col md={6} xs={12}>
                  <Form.Item
                    name="cost_price_render"
                    label=" "
                  >
                    <Input className="input-format-currency" disabled />
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
                      Tinh thần, thái độ
                      <Form.Item name='criteria_2'>
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
                      Chủ động trong công tác chuẩn bị
                      <Form.Item name='criteria_3'>
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
                      Khả năng thích nghi với môi trường làm việc
                      <Form.Item name='criteria_4'>
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
                      Khả năng lãnh đạo, năng lực tổ chức quản lý
                      <Form.Item name='criteria_5'>
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
                      Sự gắn bó với Công ty
                      <Form.Item name='criteria_6'>
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
                      Bằng cấp chuyên môn phù hợp
                      <Form.Item name='criteria_7'>
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

                    <Col >
                      Điểm đánh giá (test năng lực)
                      <Form.Item name='criteria_8'>
                        <Input placeholder='Tốt: ≥ 91đ; Khá: 81-90đ; Trung bình: 61-80đ; Yếu: <60đ'></Input>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
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
            </Form>
          )}


        {/* nếu là người tham gia phỏng vấn hoặc sếp  hoặc thuộc cùng phòng ban*/}
        {
          ((interviewer.includes(userLogin?.id)) ||
            userLogin.position_code == "GIAM_DOC" ||
            userLogin.position_code == "P_GIAM_DOC"
          )
          && (
            <Form
              layout="vertical"
              className="commom-form"
              // onFinish={handleAddProcedure}
              form={form2}
              name='form2'

            >
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
            </Form>
          )
        }

        {/* nếu là vị trí nhân sự */}
        {
          (userLogin?.position_code === "NHAN_SU") &&
          (
            <>
              <Col >
                <Radio.Group className="w-full" onChange={handleRadioBtnChange}>
                  <Row gutter={[6, 6]}>
                    {Object.keys(INTERVIEW_ACTION).map((key) =>
                      <Col key={key} md={8} xs={12}>
                        <Radio value={key}>
                          {INTERVIEW_ACTION[key]}
                        </Radio>
                      </Col>
                    )}
                  </Row>
                </Radio.Group>
              </Col>

              {selectedInterviewAction == 1 &&

                <Form
                  layout="vertical"
                  className="commom-form"
                  // onFinish={handleAddProcedure}

                  form={form3}

                >
                  <Row gutter={[16, 16]}>
                    <Col md={8} xs={24}>
                      <Form.Item name="interviewer"
                        rules={[
                          { required: true, message: "Vui lòng chọn người phỏng vấn " }
                        ]}
                        label="Người tham gia phỏng vấn vòng 2"
                      >
                        <Select
                          className='w-full'
                          placeholder="Người tham gia phỏng vấn vòng 2"
                          showSearch
                          allowClear
                          mode="multiple"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            `${option.children}`.toLocaleLowerCase().includes(input.toLocaleLowerCase())
                          }
                        >
                          {users.map((e) =>
                            <Select.Option key={e?.id} value={e.id}>
                              {e?.name}
                            </Select.Option>
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col md={8} xs={24}>
                      <Form.Item name="interview_time"
                        rules={[
                          { required: true, message: "Vui lòng chọn thời gian phỏng vấn vòng 2" }
                        ]}
                        label="Thời gian phỏng vấn vòng 2"
                      >
                        <Row gutter={[4, 0]}>
                          <Col className="w-full">
                            <DatePickerCustom
                              setDatetime={handleChangeFormData}
                              disabled={handleDisabledDate}
                            />
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>

                    <Col md={8} xs={24}>
                      <Form.Item name="description"
                        label="Mô tả:"
                      >
                        <TextArea rows={2} placeholder="Mô tả" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

              }
            </>
          )
        }

        {/* nếu là giám đốc hoặc phó giám đốc */}

        {(userLogin?.position_code === "GIAM_DOC" || userLogin?.position_code === "P_GIAM_DOC") && openFeedBack.review_round_3 &&
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              ...openFeedBack?.review_round_1,
              ...openFeedBack?.review_round_2,
              ...openFeedBack?.review_round_3,

              cost_price_render: formatCurrency(openFeedBack?.salary * (85 / 100))
            }}

          >
            <Row gutter={[32, 8]}>

              <Col span={24}>
                <Form.Item name="salary"
                  label="Mức lương dự kiến chính thức:"
                  rules={[
                    { required: true, message: "Vui lòng nhập " },
                  ]}
                >

                  <InputNumber
                    min={0}
                    className="w-full"
                    value={probationarySalary}
                    onChange={(value) => {
                      value &&
                        setEstimatedPriceFormatCurrency(value * (85 / 100))
                      setProbationarySalary(format(value));
                    }}
                    formatter={(value) => value && value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value && value?.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>


              </Col>

              {/* <Col span={24}>
              <Form.Item
                name="cost_price_render"
                label="Mức lương thử việc(85% chính thức)"
              >
                <Input className="input-format-currency" disabled />
              </Form.Item>
            </Col> */}

              <Col md={24} xs={24}>
                <Form.Item name="form_review"
                >
                  <BM06V3
                    openFeedBack={openFeedBack}
                    setEstimatedPriceFormatCurrency={setEstimatedPriceFormatCurrency}
                  // ref={bm06Ref}
                  />

                </Form.Item>

              </Col>

            </Row>
          </Form>
        }


      </SpinCustom>
    </Modal>
  )
}

export default FeedBackModal