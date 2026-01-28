import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";

const useUpdateLocation = () => {
    const userData = useSelector((state) => {
        return state.user?.userData?.data;
    });
    useEffect(() => {
        const updateLocation = async (lat, lng) => {
            const result = await axios.post(
                `${serverUrl}/api/user/update-location`,
                {
                    lat,
                    lng,
                },
                {
                    withCredentials: true,
                },
            );
            console.log("updated location: ", result);
        };
        navigator.geolocation.watchPosition(async (position) => {
            await updateLocation(
                position.coords.latitude,
                position.coords.longitude,
            );
        });
    }, [userData]);
};

export default useUpdateLocation;
