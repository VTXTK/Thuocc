import { Row, Col, Tabs, Divider, Button, Empty } from 'antd';
import './history.scss'
import { callAllOrder, callDetailProduct, callUpdateProduct, callUploadStateOrder } from '../../services/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigate } from "react-router-dom";
const HistoryOrderPage = () => {
    const user = useSelector(state => state.account.user)
    const navigate = useNavigate()
    const [selectedOrder, setSelectedOrder] = useState(null);
    //const [form] = Form.useForm();
    const [listOrder, setlistOrder] = useState([]);
    const [sortQuery, setSortQuery] = useState('sort=-createdAt')
    // const [isLoading, setIsLoading] = useState(false)
    // const [filter, setFilter] = useState("");
    useEffect(() => {
        fetchOrder();
    }, [sortQuery]);
    const fetchOrder = async () => {
        let query = `idUser=${user.id}`
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callAllOrder(query);
        if (res && res.data) {
            setlistOrder(res.data);
        }

    }
    useEffect(() => {
        if (selectedOrder) {
            navigate('/detailHistory', { state: { order: selectedOrder } })
        }
    }, [selectedOrder])
    const items = [
        {
            key: 'sort=-createdAt',
            label: `Tất cả`,
            children: <></>,
        },
        {
            key: 'state=Đang xử lý',
            label: `Đang xử lý`,
            children: <></>,
        },
        {
            key: 'state=Đang chờ vận chuyển',
            label: `Đang chờ vận chuyển`,
            children: <></>,
        },
        {
            key: 'state=Đang giao',
            label: `Đang giao`,
            children: <></>,
        },
        {
            key: 'state=Đã giao',
            label: `Đã giao`,
            children: <></>,
        },
        {
            key: 'state=Đã hủy',
            label: `Đã hủy`,
            children: <></>,
        },
    ];
    const handleCancelOrder = async (order) => {
        const _id = order._id
        const state = "Đã hủy"
        const res = await callUploadStateOrder(_id, { state: state })
        if (res && res?.data) {
            res?.data?.order?.detail?.map(async (item) => {
                const _id = item._id
                const product = await callDetailProduct(item._id)
                const sold = product.data.sold - item.quantity
                const quantity = product.data.quantity + item.quantity
                const res = await callUpdateProduct(_id, { sold: sold, quantity: quantity })
            })
            fetchOrder()
        }
    }
    return (

        <div style={{ background: '#efefef', padding: '20px 0' }} >
            <div className="history-container" style={{ maxWidth: 1440, margin: 10 }} >
                <Row span={16} gutter={[20, 20]}>
                    <Col md={24} xs={24} className='history-tabs'>
                        <Row style={{ background: "white", padding: 20, borderRadius: 10, width: "81%", margin: "0 auto" }}>
                            <Tabs
                                defaultActiveKey="sort=-createdAt"
                                items={items}
                                onChange={(value) => { setSortQuery(value) }}
                                style={{ overflowX: "auto" }}
                                className='name'
                            />
                        </Row>
                    </Col>
                    {listOrder?.map((item, index) => {
                        return (
                            <div style={{ width: "80%", margin: "0 auto" }}>
                                <Col md={24} xs={24} key={`index-${index}`} style={{ background: "white", padding: 20, borderRadius: 10 }}>
                                    <Row span={24} style={{ height: '40px' }}>
                                        <Col span={20} > <div className='dateOrder'>Đơn hàng : {moment(item?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div></Col>
                                        <Col span={4}><div className='stateOrder'>{item.state}</div></Col>
                                    </Row>
                                    <Divider />
                                    <Row>
                                        <Col span={4}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item?.detail[0].thumbnail}`} alt="thumbnail product" style={{ width: 70, height: 70, marginLeft: 30 }} /></Col>
                                        <Col span={12} style={{ marginTop: 10 }}>
                                            <div className='name'>{item.detail[0].productName}</div>
                                            <div className='product' style={{ marginTop: 10 }}>+{item.detail.length - 1} sản phẩm khác</div>

                                        </Col>
                                        <Col span={4}><div className='name margin_top' style={{ marginLeft: "40%" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail[0].sellingPrice)}</div></Col>
                                        <Col span={4}> <div className='product margin_top'> Số lượng: {item.detail[0].quantity}</div></Col>
                                    </Row>

                                    <Row style={{ marginTop: 20 }}>
                                        <Col span={16}><div className='name' style={{ marginLeft: 20 }} onClick={() => setSelectedOrder(item)}>Xem chi tiết</div></Col>
                                        <Col span={8}><div className='name' style={{ marginLeft: "20%" }}> Thành tiền: <span >{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</span></div></Col>
                                    </Row>
                                    <Divider />
                                    {
                                        item.state === "Đang xử lý" &&
                                        <Button onClick={() => handleCancelOrder(item)}> Hủy
                                        </Button>
                                    }
                                    {
                                        item.state === "Đã hủy" &&
                                        <Button >Mua lại
                                        </Button>
                                    }

                                </Col>
                            </div>
                        )
                    })}
                    {listOrder.length === 0 &&
                        <div className='order-product-empty' style={{ width: "77%", margin: "0 auto" }}>
                            <Empty description='Không có đơn hàng nào' />
                        </div>
                    }
                </Row>
            </div>
        </div >
    )
}

export default HistoryOrderPage