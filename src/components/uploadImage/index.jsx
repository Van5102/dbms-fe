import { Upload, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"

const UploadImage = ({ files, setFiles, maxCount }) => {
  return (
    <Upload
      accept="image/*"
      listType="picture-card"
      multiple={true}
      maxCount={maxCount}
      beforeUpload={(file) => {
        if (`${file.type}`.includes('image')) {
          setFiles(prev => {
            const fileList = [...prev, file]
            return fileList.slice(0, maxCount)
          })
        } else {
          message.warning("Ảnh không đúng định dạng !");
        }

        return false;
      }}
      
      onRemove={(file) => {
        setFiles(files.filter(f => f.uid !== file.uid))
      }}
    >
      {files && files.length >= maxCount ? null : <PlusOutlined />}
    </Upload>
  )
}

export default UploadImage
