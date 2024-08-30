import { useState, useEffect } from 'react'
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Modal } from 'antd'
import moment from "moment"
// import { getFullUrlStaticFile, isEmpty } from "utils/helps"
import RobotoLightWebfont from 'assets/fonts/roboto-light-webfont.ttf'
import RobotoRegularWebfont from 'assets/fonts/roboto-regular-webfont.ttf'
import RobotoMediumWebfont from 'assets/fonts/roboto-medium-webfont.ttf'
import RobotoBoldWebfont from 'assets/fonts/roboto-bold-webfont.ttf'
import { AiptLogo } from 'assets'

import './index.scss'

import {
  Row, Col, Button
} from 'antd'

import {
  Font, Page, Text, View,
  Document, StyleSheet, Image
} from '@react-pdf/renderer';

import {
  DATETIME_FORMAT,
  GENDER_MAP,
  MASK_STATUS
} from "utils/constants/config"

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
    fontFamily: 'Roboto',
    padding: '24px 12px'
  },
  header: {
    width: '100%',
    marginBottom: 24
  },
  boxLogo: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24
  },
  logo: {
    width: 120
  },
  textHeader: {
    fontWeight: "400",
    marginBottom: 8,
    fontSize: 11
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: 2,
  },
  image: {
    maxWidth: 40,
    maxHeight: 40
  }
});

const TablePDF = ({ data }) => {
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

  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <TabCol width={70}>
          <Text>Báo cáo</Text>
        </TabCol>

        <TabCol width={100}>
          <Text>Họ và tên</Text>
        </TabCol>

        <TabCol width={100}>
          <Text>Email</Text>
        </TabCol>

        <TabCol width={100}>
          <Text>Số điện thoại</Text>
        </TabCol>

        <TabCol width={100}>
          <Text>Vị trí</Text>
        </TabCol>

        <TabCol width={100}>
          <Text>Phòng ban</Text>
        </TabCol>

        {/* <TabCol width={50}>
          <Text>Ảnh</Text>
        </TabCol> */}
      </View>

      {data?.map((item) =>
        <View key={item?.id} style={styles.tableRow}>
          <TabCol width={70}>
            <Text>{`#${item?.id}`}</Text>
          </TabCol>


          <TabCol width={100}>
            <Text
              renderText={handleRenderText}
            >
              {item?.name}
            </Text>
          </TabCol>

          <TabCol width={100}>
            <Text >{item?.email}</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>{item?.phone}</Text>
          </TabCol>

          <TabCol width={100}>
            <Text>
              {item?.position_name}
            </Text>
          </TabCol>

          <TabCol width={100}>
            <Text>
              {item?.department_name}
            </Text>
          </TabCol>

          {/* <TabCol width={80}>
            {item?.CodeColor ? <View
              style={{
                backgroundColor: `rgb(${item?.CodeColor})`,
                width: 70,
                height: 20
              }}
            /> :
            
            <Text>không xác định</Text>}
          </TabCol>

          <TabCol width={50}>
            <Image style={styles.image}
              src={getFullUrlStaticFile(item?.images[0]?.path)}
            />
          </TabCol> */}
        </View>
      )}
    </View>
  )
}

const PDFDocument = ({ data }) => {

  const { reports, total } = data
  const [dataTable, setDataTable] = useState([])

  useEffect(() => {
    const newList = [];
    let currentIndex = 0;

    while (currentIndex < reports.length) {
      let nextTen = []

      if (currentIndex == 0) {
        nextTen = reports.slice(currentIndex, currentIndex + 10);
        currentIndex += 10;
      }
      else {
        nextTen = reports.slice(currentIndex, currentIndex + 13);
        currentIndex += 13;
      }
      newList.push(nextTen);
    }

    setDataTable(newList)
  }, [reports])

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.boxLogo}>
            <Image style={styles.logo} src={AiptLogo} />
          </View>


          <Text style={styles.textHeader}>
            Thời gian xuất file : {moment().format(DATETIME_FORMAT)}
          </Text>

          <Text style={styles.textHeader}>
            {`Tổng số bản ghi: ${total}`}
          </Text>
        </View>

        <TablePDF data={dataTable[0]} />
      </Page>

      {dataTable.length > 1 && dataTable.slice(1).map((item, index) =>
        <Page key={index} size="A4" style={styles.page}>
          <TablePDF data={item} />
        </Page>
      )}
    </Document>
  )
}

const ExportPDF = ({ data, onClose }) => {
  return (
    <Modal
      className='common-modal export-pdf'
      open={true}
      closeIcon={false}
      footer={<Row justify="end">
        <Col span={6}>
          <Button onClick={onClose} type="primary" className="w-full" >Thoát</Button>
        </Col>
      </Row>}
    >
      <PDFViewer className='export-pdf--content'>
        <PDFDocument data={data} />
      </PDFViewer>
    </Modal>
  );
}

export default ExportPDF;
