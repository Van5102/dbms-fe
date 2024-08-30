import { SpinCustom, } from "components"
import { Button, Checkbox, Col, Modal, Row, message } from "antd"
import { useEffect, useState } from "react"
import { actionGetListRole } from "../action"
import { useSelector } from "react-redux"
import { actionDecentralize } from "../action"

const RoleUser = ({ onClose, employee, documentId, fileType }) => {
    const [spinning, setSpinning] = useState(false)
    const [listRole, setlistRole] = useState([])
    let [roleUser, setRoleUser] = useState([])

    const userLogin = useSelector(state => state?.profile)

    const handleOpenChange = async () => {
        setSpinning(true)
        try {
            const { data, status } = await actionGetListRole()
            if (status === 200) {
                setlistRole(data?.data)
            }
        } catch (err) {
            console.log(err)
        }
        setSpinning(false)
    }

    const handleGetRoleUser = async () => {
        setSpinning(true)
        try {
            const params = {
                user_id: employee.id,
                doc_id: documentId
            }
            const { data, status } = await actionGetListRole(params)
            if (status === 200) {
                setRoleUser(data?.data)
            }
        } catch (err) {
            console.log(err)
        }
        setSpinning(false)
    }

    const handleCheckbox = (role) => {
        const list_role_id = roleUser.map((item) => { return item.id })
        if (list_role_id.includes(role.id)) {
            roleUser = roleUser.filter(item => item.id !== role.id)
        } else {
            roleUser.push(role)
        }
    }

    const handleSubmit = async () => {
        setSpinning(true)
        try {
            const list_role_id = roleUser.map((item) => { return item.id })
            const params = {
                id_emp: employee.id,
                id_boss: userLogin.id,
                emp_role: list_role_id,
                doc_id: documentId
            }
            let { data, status } = await actionDecentralize(params)
            if (status === 200) {
                onClose()
                message.success(data?.message)
            }
        } catch (err) {
            console.log(err)
        }
        setSpinning(false)
    }
		
    useEffect(() => {
        const fetchData = async () => {
            await handleGetRoleUser()
            await handleOpenChange()
        }
        fetchData()
    }, [])

    return (
        <Modal
            open={true}
            title={employee.name}
            className='form-modal'
            footer={false}
            height={200}
            width={200}
        >
            <SpinCustom spinning={spinning}>
                {
                    listRole.map((item, index) => {
                        if (fileType === 2) {
                            if (item.code !== "R1") {
                                return (
                                    <Row key={index} >
                                        <Checkbox
                                            defaultChecked={roleUser.map((item) => { return item.id }).includes((item.id))}
                                            onChange={(e) => handleCheckbox(item)}
                                        >
                                            {item.name}
                                        </Checkbox>
                                    </Row>
                                )
                            }
                        }
                        else {
                            return (
                                <Row key={index} >
                                    <Checkbox
                                        defaultChecked={roleUser.map((item) => { return item.id }).includes((item.id))}
                                        onChange={(e) => handleCheckbox(item)}
                                    >
                                        {item.name}
                                    </Checkbox>
                                </Row>
                            )
                        }
                    }
                    )
                }
                <Row>
                    <Col span={12}>
                        <Button
                            className="w-full"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Thoát
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            className="w-full"
                            type="primary"
                            htmlType="submit"
                            onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </Col>

                </Row>
            </SpinCustom>
        </Modal>
    )
}

export default RoleUser