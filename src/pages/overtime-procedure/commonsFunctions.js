import dayjs from "dayjs";
import { DATETIME_FORMAT } from "utils/constants/config";

// Lây mô tả công việc 
export const getDscriptions = (r) => {
  const size = 3;

  const rs = r?.over_time?.slice(0, size).map((v, index) => {
    return `<div>- ${v?.description}</p>`;
  })

  return rs?.join("")
}

// Lấy thời gian dự kiến bắt đầu làm
export const getEstimatedStartTime = (r) => {
  const size = 3;

  const rs = r?.over_time?.slice(0, size).map((v, index) =>
    `<div>- ${dayjs.unix(v?.estimated_start_time).format(DATETIME_FORMAT)}</p>`);

  const elements = rs?.join("")

  return elements;
}