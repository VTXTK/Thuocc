import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCardFilled, LoadingOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Divider, Form, Input, InputNumber, Radio, message, notification, Col, Row, Empty } from 'antd';
import './history.scss'
import moment from 'moment';
import { useLocation } from 'react-router-dom';
const ViewDetailHistoryPage = () => {
    const location = useLocation()
    let data = location.state?.order
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="history-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={16} xs={24}>
                        <div className='billing-information' >
                            <Row span={24}>
                                <Col span={20}>
                                    <div className='dateOrder'>Đơn hàng ngày {moment(data?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                </Col>
                                <Col span={4}><div className='stateOrder'>{data.state}</div></Col>
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
                                data?.detail.map((item) => {
                                    return (
                                        <div>
                                            <Row gutter={20} >
                                                <Col span={4}><img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`} alt="thumbnail product" style={{ width: 70, height: 70, marginLeft: 30 }} /></Col>
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
                    </Col>
                    <Col md={8} xs={24} style={{ padding: '0 30px' }}>
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
            </div>
        </div >
    )
}
export default ViewDetailHistoryPage;