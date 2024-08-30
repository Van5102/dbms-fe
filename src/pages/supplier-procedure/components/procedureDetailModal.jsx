import { useMemo, useState } from "react"
import { Modal, Table, Button, Image, Row, Col } from "antd"
import { formatCurrency } from "utils/helps"
import { getFullUrlStaticFile } from "utils/helps";

const ProcedureDetailModal = ({ record, onCancel }) => {
  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 10
  })

  const equipments = useMemo(() => {
    return record?.supplier || []
  }, [record])
  const columns = [
    {
      width: 80,
      align: "center",
      title: "STT",
      key: "stt",
      dataIndex: "stt",
      render: (_, r, i) => (i + 1) + (pagination.page_num - 1) * pagination.page_size
    },

    {
      align: "center",
      title: "id",
      key: "id",
      dataIndex: "id",
      width: 20,
      render:(v,r)=>r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{v}</strong></span> :<span>{v}</span>


    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
      align: "center",
      // fixed:"left"
      width: 150,
      render:(v,r)=>r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{v}</strong></span> :<span>{v}</span>

    },
    {
      align: "left",
      title: "Nội dung hàng hóa",
      dataIndex: "content",
      key: "content",
      width: 300,

      render: (v,r) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>{

          r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{v}</strong></span> :<span>{v}</span>
        }</div>
      ),
    },


    {
      width: 60,

      title: "Số lượng hàng hóa",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render:(v,r)=>r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{v}</strong></span> :<span>{v}</span>

    },
    {
      width: 200,

      title: "Giá chưa VAT",
      dataIndex: "cost_none_VAT",
      key: "cost_none_VAT",
      align: "center",
      render: (v,r) => v ?  r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{formatCurrency(v)}</strong></span> :<span>{formatCurrency(v)}</span> : ""
    },
    {
      width: 200,

      title: "Thành tiền(gồm VAT)",
      dataIndex: "cost_include_VAT",
      key: "cost_include_VAT",
      align: "center",
      render: (v,r) => v ?  r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{formatCurrency(v)}</strong></span> :<span>{formatCurrency(v)}</span> : ""
    },

    {
      title: "Tệp",
      dataIndex: "attachments",
      key: "attachments",
      align: "center",
      width: 300,

      render: e => (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {e && e?.map((url, index) => (
              <div key={index} >
                {url?.path?.split('.').pop()?.toLowerCase() === 'pdf' ?
                    <Button type="info" onClick={() => window.open(getFullUrlStaticFile(url?.path), "_blank")}>Mở PDF</Button>
                  :
                    <Image src={getFullUrlStaticFile(url?.path)} width={100} style={{ "paddingBottom": "8px" }} />
                }
              </div>
            ))}

          </div>

        </>
      ),
    },

    {
      align: "left",
      title: "Ưu/nhược điểm",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (v,r) => (
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>{

          r?.status===1 ? <span style={{backgroundColor:"yellow",padding:"3px"}}><strong>{v}</strong></span> :<span>{v}</span>
        }</div>
      ),
    },


  ]
  // console.log('equipments', equipments)
  return (
    <Modal
      className="common-modal"
      style={{ top: 10 }}
      width={1500}
      title="Danh sách"
      footer={<Button onClick={onCancel} className="w-120">
        Thoát
      </Button>}
      open={true}
    >
      <Row>
        <Col span={24}>

          {equipments.map(e => e.status === 1) ? (
            <>
              <strong>Đề xuất nhà cung cấp: {equipments.find(e => e.status === 1)?.name}</strong> 
            </>
          ) : (
            "Đề xuất nhà cung cấp:"
          )}
        </Col>
        <Col span={24}>
          <strong>Mục đích:</strong>  {equipments[0]?.purpose}
        </Col>
      </Row>
      <Table
        dataSource={equipments}
        columns={columns}
        rowKey={record => record?.id}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.page_num,
          pageSize: pagination.page_size,
          total: equipments.length,
          onChange: (page_num, page_size) => {
            setPagination({ page_num, page_size })
          }
        }}
        scroll={{ x: 1200 }}

      />
    </Modal>
  )
}

export default ProcedureDetailModal