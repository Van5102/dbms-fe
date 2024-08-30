import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { actionGetVehicles, actionDeleteVehicle } from "./action";
import { useSelector } from "react-redux";
import { VEHICLE_STATUS } from "utils/constants/config";
import AddVehiclesModal from "./components/addVehiclesModal";

import {
  Button,
  Layout,
  Space,
  Table,
  Row,
  Col,
  message,
  Popconfirm,
} from "antd";

const ManageVehicles = () => {
  const userLogin = useSelector((state) => state?.profile);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [name, setName] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isOpenAddVehiclesModal, setOpenAddVehiclesModal] = useState(false);

  //paginate
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
  });

  const handleChangePage = (page, pageSize) => {
    setPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  const handleGetVehicles = async () => {
    setSpinning(true);
    try {
      // const params = {
      //   status: selectedStatus,
      //   name: name
      // }
      const { data, status } = await actionGetVehicles();

      if (status === 200) {
        setVehicles(data);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleDeleteVehicle = async (id) => {
    setSpinning(true);
    try {
      const { status, data } = await actionDeleteVehicle(id);

      if (status === 200) {
        message.success(data?.message);
        setVehicles(data?.vehicles);
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleNavigateProcedure = async (e) => {
    window.navigatePage("vehicle-procedure", null, { vehicle_id: e.id });
  };

  useEffect(() => {
    handleGetVehicles();
  }, [selectedStatus, name]);

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <Space>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </Space>
      ),
    },
    {
      fixed: "left",
      width: 80,
      title: "Mã số",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên xe ",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Biển số xe",
      dataIndex: "license_plate",
      key: "license_plate",
      align: "center",
    },
    {
      title: "Trạng thái xe",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (v) => VEHICLE_STATUS[v],
    },

    {
      width: 240,
      title: "",
      dataIndex: "operation",
      key: "operation",
      render: (_, r) => (
        <Space>
          <Button onClick={() => handleNavigateProcedure(r)}>
            Xem chuyến đi
          </Button>

          {(userLogin.position_code === "GIAM_DOC" ||
            (userLogin.position_code === "TRUONG_PHONG" &&
              userLogin.department_id === 6)) && (
            <Space>
              <Popconfirm
                title={"Bạn chắc chắn muốn xóa?"}
                okText={"Xóa"}
                cancelText="Hủy"
                onConfirm={() => handleDeleteVehicle(r.id)}
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        </Space>
      ),
      align: "center",
    },
  ];
  return (
    <Layout className="common-layout">
      <>
        <SpinCustom spinning={spinning}>
          <div className="common-layout--header">
            <Row gutter={[16, 24]}>
              <Col>
                {(userLogin.position_code === "GIAM_DOC" ||
                  (userLogin.position_code === "TRUONG_PHONG" &&
                    userLogin.department_id === 6)) && (
                  <Button
                    type="primary"
                    onClick={() => setOpenAddVehiclesModal(true)}
                  >
                    Thêm xe
                  </Button>
                )}
              </Col>
            </Row>
          </div>

          <div className="common-layout--content">
            <Table
              width="100%"
              dataSource={vehicles}
              rowKey={(r) => r.id}
              columns={columns}
              pagination={{
                pageSize: pagination.pageSize,
                current: pagination.current,
                onChange: handleChangePage,
              }}
              scroll={{ x: 1024 }}
            />
          </div>

          <div className="common-layout--footer"></div>
        </SpinCustom>
      </>

      <>
        {isOpenAddVehiclesModal && (
          <AddVehiclesModal
            setVehicles={setVehicles}
            onClose={() => {
              setOpenAddVehiclesModal(false);
            }}
          />
        )}
      </>
    </Layout>
  );
};

export default ManageVehicles;
