import React, { useEffect, useState } from 'react';
import { Table, Row, Col, message, notification, Popconfirm, Button } from 'antd';
import InputSearch from './InputSearch';
import { callAllProduct, callDeleteProduct, } from '../../../services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import ProductViewDetail from './ProductViewDetail';
import NewProduct from './NewProduct';
import UpdateProduct from './UpdateProduct';

const ProductTable = () => {
    const [listProduct, setListProduct] = useState([]);
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [dataViewDetail, setDataViewDetail] = useState('')
    const [openModalCreate, setOpenModalCreate] = useState(false)
    const [openModalUpdate, setOpenModalUpdate] = useState(false)
    const [dataUpdate, setDataUpdate] = useState('')
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        fetchProduct();
    }, [current, pageSize, filter, sortQuery]);
    const fetchProduct = async () => {
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callAllProduct(query);
        console.log("resss", res.data)
        if (res && res.data.product) {
            setListProduct(res.data.product);
            setTotal(res.data.meta.total)
        }

    }
    const onChane = (pagination, flters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
            setSortQuery(q)
        }
    }
    const handleDelete = async (idUser) => {
        const res = await callDeleteProduct(idUser)
        if (res && res.data.product) {
            message.success("Xóa thành công")
            fetchProduct()
        }
        else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }
    }
    const handleSearch = (query) => {
        setFilter(query)
    }
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Danh sách sản phẩm </span>
                <span style={{ display: 'flex', gap: 15 }}>
                    {/* <Button>Export</Button> */}
                    {/* <Button>Import</Button> */}
                    <Button
                        icon={<PlusOutlined />}
                        type='primary'
                        onClick={() => setOpenModalCreate(true)}
                    >Thêm mới</Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("")
                        setSortQuery("")
                    }} ><ReloadOutlined /></Button>
                </span>
            </div>
        )
    }
    // const res = callAllUser();

    // // if(res && res.data){

    // // }
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            width: 80,
            render: (text, record, index) => index + 1
        },
        {
            title: 'ID',
            dataIndex: 'productId',
            render: (text, record, inde) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record)
                        setOpenViewDetail(true)
                    }}>{record.productId}
                    </a>
                )
            },
            align: 'center',
            sorter: true
        },
        {
            title: 'Tên thuốc',
            dataIndex: 'drugName', align: 'center',
            sorter: true,
        },
        {
            title: 'Nhóm thuốc',
            dataIndex: 'drugGroupName', align: 'center',
            sorter: true
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity', align: 'center',
            sorter: true
        },
        {
            title: 'Giá nhập',
            dataIndex: 'importPrice', align: 'center',
            sorter: true,
            render: (price) => {
                return <div className='price'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </div>
            }
        },
        {
            title: 'Giá bán',
            dataIndex: 'sellingPrice', align: 'center',
            sorter: true,
            render: (price) => {
                return <div className='price'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </div>
            }
        },
        {
            title: 'Action', align: 'center',
            render: (text, record, index) => {
                return (
                    <Row span={24}>
                        < Col span={8} >
                            <Popconfirm
                                placement='leftTop'
                                title={"Xác nhân xóa"}
                                description={"Bạn chắc chắn có muốn xóa không?"}
                                onConfirm={() => handleDelete(record._id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                {
                                    record.quantity === 1 &&
                                    <span style={{ cursor: "pointer" }}>
                                        <DeleteTwoTone twoToneColor="#ff4d4f" />
                                    </span>
                                }
                            </Popconfirm>
                        </Col >
                        <Col span={8} ></Col>
                        <Col span={8} >
                            <EditTwoTone
                                TwoToneColor="#f57800" style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setOpenModalUpdate(true)
                                    setDataUpdate(record);
                                }}
                            />
                        </Col>
                    </Row >

                )
            }

        },

    ];

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} setFilter={setFilter} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        isLoading={isLoading}
                        className='def'
                        columns={columns}
                        onChange={onChane}
                        dataSource={listProduct}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                pageSizeOptions: [5, 10, 20, 50, 100]
                            }
                        }
                    />
                </Col>
            </Row>
            <ProductViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <NewProduct
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchProduct={fetchProduct}
            />
            <UpdateProduct
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdate={dataUpdate}
                fetchProduct={fetchProduct}
            />
        </>
    )
}


export default ProductTable;