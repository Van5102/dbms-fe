import { SpinCustom } from "components";
import { Button, Layout, Space, Table, message,Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { actionGetListFreeTime, actionHandleFreeTime } from "../action";
import dayjs from "dayjs";
import moment from "moment";
import {
  SECOND_FORMAT,
  STATUS,
  STATUS_FREE_TIME,
  TYPE_KEEPING,
} from "utils/constants/config";
import { useSelector } from "react-redux";

const FreeTime = ({ start, end, row,nameSeach }) => {
  const [spinning, setSpinning] = useState(false);
  const [listFreeTime, setListFreeTime] = useState([]);
  const userLogin = useSelector((state) => state?.profile);
  const startTime = "08:15:59";
  const endTime = "17:30:00";
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

  const handleGetListFreeTime = async () => {
    setSpinning(true);

    try {
      const params = {
        time_start: dayjs(start).startOf("D").unix() || null,
        time_end: dayjs(end).endOf("D").unix() || null,
        free_time: row,
        name: nameSeach,

      };
      const { data, status } = await actionGetListFreeTime(
        dayjs(start).startOf("D").unix(),
        params
      );

      if (status === 200) {
        setListFreeTime(data?.list_free_time);
        data?.list_free_time?.map((item) => {
          const [timeHoursOut, timeMinutesOut, timeSecondsOut] = moment(
            item.time_out * 1000
          )
            .format(SECOND_FORMAT)
            .slice(0, 8)
            .split(":")
            .map(Number);
          const [timeHoursIn, timeMinutesIn, timeSecondsIn] = moment(
            item.time_in * 1000
          )
            .format(SECOND_FORMAT)
            .slice(0, 8)
            .split(":")
            .map(Number);
          const [startHours, startMinutes, startSeconds] = startTime
            .split(":")
            .map(Number);
          const [endHours, endMinutes, endSeconds] = endTime
            .split(":")
            .map(Number);

          // Compare time considering same day
          // if checkout between 8:15:59 and 17:30:00 then set time_in = null
          if (
            timeHoursOut > startHours ||
            (timeHoursOut === startHours &&
              (timeMinutesOut > startMinutes ||
                (timeMinutesOut === startMinutes &&
                  timeSecondsOut > startSeconds)))
          ) {
            if (
              timeHoursOut < endHours ||
              (timeHoursOut === endHours &&
                (timeMinutesOut < endMinutes ||
                  (timeMinutesOut === endMinutes &&
                    timeSecondsOut < endSeconds)))
            ) {
              if (
                timeHoursIn == 17 &&
                timeMinutesIn == 30 &&
                timeSecondsIn == 0
              ) {
                item.time_in = null;
              }
            }
          }

          // if checkin between 8:15:59 and 17:30:00 then set time_out = null
          if (
            timeHoursIn > startHours ||
            (timeHoursIn === startHours && timeMinutesIn >= startMinutes)
          ) {
            if (
              timeHoursIn < endHours ||
              (timeHoursIn === endHours && timeMinutesIn <= endSeconds)
            ) {
              if (
                timeHoursOut == 8 &&
                timeMinutesOut == 15 &&
                timeSecondsOut == 0
              ) {
                item.time_out = null;
              }
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
      message.error(err);
    }
    setSpinning(false);
  };

  const handleFreeTime = async (id, stt) => {
    setSpinning(true);
    try {
      const params = {};
      const date = dayjs(start).startOf("D").unix() || new Date().getTime();

      const { data, status } = await actionHandleFreeTime(
        date,
        id,
        stt,
        params
      );
      if (status === 200) {
        setListFreeTime(data?.list_free_time);
        handleGetListFreeTime();
        message.success(data?.message);
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const check_position = () => {
    return (
      userLogin.position_code === "GIAM_DOC" ||
      userLogin.position_code === "P_GIAM_DOC" ||
      userLogin.position_code === "TRUONG_PHONG"
    );
  };

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
      title: "Tên",
      dataIndex: "user_name",
      key: "user_name",
      align: "center",
    },
    {
      title: "Giờ vào",
      dataIndex: "time_in",
      key: "time_in",
      align: "center",
      render: function (text, record, index) {
        return moment(record?.time_in * 1000)
          .format(SECOND_FORMAT)
          .slice(-4) === "1970"
          ? null
          : moment(record?.time_in * 1000).format(SECOND_FORMAT);
      },
    },
    {
      title: "Giờ ra",
      dataIndex: "time_out",
      key: "time_out",
      align: "center",
      render: function (text, record, index) {
        return moment(record?.time_out * 1000)
          .format(SECOND_FORMAT)
          .slice(-4) === "1970"
          ? null
          : moment(record?.time_out * 1000).format(SECOND_FORMAT);
      },
    },
    {
      title: "PVR(ngày)",
      dataIndex: "free_time",
      key: "free_time",
      align: "center",
      render: (text, record, index) => {
        return record?.status === 1 ? 0 : parseInt(record?.free_time / 60);
      },
    },
    {
      title: "Kiểu phút việc riêng",
      dataIndex: "type_freetime",
      key: "type_freetime",
      render: (v) => TYPE_KEEPING[v],
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      key: "status",
      align: "center",
      render: (text, record, index) => {
        let statusClass;
        switch (text) {
          case STATUS["ACCEPT"]:
            statusClass = "process--success";
            break;
          case STATUS["REFUSE"]:
            statusClass = "process--cancel";
            break;
          default:
            statusClass = "process";
        }
        return (
          <span className={statusClass}>
            {STATUS_FREE_TIME[record?.status]}
          </span>
        );
      },
    },
    {
      width: 180,
      title: "Thao tác",
      dataIndex: "t",
      key: "t",
      render: (v, r) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {r?.status == null && check_position() && (
            <Popconfirm
            title="Xác nhận"
            description="Bạn có chắc chắn muốn xác nhận công việc?"
            onConfirm={() => {
              handleFreeTime(r?.id, STATUS["ACCEPT"]);
            }}
            // onCancel={cancel}
            okText="Có"
            cancelText="Không"
          >
           <Button
              type="primary"
            
            >
              Công việc
            </Button>
           </Popconfirm>
           
          )}

          {r?.status == null && check_position() && (
            <Popconfirm
            title="Xác nhận"
            description="Bạn có chắc chắn muốn xác nhận việc riêng?"
            onConfirm={() => {
              handleFreeTime(r?.id, STATUS["REFUSE"]);
            }}
            // onCancel={cancel}
            okText="Có"
            cancelText="Không"
          >
            <Button
              Button
              type="cancel"
             
            >
              Việc riêng
            </Button>
           </Popconfirm>
           
          )}
        </Space>
      ),
      align: "center",
    },
  ];

  useEffect(() => {
    handleGetListFreeTime();
  }, [start, end,nameSeach]);

  return (
    <Layout className="common-layout">
      <div className="common-layout--content">
        <SpinCustom spinning={spinning}>
          <Table
            width="100%"
            dataSource={listFreeTime}
            rowKey={(r) => r.id}
            columns={columns}
            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.current,
              onChange: handleChangePage,
            }}
            scroll={{ x: 1024 }}
          />
        </SpinCustom>
      </div>
    </Layout>
  );
};

export default FreeTime;
