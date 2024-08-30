import { DATETIME_FORMAT } from "utils/constants/config";
import moment from "moment";
import * as XLSX from "xlsx";
const handleExportToExcelProduce = (data) => {
    const tmp = data.map((e, index) => {
      return {
        STT: index + 1,
        "Người tạo": e?.created_by,
        "Thời gian tạo": moment(parseInt(e?.time_created) * 1000).format( DATETIME_FORMAT),
        "Trạng thái đơn": e?.status,
        "Lý do nghỉ": e?.reason,
        "Số ngày nghỉ có phép": e?.allow_day,
        "Số ngày nghỉ không phép": e?.not_allow_day,
        "Thời gian bắt đầu nghỉ": moment(parseInt(e?.time_start) * 1000).format(
          DATETIME_FORMAT
        ),
        "Thời gian kết thúc nghỉ": moment(parseInt(e?.time_end) * 1000).format(
          DATETIME_FORMAT
        ),
        "Ghi chú ": e?.description,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tmp);
    const wscols = [
      { wch: 10 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    worksheet["!cols"] = wscols;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_xin_nghi");
    XLSX.writeFile(workbook, "Danh_sach_xin_nghi.xlsx");
  };
export default handleExportToExcelProduce