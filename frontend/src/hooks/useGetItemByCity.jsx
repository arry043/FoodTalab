import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";

function useGetItemByCity() {
    const dispatch = useDispatch();
    const myShopData = useSelector((state) => state.owner.myShopData);
    const { city } = useSelector((state) => state.user);

    useEffect(() => {
        if (myShopData) return;

        const fetchItems = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/item/getitembycity/${city}`,
                    { withCredentials: true },
                );

                // console.log("items in city:", result.data);

                // ✅ correct dispatch
                dispatch(setItemsInMyCity(result?.data?.data));
            } catch (error) {
                console.log("My Shop Error:", error);
            }
        };

        fetchItems();
    }, [city]);
}

export default useGetItemByCity;
