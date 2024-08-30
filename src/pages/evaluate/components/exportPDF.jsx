import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";

import { EVALATE_RANK } from "utils/constants/config";

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
  feedbackWrapperRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",

  },
  feedbackWrapperCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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

const TablePDF = ({ data }) => {


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
          <TabCol width={100}>
            <Text>Nội dung công việc</Text>
          </TabCol>

          <TabCol width={50}>
            <Text>Trọng số
              (tỷ lệ %)</Text>
          </TabCol>

          <TabCol width={80}>
            <Text>Yêu cầu/mục tiêu công việc	</Text>
          </TabCol>

          <TabCol width={50}>
            <Text>Kết quả	</Text>
          </TabCol>

          <TabCol width={70}>
            <Text>Thời gian thực hiện	</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>Nhân viên tự đánh giá	</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>Phụ trách đánh giá
            </Text>
          </TabCol>
        </View>

       
      </View>

      <Text style={styles.commonText}>

        2.Đánh giá kỹ năng và các vấn đề liên quan:
      </Text>
      <View style={styles.feedbackWrapperRow}>
        <div className="">
          <View>
            <Text style={styles.commonText}>

              Nhân viên tự đánh giá </Text>

            <Text style={styles.commonText}>

              Tinh thần trách nhiệm: {EVALATE_RANK[data?.radio1]}
            </Text>
            <Text style={styles.commonText}>

              Chất lượng công việc
              : {EVALATE_RANK[data?.radio2]}
            </Text>
            <Text style={styles.commonText}>

              Thời gian hoàn thành công việc: {EVALATE_RANK[data?.radio3]}
            </Text>
            <Text style={styles.commonText}>

              Kết quả công việc:
              {EVALATE_RANK[data?.radio4]}
            </Text>
            <Text style={styles.commonText}>

              Hỗ trợ đồng nghiệp: {EVALATE_RANK[data?.radio5]}
            </Text>
            <Text style={styles.commonText}>

              Văn hóa công ty: {EVALATE_RANK[data?.radio6]}
            </Text>
            <Text style={styles.commonText}>

              Hỗ trợ đồng nghiệp: {EVALATE_RANK[data?.radio7]}
            </Text>

          </View>
        </div>
        <div className="">
          <View>
            <Text style={styles.commonText}>

              Phụ trách bộ phận
            </Text>
            <Text style={styles.commonText}>

              Tinh thần trách nhiệm: {EVALATE_RANK[data?.radio8]}
            </Text>
            <Text style={styles.commonText}>

              Chất lượng công việc
              : {EVALATE_RANK[data?.radio9]}
            </Text>
            <Text style={styles.commonText}>

              Thời gian hoàn thành công việc: {EVALATE_RANK[data?.radio10]}
            </Text>
            <Text style={styles.commonText}>

              Kết quả công việc:
              {EVALATE_RANK[data?.radio11]}
            </Text>
            <Text style={styles.commonText}>

              Hỗ trợ đồng nghiệp: {EVALATE_RANK[data?.radio12]}
            </Text>
            <Text style={styles.commonText}>

              Văn hóa công ty: {EVALATE_RANK[data?.radio13]}
            </Text>
            <Text style={styles.commonText}>

              Hỗ trợ đồng nghiệp: {EVALATE_RANK[data?.radio14]}
            </Text>
          </View>

        </div>
      </View>


    </>
  );
};

const PDFPage = ({ data, title }) => {
  console.log("data pdfpage", data)
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
        <Text>ĐÁNH GIÁ KẾT QUẢ THỰC TẬP/HỌC VIỆC/THỬ VIỆC</Text>
      </View>

      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội, ngày {moment().format("DD")} tháng {moment().format("MM")} năm{" "}
          {moment().format("YYYY")}
        </Text>
      </View>

      <View>
        <Text style={styles.commonText}>
          I.NGƯỜI ĐƯỢC ĐÁNH GIÁ
        </Text>
        <Text style={styles.commonText}>Họ & tên {data?.content?.applicant_name}</Text>
        <Text style={styles.commonText}>Chức danh {data?.content?.applicant_position}</Text>
        <Text style={styles.commonText}>Bộ phận {data?.content?.applicant_department}</Text>

      </View>
      <View>
        <Text style={styles.commonText}>
          II.NGƯỜI TIẾN HÀNH ĐÁNH GIÁ        </Text>
        <Text style={styles.commonText}>Họ & tên {data?.content?.name}</Text>
        <Text style={styles.commonText}>Chức danh {data?.content?.pos_name}</Text>
        <Text style={styles.commonText}>Bộ phận {data?.content?.des_name}</Text>

      </View>
      <View>
        <Text style={styles.commonText}>
          I. NỘI DUNG ĐÁNH GIÁ       </Text>
        <Text style={styles.commonText}>1 Các công việc, nhiệm vụ trong thời gian thực tập/học việc/thử việc:
        </Text>
        <Text style={styles.commonText}>Chức danh {data?.content?.pos_name}</Text>
        <Text style={styles.commonText}>Bộ phận {data?.content?.des_name}</Text>

      </View>

      <TablePDF dataProcessing={data?.details} data={data?.content} />
      <View>
        <Text style={styles.commonText}>
          I. Ý kiến và đề xuất của NLĐ
        </Text>
        <Text style={styles.commonText}>{data?.content?.yk1}
        </Text>
        <br />
        <Text style={styles.commonText}>Đề xuất</Text>
        <Text style={styles.commonText}>Tuyển dụng chính thức:
          {data?.content?.ct1}
        </Text>
        <Text style={styles.commonText}>Tuyển dụng chính thức:
          {data?.content?.ct1}
        </Text>
        <Text style={styles.commonText}>Bộ phận {data?.content?.des_name}</Text>

      </View>
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
