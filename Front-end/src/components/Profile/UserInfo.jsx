import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Form, Input, Row, Upload, message, notification } from "antd"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { callUpdateAvatar, callUpdateUser } from "../../services/api"
import { doUpdateUserInfoAction, doUploadAvatarAction } from "../../features/account/accountSlice"
import { useNavigate } from "react-router-dom"

const UserInfo = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setIsModalOpen } = props
    const user = useSelector(state => state.account.user)

    const [form] = Form.useForm()

    const tempAvatar = useSelector(state => state.account.tempAvatar)
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
    const [isSubmit, setIsSubmit] = useState(false)
    let avatar = ''
    if (user?.avatar) {
        avatar = tempAvatar || user?.avatar
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
    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        const res = await callUpdateAvatar(file)
        if (res && res.data) {

            const newAvatar = res.data.fileUploaded;
            dispatch(doUploadAvatarAction({ avatar: newAvatar }))
            setUserAvatar(newAvatar)
            onSuccess('ok')
        }
        else {
            onError('Đã có lỗi khi upload file')
        }
    }
    const onFinish = async (values) => {
        const { fullName, phone } = values
        setIsSubmit(true)
        const newUser = {
            fullName: fullName,
            phone: phone,
            avatar: userAvatar
        }
        const res = await callUpdateUser(newUser, user?.id)
        if (res && res.data) {
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }));
            message.success("Cập nhật thông tin thành công")
            localStorage.removeItem('accessToken')
            setIsModalOpen(false)
        }
        else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onchange(info) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success('Upload file thành công')
            }
            if (info.file.status === 'error') {
                message.success('Upload file thất bại')
            }
        }
    }

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{ sx: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                icon={<AntDesignOutlined />}
                                src={urlAvatar}
                                shape="circle"
                            />
                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={< UploadOutlined />}>
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <div className="tabContent">
                            <div className="inputContainer">
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    initialValue={user?.email}

                                >
                                    <Input readOnly />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên hiển thị"
                                    name="fullName"
                                    initialValue={user?.fullName}
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={user?.phone}
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Cập nhật
                                </Button>

                            </div>

                        </div>
                    </Form>
                </Col>
            </Row>
        </div >
    )
}
export default UserInfo