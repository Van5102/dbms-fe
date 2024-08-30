import { useState, useEffect } from "react";
import { SpinCustom } from "components";
import "./index.scss";
import AddDocument from "./components/addDocument";
import { DATE_FORMAT } from "utils/constants/config";
import UpdateNameFile from "./components/updateNameFile";
import File from "./components/File";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  actionGetListDocument,
  actionGetListFolderChid,
  actionGetListRole
} from "./action";
import { Layout, Col, Row, Input, DatePicker, Button, Breadcrumb } from "antd";
import { useSearchParams } from "react-router-dom";

const DepartmentDocument = () => {
  const [spinning, setSpinning] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [name, setName] = useState();
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDocumentAdd, setIdDocumentAdd] = useState(null);
  const [modalEditName, setmodalEditName] = useState(false);
  const [oldName, setOldName] = useState();
  const [idFile, setIdFile] = useState();
  const [checkDepartmentID, setCheckDepartmentID] = useState();
  const [department, setDepartment] = useState();
  const userLogin = useSelector((state) => state?.profile);
  const [isClicked, setIsClicked] = useState();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [idLastFolder, setIdLastFolder] = useState(null);
  const [roleUser, setRoleUser] = useState([])
  const [searchParams] = useSearchParams()
  const Document_id = searchParams.get('document_id')
  // const Department_id = searchParams.get('department_id')
  const departmentList = useSelector(state => state?.departments)

  const handleNavigateBack = (e, breadcrumb, index) => {
    const last_folder = []
    breadcrumbs.map((item, index1) => {
      return index1 < index && last_folder.push(item)
    })
    setBreadcrumbs(last_folder)
    setIdLastFolder(breadcrumb)
  };

  const handleCommonBreadcrumbClick = async () => {
    setBreadcrumbs([]);
    setIdDocumentAdd()
    setIsClicked(false)
    if (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ) {
      setListDocument(departmentList)
      setCheckDepartmentID(true);
    } else {
      const params = {
        department_id: userLogin.department_id,
        accessScope: 1,
        // name: name || null,
        // time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
        // time_upload_end: dayjs(dateEnd).startOf('D').unix() || null,
        // document_id: idDocumentAdd || null
      };
      const { data, status } = await actionGetListDocument(params);
      if (status === 200) {
        setListDocument(data?.data);
        setBreadcrumbs([]);
      }
    }
  };

  const handleGetListDocument = async () => {
    setSpinning(true);
    try {
      setIdDocumentAdd()
      if ((userLogin.position_code === "GIAM_DOC"  || userLogin.position_code === "P_GIAM_DOC" ) && checkDepartmentID) {
        const params = {
          department_id: department,
          accessScope: 1,
          name: name,
          time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
          time_upload_end: dayjs(dateEnd).endOf('D').unix() || null,
          document_id: Document_id || idDocumentAdd
        };
        const { data, status } = await actionGetListDocument(params);
        if (status === 200) {
          setListDocument(data?.data);
          setCheckDepartmentID(false);
          setBreadcrumbs([]);
        }
      } else {
        const params = {
          department_id: userLogin.department_id || department,
          accessScope: 1,
          name: name || null,
          time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
          time_upload_end: dayjs(dateEnd).endOf('D').unix() || null,
          document_id: idDocumentAdd || null
        };
        const { data, status } = await actionGetListDocument(params);
        if (status === 200) {
          setListDocument(data?.data);
          setBreadcrumbs([]);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleGetChildFolder = async (value) => {
    setSpinning(true);
    try {
      if (checkDepartmentID || value?.code) {
        setDepartment(value?.id);
        const params = {
          department_id: value.id,
          accessScope: 1,
          name: name || null,
          time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
          time_upload_end: dayjs(dateEnd).startOf('D').unix() || null,
          document_id: value?.code ? null : idDocumentAdd
        };
        const { data, status } = await actionGetListDocument(params);
        if (status === 200) {
          setBreadcrumbs([...breadcrumbs, { id: value.id, name: value.name, code: value?.code }]);
          setCheckDepartmentID(false);
          setListDocument(data?.data);
        }
      } else {
        setIdDocumentAdd(value?.id)
        const body = {
          document_id: value?.id,
          accessScope: 1,
          name: name || null,
          time_upload_start: dayjs(dateStart).startOf('D').unix() || null,
          time_upload_end: dayjs(dateEnd).startOf('D').unix() || null,
        };
        if (userLogin.position_code !== "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ) {
          body.department_id = userLogin.department_id
        }
        const { data, status } = await actionGetListFolderChid(body);
        if (status === 200) {
          setCheckDepartmentID(false);
          setListDocument(data?.data);
          setBreadcrumbs([...breadcrumbs, { id: value?.id, name: value?.name, code: value?.code }]);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setSpinning(false);
  };

  const handleClick = (event, name_file, id_file) => {
    if (event.detail === 2) {
      setOldName(name_file);
      setIdFile(id_file);
      setmodalEditName(true);
    }
  };

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
    handleGetListDocument();
  }, [name, dateEnd, dateStart]);

  useEffect(() => {
    if (idLastFolder?.code) {
      setIdDocumentAdd(null)
    } else {
      setIdDocumentAdd(idLastFolder?.id)
    }
    // (!idLastFolder?.code) && setIdDocumentAdd(idLastFolder.id)
    handleGetChildFolder(idLastFolder);
  }, [idLastFolder]);

  useEffect(() => {
    handleGetRoleUser()
  }, [])

  return (
    <Layout className="common-layout document-page">
      <SpinCustom spinning={spinning}>
        <div className="common-layout--header">
          <Row className='filler' gutter={[8, 8]}>

          <Col span={24}>
              <Button className='exit-home' onClick={() => window.navigatePage("home-navigate")}>
                Thoát
              </Button>
            </Col>

            <Col >
              <Row gutter={[8, 8]}>
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

            <Col >
              <Row gutter={[8, 8]}>
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

            {(((userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ) && isClicked) || (userLogin.position_code !== "GIAM_DOC" && userLogin.position_code !== "P_GIAM_DOC")) &&
              <Col span={12}>
                <Button onClick={() => setIsModalOpen(true)} type='primary' >Thêm tài liệu</Button>
              </Col>}
          </Row>
          <br />
        </div>
        <div className="common-layout--content">
          <Row gutter={[8, 16]}>
            <Breadcrumb className="dropdown-action">
              <Breadcrumb.Item
                onClick={() => {
                  handleCommonBreadcrumbClick()
                }}>
                Tài liệu phòng ban
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
              department={department}
              handleClick={handleClick}
              setIsModalOpen={setIsModalOpen}
              idDocumentAdd={idDocumentAdd}
              setCheckDepartmentID={setCheckDepartmentID}
              setListDocument={setListDocument}
              isClicked={isClicked}
              setIdDocumentAdd={setIdDocumentAdd}
              setIsClicked={setIsClicked}
              checkDepartmentID={checkDepartmentID}
              setBreadcrumbs={setBreadcrumbs}
              breadcrumbs={breadcrumbs}
              document_id={Document_id}
              roleUser={roleUser}

            />
          </Row>
        </div>
      </SpinCustom>
      <>
        {isModalOpen && (
          <AddDocument
            onCancel={() => setIsModalOpen(false)}
            handleGetListDocument={handleGetListDocument}
            idDocumentAdd={idDocumentAdd}
            handleGetChildFolder={handleGetChildFolder}
            department={department}
            setCheckDepartmentID={setCheckDepartmentID}
            checkDepartmentID={checkDepartmentID}
            setListDocument={setListDocument}
            setIdDocumentAdd={setIdDocumentAdd}
          />
        )}
        {modalEditName && (
          <UpdateNameFile
            oldName={oldName}
            idFile={idFile}
            onCancel={() => setmodalEditName(false)}
            idDocumentAdd={idDocumentAdd}
            handleGetListDocument={handleGetListDocument}
            setCheckDepartmentID={setCheckDepartmentID}
          />
        )}
      </>
    </Layout>
  );
};
export default DepartmentDocument;
