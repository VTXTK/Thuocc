import { Col, DatePicker, Descriptions, Drawer, Form, Row, Table, Tag } from "antd"
import './UserViewDetail.scss'
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { callAllOrder, callDetailOrder } from "../../../services/api";
import moment from 'moment';
const UserViewDetail1 = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [listOrder, setListOrder] = useState([])
    let total = 0
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    useEffect(() => {
        fectOrder()
    }, [dataViewDetail])
    let id = ''
    id = dataViewDetail?._id
    const fectOrder = async () => {
        let query = `idUser=${id}`
        const res = await callAllOrder(query)
        if (res && res?.data) {
            setListOrder(res)
        }
    }
    listOrder?.data?.map((item => {
        total += item.totalPrice
    }))
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
                            <Row gutter={[20, 20]} span={24}>
                                <Col span={24} className="total-history" >
                                    <div className="margin-Left">
                                        <div className="title-total" >Tổng đơn đã đặt</div>
                                        <div className="content-total">{listOrder?.data?.length || 0}</div>
                                    </div>
                                </Col>
                                <Col span={24} className="total-history" >
                                    <div className="margin-Left">
                                        <div className="title-total">Tông tiền</div>

                                        <div className="content-total">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</div>
                                    </div>
                                </Col>
                            </Row>
                            <Row span={24} >
                                <Col span={24} className="back-title">
                                    <Row span={24}>
                                        <Col span={24}>  <div className="title">Lịch sử sản phẩm đã mua</div></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={24}>

                                    <Row span={24} >
                                        <Col span={4} className="item">
                                            <div>Mã đặt hàng</div>
                                        </Col>
                                        <Col span={8} className="item">
                                            <div>Sản phẩm</div>
                                        </Col>
                                        <Col span={4} className="item">
                                            <div>Tổng tiền</div>
                                        </Col >
                                        <Col span={4} className="item">
                                            <div>Trạng thái</div>
                                        </Col>
                                        <Col span={4} className="item">
                                            <div>Ngày mua</div>
                                        </Col>
                                    </Row>
                                    {listOrder?.data?.map((item, index) => {
                                        console.log("item", item)
                                        return (
                                            <Row span={24} key={`index-${index}`} >
                                                <Col span={4} className="back-content "><div className="mdh">{item?.orderId}</div></Col>
                                                <Col span={8} className="back-content">
                                                    <div className="text drug-name">{item.detail[0].productName}</div>
                                                    <div className="product text" style={{ marginTop: "0%" }}>+{item.detail.length - 1} san pham khac</div>
                                                </Col>
                                                <Col span={4} className="back-content">
                                                    <div className="text product" >{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</div>
                                                </Col>
                                                <Col span={4} className="back-content">
                                                    <div className="text">
                                                        {item.state === 'Đang xử lý' && <Tag color="warning">{item?.state}</Tag>}
                                                        {item.state === 'Đã hủy' && <Tag color="red">{item?.state}</Tag>}
                                                        {item.state === 'Đã giao' && <Tag color="success">{item?.state}</Tag>}
                                                        {item.state === 'Đang chờ vận chuyển' && <Tag color="warning">{item?.state}</Tag>}
                                                        {item.state === 'Đang giao' && <Tag color="processing">{item?.state}</Tag>}
                                                    </div>
                                                </Col>
                                                <Col span={4} className="back-content">
                                                    <div className="text">
                                                        {moment(item?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Col>

                            </Row>

                        </Col>

                    </Row>
                </Form >

            </Drawer >
        </>
    )
}
export default UserViewDetail1