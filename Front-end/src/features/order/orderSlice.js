import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: []
};
export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddProductAction: (state, action) => {
            let carts = state.carts
            const item = action.payload
            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1 && carts[isExistIndex].idUser === item.idUser) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }
            }
            else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail, idUser: item.idUser })
            }
            state.carts = carts
            message.success("Sản phẩm được thêm vào giỏ hàng")
        },
        doUpdateCartAction: (state, action) => {
            let carts = state.carts
            const item = action.payload
            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1 && carts[isExistIndex].idUser === item.idUser) {
                carts[isExistIndex].quantity = item.quantity
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }
            }
            else {
                carts.push({ quantity: item.quantity, _id: item._id, detail: item.detail, idUser: item.idUser })
            }
            state.carts = carts

        },
        doDeleteItemCartAction: (state, action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id)
        },
        doPlaceOrderAction: (state, action) => {
            const { idUser, listChecked } = action.payload;

            // Lấy danh sách cart hiện tại của user
            const userCarts = state.carts.filter(cart => cart.idUser === idUser);

            const checkedIds = listChecked.map(item => item._id);
            // Loại bỏ các sản phẩm đã checkout
            const remainingCarts = userCarts.filter(
                cart => !checkedIds.includes(cart._id)
            );
            // Cập nhật lại giỏ hàng của user
            const updatedUserCarts = remainingCarts;
            const updatedState = {
                ...state,
                carts: [
                    ...state.carts.filter(cart => cart.idUser !== idUser),
                    ...updatedUserCarts
                ]
            };

            // Trả về state mới
            return updatedState;

        },
        doPlaceOrder: (state, action) => {
            const { idUser } = action.payload;

            // Lọc ra các cart không phải của user 
            const remainingCarts = state.carts.filter(cart => cart.idUser !== idUser);

            // Gán lại carts là các cart còn lại 
            state.carts = remainingCarts;
        }
    }
})

export const { doAddProductAction, doUpdateCartAction, doDeleteItemCartAction, doPlaceOrderAction } = orderSlice.actions
export default orderSlice.reducer;