import { Button, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import React, { useEffect } from 'react';

const UploadFIle = ({ files, setFiles, maxCount, defaultFile }) => {
  useEffect(() => {
    if (defaultFile) {
      // Nếu có tập tin mặc định, thêm vào danh sách
      setFiles([defaultFile]);
    }
  }, [defaultFile, setFiles]);

  return (
    <Upload
      // listType="picture-card"
      multiple={true}
      maxCount={maxCount}
      fileList={files}
      beforeUpload={(file) => {
        setFiles(prev => {
          const fileList = [...prev, file]
          return fileList.slice(0, maxCount)
        })
        return false;
      }}
      onRemove={(file) => {
        
        setFiles(files.filter(f => f.uid !== file.uid))
      }}
    >
      {files && files.length >= maxCount ? null : <Button icon={<UploadOutlined />}>Tải lên</Button>}
    </Upload>
  )
}

export default UploadFIle
