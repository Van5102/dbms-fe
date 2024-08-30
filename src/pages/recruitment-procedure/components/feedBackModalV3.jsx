import { useState, useRef } from "react"
import { actionHandleReview } from "../actions"
import { SpinCustom } from "components"
import {
  Modal, Form, Row, Col,
  Button, Input, InputNumber,
  message,
} from "antd"
import dayjs from "dayjs";
import BM06V3 from "./BM06_V3";

import { formatCurrency } from "utils/helps";
const FeedBackModalV3 = ({ onCancel, openFeedBackV3, setDataTb }) => {
  const [form] = Form.useForm()
  const [spinning, setSpinning] = useState(false)
  const [probationarySalary, setProbationarySalary] = useState();


  const handleAddFeedBackV3 = async () => {
    setSpinning(true)
    form.validateFields().then(async (values) => {
      setSpinning(true)
      const req_data = {
        review_round_1: null,
        review_round_2:null,
        review_round_3:JSON.stringify(await form.validateFields()),
        status: 1,
        salary: parseInt(values?.salary) || null,
        description: values?.description || " ",
      }
  
      const { data, status } = await actionHandleReview(openFeedBackV3?.id, req_data, { tab: 1 })
      if (status === 200) {
        message.success(data?.message)
        setDataTb(data?.list_interview)
        onCancel()
      }
  
    })
      .catch(err => console.log(err))
      .finally(() => setSpinning(false));
  }


  const setItemValue = (value) => {

    form.setFieldsValue({ "cost_price_render": value });
  };

  const setEstimatedPriceFormatCurrency = (value) => {
    setItemValue(formatCurrency(value || 0))
  };

  const format = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const handleDisabledDate = (currentDate) => {
    return currentDate <= dayjs().startOf("day");
  }
  const handleDateChange = (date) => {
    form.setFieldValue("start_working", date);
  };
 
  return (
    <Modal
      className="common-modal"
      style={{ top: 10, width: 350 }}
      open={true}
      title="Đánh giá phỏng vấn "
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleAddFeedBackV3}
            type="primary"
          >
            Tiếp nhận
          </Button>
        </Col>



      </Row>}
    >
      <SpinCustom spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...openFeedBackV3?.review_round_1,
            ...openFeedBackV3?.review_round_2,
            ...openFeedBackV3?.review_round_3,

            cost_price_render: formatCurrency(openFeedBackV3?.salary * (85 / 100))
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
                  openFeedBackV3={openFeedBackV3}
                  setEstimatedPriceFormatCurrency={setEstimatedPriceFormatCurrency}
                // ref={bm06Ref}
                />

              </Form.Item>

            </Col>

          </Row>
        </Form>
      </SpinCustom>
    </Modal>
  )
}

export default FeedBackModalV3