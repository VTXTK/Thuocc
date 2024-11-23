import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Upload, Spin } from 'antd';
import './home.scss';
import '../button.scss'
import { useEffect, useState } from 'react';
import { callAllProduct, callFetchCategory } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';

const Home = () => {
    const navigate = useNavigate()
    // const productSearch = useSelector(state => state.product.search)
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([])
    const [listProduct, setListProduct] = useState([]);
    const [sortQuery, setSortQuery] = useState('sort=-sold')
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState("");
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [categories, setCategories] = useState('')
    const [urlSellingPrice, setUrlSellingPrice] = useState('')
    const [selectedButton, setSelectedButton] = useState(null);
    useEffect(() => {
        fetchCategory()
    }, [])
    const fetchCategory = async () => {
        const res = await callFetchCategory();
        if (res && res.data) {
            const d = res.data.map(item => {
                return { label: item, value: item }
            })
            setListCategory(d);

        }
    }
    useEffect(() => {
        fetchProduct();
    }, [sortQuery, filter, current, pageSize]);

    const fetchProduct = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callAllProduct(query);
        if (res && res.data.product) {
            setListProduct(res.data.product);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }
    const handleOnChanePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }
    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
    const handleRedirectProduct = (product) => {
        const slug = convertSlug(product.drugName)
        navigate(`/product/${slug}?id=${product._id}`)
    }

    const handleChangeFilter = (changedValues, values) => {
        // console.log(">>> check handleChangeFilter", changedValues, values)

        //only fire if category changes
        if (changedValues.category) {
            const cate = values.category;

            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setCategories(f)
                setFilter(`drugGroupName=${f}`)
                if (urlSellingPrice) {
                    setFilter(`drugGroupName=${f}&${urlSellingPrice}`)
                }
            } else {
                //reset data -> fetch all
                setFilter('');
            }
        }
    }

    const onClick = (from, to) => {
        if (from >= 0 && to >= 0) {
            let f = `&sellingPrice>=${from}&sellingPrice<=${to}`;
            setUrlSellingPrice(f)
            if (categories) {
                f += `&drugGroupName=${categories}`
            }
            setFilter(f);
        }
        setSelectedButton({ from, to });
    }
    // const onFinish = (values) => {
    //     // console.log('>> check values: ', values)

    //     if (values?.range?.from >= 0 && values?.range?.to >= 0) {
    //         let f = `sellingPrice>=${values?.range?.from}&sellingPrice<=${values?.range?.to} `;
    //         if (values?.category?.length) {
    //             const cate = values?.category?.join(',');
    //             f += `&drugGroupName=${cate} `
    //         }
    //         setFilter(f);
    //     }
    // }

    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=sellingPrice',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-sellingPrice',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];
    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto', borderBottom: "1px solid green" }}>
            <Row gutter={[20, 20]} span={24}>
                <Col md={4} sm={0} xs={0} style={{ borderRight: "1px solid green" }}>
                    <div style={{ padding: "10px" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                            <Button onClick={() => { form.resetFields(), setFilter(''), setSelectedButton('') }}><ReloadOutlined title="Reset" /></Button>
                        </div>
                        <Form

                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <div className="FormItemCategory">
                                <Form.Item
                                    name="category"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group className="CheckboxGroup">
                                        <Row>
                                            {listCategory?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index - ${index} `} style={{ padding: '7px 0' }} >
                                                        <Checkbox value={item.value}>
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })

                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                            >
                                <Col span={24}>
                                    <Row span={24}>
                                        <Button className='buttonn' style={{ width: '100%', backgroundColor: selectedButton && selectedButton.from === 0 ? 'rgba(45, 172, 102, 0.90)' : 'inherit' }} onClick={() => onClick(0, 100000)} >
                                            <p style={{ overflow: 'hidden' }}>Dưới 100.000đ</p>
                                        </Button>
                                    </Row>
                                </Col>
                                <br />
                                <Col span={24}>
                                    <Row span={24}> <Button className='buttonn' style={{ width: '100%', backgroundColor: selectedButton && selectedButton.from === 100000 ? 'rgba(45, 172, 102, 0.90)' : 'inherit' }} onClick={() => onClick(100000, 300000)}><p style={{ overflow: 'hidden' }}>100.000đ đến 300.000đ</p></Button></Row>
                                </Col>
                                <br />
                                <Col span={24}>
                                    <Row span={24}> <Button className='buttonn' style={{ width: '100%', backgroundColor: selectedButton && selectedButton.from === 300000 ? 'rgba(45, 172, 102, 0.90)' : 'inherit' }} onClick={() => onClick(300000, 500000)}><p style={{ overflow: 'hidden' }}>300.000đ đến 500.000đ</p></Button></Row>
                                </Col>
                                <br />
                                <Col span={24}>
                                    <Row span={24}> <Button className='buttonn' style={{ width: '100%', backgroundColor: selectedButton && selectedButton.from === 500000 ? 'rgba(45, 172, 102, 0.90)' : 'inherit' }} onClick={() => onClick(500000, 999999999)}><p style={{ overflow: 'hidden' }}>Trên 500.000đ</p></Button></Row>
                                </Col>
                                {/* 
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Form.Item name={["range", 'from']} >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            name='from'
                                            min={0}
                                            placeholder="đ TỪ"
                                            formatter={(value) => `${value} `.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    <span >-</span>
                                    <Form.Item name={["range", 'to']}>
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            name='to'
                                            min={0}
                                            placeholder="đ ĐẾN"
                                            formatter={(value) => `${value} `.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button onClick={() => form.submit()} className='button-antd'
                                        style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                </div> */}
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}

                            >
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />

                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />

                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />

                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />

                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={20} xs={24} className='container'>
                    <Spin spinning={isLoading} tip="Loading...">

                        <div style={{ padding: "20px", paddingTop: "0", background: "#fff", borderRadius: 5 }}>
                            <Row>
                                <Tabs defaultActiveKey="sort=-sold"
                                    items={items}
                                    onChange={(value) => { setSortQuery(value) }}
                                    style={{ overflowX: "auto" }}
                                />
                            </Row>
                            <Row span={24} style={{ marginBottom: '10px' }}><img src={`${import.meta.env.VITE_BACKEND_URL}/images/logo/banner_2.png`} style={{ margin: '0 auto', width: '100%' }} alt="" /></Row>
                            <Row className='customize-row'>
                                {listProduct?.map((item, index) => {

                                    return (
                                        <div className="column" key={`product - ${index} `}
                                            onClick={() => handleRedirectProduct(item)}>
                                            <div className='wrapper'>
                                                <Col className="Col" >
                                                    <div className='thumbnail'>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`} alt="thumbnail product" />
                                                        {item.quantity === 0 &&
                                                            <div className="sold-out">Sold Out</div>
                                                        }
                                                    </div>
                                                    <div className='text' title={`${item.drugName} `}>{item.drugName}</div>
                                                    <div className='price' >
                                                        <span className='sell'>
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sellingPrice)}
                                                        </span>
                                                        <br />
                                                        <span className='sale'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sellingPrice / 90 * 100)}</span>
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 8 }} />
                                                        <span>Đã bán {item.sold}</span>
                                                    </div>
                                                </Col>
                                            </div>
                                        </div>
                                    )
                                }
                                )

                                }
                            </Row>
                        </div>
                    </Spin>
                    <Divider />
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            total={total}
                            current={current}
                            pageSize={pageSize}
                            responsive
                            onChange={(p, s) => handleOnChanePage({ current: p, pageSize: s })}
                        />
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default Home;