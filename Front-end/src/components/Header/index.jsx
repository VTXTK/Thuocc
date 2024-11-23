import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Popover, Avatar, AutoComplete, Input, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import { callAddProduct, callAllProduct, callLogout, callSearchProduct } from '../../services/api';
import './header.scss';
import '../button.scss'
import { doLogoutAction } from '../../features/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from '../Profile/ManageAccount';





const Header = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.order.carts)
    const userCarts = carts.filter(cart => cart.idUser === user?.id)
    const [options, setOptions] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const url = window.location.pathname;
    const id = window.location.search

    const onClick = () => {
        if (user.id === '') {
            navigate('/login', { state: { redirectUrl: url, id: id } });
        }
        else {
            navigate('/order')
        }
    }
    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }
    const contentPopover = () => {
        return (
            <div className='pop-carts-body'>
                <div className='pop-carts-content'>
                    {
                        carts?.map((product, index) => {
                            return (
                                user.id === product.idUser &&
                                <div className='product' key={`product-${index}`}>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${product.detail.thumbnail}`} />
                                    <div>{product.detail.drugName}</div>
                                    <div className='price'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product?.detail?.sellingPrice ?? 0)}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='pop-carts-footer'>
                    <button className='button-antd' onClick={() => {
                        navigate('/order')
                    }}>Xem giỏ hàng</button>
                </div>
            </div>
        )
    }
    const optionSearch = (e) =>
        e.map(item => {
            return {
                value: `${item.drugName}?id=${item._id}`,
                label: (
                    <div style={{ display: 'flex', gap: '5px', width: '650px' }} key={`product-${item}`}>
                        <div style={{ height: 70, width: 70 }}><img style={{ height: '70px', width: '70px' }} src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`} /></div>
                        <div style={{ marginTop: '15px', marginLeft: '10px' }}>
                            <div style={{ width: '650px' }}>{item.drugName}</div>
                            <div >
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sellingPrice ?? 0)}
                            </div>
                        </div>
                    </div>
                )
            }
        })
    const onSelect = (value) => {
        navigate(`/product/${value}`)
    };
    const onSearch = async (e) => {
        if (e.length > 0) {
            let query = ''
            query = `drugName=${e}`
            const res = await callAllProduct(query)
            if (res && res.data) {
                setOptions(optionSearch(res.data.product))
            }
        }
    }


    const [isModalOpen, setIsModalOpen] = useState(false)
    let items = [
        {
            label: <label onClick={() => setIsModalOpen(true)}> Quản lý tài khoản </label>,
            key: 'account',
        },

        {
            label: <Link to='history' >Lịch sử mua hàng</Link>,
            key: 'history'
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'><Col md={24} sm={0} xs={0} hidden={['sm', 'xs']}> Trang quản trị</Col></Link>,
            key: 'admin'
        })
    }
    let avatar = ''
    if (user?.avatar) {
        avatar = user?.avatar
    }
    else {
        avatar = 'avatar.png'
    }
    let urlAvatar = ''
    //urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${avatar}`
    if (avatar.includes('https://lh3.googleusercontent.com')) {
        urlAvatar = avatar
    }
    else {
        urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${avatar}`
    }
    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span> <a href='/'><img src={`${import.meta.env.VITE_BACKEND_URL}/images/logo/logo.png`} style={{ height: "50px", marginTop: "40px" }} /></a></span>
                            </span>
                            <Col md={24} sm={24} xs={24}>
                                <AutoComplete
                                    popupMatchSelectWidth={'100%'}
                                    style={{ width: "70%", marginLeft: '10%', marginTop: '25px' }}
                                    options={options}
                                    onSelect={onSelect}
                                    onSearch={onSearch}
                                    placeholder='Hãy cho tôi biết tên sản phẩm mà bạn muốn tìm...'

                                >
                                </AutoComplete>
                            </Col>
                        </div>

                    </div>
                    <div  >
                        <Row md={24} id="navigation" className="navigation">
                            <Col className="navigation__item shopping-cart"  >
                                <Popover
                                    className='popover-carts'
                                    placement='topRight'
                                    rootClassName='popover-carts'
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}
                                >
                                    <Badge
                                        count={userCarts?.length ?? 0}
                                        size={"small"}

                                        showZero
                                    >
                                        <div onClick={onClick}>
                                            < FiShoppingCart className='icon-cart' />
                                        </div>

                                    </Badge>

                                </Popover>
                            </Col>
                            <Col className="navigation__item navigation__none" style={{ padding: 0 }} ><Divider type='vertical' /></Col>
                            <Col className="navigation__item " sm={0} xs={0} hidden={['xs']}>
                                <Col className="user-col" >
                                    {!isAuthenticated ?
                                        <span onClick={() => navigate('/login')} className='text'><UserOutlined /> Tài Khoản</span>
                                        :
                                        <Dropdown menu={{ items }} trigger={['click']}>
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    <Avatar src={urlAvatar} />
                                                    <div className='text'>{user?.fullName}</div>
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    }
                                </Col>
                            </Col>

                        </Row>
                    </div>
                </header>
            </div >
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <li className="navigation__item mobile">
                    {!isAuthenticated ?
                        <span onClick={() => navigate('/login')}> Đăng nhập</span>
                        :
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar src={urlAvatar} />
                                    {user?.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    }
                </li>

                <Divider />
            </Drawer>
            <ManageAccount
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
            />
        </>
    )
};

export default Header;
