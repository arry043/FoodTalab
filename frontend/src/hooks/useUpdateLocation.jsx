import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useSelector } from "react-redux";

const useUpdateLocation = () => {
    const userData = useSelector((state) => state.user?.userData?.data);

    useEffect(() => {
        if (!userData?._id) return;

        const updateLocation = async (lat, lng) => {
            try {
                await axios.post(
                    `${serverUrl}/api/user/update-location`,
                    { lat, lng },
                    { withCredentials: true },
                );
                // console.log("Location updated");
            } catch (err) {
                console.log("Update location error:", err.message);
            }
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                updateLocation(
                    position.coords.latitude,
                    position.coords.longitude,
                );
            },
            (error) => {
                console.log("GPS Error:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000,
            },
        );

        // ✅ cleanup (VERY important)
        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [userData?._id]);
};

export default useUpdateLocation;
