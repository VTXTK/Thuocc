import React, { useState } from 'react';
import { Divider, Form, Input, message, Modal, notification } from 'antd';
import { callRegister } from '../../../services/api';
const NewUser = (props) => {
    const { openModalCreate, setOpenModalCreate, fetchUser } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        setIsSubmit(true);
        const { fullName, email, password, phone } = values;
        console.log('value', values)
        const res = await callRegister(fullName, email, password, phone);
        if (res?.data) {
            message.success('Đăng ký tài khoản thành công!');
            setOpenModalCreate(false)
            fetchUser()
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false)
    };



    return (
        <>

            <Modal
                title="Thêm mới mới người dùng"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => { setOpenModalCreate(false), form.resetFields(); }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                //do not close when click fetchBook
                maskClosable={false}
            >
                <Divider />

                <Form
                    name="basic"
                    // style={{ maxWidth: 600, margin: '0 auto' }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Email không được để trống!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && !value.endsWith('@gmail.com') && !value.endsWith('@email.com')) {
                                        return Promise.reject('Email phải có đuôi @gmail.com hoặc @email.com');
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
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
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="phone"
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
                    <Divider>Or</Divider>

                </Form>
            </Modal>

        </>
    );
};

export default NewUser;