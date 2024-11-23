import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';



const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const { handleSearch } = props
    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        let query = ""
        if (values.name) {
            query += `&name=${values.name}`
        }
        if (values.phone) {
            query += `&phone=${values.phone}`
        }
        if (query) {
            handleSearch(query)
        }
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`name`}
                        label={`Tên khách hàng:`}
                    >
                        <Input placeholder="Nguyen Van A" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`phone`}
                        label={`Số điện thoại`}
                    >
                        <Input placeholder="0123456" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            setFilter("")
                        }}
                    >
                        Clear
                    </Button>
                    {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
                </Col>
            </Row>
        </Form>
    );
};

export default InputSearch;