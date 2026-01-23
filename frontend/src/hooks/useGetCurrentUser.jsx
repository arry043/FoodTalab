import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);

    useEffect(() => {
        if (userData) return;
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                });
                // console.log(result.data);
                dispatch(setUserData(result?.data));
            } catch (error) { 
                console.log(error);
            }
        };
        fetchUser();
    }, [
        userData
    ]);
};

export default useGetCurrentUser;
