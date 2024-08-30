import { useMemo, useState } from "react"
import { Modal, Table, Button } from "antd"
import moment from "moment"
import {
  NOTARIZATION_PROCEDURE_TYPES,
  DATE_FORMAT, GENDER, USE_NEEDS,
  EXPERIENCE, EDUCATION_LEVEL
} from "utils/constants/config"

import {
  Row, Col
} from "antd"

const ProcedureDetailModal = ({ record, onCancel, setTabKey }) => {
  const showListCV = () => {
    onCancel()
    setTabKey('tab-4')
  }

  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={700}
      title="Phiếu tuyển dụng"
      footer={
        <>
          <Button onClick={showListCV} className="w-120">
            Xem CV
          </Button>
          <Button onClick={onCancel} className="w-120">
            Thoát
          </Button>
        </>
      }
      open={true}
    >
      <Row gutter={[12, 12]}>
        <Col md={12} xs={24}>
          <b>Vị trí cần tuyển</b>: {record?.position_name}
        </Col>

        <Col md={12} xs={24}>
          <b>Số lượng</b>: {record?.quantity}
        </Col>

        <Col md={12} xs={24}>
          <b>Bộ phận</b>: {record?.user_replaced_department_name}
        </Col>

        <Col md={12} xs={24}>
          <b>Ngày đề xuất</b>: {moment(record?.time_created * 1000).format(DATE_FORMAT)}
        </Col>

        <Col md={12} xs={24}>
          <b>Giới tính</b>: {record?.gender ? GENDER[record?.gender] : "Không yêu cầu"}
        </Col>

        <Col md={12} xs={24}>
          <b>Ngày cần lao động</b>: {moment(record?.day_need * 1000).format(DATE_FORMAT)}
        </Col>


        <Col md={12} xs={24}>
          <b>Nhu cầu sử dụng</b>: {USE_NEEDS[record?.use_needs]}
        </Col>

        <Col md={12} xs={24}>
          <b>Kinh nghiệm làm việc</b>: {EXPERIENCE[record?.experience]}
        </Col>

        <Col md={12} xs={24}>
          <b>Trình độ học vấn</b>: {EDUCATION_LEVEL[record?.education_level]}
        </Col>

        <Col md={12} xs={24}>
          <b>Thay thế nhân viên</b>: {record?.user_replaced_name || "________"}
        </Col>

        {record?.reason_replaced && <Col span={24}>
          <b>Lý do thay thế: </b>
          <div
            dangerouslySetInnerHTML={{ __html: record?.reason_replaced }}
          />
        </Col>}

        <Col span={24}>
          <b>Lý do tuyển dụng: </b>
          <div
            dangerouslySetInnerHTML={{ __html: record?.reason_recruitment }}
          />
        </Col>

        <Col span={24}>
          <b>Yêu cầu năng lực nhân sự: </b>
          <div
            dangerouslySetInnerHTML={{ __html: record?.description }}
          />
        </Col>

        <Col span={24}>
          <b>Mô tả công việc: </b>
          <div
            dangerouslySetInnerHTML={{ __html: record?.specializes }}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default ProcedureDetailModal