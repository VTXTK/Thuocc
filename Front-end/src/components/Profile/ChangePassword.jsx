import { Button, Form, Input, message, notification } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { callChangePassword } from "../../services/api"

const ChangePassword = (props) => {
    const user = useSelector(state => state.account.user)
    const { setIsModalOpen } = props
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false)
    console.log("user ", user)

    const onFinish = async (values) => {
        const { oldpass, email, newpass } = values
        setIsSubmit(true)
        const newPass = {
            password: oldpass,
            email: email,
            newpass: newpass
        }
        const res = await callChangePassword(newPass)
        if (res && res.data) {

            message.success("Cập nhật thông tin thành công")
            setIsModalOpen(false)
            form.setFieldValue("oldpass", "")
            form.setFieldValue("newpass", "")
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
        <div>
            <Form
                onFinish={onFinish}
                form={form}
                autoComplete="off"
                name="basic"
            >

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
                    label="Mật khẩu hiện tại"
                    name="oldpass"
                    rules={[{ required: true, message: 'Password không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Mật khẩu mới"
                    name="newpass"
                    rules={[{ required: true, message: 'Password không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Xác nhận
                </Button>
            </Form>
        </div>
    )
}
export default ChangePassword