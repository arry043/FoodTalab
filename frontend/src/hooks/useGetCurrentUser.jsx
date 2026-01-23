import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";

const useGetCurrentUser = () => {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true,
                });
                console.log("fetched user", user);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);
};

export default useGetCurrentUser;
