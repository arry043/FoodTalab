import React from "react";
import { FaStore } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function UserOrdersCard({ order, index }) {
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

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
            {/* Top Row */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h4 className="text-xs text-gray-500 mb-1">
                        Order ID: #{order?._id}
                    </h4>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        <IoTimeOutline />
                        {formatOrderTime(order?.createdAt)}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border
                    ${
                        order?.paymentMethod === "COD"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-green-100 text-green-700 border-green-200"
                    }`}
                    >
                        {order?.paymentMethod === "COD"
                            ? "💵 Cash on Delivery"
                            : "💳 Online Paid"}
                    </span>
                </div>
            </div>
            {/* Divider */}
            <div className="my-4 border-t border-dashed"></div>

            <div>
                {order?.shopOrders?.map((shopOrder, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FaStore className="text-[#ff4d2d]" />
                                    {shopOrder?.shop?.name}
                                </h2>

                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <MdLocationOn className="text-sm" />
                                    {shopOrder?.shop?.address}
                                </p>
                            </div>

                            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                {shopOrder?.status}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="mt-5 space-y-2 text-sm text-gray-600">
                            {shopOrder?.shopOrderItems?.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex flex-row items-center gap-3 bg-gray-50 p-2 rounded-xl"
                                >
                                    <img
                                        src={item.item?.image}
                                        className="w-12 h-12 rounded-full object-cover"
                                        alt=""
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item?.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ₹{item?.price} x {item.quantity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Row */}
                        <div className="mt-4 flex justify-end">
                            <div className="text-right flex gap-2">
                                <p className="text-xs text-gray-400">
                                    Sub Total:
                                </p>
                                <p className="text-xs font-bold text-gray-800">
                                    ₹{shopOrder?.subTotal}
                                </p>
                            </div>
                        </div>

                        {/* 👇 Divider only if NOT last shop order */}
                        {idx !== order.shopOrders.length - 1 && (
                            <div className="my-4 border-t border-dashed"></div>
                        )}
                    </div>
                ))}
                {/* Bill Summary */}
                <div className="mt-5 bg-[#fff1ec] border border-[#ffd5c8] rounded-2xl p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Item Total</span>
                        <span>₹{order?.itemTotal || order?.totalAmount}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Delivery Fee</span>
                        {order?.delivaryFee === 0 ? (
                            <div className="flex gap-3">
                                <span className="line-through text-gray-400">
                                    ₹49
                                </span>
                                <span className="text-green-600 font-semibold">
                                    Free
                                </span>
                            </div>
                        ) : (
                            <span>₹{order?.delivaryFee}</span>
                        )}
                    </div>

                    <div className="border-t border-dashed my-3"></div>

                    <div className="flex justify-between items-center text-base font-bold text-gray-800">
                        <span>Grand Total</span>
                        <span className="text-[#ff4d2d] text-lg">
                            ₹{order?.payableAmount}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
                <button onClick={()=> navigate(`/track-order/${order?._id}`)} className="flex-1 py-2 text-sm rounded-xl border border-[#ff4d2d] text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition">
                    Track Order
                </button>
                <button onClick={()=> navigate("/")}  className="flex-1 py-2 text-sm rounded-xl bg-[#ff4d2d] text-white hover:bg-[#e64427] transition">
                    Reorder
                </button>
            </div>
        </div>
    );
}

export default UserOrdersCard;
