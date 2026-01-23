import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setUserData } from "../redux/userSlice";

const useGetCity = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => {
        return state.user?.userData?.data;
    });
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // console.log(position);
            const lattitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // console.log(`lattitude: ${lattitude} longitude: ${longitude}`);

            try {
                const location = await axios.get(
                    `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
                );
                // console.log(location );
                const city = location?.data?.results[0]?.city;
                // console.log(location?.data.results[0].city);
                // const name = location?.data.results[0].name;
                // const pincode = location?.data.results[0].postcode;
                // const address1 = location?.data.results[0].address_line1;
                // const address2 = location?.data.results[0].address_line2;

                // console.log(`name: ${name}, add1: ${address1}, add2: ${address2}, city: ${city}, pincode: ${pincode} `);
                // console.log(city);
                dispatch (setCity(city));
            } catch (error) {}
        });
    }, [userData]);
};

export default useGetCity;
