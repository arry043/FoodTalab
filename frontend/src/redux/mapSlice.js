import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
    name: "map",
    initialState: {
        location: {
            lat: 0,
            lng: 0
        },
        mapAddress: null
    },
    reducers: {
        setLocation: (state, action) => {
            const { lat, lng } = action.payload;
            state.location.lat = lat;
            state.location.lng = lng;
        },

        setMapAddress: (state, action) => {
            state.mapAddress = action.payload
        }
    },
});

export const {setMapAddress, setLocation} = mapSlice.actions;
export default mapSlice.reducer;
