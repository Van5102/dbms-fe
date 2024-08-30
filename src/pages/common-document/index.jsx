
import { useState, useEffect } from "react";
import React from 'react';
import { SpinCustom } from "components"
import './index.scss'
import dayjs from "dayjs";
import AddDocument from "./components/addDocument";
import { DATE_FORMAT } from "utils/constants/config"
import File from "./components/File";
import {
  actionGetListDocument,
  actionGetListFolderChid,
  actionGetListRole
} from "./action"

import {
  Layout, Col, Row,
  Input, DatePicker, Button, Breadcrumb
} from "antd"

const CommonDocument = () => {

  const [spinning, setSpinning] = useState(false)
  const [listDocument, setListDocument] = useState([]);
  const [name, setName] = useState(null)
  const [dateStart, setDateStart] = useState(null)
  const [dateEnd, setDateEnd] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDocumentAdd, setIdDocumentAdd] = useState()
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [idLastFolder, setIdLastFolder] = useState();
  const [roleUser, setRoleUser] = useState([])

  const handleNavigateBack = (e, breadcrumb, index) => {
    const last_folder = []
    breadcrumbs.map((item, index1) => {
      return index1 < index && last_folder.push(item)
    })
    setBreadcrumbs(last_folder)
    setIdLastFolder(breadcrumb)
  }

  const handleCommonBreadcrumbClick = async () => {
    setSpinning(true)
    try {
      setIdDocumentAdd()
      setBreadcrumbs([]);
      setIdDocumentAdd()
      const params = {
        accessScope: 2,
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
        time_upload_end: dayjs(dateEnd).startOf('D').unix() || null,
      }
      const { data, status } = await actionGetListDocument(params)
      if (status === 200) {
        setListDocument(data?.data)
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false)
  };

  const handleGetListDocument = async () => {

    setSpinning(true)
    try {

      // window.navigatePage('common-document', null, {
      //   document_id: Document_id
      // })
      const params = {
        accessScope: 2,
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
        time_upload_end: dayjs(dateEnd).endOf('D').unix() || null,
        // document_id: Document_id || idDocumentAdd
      }
      if (idDocumentAdd) {
        params.document_id = idDocumentAdd
      }
      setIdDocumentAdd()
      const { data, status } = await actionGetListDocument(params)
      if (status === 200) {
        setListDocument(data?.data)
        setBreadcrumbs([]);
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  const handleGetChildFolder = async (value) => {
    setSpinning(true)
    try {
      // window.navigatePage('common-document', null, {
      //   document_id: value.id
      // })
      setIdDocumentAdd(value?.id)
      const params = {
        accessScope: 2,
        name: name || null,
        time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
        time_upload_end: dayjs(dateEnd).endOf('D').unix() || null,
        document_id: value?.id
        //   document_id: Document_id
      }
      const { data, status } = await actionGetListFolderChid(params)
      if (status === 200) {
        setListDocument(data?.data)
        setBreadcrumbs([...breadcrumbs, { id: value?.id, name: value?.name }]);
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }



  const handleGetRoleUser = async () => {
    setSpinning(true)
    try {
      const { data, status } = await actionGetListRole()
      if (status === 200) {
        setRoleUser(data?.data)
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }
  useEffect(() => {
    handleGetListDocument()
  }, [name, dateStart, dateEnd])

  useEffect(() => {
    handleGetChildFolder(idLastFolder);
  }, [idLastFolder])

  useEffect(() => {
    handleGetRoleUser()
  }, [])
  return (
    <Layout className='common-layout document-page' >
      <SpinCustom spinning={spinning}>
        <div className='common-layout--header'>


          <Row className='filler' gutter={[8, 8]}>
            <Col span={24}>
              <Button className='exit-home' onClick={() => window.navigatePage("home-navigate")}>
                Thoát
              </Button>
            </Col>

            
            <Col >

              <Row gutter={[8, 0]}>
                <Col className="align--center" >
                  <span>Từ:</span>
                </Col>
                <Col>
                  <DatePicker
                    defaultValue={dateStart}
                    onChange={(v) => {
                      setDateStart(v)
                    }}
                    allowClear
                    format={DATE_FORMAT}
                  />
                </Col>

              </Row>

            </Col>

            <Col>
              <Row gutter={[8, 0]}>

                <Col className="align--center">
                  <span>Đến:</span>
                </Col>
                <Col>
                  <DatePicker
                    defaultValue={dateEnd}
                    onChange={(v) => {
                      setDateEnd(v)
                    }}
                    allowClear
                    format={DATE_FORMAT}
                  />
                </Col>
              </Row>
            </Col>

            <Col className='filler--item'>
              <Input.Search
                onSearch={(v) => {
                  setName(v)
                }}
                placeholder='Nhập tên ...'
                allowClear
              />
            </Col>

            <Col span={12}>
              <Button onClick={() => setIsModalOpen(true)} type='primary' >Thêm tài liệu</Button>
            </Col>
          </Row>
        </div>
        <div className='common-layout--content'>
          <Row gutter={[8, 16]} >
            <Breadcrumb className="dropdown-action ">
              <Breadcrumb.Item
                onClick={() => {
                  handleCommonBreadcrumbClick()
                }}>
                Tài liệu chung
              </Breadcrumb.Item>

              {breadcrumbs.map((breadcrumb, index) => (
                (<Breadcrumb.Item
                  key={index}
                  onClick={(e) => handleNavigateBack(e, breadcrumb, index)}
                >
                  {breadcrumb.name}
                </Breadcrumb.Item>)
              ))}
            </Breadcrumb>

            <File
              listDocument={listDocument}
              handleGetListDocument={handleGetListDocument}
              handleGetChildFolder={handleGetChildFolder}
              setIsModalOpen={setIsModalOpen}
              idDocumentAdd={idDocumentAdd}
              roleUser={roleUser}

            />

          </Row>

        </div>
      </SpinCustom>

      <>
        {isModalOpen && <AddDocument
          idDocumentAdd={idDocumentAdd}
          onCancel={() => setIsModalOpen(false)}
          handleGetListDocument={handleGetListDocument}
          handleGetChildFolder={handleGetChildFolder}
        />}

      </>
    </Layout>
  )
};
export default CommonDocument