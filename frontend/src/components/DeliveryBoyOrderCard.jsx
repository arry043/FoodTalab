import React from "react";
import { MdPhone } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LuMailCheck } from "react-icons/lu";

function DeliveryBoyOrderCard({ order }) {
    const formatOrderTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);

        const plural = (value, word) =>
            `${value} ${word}${value === 1 ? "" : "s"} ago`;

        if (now.toDateString() === date.toDateString()) {
            if (diffSec < 60) return plural(diffSec, "second");
            if (diffMin < 60) return plural(diffMin, "minute");
            return plural(diffHr, "hour");
        }

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

                    <div className="border-t border-dashed"></div>

                    {/* Delivery Address */}
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                            📍 Delivered To
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed break-words">
                            {order?.delivaryAddress?.text}
                        </p>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col items-end gap-2 self-end md:self-auto">
                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${order?.paymentMethod === "COD" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-purple-100 text-purple-700 border-purple-200"}`}
                        >
                            {order?.paymentMethod === "COD"
                                ? "💵 COD"
                                : "💳 Online"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-700 border-green-200">
                            ✅ Paid
                        </span>
                    </div>
                    <span className="inline-block text-xs px-3 py-1 border border-green-200 rounded-full bg-green-100 text-green-700 font-medium">
                        Delivered
                    </span>
                </div>
            </div>

            <div className="my-4 border-t border-dashed"></div>

            {/* Items */}
            <div className="mt-4 space-y-3">
                {order?.shopOrders[0]?.shopOrderItems?.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100"
                    >
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
                    {formatOrderTime(
                        order?.shopOrders[0]?.deliveredAt || order?.createdAt,
                    )}
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Earned</p>
                    <p className="text-lg font-bold text-green-600">
                        ₹{order?.delivaryFee || 49}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DeliveryBoyOrderCard;
