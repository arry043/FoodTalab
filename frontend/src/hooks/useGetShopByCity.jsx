import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
    const dispatch = useDispatch();
    const myShopData = useSelector((state) => state.owner.myShopData);
    const { city } = useSelector((state) => state.user);

    useEffect(() => {
        if (myShopData) return;

        const fetchShop = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/shop/getbycity/${city}`,
                    { withCredentials: true },
                );

                console.log("Shops in city:", result.data);

                // ✅ correct dispatch
                dispatch(setShopsInMyCity(result?.data?.data));
            } catch (error) {
                console.log("My Shop Error:", error);
            }
        };

        if (city) fetchShop();
    }, [city, myShopData, dispatch]);
}

export default useGetShopByCity;
