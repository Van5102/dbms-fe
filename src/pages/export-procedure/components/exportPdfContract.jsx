import React from "react";
import { Modal } from "antd";
import moment from "moment";
import RobotoLightWebfont from "assets/fonts/roboto-light-webfont.ttf";
import RobotoRegularWebfont from "assets/fonts/roboto-regular-webfont.ttf";
import RobotoMediumWebfont from "assets/fonts/roboto-medium-webfont.ttf";
import RobotoBoldWebfont from "assets/fonts/roboto-bold-webfont.ttf";

import {
  DATETIME_FORMAT,PAYMENT_TYPE,DATE_FORMAT
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
  pageSmallTitle: {
    fontSize: 12,
    marginTop: 20,
    fontWeight: "bold",
    textDecoration:"underline"
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
        <Text>Phiếu đề nghị xuất kho</Text>
      </View>
      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội, ngày {moment().format("DD")} tháng {moment().format("MM")} năm{" "}
          {moment().format("YYYY")}
        </Text>
      </View>
<Text style={styles.commonText}>
          Họ và tên người đề nghị: {data?.created_by}
        </Text>
        <Text style={styles.commonText}>Bộ phận: {data?.department_name}</Text>
        <Text style={styles.commonText}>
          Thời gian đề xuất:{" "}
          {moment(data?.time_created * 1000).format(DATETIME_FORMAT)}
        </Text>
        <Text style={styles.commonText}>Trạng thái đơn: {data?.status}</Text>

        <View style={styles.pageContent}>
      
      <div>
    <View>
    <View style={styles.pageSmallTitle}>
        <Text style={styles.commonText}>
          I.  THÔNG TIN BÁN HÀNG
        </Text>
      </View>
      <Text style={styles.commonText}>Tên khách hàng: {data?.customer_name}</Text>
       <Text style={styles.commonText}>Địa chỉ khách hàng: {data?.customer_address}</Text>
       <View style={styles.pageSectionTitle}>
        <Text style={styles.commonText}>
        Điều kiện thanh toán
        </Text>
      </View>
       <View style={styles.pageContent}>
      
      <div>
    <View>

   
      <Text style={styles.commonText}> Lần 1: {data?.pay_t1} %</Text>
      <Text style={styles.commonText}>Lần 3: {data?.pay_t3} %</Text>
  
    </View>
    </div>
    <div>

    <View>
      <Text style={styles.commonText}>Lần 2: {data?.pay_t2} %</Text>
      <Text style={styles.commonText}>Lần 4: {data?.pay_t4} %</Text>

      
     
    </View>
    </div>

    </View>
    <Text style={styles.commonText}>Hình thức thanh toán: {PAYMENT_TYPE[data?.payment]}</Text>
     
    <Text style={styles.commonText}>Ngày giao hàng:
    {moment(data?.delivery_day * 1000).format(DATE_FORMAT)}
    
    </Text>
    <Text style={styles.commonText}>Địa điểm giao hàng: {data?.delivery_place}</Text>
      
       
  
  
    </View>
    </div>
    <div>
    

    </div>

    </View>

     



      
   
      <View style={styles.pageSectionTitle}>
        <Text style={styles.commonText}>
        Tài liệu đính kèm bao gồm:
        </Text>
      </View>
      <View style={styles.pageContent}>
      
      <div>
      <View>
      <Text style={styles.commonText}>Thông tin liên hệ: {data?.contact_name}</Text>
      <Text style={styles.commonText}>Mô tả: {data?.description}</Text>
   
      <Text style={styles.commonText}>Chứng từ cung cấp: </Text>
<Text style={styles.commonText}>Hoá đơn đỏ: {data?.invoice_VAT != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>CO (PTM or NSX): {data?.receipt_CO != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>CQ NSX: {data?.date_of_manufacture != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>Chứng từ khác: {data?.receipt_defference }</Text>

        </View>
      </div>
      <div>
      <View>
     
       <Text style={styles.commonText}>SDT liên hệ HD:{data?.contract_phone}</Text>

        <Text style={styles.commonText}>Packing list xóa giá: {data?.packing_list != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>Tờ khai hải quan: {data?.customs_declaration_price_clearance != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>CQ NSX: {data?.date_of_manufacture != null ? "Có" : "Không"}</Text>
        <Text style={styles.commonText}>Invoice xóa giá: {data?.invoice_price_clearance != null ? "Có" : "Không"}</Text>
       
        </View>
      </div>
      </View>
      <View >
    <View style={styles.pageSmallTitle}>
        <Text style={styles.commonText}>
          II.  HÀNG HÓA YÊU CẦU

        </Text>
      </View>

      <View style={styles.pageContent}>
      
        <div>
      <View>

     
        <Text style={styles.commonText}>        THIẾT BỊ VÀ PHỤ KIỆN
 </Text>
       

      </View>
      </div>
      <div>

     
      </div>

      </View>

      <View style={[styles.tableRow]}>
        <Text style={[styles.tableCell, {width:40}]}>STT    </Text>
        <Text style={[styles.tableCell, { width: 120 }]}>Thiết bị</Text>
       

        <Text style={[styles.tableCell,{width:40}]}>Số lượng</Text>
       
        <Text style={styles.tableCell}>Model</Text>
        <Text style={styles.tableCell}>Hãng sx</Text>
        <Text style={styles.tableCell}>Xuất xứ</Text>
        <Text style={styles.tableCell}>Ghi chú</Text>
      </View>

      {/* Map over table data to render rows */}
      {data?.devices.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell,{width:40}]}>{index+1}</Text>
          <Text style={[styles.tableCell,{width:120}]}>{row?.device_name}</Text>
          <Text style={[styles.tableCell,{width:40}]}>{row?.quantity}</Text>
         
          <Text style={styles.tableCell}>{row?.model}</Text>
          <Text style={styles.tableCell}>{row?.manufactor}</Text>
          <Text style={styles.tableCell}>{row?.origin}</Text>
          <Text style={styles.tableCell}>{row?.description}</Text>
        </View>
      ))}
    </View>

      
      <TablePDF dataProcessing={data?.details} data={data?.equipments} />
    </Page>
  );
};

const ExportPdfContractModal = ({ data, onCancel }) => {
  console.log('record',data);
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

export default ExportPdfContractModal;
