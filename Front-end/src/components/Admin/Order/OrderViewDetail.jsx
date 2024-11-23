import { Col, DatePicker, Descriptions, Divider, Drawer, Form, Row, Table, Tag } from "antd"
import './OrderViewDetail.scss'
import { CreditCardFilled, ShopOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { callAllOrder, callDetailOrder } from "../../../services/api";
import moment from 'moment';
const OrderViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataOrder, setDataOrder } = props;
    const [listOrder, setListOrder] = useState([])
    console.log('data', dataOrder)
    const data = dataOrder
    const onClose = () => {
        setOpenViewDetail(false);
        setDataOrder(null);
    }
    useEffect(() => {
        fectOrder()
    }, [dataOrder])
    let id = ''
    id = data?._id
    const fectOrder = async () => {
        let query = `idUser=${id}`
        const res = await callAllOrder(query)
        if (res && res?.data) {
            setListOrder(res)
        }
    }
    return (
        < >
            <Drawer

                title="Chức năng xem chi tiết "
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}

            >
                <Form span={24}>
                    <Row gutter={[24, 24]} span={24}>
                        <Col span={24}>
                            <div className='billing-information' >
                                <Row span={24}>
                                    <Col span={20}>
                                        <div className='dateOrder'>Đơn hàng ngày {moment(data?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                    </Col>
                                    <Col span={4}><div className='stateOrder'>{data?.state}</div></Col>
                                </Row>
                                <Divider style={{ margin: '0px' }} />
                                <Row>
                                    <div>
                                        <div className='name'>Địa chỉ nhận hàng </div>
                                        <div className='margin_top'>{data?.address}</div>
                                    </div>
                                </Row>
                                <Divider style={{ margin: '0px' }} />
                                <Row>
                                    <Col span={12} >
                                        <div className='name '> <UserOutlined /> Thông tin người nhận</div>
                                        <div className='name  margin_top '>{data?.name}</div>
                                        <div>{data?.phone}</div>

                                    </Col>
                                    <Col span={12}>
                                        <div className='name'><ShopOutlined /> Được gửi từ</div>
                                        <div className=' margin_top'>Nhà thuốc <span className='name'>Healthy-Med</span></div>
                                    </Col>
                                </Row>
                            </div>
                            <div className='name' style={{ margin: '20px' }}>Danh sách sản phẩm</div>
                            <div className='billing-information' >
                                {
                                    data?.detail?.map((item) => {
                                        return (
                                            <div>
                                                <Row gutter={24} >
                                                    <Col span={4}><img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`} alt="thumbnail product" style={{ width: 70, height: 70 }} /></Col>
                                                    <Col span={12}> <div className='name margin_top'>{item?.productName}</div></Col>
                                                    <Col span={4}><div className='name margin_top'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.sellingPrice)}</div></Col>
                                                    <Col span={4}><div className='product margin_top'>Số lượng : x{item.quantity} </div></Col>
                                                </Row>
                                                <Divider />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='billing-information'>
                                <Row><div className='dateOrder'>Thông tin thanh toán</div></Row>
                                <Row>
                                    <Col span={16}><div className='product'>Tổng tiền</div></Col>
                                    <Col ><div className='name'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.totalPrice)}</div></Col>
                                </Row>
                                <Row>
                                    <Col span={16}><div className='product'>Giảm giá</div></Col>
                                    <Col ><div className='name'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</div></Col>
                                </Row>
                                <Row>
                                    <Col span={16}><div className='product'>Phí vận chuyển</div></Col>
                                    <Col><div className='name'>Miễn phí</div></Col>
                                </Row>
                                <Divider style={{ margin: '0px' }} />
                                <Row>
                                    <Col span={16}><div className='product'>Thành tiền</div></Col>
                                    <Col><div className='name price'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data?.totalPrice)}</div></Col>
                                </Row>
                                <Divider style={{ margin: '0px' }} />
                                <Row>
                                    <Col span={16}><div className='name'>Phương thức thanh toán</div></Col>
                                    <Col><div>Đã thanh toán</div></Col>
                                </Row>
                                <Row>
                                    <CreditCardFilled style={{ marginRight: '10px', marginTop: '4px' }} /> <div className='name' >Thanh toán bằng tiền mặt</div>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </Form >

            </Drawer >
        </>
    )
}
export default OrderViewDetail