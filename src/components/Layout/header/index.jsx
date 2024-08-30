import { useEffect, useMemo, useState } from "react";
import { findPageByPath, isEmpty, getFullUrlStaticFile } from "utils/helps";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AIPT_WEB_TOKEN, DATETIME_FORMAT } from "utils/constants/config";
import Cookies from "js-cookie";
import { SET_PROFILE } from "utils/constants/redux-actions";
import InfoUserModal from "./components/info-user";
import ChangePassword from "./components/changePassword";
import pages from "pages";
import { BellOutlined, MailOutlined } from "@ant-design/icons";
import { DefaultAvatar } from "assets";
import socketIO from "utils/service/socketIO";

import {
  actionChangeNotificationStatus,
  actionGetNotification,
} from "./actions";

import {
  Layout,
  Space,
  Divider,
  Button,
  Row,
  Avatar,
  Col,
  Dropdown,
  Menu,
  Badge,
} from "antd";

import "./index.scss";
import moment from "moment";
import { AiptLogo } from "assets";

const AppHeader = () => {

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state?.profile);
  const token = Cookies.get(AIPT_WEB_TOKEN);
  const currentPath = useLocation().pathname;
  const [notifications, setNotifications] = useState([]);
  const [isOpenModalUserinfo, setOpenModalUserInfo] = useState(false);
  const [isOpenModalChangePassword, setOpenModalChangePassword] = useState(false);
  const shouldHideFixIcon = useMemo(() => {
    return notifications?.filter((notification) => notification.status === 0);
  }, [notifications]);

  const page = useMemo(() => {
    return findPageByPath(currentPath, pages);
  }, [currentPath]);

  console.log(shouldHideFixIcon);
  const handleLogout = () => {
    dispatch({ type: SET_PROFILE, payload: {} });
    Cookies.remove(AIPT_WEB_TOKEN);
    window.navigatePage("login");
  };

  const handleGetNotifications = async () => {
    try {
      const { data, status } = await actionGetNotification();
      if (status === 200) {
        setNotifications(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeStatus = async (notification) => {
    try {
      const { data, status } = await actionChangeNotificationStatus(notification?.id);
      if (status === 200) {
        setNotifications(data?.notifications);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateProcedure = async (notification) => {
    handleChangeStatus(notification);
    window.open(notification.link, '_self');
  };

  useEffect(() => {
    if (token) {
      socketIO.on("notifications", (data) => {
        setNotifications(data);
      });

      handleGetNotifications();
    }
  }, [token]);

  const dropdownMenuNotification = notifications.sort((a, b) => a.status - b.status)?.slice(0, 50)?.map((notification, index) => (
    <Menu.Item
      key={index}
      onClick={() => handleNavigateProcedure(notification)}
    >
      <div
        className={`notification-item ${notification.status === 0 ? "unread" : "read"
          }`}
      >
        <div
          className="notification-content"
          dangerouslySetInnerHTML={{ __html: notification?.content }}
        />
        <div className="notification-time">
          {moment(notification.time_created * 1000).format(DATETIME_FORMAT)}
        </div>
      </div>
    </Menu.Item>
  ));

  return (
    <Layout.Header className="app-header">
      <div className="app-header--left">
        <span className="app-header--title hidden-mobile">{page?.label}</span>
        <img className="hidden-logo" src={AiptLogo} alt="logo" />
      </div>

      <div className="app-header--right">
        <Space size={8} split={<Divider type="vertical" />}>
          <MailOutlined />
          <Dropdown
            placement="bottomRight"
            arrow
            trigger={["click"]}
            overlay={
              <Menu className="app-header-dropdown-menu">
                {dropdownMenuNotification}
              </Menu>
            }
          >
            {shouldHideFixIcon.length > 0 ?
              <Badge count={shouldHideFixIcon.length} >
                <BellOutlined />
              </Badge>
              :
              <Badge count={0} showZero>
                <BellOutlined />
              </Badge>
            }


          </Dropdown>

          <Row gutter={[8, 0]}>
            <Col>
              <Avatar
                className="avatar"
                shape="circle"
                size={24}
                src={userLogin?.avatar ? getFullUrlStaticFile(`${userLogin?.avatar}`) : DefaultAvatar}
                onClick={() => setOpenModalUserInfo(true)}
              />
            </Col>

            <Col className="hidden-mobile">{userLogin?.name}</Col>
          </Row>

          <Button size="small" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Space>
      </div>

      <>
        {isOpenModalUserinfo && (
          <InfoUserModal
            onClose={() => setOpenModalUserInfo(false)}
            userLogin={userLogin}
            onChangePassword={() => {
              setOpenModalUserInfo(false);
              setOpenModalChangePassword(true);
            }}
          />
        )}

        {isOpenModalChangePassword && (
          <ChangePassword
            onClose={() => {
              setOpenModalUserInfo(true);
              setOpenModalChangePassword(false);
            }}
          />
        )}
      </>
    </Layout.Header>
  );
};

export default AppHeader;
