import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";
import {
 CHECK_GOODS_TYPE
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
    padding: 4,
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
  pageContent: {
    marginTop: 32,
    display: "flex",
    flexDirection: "row",
    gap: 60,
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
  },

  // table styles
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderRight: 0.3,
    borderBottom: 0.3,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderTop: 0.3,
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
});

const TablePDF = ({ dataProcessing, data }) => {
  const handleRenderText = (text, renderTextProps) => {
    const words = text.split(" ");

    let lines = [];
    let currentLine = "";
    words.forEach((word) => {
      const width = renderTextProps.widthOfText(word);
      if (currentLine === "") {
        currentLine = word;
      } else if (width < renderTextProps.availableWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);

    return lines.map((line, index) => <Text key={index}>{line}</Text>);
  };

  const TabCol = ({ children, width }) => {
    return (
      <View
        style={{
          ...styles.tableCol,
          width,
        }}
      >
        {children}
      </View>
    );
  };

  return (
    <>



    </>
  );
};

const PDFPage = ({ data, title }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text>Phiếu kiểm hàng</Text>
      </View>

      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội, ngày {moment().format("DD")} tháng {moment().format("MM")} năm{" "}
          {moment().format("YYYY")}
        </Text>
      </View>

      <View style={styles.pageContent}>

        <Text style={styles.commonText}>
          Người yêu cầu: {data?.user_request_name}
        </Text>
        <Text style={styles.commonText}>Tên khách hàng: {data?.customer_name}</Text>
        <Text style={styles.commonText}>
          Số hợp đồng mua:{" "}
          {data?.contract_number}
        </Text>
        <Text style={styles.commonText}>Số hợp đồng bán	: {data?.contract_number_attached}</Text>
        <Text style={styles.commonText}>Lô hàng: {data?.batch}</Text>
        <Text style={styles.commonText}>Số lượng: {data?.device_item}</Text>
        <Text style={styles.commonText}>Địa điểm kiểm hàng: {data?.address_checking}</Text>
        <Text style={styles.commonText}>Kết quả kiểm hàng	: {CHECK_GOODS_TYPE[data?.result_checking]}</Text>


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
