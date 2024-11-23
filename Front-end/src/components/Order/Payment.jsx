import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Divider, Form, Input, InputNumber, Radio, message, notification, Col, Row, Empty, Space, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../features/order/orderSlice'
import { callDistrict, callPlaceOrder, callProvince, callUpdateProduct, callWard } from '../../services/api';
import { Option } from 'antd/es/mentions';
const PaymentOrder = (props) => {
    const user = useSelector(state => state.account.user)
    const { listChecked, setListChecked, dataProduct } = props
    const [totalPrice, setTotalPrice] = useState(0)
    const [isSubmit, setIsSubmit] = useState(false)
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [listProvinces, setListProvinces] = useState([]);
    const [listDistricts, setListDistricts] = useState([]);
    const [listWards, setListWards] = useState([]);
    useEffect(() => {
        fectProvince()
    }, [])
    const fectProvince = async () => {
        const res = await callProvince();
        if (res && res.data) {
            setListProvinces
            setListProvinces(res.data.results)
        }
    }

    const handleProvinceChange = async (idProvince, province) => {
        const res = await callDistrict(idProvince)
        if (res && res.data) {
            setListDistricts(res.data.districts)
        }
    };
    const handleDistrictChange = async (idDistrict, district) => {
        const res = await callWard(idDistrict)
        if (res && res.data) {
            setListWards(res.data.wards)
        }


    };
    const handleWardChange = async (idWard, ward) => {
        setWard(ward.label)
    };
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
    useEffect(() => {
        if (dataProduct) {
            setListChecked([...listChecked, dataProduct])
        }
    }, [dataProduct])

    const handleOnChangeInput = (value, product) => {
        if (!value || value < 1) return
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: product, _id: product._id }))
        }
    }
    const onFinish = async (values) => {
        setIsSubmit(true)
        const detailOrder = listChecked?.map(item => {
            return {
                productName: item.detail.drugName,
                thumbnail: item.detail.thumbnail,
                sellingPrice: item.detail.sellingPrice,
                quantity: item.quantity,
                updatedAt: item.detail.updatedAt,
                _id: item._id,
                productId: item?.detail.productId
            }
        })
        const addresss = `${values.address}, ${ward}, ${district}, ${province}`

        const data = {
            idUser: user.id,
            name: values.name,
            avatar: user.avatar,
            address: addresss,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder

        }

        const res = await callPlaceOrder(data)
        if (res && res.data) {
            message.success('Đặt hàng thành công')
            listChecked?.map(async item => {
                const _id = item._id
                const sold = item.detail.sold + item.quantity
                const quantity = item.detail.quantity - item.quantity
                const res = await callUpdateProduct(_id, { sold: sold, quantity: quantity, idUser: user.id })
            })
            dispatch(doPlaceOrderAction({ idUser: user.id, listChecked: listChecked }))
            props.setCurrentStep(2)
        }
        else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    }
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
                        <div className='background-order'>
                            <div >
                                <Row >

                                    <Col md={12} sm={24} xs={24}>
                                        <div className='checked-all' style={{ padding: '0 20px', width: '50%' }} >
                                            <span className='tilte-order'>Sản phẩm ({listChecked?.length})</span>
                                        </div>
                                    </Col>
                                    <Col md={12} sm={0} xs={0}>
                                        <div className='tilte-order' >
                                            <div> Đơn giá</div>
                                            <div>Số lượng</div>
                                            <div>Số tiền</div>
                                        </div>
                                    </Col>

                                </Row>
                            </div>
                            <Divider />
                            {listChecked?.map((product, index) => {
                                const currentProductPrice = product?.quantity * product?.detail?.sellingPrice ?? 0
                                return (
                                    <div>
                                        < div className='order-book' >

                                            <div className='book-content' style={{ width: '50%' }}>

                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${product?.detail?.thumbnail}`} />
                                                <div className='title'>
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
                                                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentProductPrice)}
                                                    </div>
                                                </Col>
                                            </div>

                                        </div>
                                        <Divider />
                                    </div>

                                )
                            })}
                            {listChecked.length === 0 &&
                                <div className='order-product-empty'>
                                    <Empty description='Không có sản phẩm trong giỏ hàng' />
                                </div>
                            }
                        </div>

                    </Col>
                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <Form
                                onFinish={onFinish}
                                form={form}
                                style={{ padding: '10px' }}
                            >
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Tên người nhận"
                                    name="name"
                                    initialValue={user?.fullName}
                                    rules={[{ required: true, message: 'Tên người nhận không được bỏ trống' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={user?.phone}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || value.length !== 10 || isNaN(value)) {
                                                    return Promise.reject('Số điện thoại phải là 10 số và không được chứa chữ');
                                                }
                                                if (!value.startsWith('0')) {
                                                    return Promise.reject('Số điện thoại phải bắt đầu bằng số 0');
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Chọn tỉnh/thành phố"
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    name="province"
                                    rules={[{ required: true, message: 'Tỉnh/thành phố không được bỏ trống' }]}
                                >
                                    <Select
                                        onChange={handleProvinceChange}
                                        placeholder="Chọn tỉnh/thành phố"
                                        options={listProvinces?.map((province) => ({ label: province?.full_name, value: province?.id, districts: province?.districts }))}
                                    >

                                    </Select>
                                </Form.Item>
                                <Form.Item name="district" label="Chọn quận/huyện" labelCol={{ span: 24 }} style={{ margin: 0 }} rules={[{ required: true, message: 'Quận/huyện không được bỏ trống' }]}>
                                    <Select
                                        onChange={handleDistrictChange}
                                        placeholder="Chọn quận/huyện"
                                        options={listDistricts?.map((district) => ({ label: district?.full_name, value: district?.id, wards: district?.wards }))}
                                    >

                                    </Select>
                                </Form.Item>
                                <Form.Item name="ward" label="Chọn phường/xã" labelCol={{ span: 24 }} style={{ margin: 0 }} rules={[{ required: true, message: 'Phường/xã không được bỏ trống' }]}>
                                    <Select
                                        placeholder="Chọn phường/xã"
                                        onChange={handleWardChange}
                                        options={listWards?.map((ward) => ({ label: ward?.full_name, value: ward?.id }))}
                                    >

                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[{ required: true, message: 'Địa chỉ không được bỏ trống' }]}>
                                    <TextArea
                                        autoFocus
                                        rows={4}
                                    />

                                </Form.Item>
                                <div className='info'>
                                    <div className='method'>
                                        <div>Hình thức thanh toán</div>
                                        <Radio checked> Thanh toán khi nhận hàng</Radio>
                                    </div>
                                </div>
                                <Divider style={{ margin: "5px 0" }} />
                                <div className='calculate'>
                                    <span>Tổng tiền</span>
                                    <span className='sum-final'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                    </span>
                                </div>
                                <Divider style={{ margin: "5px 0" }} />
                                {
                                    listChecked.length !== 0 &&
                                    <button onClick={() => form.submit()} disabled={isSubmit}>
                                        {isSubmit && <span><LoadingOutlined /></span>}
                                        Đặt hàng( {listChecked?.length ?? 0})
                                    </button>

                                }
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    )
}
export default PaymentOrder;