import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

function useGetMyShop() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) return;
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/myshop`, {
                    withCredentials: true,
                });
                console.log(result.data);
                dispatch(setMyShopData(result?.data));
            } catch (error) { 
                console.log("My Shop Error: ", error);
            }
        };
        fetchShop();
    }, [
        userData
    ]);
}

export default useGetMyShop;
