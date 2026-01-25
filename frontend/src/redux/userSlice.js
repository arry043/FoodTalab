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
    removeFromCart
} = userSlice.actions;
export default userSlice.reducer;
