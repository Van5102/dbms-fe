import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";
import { formatCurrency } from "utils/helps";
import {
  NOTARIZATION_PROCEDURE_TYPES,
  DATETIME_FORMAT,
  DATE_FORMAT,
  PAYMENT_TYPE,
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
    fontFamily: "Roboto",
    padding: 24,
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

    return lines?.map((line, index) => <Text key={index}>{line}</Text>);
  };

  const TabCol = ({ children, width }) => {
    // console.log('data TabCol',data)
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
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <TabCol width={27}>
            <Text style={{fontWeight: 'bold'}}>STT</Text>
          </TabCol>

          <TabCol width={200}>
            <Text style={{fontWeight: 'bold'}}>Nội dung Thanh toán</Text>
          </TabCol>

          <TabCol width={90}>
            <Text style={{fontWeight: 'bold'}}>Số lượng</Text>
          </TabCol>

          <TabCol width={90}>
            <Text style={{fontWeight: 'bold'}}>Số tiền</Text>
          </TabCol>

          <TabCol width={140}>
            <Text style={{fontWeight: 'bold'}}>Ghi chú</Text>
          </TabCol>

        </View>

        {data?.map((item, index) => (
          <View key={item?.id} style={styles.tableRow}>
            <TabCol width={27}>
              <Text>{index + 1}</Text>
            </TabCol>

            <TabCol width={200}>
                <Text renderText={handleRenderText}>{item?.details}</Text>
              </TabCol>

              <TabCol width={90}>
                <Text renderText={handleRenderText}>{item?.quantity}</Text>
              </TabCol>

              <TabCol width={90}>
                <Text renderText={handleRenderText}>{formatCurrency(item?.cost)}</Text>
              </TabCol>

              <TabCol width={140}>
                <Text renderText={handleRenderText}>{item?.note}</Text>
              </TabCol>



          </View>
        ))}
      </View>

      <Text style={styles.commonText}> </Text>
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
  // console.log(data);
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text>Phiếu đề nghị thanh toán</Text>
      </View>

      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội, ngày {moment().format("DD")} tháng {moment().format("MM")} năm{" "}
          {moment().format("YYYY")}
        </Text>
      </View>

      <View>
        <Text style={styles.commonText}>
          Họ và tên người đề nghị: {data?.created_by}
        </Text>
        <Text style={styles.commonText}>Bộ phận: {data?.department_name}</Text>
        <Text style={styles.commonText}>
          Thời gian đề xuất:{" "}
          {moment(data?.time_created * 1000).format(DATETIME_FORMAT)}
        </Text>
        <Text style={styles.commonText}>
            <Text style={{ fontWeight: 'bold' }}>Nội dung thanh toán: </Text>
            <Text>{data?.content}</Text>
        </Text>

        <Text style={styles.commonText}>
            <Text style={{ fontWeight: 'bold' }}>Tổng số tiền thanh toán: </Text>
            <Text>{formatCurrency(data?.accounting_details.map(e => e.cost ).reduce( (accumulator, currentValue) => accumulator + currentValue,0,)) }</Text>
        </Text>
        <Text style={styles.commonText}>
            <Text style={{ fontWeight: 'bold' }}>Hình thức thanh toán: </Text>
            <Text>{PAYMENT_TYPE[data?.type_payment] }</Text>
        </Text>
        

      </View>

      <TablePDF dataProcessing={data?.details} data={data?.accounting_details} />
    </Page>
  );
};

const ExportPdfModal = ({ data, onCancel }) => {
  // console.log(data);
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
          {/* {data?.map((item) => (
          ))} */}
        <PDFPage key={data?.id} data={data} />
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ExportPdfModal;
