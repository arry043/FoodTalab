import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";

const DelivaryManDashboard = () => {
    const { userData } = useSelector((state) => state.user);
    const actualUserData = userData?.data;
    const [availableAssignments, setAvailableAssignments] = React.useState([]);

    const getAssignments = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-assignments`,
                {
                    withCredentials: true,
                },
            );
            // console.log(result.data);
            setAvailableAssignments(result?.data?.data);
        } catch (error) {
            console.log("get my orders Error:", error);
        }
    };
    useEffect(() => {
        getAssignments();
    }, [userData]);

    console.log(availableAssignments);

    return (
        <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
            <Navbar />

            <div className="w-full max-w-[900px] mt-20 px-4 flex flex-col gap-6">
                {/* Welcome Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FaUserCircle className="text-[#ff4d2d]" size={42} />
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">
                                Welcome, {actualUserData?.fullName} 👋
                            </h1>
                            <p className="text-xs text-gray-500">
                                Ready to deliver some orders today?
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                        <IoTimeOutline />
                        {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>

                {/* Status Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="mt-1 text-sm font-semibold text-green-600">
                            Available
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                        <p className="text-xs text-gray-500">
                            Today Deliveries
                        </p>
                        <p className="mt-1 text-lg font-bold text-gray-800">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                        <p className="text-xs text-gray-500">Total Earnings</p>
                        <p className="mt-1 text-lg font-bold text-gray-800">
                            ₹0
                        </p>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        🚚 Active Delivery Requests
                    </h2>

                    {/* Empty State */}
                    <div className="text-center py-10 text-gray-500 text-sm">
                        No delivery requests right now.
                        <br />
                        Stay online to receive new orders.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DelivaryManDashboard;
