import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import { actionGetUsers, actionLockUser } from "./actions";
import { useSelector } from "react-redux";
import AddUserModal from "./components/addUserModal";
import InfoUserModal from "./components/info-user";
import ExportPDF from "../procedure/components/exportPDF";
import { FilePdfOutlined } from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Button,
  Layout,
  Space,
  Table,
  Tooltip,
  Row,
  Tag,
  Col,
  message,
  Popconfirm,
  Select,
  Input,

} from "antd";

import EditUser from "./components/editUserModal";
import ContractModal from "../evaluate/components/contract";

const HomePage = () => {
  const userLogin = useSelector((state) => state?.profile);
  const departments = useSelector((state) => state?.departments);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [name, setName] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [user, setUser] = useState([]);
  const [editUser, setEditUser] = useState(false);
  const [detailMenu, setDetailMenu] = useState(false);
  //modal
  const [isOpenAddUserModal, setOpenAddUserModal] = useState(false);
  const [isOpenUserModal, setOpenUserModal] = useState(false);
  const [dataExport, setDataExport] = useState();

  //copy email
  const [textToCopy, setTextToCopy] = useState(''); // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false); // To indicate if the text was copied

  const onCopyText = (text, result) => {
    if (result) {

      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 1000); // Reset status after 2 seconds
    } else {
      message.error('Copy email không thành công. Hãy thử lại');
    }
  };

  //paginate
  const pagination = {
    pageNum: 1,
    pageSize: 10,
  };

  const handleChangePage = (pageNum, pageSize) => {
    pagination.pageNum = pageNum;
    pagination.pageSize = pageSize;
  };

  const handleExportData = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus,
        name: name,
      };

      const { data, status } = await actionGetUsers(params);
      if (status === 200) {
        setDataExport({
          reports: data?.filter(item => item.account_stutus === 1),
          total: data?.filter(item => item.account_stutus === 1).length,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleGetUser = async () => {
    setSpinning(true);
    try {
      const params = {
        department_id: selectedStatus,
        name: name,
      };
      const { data, status } = await actionGetUsers(params);

      if (status === 200) {
        setUser(data?.filter(item => item.account_stutus === 1));

      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleLock = async (id) => {
    setSpinning(true);
    try {
      const { status, data } = await actionLockUser(id);

      if (status === 200) {
        message.success(data?.message);
        setUser(data?.employees.filter(item => item.account_stutus === 1));
      }
    } catch (error) {
      console.log(error);
    }
    setSpinning(false);
  };

  const handleCheckRole = (r) => {
    if (
      (userLogin?.position_code === "GIAM_DOC" &&
        r?.position_code !== "GIAM_DOC") ||
      (userLogin?.position_code === "P_GIAM_DOC" &&
        r?.position_code !== "P_GIAM_DOC") ||
      (userLogin?.position_code === "TRUONG_PHONG" &&
        userLogin?.department_id === r?.department_id &&
        r?.position_code !== "TRUONG_PHONG" &&
        r?.position_code !== "GIAM_DOC") ||
      (
        userLogin?.position_code === "NHAN_SU"
      )
    ) {
      return true;
    }

    return false;
  };

  const handleCopyEmailBtn = () => {
    setTextToCopy(user?.map((e) => e.email).join(' '))
    message.success('Email của người dùng đã được copy')
    message.success('Vui lòng click vào nút thêm 1 lần nữa để xác nhận')
  }

  useEffect(() => {
    handleGetUser();
  }, [selectedStatus, name, textToCopy]);

  const columns = [
    {
      fixed: "left",
      width: 60,
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (v, record, index) => (
        <Space>
          {index + 1 + (pagination.pageNum - 1) * pagination.pageSize}
        </Space>
      ),
    },
    {
      width: 100,
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Họ và tên ",
      dataIndex: "name",
      key: "name",
      align: "center",

    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",

    },
    {
      title: "Chức vụ",
      dataIndex: "position_name",
      key: "position_name",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_name",
      key: "department_name",
      align: "center",
    },
    // {
    //   title: "Ngày nhận việc",
    //   dataIndex: "start_working",
    //   key: "start_working",
    //   render: (v) => v ? moment(v * 1000).format(DATE_FORMAT) : "",
    //   align: "center",
    // },

    {
      width: 100,
      title: "",
      dataIndex: "operation",
      key: "operation",
      render: (_, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {

            handleCheckRole(r) && (
              <Popconfirm
                title={
                  r.account_stutus === 1
                    ? "Bạn chắc chắn muốn khóa?"
                    : "Bạn chắc chắn muốn mở khóa?"
                }
                okText={r.account_stutus === 1 ? "Khóa" : "Mở khóa"}
                cancelText="Hủy"
                onConfirm={() => handleLock(r.id)}
              >
                {r.account_stutus === 1 ? (
                  <Tooltip
                    title="Khóa tài khoản"
                    placement="bottomRight"
                    overlayInnerStyle={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >

                    <Tag color="#87d068 " className="tag-btn">
                      <Button type="text" className="btn-lock">
                        <IoLockClosedOutline className="icon-fa icon-fa-lock" />
                      </Button>
                    </Tag>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title="Mở khóa tài khoản"
                    placement="bottomRight"
                    overlayInnerStyle={{
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    <Tag color="#f41f1f" className="tag-btn">
                      <Button type="text" className="btn-unlock">
                        <GoUnlock className="icon-fa icon-fa-unlock" />
                      </Button>
                    </Tag>
                  </Tooltip>
                )}
              </Popconfirm>
            )}
        </Space>
      ),
      align: "center",
    },
    {
      width: 150,
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (v, r) =>
        <Space onClick={(e) => e.stopPropagation()}>
          {
            (userLogin?.position_code === "P_GIAM_DOC" ||
              userLogin?.position_code === "GIAM_DOC"
              || userLogin?.position_code === "NHAN_SU"
              || (userLogin?.department_code === "PB6" && userLogin.position_code === "TRUONG_PHONG")
            )

            && (

              <Button
                type="primary"
                className="btn-with-icon"
                onClick={() => setEditUser(r)}
              >
                <span className="btn-text">Sửa</span>

                <FaRegEdit />
              </Button>
            )
          }

          {(userLogin?.position_code === "NHAN_SU"
            &&
            r?.position_code !== "GIAM_DOC"
            &&
            r?.position_code !== "P_GIAM_DOC"

          ) &&

            <Button
              className="btn-with-icon"
              type="primary"
              onClick={() => setDetailMenu(r)}
            >
              HĐ mới
            </Button>

          }

        </Space>,
      align: "center",
    },
  ];

  return (
    <Layout className="common-layout">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className="filler" gutter={[8, 8]}>
            <Button
              className="exit-home"
              onClick={() => window.navigatePage("home-navigate")}
            >
              Thoát
            </Button>
            <Col className="filler--item">
              <Select
                className="w-full"
                placeholder="Phòng ban"
                onChange={setSelectedStatus}
                allowClear
              >

                {departments.map((dep) => {
                  return (
                    <Select.Option key={dep.id} value={dep.id}>
                      {
                        dep?.name
                      }
                    </Select.Option>
                  );
                })
                }
              </Select>
            </Col>

            <Col className="filler--item">
              <Input.Search
                onSearch={(v) => {
                  setName(v);
                }}
                placeholder="Nhập tên ..."
                allowClear
              />
            </Col>

            {(userLogin.position_code === "GIAM_DOC" ||
              userLogin.position_code === "TRUONG_PHONG" ||
              userLogin?.position_code === "NHAN_SU"
            ) && (
                <Col>
                  <Button
                    className="w-full"
                    type="primary"
                    onClick={() => setOpenAddUserModal(true)}
                  >
                    Thêm nhân viên
                  </Button>
                </Col>
              )}


            <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
              <Col>
                <Button
                  className="w-full"
                  type="primary"
                  onClick={handleCopyEmailBtn}
                >
                  Copy email của người dùng
                </Button>
              </Col>
            </CopyToClipboard>




            {userLogin?.position_code === "TRUONG_PHONG" &&
              userLogin.department_id === 6 && (
                <Col>
                  <Button
                    onClick={handleExportData}
                    icon={<FilePdfOutlined />}
                    type="primary"
                  >
                    Xuất file PDF
                  </Button>
                </Col>
              )}
          </Row>
        </div>

        <div className="common-layout--content">
          <Table
            width="100%"
            dataSource={user}
            className="tb-click-row"
            rowKey={(r) => r.id}
            columns={columns}
            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange: handleChangePage,
            }}
            onRow={(r) => ({
              onClick: () => setOpenUserModal(r)
            })}
            scroll={{ x: 1024 }}
          />
        </div>
      </SpinCustom>

      <>
        {isOpenAddUserModal && (
          <AddUserModal
            setUser={setUser}
            onClose={() => {
              setOpenAddUserModal(false);
            }}
          />
        )}
        {editUser && (
          <EditUser
            setUser={setUser}
            editUser={editUser}
            onClose={() => {
              setEditUser(false);
            }}
          />
        )}

        {isOpenUserModal && (
          <InfoUserModal
            isOpenUserModal={isOpenUserModal}
            onClose={() => {
              setOpenUserModal(false);
            }}
          />
        )}

        {dataExport && (
          <ExportPDF data={dataExport} onClose={() => setDataExport(null)} />
        )}

        {detailMenu && (
          <ContractModal
            setUser={setUser}
            onCancel={() => setDetailMenu(false)}
            detailMenu={detailMenu}
            title="Hợp đồng "
          />
        )}

      </>
    </Layout>
  );
};

export default HomePage;
