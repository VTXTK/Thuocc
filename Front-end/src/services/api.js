import axios from '../utils/axios-customize';
import axios1 from "axios";
export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/auth/register', { fullName, email, password, phone })
}

export const callLogin = (email, password) => {
    return axios.post('/api/v1/auth/login', { email, password })
}

export const callLoginFromGG = (email, fullName, avatar) => {
    return axios.post('/api/v1/auth/google', { email, fullName, avatar })
}
export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}
export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`)
}
export const callDetailUser = (id) => {
    return axios.get(`/api/v1/user/${id}`)
}
export const callAllCus = () => {
    return axios.get('api/v1/user/customer')
}
export const callDeleteUser = (id) => {
    return axios.delete(`api/v1/user/${id}`)
}

export const callUpdateAvatar = (fileImg) => {
    const bodyFormData = new FormData()
    bodyFormData.append('fileImg', fileImg)
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        }
    })
}

export const callChangePassword = (values) => {
    return axios.post("/api/v1/user/changePass", values)
}

export const callUpdateUser = (newUser, id) => {
    return axios.put(`/api/v1/user/${id}`, newUser)
}
//San pham(thuocs)
export const callAllProduct = (query) => {
    return axios.get(`api/v1/product?${query}`)
}
export const callDetailProduct = (idProduct) => {
    return axios.get(`api/v1/product/${idProduct}`)
}
export const callDeleteProduct = (idProduct) => {
    return axios.delete(`api/v1/product/${idProduct}`)
}
export const callAddProduct = (newProduct) => {
    return axios.post('api/v1/product/add', newProduct)
}
export const callUpdateProduct = (id, newProduct) => {
    return axios.put(`api/v1/product/${id}`, newProduct)
}
export const callSearchProduct = (query) => {
    return axios.get(`api/v1/search/product?${query}`)
}

// category
export const callFetchCategory = () => {
    return axios.get('/api/v1/category/')
}


// upLoad hinh 
export const callUploadProductImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "product"
        },
    });
}

//Dat hang

export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/order', { ...data })
}
export const callAllOrder = (query) => {
    return axios.get(`/api/v1/order/all?${query}`)
}
export const callDeleteOrder = (idOrder) => {
    return axios.delete(`/api/v1/order/${idOrder}`)
}
export const callUploadStateOrder = (id, newState) => {
    return axios.put(`/api/v1/order/${id}`, newState)
}
export const callDetailOrder = (id) => {
    return axios.get(`/api/v1/order/${id}`)
}

//dashboard

export const callDataDashboard = (time) => {
    return axios.get(`/api/v1/dashboard?${time}`)
}

export const callProvince = () => {
    return axios1.get('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100')
}
export const callDistrict = (provinceID) => {
    return axios1.get(`https://vnprovinces.pythonanywhere.com/api/provinces/${provinceID}`)
}
export const callWard = (districtID) => {
    return axios1.get(`https://vnprovinces.pythonanywhere.com/api/districts/${districtID}`)
}
