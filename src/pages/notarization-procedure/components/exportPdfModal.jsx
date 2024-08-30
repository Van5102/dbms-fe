import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";

import {
  NOTARIZATION_PROCEDURE_TYPES,
  DATETIME_FORMAT,
  DATE_FORMAT,
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
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <TabCol width={47}>
            <Text>STT</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>Tên hồ sơ cần công chứng/dịch thuật</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>Mục đích</Text>
          </TabCol>

          <TabCol width={50}>
            <Text>Số lượng</Text>
          </TabCol>

          <TabCol width={80}>
            <Text>Hình thức công chứng</Text>
          </TabCol>

          <TabCol width={70}>
            <Text>Ngày cần</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>Ghi chú</Text>
          </TabCol>
        </View>

        {data?.map((item, index) => (
          <View key={item?.id} style={styles.tableRow}>
            <TabCol width={47}>
              <Text>{index + 1}</Text>
            </TabCol>

            <TabCol width={100}>
              <Text renderText={handleRenderText}>{item?.name}</Text>
            </TabCol>

            <TabCol width={100}>
              <Text renderText={handleRenderText}>{item?.purpose}</Text>
            </TabCol>

            <TabCol width={50}>
              <Text>{item?.quantity}</Text>
            </TabCol>

            <TabCol width={80}>
              <Text renderText={handleRenderText}>
                {NOTARIZATION_PROCEDURE_TYPES[item?.type_notariza]}
              </Text>
            </TabCol>

            <TabCol width={70}>
              <Text>
                {item?.day_need
                  ? moment(item?.day_need * 1000).format(DATE_FORMAT)
                  : ""}
              </Text>
            </TabCol>

            <TabCol width={100}>
              <Text renderText={handleRenderText}>{item?.description}</Text>
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

const PDFPage = ({ data }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text>Công ty cổ phần aipt việt nam</Text>
        <Text>Phiếu đề nghị công chứng/dịch thuật</Text>
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
        <Text style={styles.commonText}>Đề nghị cung cấp</Text>
      </View>

      <TablePDF dataProcessing={data?.details} data={data?.papers} />
    </Page>
  );
};

const ExportPdfModal = ({ data, onCancel }) => {
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

export default ExportPdfModal;
