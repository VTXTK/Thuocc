import { Button, Result, Steps } from "antd";
import ViewOrder from "../../components/order/ViewOrder";
import { useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import './order.scss'
import PaymentOrder from "../../components/Order/Payment";
import { useLocation, useNavigate } from "react-router-dom";

const OrderPage = (props) => {
    const location = useLocation()
    let dataProduct = location.state?.dataProduct
    const [listChecked, setListChecked] = useState([])
    let number = 0
    if (dataProduct) {
        number = 1
    }
    const [currentStep, setCurrentStep] = useState(number)

    const navigate = useNavigate()
    return (
        <div style={{ background: '#efefef', padding: '20px 0' }} >
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }} >
                <div className="order-step">
                    <Steps
                        size="small"
                        current={currentStep}
                        status="finish"
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} setListChecked={setListChecked} listChecked={listChecked} />}
                {currentStep === 1 && <PaymentOrder setCurrentStep={setCurrentStep} listChecked={listChecked} setListChecked={setListChecked} dataProduct={dataProduct} />}
                {currentStep === 2 &&
                    <Result
                        icon={<SmileOutlined />}
                        title="Đơn hàng đặt thành công"
                        extra={<Button type="primary" onClick={() => navigate('/history')}>Xem đơn hàng </Button>}
                    />
                }
            </div>
        </div >
    )
}
export default OrderPage