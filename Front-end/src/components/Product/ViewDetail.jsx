import { Row, Col, Rate, Divider, Button, message, Anchor, Tabs } from 'antd';
import './product.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PhoneOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import ProductLoader from './ProductLoader';
import { useDispatch, useSelector } from 'react-redux';
import { doAddProductAction } from '../../features/order/orderSlice';
import { useNavigate } from 'react-router-dom';


const ViewDetail = (props) => {
    const { dataProduct } = props
    const images = dataProduct?.items ?? []
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const refGallery = useRef(null);
    const [active, setActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0)
    const [listChecked, setListChecked] = useState([])
    // Lưu url vào state 

    const user = useSelector(state => state.account.user)
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }
    const url = window.location.pathname;
    const id = window.location.search
    const handleAddToCart = (quantity, product) => {
        if (user.id === '') {
            navigate('/login', { state: { redirectUrl: url, id: id } });
        }
        else {
            dispatch(doAddProductAction({ quantity, detail: product, _id: product._id, idUser: user.id }))
        }
    }
    const handleAddToPayment = (quantity, product) => {
        if (user.id === '') {
            navigate('/login', { state: { redirectUrl: url, id: id } });
        }
        else {
            dispatch(doAddProductAction({ quantity, detail: product, _id: product._id, idUser: user.id }))
            console.log("dataProduct", dataProduct)
            navigate('/order', { state: { dataProduct: { quantity, detail: product, _id: product._id, idUser: user.id } } })
        }
    }
    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) {
                return
            }
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataProduct.quantity) {
                return
            }
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && value < +dataProduct.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }

    const description = () => {
        return (
            <div>
                <div>
                    <div className='title-tap'>Thành phần</div>
                    <div className='content-tap'>{dataProduct.drugIngredients}</div>
                </div>
                <div>
                    <div className='title-tap'>Công dụng</div>
                    <div className='content-tap'><p >{dataProduct.drugUses}</p></div>
                </div>
                <div>
                    <div className='title-tap'>Hướng dẫn sử dụng</div>
                    <div className='content-tap'><p >{dataProduct.howToUseDrug}</p></div>
                </div>
                <div >
                    <div className='title-tap'>Nguồn góc</div>
                    <div className='content-tap'><p >{dataProduct.drugOrigin}</p></div>
                </div>
                <div>
                    <div className='title-tap'>Nhà sản xuất</div>
                    <div className='content-tap'><p >{dataProduct.manufacturersName}</p></div>
                </div>
            </div>

        )
    }
    const information = () => {
        return (
            <div>
                <Row gutter={[20, 20]} style={{ margin: '10px' }}>
                    <Col md={4} sm={0} xs={12} ><div className='title-tap'>Tên thuốc</div></Col>
                    <Col md={8} sm={0} xs={12}><div className='content-tap info'>{dataProduct.drugName}</div></Col>
                </Row>
                <Row gutter={[20, 20]} style={{ margin: '10px' }}>
                    <Col md={4} sm={0} xs={12}><div className='title-tap'>Phân loại</div></Col>
                    <Col md={8} sm={0} xs={12}><div className='content-tap info' >{dataProduct.drugGroupName}</div></Col>
                </Row>
                <Row gutter={[20, 20]} style={{ margin: '10px' }}>
                    <Col md={4} sm={0} xs={12}><div className='title-tap'>Đơn vị tính</div></Col>
                    <Col md={8} sm={0} xs={12}><div className='content-tap info'>{dataProduct.unitName}</div></Col>
                </Row>
                <Row gutter={[20, 20]} style={{ margin: '10px' }}>
                    <Col md={4} sm={0} xs={12}><div className='title-tap'>Số lượng còn</div></Col>
                    <Col md={8} sm={0} xs={12}><div className='content-tap info'>{dataProduct.quantity}</div></Col>
                </Row>
            </div>
        )
    }
    const items = [
        {
            label: 'Mô tả',
            key: 'description',
            children: (description()),
        },
        {
            label: 'Thông tin sản phẩm',
            key: 'information',
            children: (information()),
        },
        {
            label: 'Thương hiệu',
            key: 'trademark',
            children: `Content of Tab Pane 3`,
        },

    ]
    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ background: '#fff', borderRadius: 5 }}>
                    {dataProduct && dataProduct._id ?
                        <Row gutter={[100, 20]}>
                            <Col md={10} sm={0} xs={0} style={{ marginLeft: '3%' }}>
                                <ImageGallery

                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>} //right arrow === <> </>
                                    slideOnThumbnailOver={true} //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()} />
                            </Col>
                            <Col md={12} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        className="my-gallery"
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>} //right arrow === <> </>
                                        showThumbnails={false} />
                                </Col>
                                <Col span={24} style={{ marginTop: "7%" }}>
                                    <div className='title'>{dataProduct.drugName}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Đã bán {dataProduct.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataProduct.sellingPrice)}
                                        </span>
                                        <br />
                                        <span className='sale'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataProduct.sellingPrice / 90 * 100)}</span>

                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left-side'>Vận chuyển</span>
                                            <span className='right-side'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-side'>Số lượng</span>
                                        <span className='right-side'>
                                            <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                            <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                            <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button >
                                        </span>
                                    </div>
                                    {
                                        dataProduct.quantity !== 0 && dataProduct.drugGroupName !== 'Thuốc' &&
                                        <div className='buy'>
                                            <button className='cart' onClick={() => handleAddToCart(currentQuantity, dataProduct)}>
                                                <BsCartPlus className='icon-cart' />
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                            <button className='now' onClick={() => handleAddToPayment(currentQuantity, dataProduct)} > <ShoppingCartOutlined />   Mua ngay</button>
                                        </div>
                                    }
                                    {
                                        dataProduct.drugGroupName === 'Thuốc' &&
                                        <div className='buy'>
                                            <button className='now' > <PhoneOutlined /> Liên hệ bác sĩ</button>
                                        </div>
                                    }
                                    {
                                        dataProduct.quantity === 0 &&
                                        <div><h1 style={{ color: "red", marginTop: "6%" }}>SOLD OUT</h1></div>
                                    }
                                </Col>
                            </Col>
                        </Row>
                        :
                        <ProductLoader />}
                </div>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5, marginTop: "20px" }}>

                    <Tabs
                        defaultActiveKey="1"
                        type="card"
                        items={items}
                    />

                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataProduct?.name}
            />
        </div >
    )
}

export default ViewDetail;