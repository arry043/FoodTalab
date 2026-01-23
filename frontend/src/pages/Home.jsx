import React from "react";
import UserDashboard from "../components/userDashboard";
import OwnerDashboard from "../components/ownerDashboard";
import DelivaryManDashboard from "../components/delivaryManDashboard";
import { useSelector } from "react-redux";

export const Home = () => {
    const {userData} = useSelector((state) => state.user);
    
    return (
        <div className="w-full min-h-screen pt-10 flex flex-col items-center bg-white">
            {userData.data?.role === "user" && <UserDashboard /> }
            {userData.data?.role === "owner" && <OwnerDashboard /> }
            {userData.data?.role === "deliveryBoy" && <DelivaryManDashboard /> }
        </div>
    );
};
