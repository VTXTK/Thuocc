import './Order.scss'
import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, QRCode, Row, Select, Space, Upload } from 'antd';
const OrderBill = (props) => {
    const { openModalBill, setOpenModalBill, dataOrder } = props;

    const [form] = Form.useForm();
    let stt = 0, price = 0, total = 0, sl = 0
    return (
        <>
            <Modal

                open={openModalBill}
                onOk={() => { form.submit() }}
                onCancel={() => { setOpenModalBill(false), form.resetFields(); }}

                okText={"In"}
                cancelText={"Hủy"}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Form
                    form={form}
                    name="basic"
                    autoComplete="off"
                >
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <Row>
                                <Col span={18}>
                                    <div><img src={`${import.meta.env.VITE_BACKEND_URL}/images/logo/logo.png`} style={{ height: "50px" }} /></div>
                                    <div style={{ marginTop: '10px' }}><span>Địa chỉ: </span>127/14,Hoàng Hoa Thám,P13,Quận Tân Bình,TP HCM</div>
                                </Col>
                                <Col span={6}>

                                    <div>Địa chỉ trang web</div>
                                    <div style={{ margin: '10px' }} ><QRCode value='http://localhost:3000/' size={90} /></div>
                                    <div>MaHD: {dataOrder?.orderId}</div>
                                </Col>
                            </Row>
                            <Divider />
                            <Col span={24}>
                                <div>Người nhận: <span>{dataOrder?.name}</span></div>
                                <div>Số điện thoại: <span>{dataOrder?.phone}</span></div>
                                <div>Địa chỉ: <span>{dataOrder?.address}</span></div>
                                <div>Ghi chú : <span></span></div>
                            </Col>
                            <Divider />
                            <Col span={24} >

                                <table style={{ alignItems: 'center' }}>
                                    <tr>
                                        <td style={{ width: '7%' }}><div>STT </div></td>
                                        <td><div>MaSP</div></td>
                                        <td style={{ width: '40%' }}><div>tên sản phẩm</div></td>
                                        <td><div>Số lượng</div></td>
                                        <td><div>Đơn giá</div></td>
                                        <td><div>Tổng</div></td>
                                    </tr>
                                    {
                                        dataOrder?.detail?.map((item) => {
                                            stt += 1
                                            price = item?.sellingPrice * item?.quantity
                                            total += price
                                            sl += item?.quantity
                                            return (
                                                <tr>
                                                    <td><div>{stt}</div></td>
                                                    <td><div>{item?.productId}</div></td>
                                                    <td className='text-left'><div>{item?.productName}</div></td>
                                                    <td><div>{item?.quantity}</div></td>
                                                    <td className='text-right'><div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.sellingPrice ?? 0)}</div></td>
                                                    <td className='text-right'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price ?? 0)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><div>[{sl}]</div></td>
                                        <td className='text-right'><div>Tạm tính</div></td>
                                        <td className='text-right'> <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total ?? 0)}</div></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='text-right'><div>Giảm</div></td>
                                        <td className='text-right'><div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0)}</div></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='text-right'><div>Tổng tiền</div></td>
                                        <td className='text-right'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataOrder?.totalPrice ?? 0)}</td>
                                    </tr>
                                </table>
                            </Col>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default OrderBill;