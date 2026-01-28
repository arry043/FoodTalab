import React from "react";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LuMailCheck } from "react-icons/lu";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerOrderCard({ order, key }) {
    const dispatch = useDispatch();

    const formatOrderTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();

        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);

        const plural = (value, word) =>
            `${value} ${word}${value === 1 ? "" : "s"} ago`;

        // ✅ If today
        if (now.toDateString() === date.toDateString()) {
            if (diffSec < 60) {
                return plural(diffSec, "second");
            }
            if (diffMin < 60) {
                return plural(diffMin, "minute");
            }
            return plural(diffHr, "hour");
        }

        // ✅ If older than today
        const formattedDate = date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        return `${formattedDate} • ${formattedTime}`;
    };

    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.put(
                `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
                {
                    status,
                },
                {
                    withCredentials: true,
                },
            );
            const newStatus = result.data.data.shopOrders[0].status;
            dispatch(updateOrderStatus({ orderId, shopId, status: newStatus }));
            console.log("update staus: ", result);
        } catch (error) {
            console.log("update status error: ", error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
            {/* Top Row */}
            <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-4">
                {/* Customer + Address Card */}
                <div className="bg-[#fff9f6] w-full md:max-w-[420px] border border-[#ffd5c8] rounded-2xl p-4 space-y-3">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#ffebe4] p-2 rounded-full shrink-0">
                            <FaUserCircle
                                size={26}
                                className="text-[#ff4d2d]"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-gray-800 truncate">
                                {order?.user?.fullName}
                            </h2>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-0.5">
                                <span className="flex items-center gap-1 truncate">
                                    <LuMailCheck className="text-sm shrink-0" />
                                    <span className="truncate">
                                        {order?.user?.email}
                                    </span>
                                </span>

                                <span className="flex items-center gap-1">
                                    <MdPhone className="text-sm shrink-0" />
                                    {order?.user?.mobile}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed"></div>

                    {/* Delivery Address */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                            📍 Deliver Here
                        </p>

                        <p className="text-xs text-gray-600 leading-relaxed break-words">
                            {order?.delivaryAddress?.text}
                        </p>

                        <p className="text-[11px] text-gray-400 mt-1">
                            Lat: {order?.delivaryAddress?.lattitude} | Lng:{" "}
                            {order?.delivaryAddress?.longitude}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="self-end md:self-auto">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        {order?.shopOrders[0]?.status}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-dashed"></div>

            {/* Items */}
            <div className="mt-4 space-y-3">
                {order?.shopOrders[0]?.shopOrderItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100"
                    >
                        {/* Left: Image + Name */}
                        <div className="flex items-center gap-3">
                            <img
                                src={item?.item?.image}
                                alt={item?.item?.name}
                                className="h-12 w-12 rounded-lg object-cover"
                            />

                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {item?.item?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Qty: {item?.quantity}
                                </p>
                            </div>
                        </div>

                        {/* Right: Price */}
                        <div className="text-sm font-semibold text-gray-800">
                            ₹{item?.item?.price * item?.quantity}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Info */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <IoTimeOutline />
                    {formatOrderTime(order?.createdAt)}
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">Bill</p>
                    <p className="text-lg font-bold text-gray-800">
                        ₹{order?.shopOrders[0]?.subTotal}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}

            {/* Status Control */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>Change Status:</span>
                    <select
                        value={order?.shopOrders[0]?.status}
                        onChange={(e) =>
                            handleUpdateStatus(
                                order?._id,
                                order?.shopOrders[0]?.shop?._id,
                                e.target.value,
                            )
                        }
                        className="px-3 py-2 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
                    >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="outForDelivery">Out for Delivery</option>
                    </select>
                </div>

                <button className="px-5 py-2 rounded-xl bg-[#ff4d2d] text-white text-sm hover:bg-[#e64427] transition">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default OwnerOrderCard;
