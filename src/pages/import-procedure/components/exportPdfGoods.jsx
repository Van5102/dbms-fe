import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";

import {
  DATETIME_FORMAT, 
  DATE_FORMAT,
  RANK
} from "utils/constants/config";

import { Row, Col, Button } from "antd";

import {
  Font,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoLightWebfont, fontWeight: 300 },
    { src: RobotoRegularWebfont, fontWeight: 400 },
    { src: RobotoMediumWebfont, fontWeight: 500 },
    { src: RobotoBoldWebfont, fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 6,
    fontFamily: "Roboto",
    pageBreakBefore: "always",
  },
  pageTitle: {
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 500,
  },
  pageSubTitle: {
    textAlign: "right",
    marginTop: 32,
    marginBottom: 16,
  },
  pageSmallTitle: {
    fontSize: 12,
    marginTop: 20,
    fontWeight: "bold",
    textDecoration: "underline"
  },
  pageSectionTitle: {
    marginTop: 15,
    fontWeight: "bold",

    fontSize: 12,

  },
  pageSubTitle: {
    textAlign: "right",
    marginTop: 32,
    marginBottom: 16,
  },
  pageContent: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    gap: 80,
  },
  commonText: {
    marginBottom: 8,
    fontSize: 10,
  },
  approvalWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    // gap: 50,
    marginTop: 40,
  },

  radioButtonChecked: {
    backgroundColor: 'black',
  },
  radioButtonLabel: {
    fontSize: 10,
  },
  // table styles
  table: {
    display: "table",
    width: '100%',
    borderStyle: "solid",
    borderWidth: 1,
    borderCollapse: 'collapse',
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",

  },
  boldText: {
    fontWeight: 'bold',
    backgroundColor: "yellow"

  },
  tableCol: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    padding: 1,
    borderStyle: "solid",
    borderLeft: 0.3,
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    textAlign: 'center',
    width: 80,
  },
});

const TablePDF = ({ dataProcessing, data }) => {




  return (
    <>
      <View style={styles.approvalWrapper}>
        {dataProcessing?.map((item, index) => (
          <View key={index}>
            <Text style={styles.commonText}>{item?.approved_by_name}</Text>
            <Text style={styles.commonText}>
              {moment(item?.time_update * 1000).format(DATETIME_FORMAT)}
            </Text>
            <Text style={styles.commonText}>{item?.status}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const PDFPage = ({ data, title }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text>BIÊN BẢN KIỂM HÀNG</Text>
      </View>
      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội, ngày {moment().format("DD")} tháng {moment().format("MM")} năm{" "}
          {moment().format("YYYY")}
        </Text>
      </View>
      <Text style={styles.commonText}>
        Người kiểm hàng: {data?.list_implementer.map((i) => i?.name).toLocaleString()}
      </Text>
      <Text style={styles.commonText}>Tên khách hàng: {data?.customer_name}</Text>
      {/* <Text style={styles.commonText}>
        Thời gian đề xuất:{" "}
        {moment(data?.time_created * 1000).format(DATETIME_FORMAT)}
      </Text>*/}
      <Text style={styles.commonText}>Số hợp đồng bán: {data?.contract_number}</Text>
      <Text style={styles.commonText}>Địa điểm kiểm hàng: {data?.address_checking}</Text>

      <View style={styles.pageContent}>


        <div>
          <View >
            <View style={styles.pageSmallTitle}>
              <Text style={styles.commonText}>
                HÀNG HÓA YÊU CẦU

              </Text>
            </View>

            <View style={styles.pageContent}>

              <div>
                <View>
                  <Text style={styles.commonText}>THIẾT BỊ VÀ PHỤ KIỆN
                  </Text>
                </View>
              </div>
              <div>


              </div>

            </View>

            <View style={[styles.tableRow]}>
              <Text style={[styles.tableCell, { width: 40 }]}>STT    </Text>
              <Text style={[styles.tableCell, { width: 120 }]}>Thiết bị</Text>

              <Text style={[styles.tableCell, { width: 40 }]}>Số lượng</Text>
              <Text style={styles.tableCell}>Serial</Text>
              <Text style={styles.tableCell}>Model</Text>
              <Text style={styles.tableCell}>Xuất xứ</Text>
              <Text style={styles.tableCell}>Năm SX</Text>
              <Text style={styles.tableCell}>Kết quả</Text>
              <Text style={styles.tableCell}>Ghi chú</Text>
            </View>

            {/* Map over table data to render rows */}
            {data?.list_items?.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText, { width: 40 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText, { width: 120 }]}>{row.device_name}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText, { width: 40 }]}>{row.quantity}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{row.serial}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{row.model}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{row.origin}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{row?.manufactor_year && moment(row?.manufactor_year * 1000).format(DATE_FORMAT)}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{RANK[row?.result]}</Text>
                <Text style={[styles.tableCell, row.attachment_id == null && styles.boldText]}>{row?.description}</Text>
              </View>
            ))}

          </View>

          <View style={styles.approvalWrapper}>
            {data?.list_implementer?.map((item, index) => (
              // console.log(item)
              <View key={index}>
                <Text style={styles.commonText}>Người làm báo cáo</Text>
                <Text style={styles.commonText}>{item?.name}</Text>

              </View>
            ))}
            <View>

              <View>
                <Text style={styles.commonText}>Bộ phận đặt hàng</Text>
                <Text style={styles.commonText}>{data?.user_request_name}</Text>

              </View>

            </View>

          </View>



        </div>

      </View>





      <View style={styles.pageContent}>


      </View>


      <TablePDF dataProcessing={data?.details} data={data?.equipments} />
    </Page>
  );
};

const ExportPdfGoodsModal = ({ data, onCancel }) => {
  return (
    <Modal
      className="export-pdf-modal"
      open={true}
      closeIcon={false}
      footer={
        <Row justify="end">
          <Col span={4}>
            <Button onClick={onCancel} className="w-full">
              Thoát
            </Button>
          </Col>
        </Row>
      }
    >
      <PDFViewer className="export-pdf--content">
        <Document>
          {data?.map((item) => (
            <PDFPage key={item?.id} data={item} />
          ))}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ExportPdfGoodsModal;
