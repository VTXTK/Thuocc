import React, { useEffect, useState } from 'react';
import { Table, Row, Col, message, notification, Popconfirm, Button, DatePicker } from 'antd';
//import InputSearch from './InputSearch';
import { callAllOrder, callDeleteOrder, callUploadStateOrder } from '../../../services/api';
import { DeleteTwoTone, EditTwoTone, ReloadOutlined } from "@ant-design/icons"
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import OrderBill from './OrderBill';
import InputSearch from './InputSearch';
import OrderViewDetail from './OrderViewDetail';
const OrderTable = () => {
    const [listOrder, setlistOrder] = useState([]);
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [dataOrder, setDataOrder] = useState('')
    const [openModalBill, setOpenModalBill] = useState(false)
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('')
    const [date, setDate] = useState('')
    const location = useLocation()
    let activeMenu = location.state?.activeMenu
    useEffect(() => {
        fetchOrder();
    }, [activeMenu, current, pageSize, filter, sortQuery, date]);
    const fetchOrder = async () => {
        let query = ''
        if (activeMenu === 'newOrder') {
            query = 'state=Đang xử lý'
        }
        if (activeMenu === 'orderAwaitingShipping') {
            query = 'state=Đang chờ vận chuyển'
        }
        if (activeMenu === 'orderTransport') {
            query = 'state=Đang giao'
        }
        if (activeMenu === 'orderSuccess') {
            query = 'state=Đã giao'
        }
        if (activeMenu === 'orderCancel') {
            query = 'state=Đã hủy'
        }
        if (filter) {
            query += `&${filter}`;
        }
        if (date) {
            query += `&${date}`;
        }
        const res = await callAllOrder(query);
        if (res && res.data) {
            setlistOrder(res.data);

        }
    }
    const handleDelete = async (idOrder) => {
        const res = await callDeleteOrder(idOrder)
        if (res && res.data) {
            message.success("Xóa thành công")
            fetchOrder()
        }
        else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }


    }
    const handleSearch = (query) => {
        setFilter(query)
    }
    const onChange = (date, dateString) => {
        setDate(`createdAt=${dateString}`)
    }
    const handleConfirm = async (idOrder, stated) => {
        const _id = idOrder
        const state = stated

        const res = await callUploadStateOrder(_id, { state: state })
        if (res && res.data) {
            message.success("Xác nhận thành công")
            if (activeMenu === 'orderAwaitingShipping') {
                setOpenModalBill(true)
                setDataOrder(res.data.order)
            }
        }
        fetchOrder()
    }
    // const res = callAllUser();

    // // if(res && res.data){

    // // }
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 40,
            render: (text, record, index) => index + 1
        },
        {
            title: 'ID',
            dataIndex: 'orderId',
            render: (text, record, inde) => {
                return (
                    <a href='#' onClick={() => {
                        setDataOrder(record)
                        setOpenViewDetail(true)
                    }}>{record.orderId}
                    </a>
                )
            },
            align: 'center',
            sorter: true
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name', align: 'center',
            width: 80,

        },
        {
            title: 'Ngày mua',
            dataIndex: 'createdAt', align: 'center',
            sorter: true,
            render: (date) => {
                return moment(date).format('DD/MM/YYYY');
            }
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address', align: 'center',
            sorter: true,
            width: 150,
        },
        {
            title: 'Số điện thoại', align: 'center',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice', align: 'center',
            sorter: true,
            width: 150,
            render: (price) => {
                return <div className='priceAdmin'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </div>
            }
        },
        // {
        //     title: 'Chi tiết đơn hàng',
        //     dataIndex: 'detail',
        //     sorter: true
        // },
        {
            title: 'Action', align: 'center',
            render: (text, record, index) => {
                return (
                    <div>
                        {
                            activeMenu === 'newOrder' &&
                            <Button type='primary' onClick={() => handleConfirm(record._id, "Đang chờ vận chuyển")}>
                                Xác nhận
                            </Button>
                        }
                        {
                            activeMenu === 'orderAwaitingShipping' &&
                            <Button type='primary' onClick={() => handleConfirm(record._id, "Đang giao")}>
                                Vận chuyển
                            </Button>
                        }
                        {
                            activeMenu === 'orderTransport' &&
                            <Button type='primary' onClick={() => handleConfirm(record._id, "Đã giao")}>
                                Giao thành công
                            </Button>
                        }
                    </div>
                )
            }

        },

    ];
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Danh sách đơn hàng </span>

                <span style={{ display: 'flex', gap: 15 }}>
                    <DatePicker
                        format={'DD/MM/YYYY'}
                        placeholder={'Chọn ngày'}
                        onChange={onChange}
                    />
                    <Button type='ghost' onClick={() => {
                        setFilter("")
                        setSortQuery("")
                        setDate("")
                    }} ><ReloadOutlined /></Button>
                </span>
            </div>
        )
    }
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
                </Col>
                {/* <Col span={24}>
                    <button onClick={setOpenModalCreate}>thêm mới</button>
                </Col> */}
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        className='def'
                        columns={columns}
                        dataSource={listOrder}
                        rowKey="_id"
                    />
                </Col>
            </Row>
            <OrderBill
                openModalBill={openModalBill}
                setOpenModalBill={setOpenModalBill}
                dataOrder={dataOrder}
            />
            <OrderViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataOrder={dataOrder}
                setDataOrder={setDataOrder}
            />
        </>
    )

}


export default OrderTable