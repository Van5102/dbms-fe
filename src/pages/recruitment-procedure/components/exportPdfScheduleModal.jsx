import React from 'react';
import { Modal } from 'antd'
import moment from 'moment';
import RobotoLightWebfont from 'assets/fonts/roboto-light-webfont.ttf'
import RobotoRegularWebfont from 'assets/fonts/roboto-regular-webfont.ttf'
import RobotoMediumWebfont from 'assets/fonts/roboto-medium-webfont.ttf'
import RobotoBoldWebfont from 'assets/fonts/roboto-bold-webfont.ttf'
import {useEffect} from 'react'
import { 
  NOTARIZATION_PROCEDURE_TYPES, 
  DATETIME_FORMAT, 
  DATE_FORMAT ,INTERVIEW_STATUS
} from "utils/constants/config"
import 'moment/locale/vi'; // 

import {
  Row, Col, Button
} from 'antd'

import {
  Font, Page, Text, View,
  Document, StyleSheet,
  PDFViewer
} from '@react-pdf/renderer';

Font.register({
  family: "Roboto",
  fonts: [
    { src: RobotoLightWebfont, fontWeight: 300 },
    { src: RobotoRegularWebfont, fontWeight: 400 },
    { src: RobotoMediumWebfont, fontWeight: 500 },
    { src: RobotoBoldWebfont, fontWeight: 600 },
  ],
});
moment.locale('vi');
const formattedDate = moment().format('LLLL');

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 4,
    fontFamily: 'Roboto',
    padding: 24,
    pageBreakBefore: 'always',
  },
  pageTitle: {
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 500,    margin: 3,

  },
  // pageCreator: {
  //   textAlign: 'right',
  //   marginTop: 32,
  //   marginBottom: 16,
  // },
  pageSubTitle: {
    textAlign: 'right',
    marginTop: 32,
    marginBottom: 16,
  },
  commonText: {
    marginBottom: 8,
    fontSize: 10
  },
  approvalWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    flexWrap: "wrap"
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
    flexDirection: "row",
    borderTop: 0.3,
  },
  tableCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: 1,
    borderStyle: "solid",
    borderLeft: 0.3,
  },
});

const TablePDF = ({data,userLogin }) => {

  const handleRenderText = (text, renderTextProps) => {
    const words = text.split(' ');

    let lines = [];
    let currentLine = '';
    words.forEach(word => {
      const width = renderTextProps.widthOfText(word);
      if (currentLine === '') {
        currentLine = word;
      } else if (width < renderTextProps.availableWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);

    return lines.map((line, index) => (
      <Text key={index}>
        {line}
      </Text>
    ))
  };

  const TabCol = ({ children, width }) => {
    return (
      <View style={{
        ...styles.tableCol,
        width
      }}>
        {children}
      </View>
    )
  }
  function getApplicantStatus(status) {
    switch (status) {
      case 0:
        return INTERVIEW_STATUS[0];
      case 1:
        return INTERVIEW_STATUS[1];
      case 2:
        return INTERVIEW_STATUS[2];
      case 3:
        return INTERVIEW_STATUS[3];
      case 4:
        return INTERVIEW_STATUS[4];
      case 5:
        return INTERVIEW_STATUS[5];
      default:
        return '';
    }
  }

  function checkInterviewerNum(n) {
    let interviewers = Object.values(n)
    return interviewers.join(',')
  }
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <TabCol width={30}>
          <Text>STT</Text>
        </TabCol>

   

        <TabCol width={150}>
          <Text>Họ và tên	</Text>
        </TabCol>

      
        <TabCol width={150}>
          <Text>Thời gian phỏng vấn	</Text>
        </TabCol>


        <TabCol width={150}>
          <Text>Người phỏng vấn	</Text>
        </TabCol>
        
      
        <TabCol width={70}>
          <Text>Trạng thái		</Text>
        </TabCol>
      </View>

      {data?.map((item, index) =>
    <View style={styles.table}>

        <View  style={styles.tableRow}>
          <TabCol width={30}>
            <Text>{index + 1}</Text>
          </TabCol>

          <TabCol width={150}>
            <Text renderText={handleRenderText}>{item?.applicant_name}</Text>
          </TabCol>

          <TabCol width={150}>
            <Text>{item?.interview_time ? moment(item?.interview_time * 1000).format(DATE_FORMAT) : ""}</Text>
          </TabCol>

          <TabCol width={150}>
            <Text>{checkInterviewerNum(item?.interviewer_name)}</Text>
          </TabCol>

          <TabCol width={70}>
            <Text renderText={handleRenderText}>{getApplicantStatus(item?.status)}</Text>
          </TabCol>

          

         
        </View>
        </View>
      )}
    </View>
  )
}

const PDFPage = ({ data,userLogin }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageTitle}>
      <Text> CÔNG TY CỔ PHẦN AIPT VIỆT NAM</Text>

        <Text>Lịch Phỏng Vấn</Text>
      </View>
      {/* <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
         Người xuất file: {userLogin?.name}
        </Text>
      </View> */}
      <View style={styles.pageSubTitle}>
        <Text style={styles.commonText}>
          Hà Nội,
          ngày {moment().format('DD')}{" "}
          tháng {moment().format('MM')}{" "}
          năm {moment().format('YYYY')}
        </Text>
      </View>

      <View>
        <Text style={styles.commonText}>Người làm phiếu: {userLogin?.name}</Text>
        <Text style={styles.commonText}>Bộ phận: {userLogin?.department_name}</Text>
        <Text style={styles.commonText}>Số bản ghi: {data.length}</Text>

      </View>

      <TablePDF data={data} userLogin={userLogin} />
    </Page>
  )
}

const ExportPdfModal = ({ data, onCancel,userLogin }) => {

  return (
    <Modal
      className='export-pdf-modal'
      open={true}
      closeIcon={false}
      footer={<Row justify="end">
        <Col span={4}>
          <Button onClick={onCancel} className="w-full" >Thoát</Button>
        </Col>
      </Row>}
    >
      <PDFViewer className='export-pdf--content'>
        <Document>
          {/* {data?.map(item =>  */}
            <PDFPage key={data?.id} data={data} userLogin={userLogin}/>  
          {/* )} */}
        </Document>
      </PDFViewer>
    </Modal>
  );
}

export default ExportPdfModal;
