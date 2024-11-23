import React, { useEffect, useState } from 'react';
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { callAddProduct, callFetchCategory, callUploadProductImg } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
const NewProduct = (props) => {
    const { openModalCreate, setOpenModalCreate, fetchProduct } = props;

    const [isSubmit, setIsSubmit] = useState(false);
    const [listCategory, setListCategory] = useState([])
    const [form] = Form.useForm();


    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');


    useEffect(() => {
        fetchCategory();
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
    const onFinish = async (values) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui long upLoad Thumbnail"
            })
            return
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: "Lỗi validate",
                description: "Vui long upLoad Slider"
            })
            return
        }
        const thumbnail = dataThumbnail[0].name
        const slider = dataSlider.map(item => item.name)
        const { drugName, drugGroupName, drugOrigin, importPrice, sellingPrice, manufacturersName, quantity, unitName, drugIngredients, drugUses, howToUseDrug } = values;
        if (importPrice > sellingPrice) {
            notification.error({
                message: "Giá bán phải lớn hơn giá nhập"
            })
            return
        }
        const newProduct = {
            drugName: drugName,
            drugGroupName: drugGroupName,
            drugOrigin: drugOrigin,
            manufacturersName: manufacturersName,
            quantity: quantity,
            unitName: unitName,
            importPrice: importPrice,
            sellingPrice: sellingPrice,
            drugIngredients: drugIngredients,
            drugUses: drugUses,
            howToUseDrug: howToUseDrug,
            slider: slider,
            thumbnail: thumbnail,
        }
        setIsSubmit(true)
        const res = await callAddProduct(newProduct);
        if (res && res.data) {
            message.success('Tạo mới thành công');
            form.resetFields();
            setDataSlider([])
            setDataThumbnail([])
            setOpenModalCreate(false);
            fetchProduct()
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };


    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        console.log("JPG", isJpgOrPng)
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };



    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadProductImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Lỗi khi upload file');
        }
    };
    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadProductImg(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Lỗi khi upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }
    const handlePreview = async (file) => {

        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };


    return (
        <>

            <Modal
                title="Thêm mới sản phẩm"
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
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên thuốc"
                                name="drugName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Nhà sản xuất"
                                name="manufacturersName"
                                rules={[{ required: true, message: 'Vui lòng nhập nhà sản xuất!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Nguồn gốc"
                                name="drugOrigin"
                                rules={[{ required: true, message: 'Vui lòng nhập nguồn gốc!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'VUi lòng nhập số lượng!' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá nhập"
                                name="importPrice"
                                rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá bán"
                                name="sellingPrice"
                                rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Nhóm thuốc"
                                name="drugGroupName"
                                rules={[{ required: true, message: 'Vui lòng nhập nhóm thuốc!' }]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    //  onChange={handleChange}
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đơn vị tính"
                                name="unitName"
                                rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính!' }]}

                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thành phần thuốc"
                                name="drugIngredients"
                                rules={[{ required: true, message: 'Vui lòng nhập thành phần thuốc!' }]}

                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Công dụng"
                                name="drugUses"
                                rules={[{ required: true, message: 'Vui lòng nhập công dụng!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Cách dùng"
                                name="howToUseDrug"
                                rules={[{ required: true, message: 'Vui lòng nhập cách dùng!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default NewProduct;