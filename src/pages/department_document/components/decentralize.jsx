import { SpinCustom, } from "components"
import { Button, Col, Row, Modal, Table, Input, Space, } from "antd"
import { useEffect, useState } from "react"
import { actionGetlistEmpoyee } from "../action"
import { useSelector } from "react-redux"
import RoleUser from "./roleUser"

const Decentralize = ({ onCancel, documentId, department, fileType }) => {
    const [spinning, setSpinning] = useState(false)
    const [nameUser, setNameUser] = useState()
    const [openRoleUser, setOpenRoleUser] = useState(false)
    const [listEmployee, setListEmployee] = useState([])
    const [employee, setEmployee] = useState()

    const userLogin = useSelector(state => state.profile)

    const [pagination, setPagination] = useState({
        pageSize: 5,
        current: 1,
    });

    const handleChangePage = (page, pageSize) => {
        setPagination({
            current: page,
            pageSize: pageSize,
        });
    };

    const handleGetListEmployee = async () => {
        setSpinning(true)
        try {
            const params = {
                name: nameUser,
                department_id: department || userLogin.department_id
            }
            let { data, status } = await actionGetlistEmpoyee(params)
            if (status === 200) {
                setListEmployee(data)
            }
        } catch (err) {
            console.log(err)
        }
        setSpinning(false)
    }

    const columns = [
        {
            fixed: 'left',
            width: 60,
            title: "STT",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => (
                <Space >{index + 1 + ((pagination.current - 1) * pagination.pageSize)}</Space>
            ),
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            align: "center",
            onCell: (cell) => {
                return {
                    onClick: (record, rowIndex) => {
                        setOpenRoleUser(record)
                        setEmployee(cell)
                    }
                }
            }
        },
    ]

    useEffect(() => {
        handleGetListEmployee()
    }, [nameUser])

    return (
        <Modal
            open={true}
            title="Phân quyền"
            className='form-modal'
            footer={true}
            // height={250}
            width={300}
        >
            <SpinCustom spinning={spinning}>
                <Row>
                    <Input.Search
                        placeholder="Nhập tên ..."
                        onSearch={(v) => {
                            setNameUser(v);
                        }}
                    />
                </Row>
                <Table
                    width="250"
                    height="300"
                    dataSource={listEmployee}
                    columns={columns}
                    rowKey={(r) => r.id}
                    scroll={{ y: 200 }}
                    pagination={{
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        onChange: handleChangePage,
                    }}
                ></Table>
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Button className="w-full"
                            onClick={onCancel}
                        >Thoát</Button>
                    </Col>
                </Row>
                <>
                    {openRoleUser && <RoleUser
                        employee={employee}
                        documentId={documentId}
                        fileType={fileType}
                        onClose={() => setOpenRoleUser(false)} />}
                </>
            </SpinCustom>
        </Modal>
    )

}

export default Decentralize