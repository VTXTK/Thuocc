import { Badge, Col, Descriptions, Divider, Drawer, Modal, Row, Upload } from "antd";
import moment from 'moment';
// import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
// FORMAT_DATE_DISPLAY = 'DD-MM-YYYY HH:mm:ss'
import { useEffect, useState } from "react";
import './Product.scss'
const ProductViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    useEffect(() => {
        fetchProduct()
    }, [dataViewDetail])

    const fetchProduct = async () => {
        let imgThumbnail = {}, imgslider = []
        if (dataViewDetail.thumbnail) {
            imgThumbnail = {
                uid: dataViewDetail.uid,
                name: dataViewDetail.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${dataViewDetail.thumbnail}`
            }
        }
        if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
            dataViewDetail.slider.map(item => {
                imgslider.push({
                    uid: dataViewDetail.uid,
                    name: dataViewDetail.slider,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/product/${item}`
                })
            })
        }
        setFileList([imgThumbnail, ...imgslider])
    }


    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        console.log("file", file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }




    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Row gutter={[20, 20]}>
                    <Col>
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Id</div></Col>
                            <Col span={8}>{dataViewDetail?.productId}</Col>
                            <Col span={4}><div className="title">Tên sản phẩm</div></Col>
                            <Col span={8}>{dataViewDetail?.drugName}</Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Nhà sản xuất</div></Col>
                            <Col span={8}>{dataViewDetail?.manufacturersName}</Col>
                            <Col span={4}><div className="title">Nguồn gốc</div></Col>
                            <Col span={8}>{dataViewDetail?.drugOrigin}</Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Số lượng tồn</div></Col>
                            <Col span={8}>{dataViewDetail?.quantity}</Col>
                            <Col span={4}><div className="title">Đơn vị tính</div></Col>
                            <Col span={8}>{dataViewDetail?.unitName}</Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Thành phần</div></Col>
                            <Col span={8}>{dataViewDetail?.drugIngredients}</Col>
                            <Col span={4}><div className="title">Công dụng</div></Col>
                            <Col span={8}>{dataViewDetail?.drugUses}</Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Cách dùng</div></Col>
                            <Col span={8}>{dataViewDetail?.howToUseDrug}</Col>
                            <Col span={4}><div className="title">Loại thuốc</div></Col>
                            <Col span={8}> <Badge status="processing" text={dataViewDetail?.drugGroupName} /></Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Giá nhập</div></Col>
                            <Col span={8}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.importPrice ?? 0)}</Col>
                            <Col span={4}><div className="title">Giá bán</div></Col>
                            <Col span={8}> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewDetail?.sellingPrice ?? 0)}</Col>
                        </Row>
                        <Divider />
                        <Row gutter={[20, 20]}>
                            <Col span={4}><div className="title">Ngày tạo</div></Col>
                            <Col span={8}>{moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</Col>
                            <Col span={4}><div className="title">Cập nhật mới nhất</div></Col>
                            <Col span={8}> {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</Col>
                        </Row>
                    </Col>
                </Row>
                {/* 
        

                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item> */}

                <Divider orientation="left" > ảnh sản phẩm </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer >
        </>
    )
}
export default ProductViewDetail;