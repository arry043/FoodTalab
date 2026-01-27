import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
 
    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/order/my-orders`,
                    { withCredentials: true },
                );

                // console.log("items in city:", result.data);

                // ✅ correct dispatch
                console.log(result?.data?.data);
                dispatch(setMyOrders(result?.data?.data));
            } catch (error) {
                console.log("get my orders Error:", error);
            }
        };

        fetchOrders();
    }, [userData]);
}

export default useGetMyOrders;
