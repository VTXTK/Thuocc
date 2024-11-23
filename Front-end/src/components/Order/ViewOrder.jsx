import { Col, Divider, InputNumber, Row, Empty, Checkbox } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { current } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doUpdateCartAction } from '../../features/order/orderSlice'
const ViewOrder = (props) => {
    const user = useSelector(state => state.account.user)
    const carts = useSelector(state => state.order.carts)
    const userCarts = carts.filter(cart => cart.idUser === user?.id)
    const [totalPrice, setTotalPrice] = useState(0)
    const { listChecked, setListChecked } = props
    const dispatch = useDispatch()
    useEffect(() => {

        if (listChecked && listChecked.length > 0) {
            let sum = 0;
            listChecked.map(item => {
                sum += item?.quantity * item?.detail?.sellingPrice
            })
            setTotalPrice(sum)
        }
        else {
            setTotalPrice(0)
        }
    }, [listChecked])

    const handleOnChangeInput = (value, product) => {
        if (!value || value < 1) return
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: product, _id: product._id, idUser: user.id }))
        }
    }
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    };
    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            userCarts?.forEach((item) => {
                newListChecked.push(item)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        <div className='background-order'>
                            <Row>
                                <Col md={12} sm={24} xs={24}>
                                    <div className='checked-all' style={{ padding: '0 20px', width: '50%' }} >
                                        <Checkbox onChange={handleOnchangeCheckAll} style={{ marginTop: '10px' }} checked={listChecked?.length === userCarts?.length} ></Checkbox>
                                        <span style={{ marginLeft: '20px' }}>Chọn tất cả ({userCarts?.length})</span>

                                    </div>
                                </Col>
                                <Col md={12} sm={0} xs={0}>
                                    <div className='tilte-order' >
                                        <div> Đơn giá</div>
                                        <div>Số lượng</div>
                                        <div>Số tiền</div>
                                        <div>Thao tác</div>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />
                            {userCarts?.map((product, index) => {
                                const currentProductPrice = product?.quantity * product?.detail?.sellingPrice ?? 0
                                return (
                                    <div>
                                        < div className='order-book' >
                                            <div className='book-content' style={{ width: '50%' }}>
                                                <div style={{ width: '10%' }}>
                                                    <Checkbox onChange={onChange} style={{ marginTop: '25px' }} value={product} checked={listChecked.includes(product)}></Checkbox>
                                                </div>
                                                <div style={{ width: '30%' }}> <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${product?.detail?.thumbnail}`} /></div>
                                                <div className='title' style={{ width: '60%' }} >
                                                    <p> {product?.detail?.drugName}</p>
                                                </div>
                                            </div>
                                            <div className='action' >
                                                <div className='price'>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.detail?.sellingPrice)}
                                                </div>
                                                <div className='quantity'>
                                                    <InputNumber onChange={(value) => handleOnChangeInput(value, product)} value={product.quantity} />
                                                </div>
                                                <Col md={8} sm={0} xs={0}>
                                                    <div className='sum'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProductPrice)}
                                                    </div></Col>


                                            </div>
                                            <div className='delete'>
                                                <DeleteOutlined
                                                    style={{ cursor: "pointer", marginTop: "15px" }}
                                                    onClick={() => dispatch(doDeleteItemCartAction({ _id: product._id }))}
                                                    twoToneColor="#eb2f96"
                                                />
                                            </div>
                                        </div>
                                        <Divider />
                                    </div>

                                )
                            })}
                            {userCarts.length === 0 &&
                                <div className='order-product-empty'>
                                    <Empty description='Không có sản phẩm trong giỏ hàng' />
                                </div>
                            }
                        </div>


                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>  Tạm tính</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span> Tổng tiền</span>
                                <span className='sum-final'> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button onClick={() => props.setCurrentStep(1)}>Mua Hàng</button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    )
}

export default ViewOrder;