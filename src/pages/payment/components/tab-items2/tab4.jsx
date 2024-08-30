import { DATETIME_FORMAT, PAGINATION, STATUS } from "utils/constants/config";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row, Select, Table, message } from "antd";
import CreatePaymentProcedure from "../createPaymentProcedure";
import { formatCurrency, handleGetProcedureStatusClassName, handleSetUrlParam } from "utils/helps";
import { OperatorPenddingProcedure, ProcedureProcessing, RejectProcedureModal } from "components";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { acctionApprovePaymentProcedure, actionGetPenddingPaymentProcedures } from "../../actions";
import ProcedureDetailModal from "../detailPaymentModal";
import ExportPdfModal from "../exportPaymentPdf";


const ApproveProcedureTT = ({ procedure_id, time_start, setProcedureId, time_end, setSpinning, name, department_id }) => {
    const [searchParams] = useSearchParams();
    const userLogin = useSelector(state => state?.profile)


    // Rexdux
    const procedureStatus = useSelector((state) => {
        return state?.procedureStatus?.filter(item => ["PENDING", "SUCCESS", "CANCEL"].includes(item?.code)) || []
    });

    // filter
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get("detail_status_id"));
    const [pagination, setPagination] = useState({ page_num: PAGINATION['PAGE_NUM'], page_size: PAGINATION['PAGE_SIZE'] })

    //biến danh sách tôi duyệt
    const [approveProcedures, setApproveProcedures] = useState([])
    const [totalProcedures, setTotalProcedures] = useState(0)
    const [isIsReject, setIdReject] = useState();

    const [isRecordShowProcessing, setRecordShowProcessing] = useState();
    const [isRecordShowDetail, setRecordShowDetail] = useState()
    const [dataExport, setDataExport] = useState()




    // Lây danh sách đễ xuất tôi duyệt
    const handleGetPenddingProcedures = async (page_num, page_size) => {
        setSpinning(true)

        try {
            // Cập nhật phân trang
            setPagination({ page_num, page_size })

            // params
            const params = {
                detail_status_id: selectedStatus,
                time_start,
                time_end,
                procedure_id,
                page_num,
                page_size,
                department_id,
                name

            }

            const { data, status } = await actionGetPenddingPaymentProcedures(params)

            if (status === 200) {
                setApproveProcedures(data?.procedures)
                setTotalProcedures(data?.total)
            }

        } catch (error) {
            console.log(error);
        }

        setSpinning(false)
    }

    // Hàm duyệt hoặc từ chối đề xuất
    const handleApprovePaymentProcedure = async (id, procedure_status, req_data) => {
        setSpinning(true)

        try {
            // params
            const params = {
                detail_status_id: selectedStatus,
                time_start,
                time_end,
                procedure_id,
                department_id,
                name,
                ...pagination
            }



            const { data, status } = await acctionApprovePaymentProcedure(id, procedure_status, { description: req_data?.description|null }, params)

            if (status === 200) {
                message.success(data?.message)
                setApproveProcedures(data?.procedures)
                setTotalProcedures(data?.total)
            }

        } catch (error) {
            console.log(error);
        }

        setSpinning(false)
    }

    const handleConfrim = (r) => {
        handleApprovePaymentProcedure(r?.id, STATUS.ACCEPT, null)
    }





    useEffect(() => {
        handleGetPenddingProcedures(PAGINATION['PAGE_NUM'], PAGINATION['PAGE_SIZE']);
    }, [time_start, time_end, selectedStatus, department_id, name])

    const columns = [
        {
            width: 60,
            title: "STT",
            dataIndex: "id",
            key: "id",
            render: (v, r, index) =>
                index + 1 + (pagination.page_num - 1) * pagination.page_size,
        },
        {
            width: 80,
            title: "Mã số",
            dataIndex: "id",
            key: "id",
        },
        {
            width: 150,
            title: "Người đề xuất",
            dataIndex: "created_by",
            key: "created_by",
            align: "center",
        },
        {
            title: "Thời gian đề xuất",
            dataIndex: "time_created",
            key: "time_created",
            render: (v) => moment(v * 1000).format(DATETIME_FORMAT),
            align: "center",
            width: 150,
        },
        {
            width: 200,
            title: "Nội dung thanh toán",
            dataIndex: "content",
            key: "content",

            align: "center",
        },
        {
            width: 200,
            title: "Tổng số tiền",
            dataIndex: "sum_money",
            key: "sum_money",
            render: (v,r) => formatCurrency(r?.accounting_details.map(e => e.cost ).reduce( (accumulator, currentValue) => accumulator + currentValue,0)),
            align: "center",
          },
        {
            width: 200,
            title: "Trạng thái",
            dataIndex: "status_code",
            key: "status_code",
            render: (v, r) =>
                <span className={handleGetProcedureStatusClassName(v)}>{r?.status}</span>,
            align: "center",
        },

        {
            width: 250,
            title: "",
            dataIndex: "detail_status_code",
            key: "operator",
            align: "center",
            render: (v, r) => <OperatorPenddingProcedure
                record={r}
                userLogin={userLogin}
                onConfirm={() => handleConfrim(r)}
                onReject={() => setIdReject(r.id)}
                onShowProcess={() => setRecordShowProcessing(r)}
                onExportPDF={() => setDataExport(r)}
            />
        }
    ];

    return (
        <Row gutter={[8, 8]}>

            <Col>
                {procedureStatus && (
                    <Select
                        allowClear
                        className="w-full"
                        placeholder="Chọn trạng thái"
                        defaultValue={selectedStatus ? parseInt(selectedStatus) : null}
                        onChange={(v) => {
                            handleSetUrlParam("detail-status", v);
                            setSelectedStatus(v);

                            // Cập nhật procedure_id
                            handleSetUrlParam("procedure_id", null)
                            setProcedureId(null)
                        }}
                    >
                        {procedureStatus?.map(item =>
                            <Select.Option key={item?.id} value={item?.id}>
                                {item?.name}
                            </Select.Option>
                        )}
                    </Select>
                )}
            </Col>

            <Col span={24}>
                <Table
                    dataSource={approveProcedures}
                    columns={columns}
                    className="tb-click-row"
                    onRow={(r) => ({
                        onClick: () =>{
                            setRecordShowDetail(r)} ,
                    })}
                    pagination={{
                        pageSize: pagination.page_size,
                        current: pagination.page_num,
                        onChange: handleGetPenddingProcedures,
                        total: totalProcedures,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50],
                    }}
                    scroll={{ x: 2000 }}
                    />
            </Col>

          

            {/* Xem tiến trình  */}
            {isRecordShowProcessing && (
                <ProcedureProcessing
                    record={isRecordShowProcessing}
                    onCancel={() => {
                        setRecordShowProcessing(null);
                    }}
                />
            )}

            {/* Xuất pdf */}
            {dataExport && (
                <ExportPdfModal
                    data={dataExport}
                    onCancel={() => setDataExport(null)}
                />
            )}

            {/* từ chối đề xuất*/}
            {isIsReject && (
                <RejectProcedureModal
                    onCancel={() => setIdReject(null)}
                    onRejection={(description) => {
                        handleApprovePaymentProcedure(isIsReject, STATUS.REFUSE, { description });
                        setIdReject(null);
                    }}
                />
            )}

            {/* chi tiết bản ghi */}
            {isRecordShowDetail && (
                <ProcedureDetailModal
                    onCancel={() => setRecordShowDetail(null)}
                    record={isRecordShowDetail}
                />
            )}

        </Row>
    )
}
export default ApproveProcedureTT
