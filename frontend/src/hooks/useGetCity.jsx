import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setPincode, setState, setAddress } from "../redux/userSlice";
import { setLocation, setMapAddress } from "../redux/mapSlice";

const useGetCity = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user?.userData?.data);

    useEffect(() => {
        if (!userData?._id) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lattitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                dispatch(setLocation({ lat: lattitude, lng: longitude }));

                try {
                    const location = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse`,
                        {
                            params: {
                                lat: lattitude,
                                lon: longitude,
                                format: "json",
                                apiKey: import.meta.env
                                    .VITE_GEO_LOCATION_API_KEY,
                            },
                        },
                    );

                    const result = location?.data?.results?.[0];

                    const city = result?.city || result?.country;
                    const address = result?.address_line1;
                    const formatted = result?.formatted;
                    const pincode = result?.postcode;
                    const state = result?.state;

                    dispatch(setCity(city));
                    dispatch(setPincode(pincode));
                    dispatch(setState(state));
                    dispatch(setAddress(address));
                    dispatch(setMapAddress(formatted));
                } catch (error) {
                    console.log("Reverse geocode error:", error.message);
                }
            },
            (error) => {
                console.log("City GPS error:", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    }, [userData?._id]);
};

export default useGetCity;
