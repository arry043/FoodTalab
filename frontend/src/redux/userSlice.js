import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        city: null,
        state: null,
        pincode: null,
        address: null,
        shopsInMyCity: [],
        itemsInMyCity: [],
        cartItems: [],
        totalAmount: 0,
        delivaryFee: 49,
        myOrders: [],
        searchItems: [],
        isSearching: false,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setState: (state, action) => {
            state.state = action.payload;
        },
        setPincode: (state, action) => {
            state.pincode = action.payload;
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload;
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload;
        },
        addToCart: (state, action) => {
            const item = action.payload;
            const existing = state.cartItems.find((i) => i.id === item.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.cartItems.push({ ...item, quantity: 1 });
            }
            state.totalAmount = state.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );
            if (state.totalAmount > 500) {
                state.delivaryFee = 0;
            } else {
                state.delivaryFee = 49;
            }
        },

        removeFromCart: (state, action) => {
            const id = action.payload;

            const existing = state.cartItems.find((i) => i.id === id);

            if (existing) {
                if (existing.quantity > 1) {
                    existing.quantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter(
                        (i) => i.id !== id,
                    );
                }
            }
            state.totalAmount = state.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );
            if (state.totalAmount > 500) {
                state.delivaryFee = 0;
            } else {
                state.delivaryFee = 49;
            }
        },
        removeItemCompletelyFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((i) => i.id !== id);
        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload;
        },
        addMyOrders: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders];
        },
        updateOrderStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload;
            const order = state.myOrders.find((o) => o._id === orderId);
            if (order) {
                const shopOrder = order.shopOrders.find(
                    (so) => so.shop?._id.toString() === shopId,
                );
                if (shopOrder) {
                    shopOrder.status = status;
                }
            }
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload;
        },
        setIsSearching: (state, action) => {
            state.isSearching = action.payload;
        },
    },
});

export const {
    setUserData,
    setCity,
    setState,
    setPincode,
    setAddress,
    setShopsInMyCity,
    setItemsInMyCity,
    addToCart,
    removeFromCart,
    removeItemCompletelyFromCart,
    setDelivaryFee,
    setMyOrders,
    addMyOrders,
    updateOrderStatus,
    setSearchItems,
    setIsSearching,
} = userSlice.actions;
export default userSlice.reducer;
