
import './admin.scss'
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
import { Col, Divider, InputNumber, Row, Empty, Checkbox, Space, Statistic, Card, DatePicker, Avatar } from 'antd';
import { DollarCircleOutlined, LineChartOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { callDataDashboard } from '../../services/api';
const AdminPage = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const [time, setTime] = useState(`${month}/${year}`)
    const [quaOrder, setQuaOrder] = useState(0)
    const [quaUser, setQuaUser] = useState(0)
    const [revenue, setRevenue] = useState(0)
    const [expectRevenue, setExpectRevenue] = useState(0)
    const [listOrder, setListOrder] = useState([])
    const topThreeOrders = listOrder?.slice(0, 3)
    useEffect(() => {
        fectData()
    }, [time])
    const fectData = async () => {
        const res = await callDataDashboard(`time=${time}`)
        if (res && res?.data) {
            const order = res?.data.order
            const user = res?.data.user
            setQuaOrder(order.length)
            setQuaUser(user.length)
            setListOrder(order)
            let totalPrice = 0
            let revenue = 0
            order?.map((item) => {
                totalPrice += item.totalPrice
                if (item.state === 'Đã giao') {
                    revenue += item.totalPrice
                }
            })
            setExpectRevenue(totalPrice)
            setRevenue(revenue)
        }

    }
    const onChange = (date, dateString) => {
        setTime(dateString)
    }
    // person images

    return (
        <div style={{ padding: '20px' }}>

            <div style={{ marginBottom: '20px' }}>
                <DatePicker
                    format={'MM/YYYY'}
                    picker="month"
                    placeholder={'Chọn tháng'}
                    onChange={onChange}
                />

            </div>

            <Row span={24} gutter={[20, 20]}>
                <Col span={6}>
                    <Card>
                        <Space>
                            <ShoppingCartOutlined
                                style={{
                                    color: "green",
                                    backgroundColor: "rgba(0,255,0,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                            <Statistic title={'Đơn hàng'} value={quaOrder} />
                        </Space>
                    </Card>
                </Col>

                <Col span={6}>
                    <Card>
                        <Space>
                            <UserOutlined
                                style={{
                                    color: "purple",
                                    backgroundColor: "rgba(0,255,255,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                            <Statistic title={'Khách hàng'} value={quaUser} />
                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Space>
                            <LineChartOutlined
                                style={{
                                    color: "orange",
                                    backgroundColor: "rgba(240,225,95,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                            <Statistic title={'Doanh thu dự kiến'} value={expectRevenue} />
                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Space>
                            <DollarCircleOutlined
                                style={{
                                    color: "red",
                                    backgroundColor: "rgba(255,0,0,0.25)",
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />

                            <Statistic title={'Doanh thu tháng'} value={revenue} />
                        </Space>
                    </Card>
                </Col>
            </Row>





            <Row gutter={[20, 20]}>

                <Col span={12}>
                    <Card style={{ marginTop: '20px', height: '300px' }}>
                        <div className="grid-one-item grid-common grid-c2">
                            <div className="grid-c-title">
                                <h3 className="grid-c-title-text" style={{ marginBottom: '20px' }}> Top 3 đơn hàng cao nhất tháng </h3>
                            </div>

                            <div className="grid-content">
                                <div className="grid-items">
                                    {

                                        topThreeOrders?.map((item) => {
                                            let avatar = ''
                                            if (item?.avatar) {
                                                avatar = item?.avatar
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
                                                <div className="grid-item" key={item.id}>
                                                    <div className="grid-item-l">
                                                        <div className="avatar img-fit-cover">
                                                            <Avatar src={urlAvatar} />
                                                        </div>
                                                        <p className="text">{item?.name} <span> {moment(item?.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span></p>
                                                    </div>
                                                    <div className="grid-item-r">
                                                        <span className="text-scarlet">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {topThreeOrders.length === 0 &&
                                        <div>
                                            <Empty description='Không có đơn hàng nào' />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <div style={{ height: '300px', padding: '10px', background: 'white', borderRadius: '5px', marginTop: '20px', alignItems: 'center' }}>
                        <DashboardChart time={time} />
                    </div>

                </Col>
            </Row>
        </div >
    )
}
function DashboardChart(props) {
    const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const { time } = props
    const [revenue, setRevenue] = useState([])
    const [i, year] = time.split('/')
    useEffect(() => {
        fectData()
    }, [time])
    const fectData = async () => {
        const requests = labels.map(async (item) => {
            const [z, month] = item.split(' ')
            const timeChart = `${month}/${year}`
            const res = await callDataDashboard(`time=${timeChart}`)

            let totalPrice = 0

            if (res && res?.data) {
                const order = res?.data.order

                order?.forEach((item) => {
                    if (item.state === 'Đã giao') {
                        totalPrice += item.totalPrice
                    }
                })
            }

            return totalPrice;
        });

        const revenues = await Promise.all(requests);
        setRevenue(revenues);
    }
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Doanh thu bán hàng',
            },
        },
    };
    const data = {
        labels,
        datasets: [
            {
                label: 'doanh thu',
                data: revenue,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
export default AdminPage;