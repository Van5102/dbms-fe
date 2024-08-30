import { Button, Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { actionGetDevices } from "../actions"
import { TbDeviceWatchPlus } from "react-icons/tb";
import AddDevice from "./addDevice";
const ListDevice = ({ setSpinning, deviceSeach }) => {
  const paginationTab1 = {
    page_num: 1,
    page_size: 10,
  };
  const [addDevice, setAddDevice] = useState(false);

  const [devices, setDevices] = useState([])
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      width: '5%',
      key: "id",
      render: (v, r, i) =>
        i + 1 + (paginationTab1.page_num - 1) * paginationTab1.page_size,
    },
    {
      title: "Mã thiết bị",
      dataIndex: "code",
      key: "code",
      align: "center",
      width: '10%'
    },
    {
      title: "Tên thiết bị",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: '40%'
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "left",
      width: '50%'
    },
  ];


  const handleGetListDevice = async () => {
    setSpinning(true)
    try {
      const param={
        name:deviceSeach
      }
      const { data, status } = await actionGetDevices(param);
      if (status === 200) {
        setDevices(data?.list_views)
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }
  useEffect(() => {
    handleGetListDevice()
  }, [deviceSeach])
  return (
    <Row gutter={[8,8]}>
      <Col>
        <Button
          type="primary"
          onClick={() => setAddDevice(true)}
          className="btn-with-icon"
        >
          <TbDeviceWatchPlus />
          Thêm thiết bị
        </Button>
      </Col>

      <Col span={24}>
        <Table
          dataSource={devices}
          columns={columns}
        />
      </Col>

      {addDevice && (
        <AddDevice
          onCancel={() => setAddDevice(null)}
          devices={devices}
          setDevices={setDevices}
        />
      )}
    </Row>

  )
}

export default ListDevice;