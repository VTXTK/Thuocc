import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';

const InputSearch = (props) => {
    const { handleSearch, setFilter } = props
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        let query = ""
        if (values.drugName) {
            query += `&drugName=${values.drugName}`
        }
        if (query) {
            handleSearch(query)
        }
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24} style={{ paddingLeft: '30px', paddingRight: '30px' }}>
                <Col span={16}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`drugName`}

                        label={`Tên thuốc: `}
                    >
                        <Input placeholder="abc" />
                    </Form.Item>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <br />
                    <br />
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
            <Row>

            </Row>
        </Form>
    );
};

export default InputSearch;