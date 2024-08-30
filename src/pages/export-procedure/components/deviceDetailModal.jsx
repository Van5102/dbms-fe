
import React from 'react'
import {Table,Modal,Button} from 'antd';
function DeviceDetailModal({ openDeviceDetail, onCancel }) {
    const columns = [
        {
            width: 180,
            align: "center",
            title: "Thiết bị",
            dataIndex: "device_name",
            key: "device_name",
           alignItem: "center"
          },
          {
            width: 180,
            align: "center",
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            alignItem: "center"
            
          }
    ]


  return (
    <Modal  className="common-modal"
    style={{ top: 10 }}
    title="Danh sách thiết bị,phụ kiện"
    footer={<Button onClick={onCancel} className="w-120">
      Thoát
    </Button>}
    open={true}
    width="30vw">
    <Table
          dataSource={openDeviceDetail}
          columns={columns}
          rowKey={openDeviceDetail => openDeviceDetail?.id}
        />
        </Modal>
  )
}

export default DeviceDetailModal