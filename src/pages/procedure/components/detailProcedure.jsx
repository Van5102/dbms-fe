import {
  Button, Row, Col,
  Modal, Image
} from "antd"
import moment from "moment"
import { getFullUrlStaticFile } from "utils/helps";

import {
  DATETIME_FORMAT,
  REACT_APP_SERVER_BASE_URL
} from "utils/constants/config"
import { isEmpty } from "utils/helps"

const DetailProcedureModal = ({ onClose, isOpenDetailModal }) => {
  return (
    <Modal
      title="Thông tin chuyến đi"
      open={true}
      closeIcon={false}
      width={350}
      className='common-modal employee-profile-modal'
      footer={<Row gutter={[8, 0]}>
        <Col span={12}>
          <Button onClick={onClose} className='w-full'>Thoát</Button>
        </Col>
      </Row>}
      style={{ top: 10 }}
    >
      <Row gutter={[8, 16]}>
        <Col span={24}><strong>Người tạo: </strong>
          {isOpenDetailModal?.created_by}
        </Col>

        <Col span={24}><strong>Lý do: </strong>
          {isOpenDetailModal?.reason}
        </Col>

        <Col span={24}><strong>Địa điểm đi: </strong>
          {isOpenDetailModal?.departure}
        </Col>

        <Col span={24}><strong>Địa điểm đến: </strong>
          {isOpenDetailModal?.destination}
        </Col>

        <Col span={24}><strong> Người lái xe: </strong>
          {isOpenDetailModal?.driver_name}
        </Col>

        <Col span={24}><strong>Tên xe: </strong>
          {isOpenDetailModal?.vehicle_name}
        </Col>

        <Col span={24}><strong>Biến số xe: </strong>
          {isOpenDetailModal?.license_plate}
        </Col>

        <Col span={24}>
          <strong>Thời gian đi(dự kiến): </strong>
          {moment((isOpenDetailModal?.time_start) * 1000).format(DATETIME_FORMAT) || "chưa có"}
        </Col>

        <Col span={24}>
          <strong>Thời gian đến(dự kiến): </strong>
          {moment((isOpenDetailModal?.time_end) * 1000).format(DATETIME_FORMAT) || "chưa có"}
        </Col>

        <Col span={24}>
          <strong>Thời gian đi(thực tế): </strong>
          {!isEmpty(isOpenDetailModal?.departure_time) ? moment((isOpenDetailModal?.departure_time) * 1000).format(DATETIME_FORMAT) : "chưa có"}
        </Col>

        <Col span={24}>
          <strong>Thời gian đến(thực tế): </strong>
          {!isEmpty(isOpenDetailModal?.trip_end_time) ? moment((isOpenDetailModal?.trip_end_time) * 1000).format(DATETIME_FORMAT) : "chưa có"}
        </Col>

        <Col span={24}>
          <strong>Thành viên tham gia: </strong>
          {isOpenDetailModal?.members.map(e => e?.name).toLocaleString().replace(/,/g, ', ')}
        </Col>

        <Col span={24}>
          <strong>Ghi chú(tài xế): </strong>
          {!isEmpty(isOpenDetailModal?.driver_description) ? isOpenDetailModal?.driver_description : "chưa có"}
        </Col>

        {!isEmpty(isOpenDetailModal?.images) ?
          isOpenDetailModal?.images.map(e =>
            <Col>
              <Image
                width={120}
                src={getFullUrlStaticFile(e?.path)}
              />
            </Col>
          ) : "chưa có"
        }
      </Row>
    </Modal>
  );
}

export default DetailProcedureModal