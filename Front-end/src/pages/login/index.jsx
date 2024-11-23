import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin, callLoginFromGG } from '../../services/api';
import './login.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../features/account/accountSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
const LoginPage = (props) => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const redirectUrl = location.state?.redirectUrl;
    const id = location.state?.id;
    const onFinish = async (values) => {
        const url = redirectUrl + id
        const { email, password } = values;
        setIsSubmit(true);
        const res = await callLogin(email, password);
        setIsSubmit(false);
        if (res?.data) {
            //lưu trữ access token trên localStorage
            localStorage.setItem('accessToken', res.data.accessToken);
            // trang thái đăng nhập
            dispatch(doLoginAction(res?.data?.user))
            message.success('Đăng nhập tài khoản thành công!');
            if (url) {
                navigate(url)
            }
            else {

                navigate('/')
            }
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    const handleLoginSuccessFromGG = async (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        const url = redirectUrl + id
        setIsSubmit(true);
        const res = await callLoginFromGG(decoded.email, decoded.name, decoded.picture);
        if (res?.data) {
            //lưu trữ access token trên localStorage
            localStorage.setItem('accessToken', res.data.accessToken);
            // trang thái đăng nhập
            dispatch(doLoginAction(res?.data?.user))
            message.success('Đăng nhập tài khoản thành công!');
            if (url) {
                navigate(url)
            }
            else {

                navigate('/')
            }
        }
        setIsSubmit(false);
    }
    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            //style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                            <div style={{ margin: '30px 0' }}>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => handleLoginSuccessFromGG(credentialResponse)}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    auto_select
                                    flow='auth-code'
                                />
                            </div>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;
