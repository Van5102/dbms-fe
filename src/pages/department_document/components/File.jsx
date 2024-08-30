// import { FileTextOutlined, FolderAddFilled, FolderFilled } from "@ant-design/icons";
import { Dropdown, Row, message, Image, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { SpinCustom } from "components";
import UpdateFile from "./updateFile";
import { actionDownLoadFile, actionDeleteFile } from "../action";
import { useSelector } from "react-redux"
import Decentralize from "./decentralize"
import { getFullUrlStaticFile } from "utils/helps";

import {
  actionGetListFolderChid,
  actionGetListDocument,
  actionGetImage,
} from "../action";
import { FolderIconDownload, WordIcon, PptxIcon, PdfIcon, ExcelIcon, DefaultIcon } from 'assets'
import { DATETIME_FORMAT, REACT_APP_SERVER_BASE_URL } from "utils/constants/config"
import DetailFile from "./detailFile";
import moment from "moment";
import UpdateNameFile from "./updateNameFile";

const File = ({ listDocument,
  handleGetListDocument,
  handleGetChildFolder,
  department,
  idDocumentAdd,
  setCheckDepartmentID,
  setListDocument,
  isClicked,
  setIsClicked,
  setIdDocumentAdd,
  checkDepartmentID,
  // Department_id,
  Document_id,
  roleUser
}) => {

  const [spinning, setSpinning] = useState(false)
  const [openModalUpdateFile, setOpenModalUpdateFile] = useState(false)
  const [documentId, setDocumentId] = useState()
  const [typeDocument, setTypeDocument] = useState(null)
  const [openDecentralize, setOpenDecentralize] = useState(false)
  const userLogin = useSelector(state => state?.profile)
  const departmentList = useSelector(state => state?.departments)
  const [status, setStatus] = useState()
  const [pathDoc, setPathDoc] = useState()
  const [openDetail, setOpenDetail] = useState(false)
  const [oldName, setOldName] = useState()
  const [idFile, setIdFile] = useState()
  const [modalEditName, setmodalEditName] = useState(false)

  const [fileType, setFileType] = useState(null)
  const [items, setItems] = useState([]);

  if (!idDocumentAdd && (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC")) {
    setCheckDepartmentID(true)
  }

  if (isClicked && !status) {
    setCheckDepartmentID(false)
  }

  if (status) {
    setCheckDepartmentID(false)
    setStatus()
  }

  if ((userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC") && !isClicked && !Document_id) {
    setListDocument(departmentList)
    setCheckDepartmentID(true)
  }

  const handleDeleteFile = async (id) => {
    setSpinning(true)
    try {
      const body = {
        doc_id: id
      }
      const { data, status } = await actionDeleteFile(body)
      if (status === 200) {
        message.success(data?.message)
        if (idDocumentAdd) {
         
          const params = {
            department_id: department,
            accessScope: 1,
            document_id: idDocumentAdd || null
          };

          const { data, status } = await actionGetListFolderChid(params);
          if (status === 200) {
            setStatus(true)
            setCheckDepartmentID(false);
            setListDocument(data?.data);
            // message.success(data?.message)
          }
        } else {

          // handleGetListDocument()
          setIdDocumentAdd()
          if ((userLogin.position_code === "GIAM_DOC" ||userLogin.position_code === "P_GIAM_DOC" ) && checkDepartmentID) {


            const params = {
              department_id: department || idDocumentAdd,
              accessScope: 1,
              document_id: idDocumentAdd || null
            };
            const { data, status } = await actionGetListDocument(params);
            if (status === 200) {
              setStatus(true)
              setListDocument(data?.data);
              setCheckDepartmentID(false);
            }
          } else {

            const params = {
              department_id: userLogin.department_id || department,
              accessScope: 1,
              document_id: idDocumentAdd || null
            };
            const { data, status } = await actionGetListDocument(params);
            if (status === 200) {
              setCheckDepartmentID(false);
              setListDocument(data?.data);
            }
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }

  const hadleDownloadFile = async (id) => {
    setSpinning(true)
    try {
      const as_attachment = 1
      const { data, status } = await actionDownLoadFile(id, as_attachment)
    } catch (err) {
      console.log(err)
    }
    setSpinning(false)
  }
  const handleEditName = async (name,id,type) => {

    if(type===1){
      setOldName(name)
    }else{
      const nameWithoutExtension = name.split('.').slice(0, -1).join('.');
    setOldName(nameWithoutExtension)
    }
    

    setIdFile(id)
    setmodalEditName(true)
  
  }
  const handleDetail = async (id) => {
    try {
      setDocumentId(id);
      const selectedDocument = listDocument.find((doc) => doc.id === id);
      
      if(selectedDocument.document_type === 1 || selectedDocument.code){
        setIsClicked(true)
        isClicked && setIdDocumentAdd(selectedDocument.id)
        handleGetChildFolder(selectedDocument)      
      }
      else{
      const arr = selectedDocument.path.split('.')
      if(arr.includes('mp4')){
        handleWatchVideo(selectedDocument)
      }
       if(arr.includes('jpeg') || arr.includes('jpg') || arr.includes('png')){
         { <Image src={`${actionGetImage(selectedDocument.id, 2)}`} />}
      }
      else{
        setDocumentId(id);
      setPathDoc(selectedDocument.path);
      selectedDocument.document_type === 1 ? setOpenDetail(false) : setOpenDetail(true);

      
      }
    }
    } catch (error) {
      console.error(error);
    }
  }

  const handleMenuClick = (e, doc_id, document_type,doc_name) => {
    setDocumentId(doc_id)
    // if (e.key === '1') {
    //   setOpenModalUpdateFile(true)
    // }
    if (e.key === "2") {
      confirmDelete(doc_id);
    }
    else if (e.key === "3") {
      hadleDownloadFile(doc_id)
    }
    else if (e.key === "4") {
        
        
      handleEditName(doc_name,doc_id,document_type)
    }
    else if (e.key === "5") {
      setOpenDecentralize(true)
      setFileType(document_type)
    }
  };

  const confirmDelete = (doc_id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa tệp tin này?",
      onOk() {
        handleDeleteFile(doc_id);
      },
      onCancel() {
      },
    });
  };

  const handleOpenChange = (doc_type) => {
    if (doc_type === 1) {
      setTypeDocument(1)
    }
    else {
      setTypeDocument(2)
    }
  };

  const handleWatchVideo = (r) => {
    const videoPath = getFullUrlStaticFile(r.path);
    window.open(videoPath, "_blank");
  }

  const checkPosition = (position_code) => {
    if ((position_code === "GIAM_DOC" || position_code === "P_GIAM_DOC") && isClicked) {
      return true;
    }

    else if (userLogin.position_code !== "GIAM_DOC" && userLogin.position_code !== "P_GIAM_DOC") {
      return true;
    }
    else {
      return false;
    }
  }

  const getIconForDocumentType = (documentType, record, extension_file) => {
    if (documentType === 1) {
      return <FolderIconDownload className="style-icon" onClick={() =>
        {
        handleGetChildFolder(record)}} />;
    } else if (record.code) {
      return <FolderIconDownload
        className="style-folder"
        onClick={() => {
          setIsClicked(true)
          isClicked && setIdDocumentAdd(record.id)
          handleGetChildFolder(record)
        }}
      />
    }
    else {
      switch (extension_file) {
        case "docx":
        case "doc":
          return <WordIcon className="style-icon" onClick={() => handleClick(record)} />;
        case "pptx":
          return <PptxIcon className="style-icon" onClick={() => handleClick(record)} />;
        case "pdf":
          return <PdfIcon className="style-icon" onClick={() => handleClick(record)} />;
        case "xls":
        case "xlsx":
          return <ExcelIcon className="style-icon" onClick={() => handleClick(record)} />;
        case "jpg":
        case "png":
        case "jpeg":
          return <Image alt='avatar' src={`${actionGetImage(record.id, 2)}`} className="style-icon" />;
        case "mp4":
        case "mov":
          return <video className="style-icon"
            onClick={() => {
              handleWatchVideo(record);
            }}>
            <source src={getFullUrlStaticFile(record.path)} type={extension_file === 'mp4' ? 'video/mp4' : 'video/quicktime'} />
          </video>;
        default:
          return <DefaultIcon className="style-icon" onClick={() => handleClick(record)} />;
      }
    }
  };

  useEffect(() => {

    if (typeDocument === 1) {
      setItems([
        (roleUser.map((item) => { return item.code }).includes(("R4")) ||
          (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ||  userLogin.position_code === "TRUONG_PHONG")
        ) && {
          label: 'Xóa',
          key: '2',
        },
        (roleUser.map((item) => { return item.code }).includes(("R4")) ||

        (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ||  userLogin.position_code === "TRUONG_PHONG")
        )&& {
          label: 'Sửa tên',
          key: '4'
        },
        (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" || userLogin.position_code === "TRUONG_PHONG") && {
          label: "Phân quyền",
          key: '5'
        }
      ])

    } else if (typeDocument === 2) {
      setItems([

        (roleUser.map((item) => { return item.code }).includes(("R4")) ||
          (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" || userLogin.position_code === "TRUONG_PHONG")) && {
          label: 'Xóa',
          key: '2',
        },
        roleUser.map((item) => { return item.code }).includes(("R2")) && {
          label: 'Tải xuống',
          key: '3',
        },
        (roleUser.map((item) => { return item.code }).includes(("R4")) ||

        (userLogin.position_code === "GIAM_DOC" || userLogin.position_code === "P_GIAM_DOC" ||  userLogin.position_code === "TRUONG_PHONG")
        )&& {
          label: 'Sửa tên',
          key: '4'
        },
        (userLogin.position_code === "GIAM_DOC"|| userLogin.position_code === "P_GIAM_DOC"  || userLogin.position_code === "TRUONG_PHONG") && {
          label: "Phân quyền",
          key: '5'
        },

      ])

    }
  }, [typeDocument])

  const rows = listDocument.map((record, index) => {
    const extension_file = record.name.replace(/\s/g, '').split('.').pop();
    return (
      <tr  className='cursor-pointer' key={index} onClick={() =>{handleDetail(record?.id)
      } }>
      <td className="icon-document" style={{ width: '2%' }}>
        {getIconForDocumentType(record.document_type, record,extension_file)}
      </td>
      <td className="name-document"  onClick={(event) => 
        { 
          event.stopPropagation()
          handleClick(event, record.name, record.id)


        }
         }>
        {record.name}
      </td>
      <td className="time-upload-document">
        {moment((record.time_upload) * 1000).format(DATETIME_FORMAT)}

      </td>
      <td className="user-create-document"  onClick={(event) => 
        { 
          event.stopPropagation()
          handleClick(event, record.name, record.id)
        }
         }>
        {record.user_crearte}
      </td>
      <td className="action-document"  onClick={(event) => 
        { 
          event.stopPropagation()
         }
         } >
        <Dropdown className="dropdown-action"
          menu={{
            items,
            onClick: (e) =>{
              handleMenuClick(e, record.id, record.document_type,record.name)
               
            } 
          }}
          onOpenChange={() => handleOpenChange(record.document_type)}
        >
          <span>Thao tác</span>
        </Dropdown>
      </td>
    </tr>
    )
  })

  const handleClick = (event, name_file, id_file) => {
    if(event.detail === 1){
      handleDetail(id_file)
    }
    
  };


  return (
    <SpinCustom spinning={spinning}>
      <Row gutter={[16, 0]} className="style-list-document">
        <table class="style-table">
          <thead>
            <tr>
              <th></th>
              <th>Tên</th>
              {checkPosition(userLogin.position_code) && <th>Ngày tạo</th>}
              {checkPosition(userLogin.position_code) && <th>Người tạo </th>}
              {checkPosition(userLogin.position_code) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </Row>
      <>
        {
          openModalUpdateFile && <UpdateFile
            documentId={documentId}
            setCheckDepartmentID={setCheckDepartmentID}
            onCancel={() => setOpenModalUpdateFile(false)} />
        }
        {
          openDecentralize && <Decentralize
            documentId={documentId}
            department={department}
            onCancel={() => setOpenDecentralize(false)}
            fileType={fileType}
          />
        }
        {
          openDetail && (
            <DetailFile
              pathDoc={pathDoc}
              documentId={documentId}
              onCancel={() => setOpenDetail(false)}
            />
          )}
          {modalEditName && <UpdateNameFile
          oldName={oldName}
          idFile={idFile}
          onCancel={() => setmodalEditName(false)}
          idDocumentAdd={idDocumentAdd}
          handleGetListDocument={handleGetListDocument}
          setCheckDepartmentID={setCheckDepartmentID}
          setListDocument={setListDocument}
        />}
      </>
    </SpinCustom>
  )
}
export default File