
import { SpinCustom } from "components";

import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  DatePicker,
  message,
  InputNumber,
} from "antd";


import { useEffect, useState } from "react";
// import DatePickerCustom from "@/components/datePickerCustom";
import TextArea from "antd/es/input/TextArea";
import DatePickerCustom from "components/datePickerCustom";
import { DATE_FORMAT, TYPE_OVER_TIME } from "utils/constants/config";
import { actionHandleAddOverTime } from "../action";
import dayjs from "dayjs";
import { formatCurrency } from "utils/helps";

const EditSalaryUserModal = ({ onCancel, openEdit, setListUserSalary }) => {
  // console.log(openEdit);
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [totalHd, setTotalHd] = useState(0);
  const [basicSalaryHd, setBasicSalaryHd] = useState(0);
  const [goodJobHd, setGoodJobHd] = useState(0);
  const [responsiGasHd, setResponsiGasHd] = useState(0);
  const [responsiUserHd, setResponsiUserHd] = useState(0);
  const [totalDayMonth, setTotalDayMonth] = useState(0);
  const [totalWorking, setTotalWorking] = useState(0);
  const [dayHoliday, setDayHoliday] = useState(0);
  const [dayBussiness, setDayBussiness] = useState(0);
  const [kpi, setKpi] = useState(0);

  form.setFieldValue('basic_salary_hd', basicSalaryHd)
  form.setFieldValue('good_job_hd', goodJobHd)
  form.setFieldValue('responsi_gas_hd', responsiGasHd)
  form.setFieldValue('responsi_user_hd', responsiUserHd)
  form.setFieldValue('total_day_month', totalDayMonth)
  form.setFieldValue('total_working', totalWorking)
  form.setFieldValue('day_holiday', dayHoliday)
  form.setFieldValue('day_bussiness', dayBussiness)
  form.setFieldValue('kpi', kpi)

  //Tổng lương(HD)
  form.setFieldValue('total_hd', basicSalaryHd + goodJobHd + responsiGasHd + responsiUserHd)

  //Lương cơ bản(Thực tế)
  form.setFieldValue('basic_salary_tt',
    (basicSalaryHd / totalDayMonth) *
    (totalWorking + dayHoliday + openEdit?.leave_allow + dayBussiness))

  //Thưởng HQCV thực tế
  form.setFieldValue('good_job_tt', ((goodJobHd / totalDayMonth) * (totalWorking + dayHoliday + dayBussiness)) * kpi)

  //PC xăng xe thực tế
  form.setFieldValue('responsi_gas_tt', (responsiGasHd / totalDayMonth) * (totalWorking + dayHoliday + dayBussiness))

  //Phụ cấp trách nhiệm thực tế
  form.setFieldValue('responsi_user_tt', responsiUserHd)

  //Lương làm thêm giờ
  form.setFieldValue('salary_add',
    (((form.getFieldValue('total_hd')) / totalDayMonth / 480) *
      openEdit?.overtime_weekday * 60 * 1.5)
    + (((form.getFieldValue('total_hd')) / totalDayMonth / 480) *
      openEdit?.overtime_weekend * 60 * 1.5)
    + (((form.getFieldValue('total_hd')) / totalDayMonth / 480) *
      openEdit?.overtime_holiday * 60 * 1.5)
  )

  //Tổng lương thực tế
  const handleAddProcedure = async () => {

    // form.validateFields().then(async (values) => {
    //   setSpinning(true)
    //   const data_req = {
    //     ...values,
    //     over_time_type:parseInt(values?.over_time_type) ,


    //     day: dayjs(values?.day).unix(),
    //   }

    //   const { data, status } = await actionHandleAddOverTime(data_req)

    //   if (status === 200) {
    //     message.success(data?.message)
    //     setListOverTime(data?.list_over_time)
    //     onCancel()
    //   }
    // })
    //   .catch(
    //     err => console.log(err)
    //   )

    // setSpinning(false)
  }


  useEffect(() => {

  }, [])
  return (
    <Modal
      className="common-long-modal"

      open={true}
      title="Cập nhật thông tin"
      footer={<Row justify="center" gutter={[8, 0]}>
        <Col>
          <Button className="w-120" onClick={onCancel}>Thoát</Button>
        </Col>

        <Col>
          <Button className="w-120"
            onClick={handleAddProcedure}
            type="primary"
          >
            Thêm
          </Button>
        </Col>
      </Row>}
      width={1200}
    >
      <Form
        layout="vertical"
        className="commom-form"
        initialValues={{ openEdit }}
        form={form}
      >
        <SpinCustom spinning={spinning}>
          <Row gutter={[8, 16]}>

            <Col md={8} xs={12} >
              <strong>Họ và tên:</strong>  {openEdit?.name}
            </Col>

            <Col md={8} xs={12}>
              <strong>Bộ phận:</strong> {openEdit?.dep_name}
            </Col>

            <Col md={8} xs={12}>
              <strong>  Chức danh: </strong>{openEdit?.pos_name}

            </Col>

            <Col md={8} xs={12} >
              <strong>Tổng lương HĐ(theo HĐ):</strong>
              <Form.Item name="total_hd">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <strong>Ngày nghỉ phép(hưởng phép năm):</strong> {openEdit?.leave_allow}

            </Col>

            <Col md={8} xs={12}>
              <strong>Làm thêm giờ ngày thường:</strong> {openEdit?.overtime_weekday}

            </Col>

            <Col md={8} xs={12}>
              <strong>Làm thêm giờ ngày nghỉ(chủ nhật): </strong>{openEdit?.overtime_weekend}
            </Col>

            <Col md={8} xs={12}>
              <strong> Làm thêm giờ ngày lễ tết:</strong> {openEdit?.overtime_holiday}
            </Col>

            <Col md={8} xs={12}>
              <strong> Phút việc riêng(PVR):</strong> {openEdit?.freetime}
            </Col>

            <Col md={8} xs={12} >
              <strong>Lương cơ bản(Thực tế):</strong>
              <Form.Item name="basic_salary_tt">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12} >
              <strong>Thưởng HQCV(Thực tế):</strong>
              <Form.Item name="good_job_tt">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12} >
              <strong>Phụ cấp xăng xe(Thực tế):</strong>
              <Form.Item name="responsi_gas_tt">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12} >
              <strong>Phụ cấp trách nhiệm(Thực tế):</strong>
              <Form.Item name="responsi_user_tt">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12} >
              <strong>Lương làm thêm giờ:</strong>
              <Form.Item name="salary_add">
                <Input className="w-full" disabled />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <strong>Trích đóng 10,5% BHXH:</strong> {openEdit?.bhxh}

            </Col>

            <Col md={8} xs={12}>
              <strong>Trừ phút việc riêng: </strong>{openEdit?.subtract_freetime}
            </Col>

            <Col md={8} xs={12}>
              <strong>Lương được nhận: </strong>{openEdit?.salary_received}
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="basic_salary_hd"
                label="Lương cơ bản/Lương đóng BH(theo HĐ)"
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  onChange={(v) => setBasicSalaryHd(v)}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="good_job_hd"
                label="Thưởng HQCV(theo HĐ):"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setGoodJobHd(v)}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="responsi_gas_hd"
                label="Phụ cấp xăng xe(theo HĐ):"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setResponsiGasHd(v)}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="responsi_user_hd"
                label="Phụ cấp trách nhiệm(theo HĐ):"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setResponsiUserHd(v)}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="total_day_month"
                label="Ngày công tiêu chuẩn:"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setTotalDayMonth(v)}
                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="total_working"
                label="Ngày công thực tế:"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setTotalWorking(v)} />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="day_holiday"
                label="Ngày nghỉ lễ tết:"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setDayHoliday(v)}

                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="day_bussiness"
                label="Ngày công tác:"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setDayBussiness(v)}


                />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="kpi"
                label="Hệ số đánh giá (KPI):"
              >
                <InputNumber className="w-full"
                  min={0}
                  onChange={(v) => setKpi(v)} />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="other_add"
                label="Khoản cộng khác:"
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="subtract_other"
                label="Khoản trừ khác:"
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </Col>

            <Col md={8} xs={12}>
              <Form.Item name="union"
                label="Khoản cộng khác:"
              >
                <InputNumber className="w-full" />
              </Form.Item>
            </Col>
          </Row>

        </SpinCustom>
      </Form>
    </Modal>
  );
};

export default EditSalaryUserModal;
