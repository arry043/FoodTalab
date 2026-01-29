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

    const acceptOrder = async (assignmentId) => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/accept-order/${assignmentId}`,
                {
                    withCredentials: true,
                },
            );
            console.log(result.data);
        } catch (error) {
            console.log("err: fetcing aceept order", error);
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                            🎟 Active Delivery Tickets
                        </h2>
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {availableAssignments.length} Active
                        </span>
                    </div>

                    {availableAssignments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            <p className="text-base mb-1">
                                No delivery requests right now
                            </p>
                            <p className="text-xs">
                                Stay online to receive new orders 🚀
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {availableAssignments.map((order) => (
                                <div
                                    key={order.assignmentId}
                                    className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="text-sm font-semibold text-gray-800">
                                            Order #{order.orderId || "XXXXXX"}
                                        </p>

                                        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                            {order.status || "Pending"}
                                        </span>
                                    </div>

                                    {/* Shop + Customer */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* SHOP */}
                                        <div className="bg-gray-50 rounded-xl p-3 border">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">
                                                🏪 Pickup From
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {order.shopName || "Shop Name"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                📍{" "}
                                                {order.shopAddress ||
                                                    "Shop Address"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                📞{" "}
                                                {order.shopContact ||
                                                    "Shop Phone"}
                                            </p>
                                        </div>

                                        {/* CUSTOMER */}
                                        <div className="bg-gray-50 rounded-xl p-3 border">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">
                                                🧍 Drop To
                                            </p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {order.customer?.name ||
                                                    "Customer Name"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                📍{" "}
                                                {order.deliveryAddress?.text ||
                                                    "Customer Address"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                📞{" "}
                                                {order.customer?.phone ||
                                                    "Customer Phone"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ITEMS LIST */}
                                    <div className="mt-4 bg-[#fff9f6] border border-orange-100 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                            🧾 Items to Pick
                                        </p>

                                        <div className="space-y-2">
                                            {(order.items &&
                                            order.items.length > 0
                                                ? order.items
                                                : [
                                                      {
                                                          name: "Item Name",
                                                          quantity: 1,
                                                          price: 0,
                                                      },
                                                  ]
                                            ).map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between text-xs text-gray-600"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-sm text-gray-700 break-words flex-1">
                                                            {item.name ||
                                                                "Item Name"}
                                                        </span>

                                                        <span className="font-medium mt-[2px]  whitespace-nowrap">
                                                            x {""}
                                                            {item.quantity || 1}
                                                        </span>
                                                    </div>

                                                    <span className="font-semibold text-gray-800">
                                                        ₹{item.price || 0}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-sm font-semibold text-green-600">
                                            💰 Total: ₹{order.subTotal || "0"}
                                        </p>

                                        <button
                                            onClick={() =>
                                                acceptOrder(order.assignmentId)
                                            }
                                            className="px-5 py-2 text-xs rounded-full bg-[#ff4d2d] text-white hover:bg-[#e64427] transition"
                                        >
                                            Accept Delivery
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DelivaryManDashboard;
