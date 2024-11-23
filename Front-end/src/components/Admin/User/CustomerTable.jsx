import React, { useEffect, useState } from 'react';
import { Table, Row, Col, message, notification, Popconfirm, Button } from 'antd';
import InputSearch from './InputSearch';
import { callAllCus, callDeleteUser, callFetchListUser } from '../../../services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import UserViewDetail1 from './UserViewDetail1';
import NewUser from './NewUser';


const CusTable = () => {
    const [listUser, setListUser] = useState([]);
    const [openViewDetail, setOpenViewDetail] = useState(false)
    const [dataViewDetail, setDataViewDetail] = useState('')
    const [openModalCreate, setOpenModalCreate] = useState(false)
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    let stt = 1;
    useEffect(() => {
        fetchUser();
    }, [current, pageSize, filter, sortQuery]);
    const fetchUser = async () => {
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchListUser(query);
        if (res && res.data) {
            setListUser(res.data.user);
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
    const handleSearch = (query) => {
        setFilter(query)
    }
    const handleDelete = async (idUser) => {
        const res = await callDeleteUser(idUser)
        console.log("ressss", res)
        if (res && res.data) {
            message.success("Xóa thành công")
            fetchUser();
        }
        else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }


    }
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Danh sách người dùng </span>
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
            dataIndex: 'userId',
            render: (text, record, inde) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record)
                        setOpenViewDetail(true)
                    }}>{record.userId}
                    </a>
                )
            },
            align: 'center',
            sorter: true
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            align: 'center',
            sorter: true,
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            align: 'center',

        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            align: 'center',
            sorter: true
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (


                    <Popconfirm
                        placement='leftTop'
                        title={"Xác nhận xóa"}
                        description={"Bạn chắc chắn có muốn xóa không ?"}
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 20px" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </Popconfirm>

                    // <EditTwoTone
                    //     TwoToneColor="#f57800" style={{ cursor: "pointer" }}
                    //     onClick={() => {
                    //         setOpenModalUpdate(true)
                    //         setDataUpdate(record);
                    //     }}
                    // />
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
                        dataSource={listUser}
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
            <UserViewDetail1
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <NewUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchUser}
            />
        </>
    )

}


export default CusTable;