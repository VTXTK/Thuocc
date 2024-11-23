import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../features/account/accountSlice';

const { Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />
    },
    {
        label: <label>Quản lý đơn hàng</label>,

        icon: <DollarCircleOutlined />,
        children: [
            {

                label: <label>Tất cả đơn hàng</label>,
                key: 'order',
            },
            {

                label: <label>Đơn hàng mới</label>,
                key: 'newOrder',

            },
            {

                label: <label>Đơn hàng đang chờ vận chuyển</label>,
                key: 'orderAwaitingShipping',

            },
            {

                label: <label>Đơn hàng đang vận chuyển</label>,
                key: 'orderTransport',

            },
            {

                label: <label>Đơn hàng thành công</label>,
                key: 'orderSuccess',

            },
            {

                label: <label>Đơn hàng đã hủy</label>,
                key: 'orderCancel',

            },

        ]
    },
    {
        label: <label>Quản lý người dùng</label>,
        // key: 'user',
        icon: <UserOutlined />,
        children: [
            {
                label: <Link to='/admin/customer'>Khách hàng</Link>,
                key: 'customer',
                icon: <TeamOutlined />,
            },
        ]
    },
    {
        label: <Link to='/admin/product'>Quản lý thuốc</Link>,
        key: 'product',
        icon: <ExceptionOutlined />
    },


];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        fetchActiveMenu()
    }, [activeMenu])
    const fetchActiveMenu = () => {
        if (activeMenu === 'order' || activeMenu === 'newOrder' || activeMenu === 'orderTransport' || activeMenu === 'orderSuccess' || activeMenu === 'orderCancel' || activeMenu === 'orderAwaitingShipping') {
            navigate('/admin/order', { state: { activeMenu: activeMenu } })
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
    const itemsDropdown = [
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
        {

            label: <Link to='/'> Trang chủ</Link>,
            key: 'layout'


        },

    ];


    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >
            <Sider
                width={250}
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    style={{ width: '100%' }}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <span style={{ fontWeight: 'bold' }}>Xin chào {user?.fullName}</span>
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content>
                    <Outlet />
                </Content>
                <Footer style={{ padding: 0 }}>
                    Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;