import {
  Popconfirm, Button
} from "antd"

const ButtonDelete = ({onConfirm, size="middle", children}) => {
  return (
    <Popconfirm
      title="Bạn chắc chắn muốn xóa ?"
      okText="Xóa"
      cancelText="Đồng ý"
      onConfirm={onConfirm}
    > 
      <Button size={size} danger>
        {children || "Xóa"}
      </Button>
    </Popconfirm>
  )
}

export default ButtonDelete