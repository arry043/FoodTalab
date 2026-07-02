import React, { useState } from "react";
import { FaStore } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../config/api";
import { motion, AnimatePresence } from "framer-motion";
import { LuCheck, LuNavigation } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";

function UserOrdersCard({ order }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isRatingMode, setIsRatingMode] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);

    const isFullyDelivered = order?.shopOrders?.every(
        (so) => so.status === "delivered",
    );

    const handleRating = async () => {
        try {
            setSubmittingRating(true);
            const itemIds = new Set();
            order?.shopOrders?.forEach((shopOrder) => {
                shopOrder?.shopOrderItems?.forEach((orderItem) => {
                    if (orderItem?.item?._id) {
                        itemIds.add(orderItem.item._id);
                    }
                });
            });

            const uniqueItemIds = Array.from(itemIds);

            if (uniqueItemIds.length === 0) {
                toast.error("No items found to rate.");
                return;
            }

            await Promise.all(
                uniqueItemIds.map((itemId) =>
                    axios.post(
                        `${serverUrl}/api/item/rating`,
                        {
                            itemId,
                            rating,
                        },
                        { withCredentials: true },
                    ),
                ),
            );

            setIsSubmitted(true);
            setIsRatingMode(false);
            toast.success("Thank you for your rating!");
        } catch (error) {
            console.log("Rating Submission Error:", error);
            toast.error("Could not submit rating. Please try again.");
        } finally {
            setSubmittingRating(false);
        }
    };

    const formatOrderTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();

        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);

        const plural = (value, word) =>
            `${value} ${word}${value === 1 ? "" : "s"} ago`;

        if (now.toDateString() === date.toDateString()) {
            if (diffSec < 60) {
                return plural(diffSec, "second");
            }
            if (diffMin < 60) {
                return plural(diffMin, "minute");
            }
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

    const navigate = useNavigate();

    return (
        <div className="panel overflow-hidden border border-orange-100 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/30">
            {/* Top Row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Order ID: #{order?._id}
                    </h4>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                        <IoTimeOutline size={14} className="text-[var(--brand)]" />
                        {formatOrderTime(order?.createdAt)}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                            order?.paymentMethod === "COD"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-purple-50 text-purple-700 border-purple-100"
                        }`}
                    >
                        {order?.paymentMethod === "COD" ? "💵 COD" : "💳 Online"}
                    </span>
                    <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                            order?.payment ||
                            order?.shopOrders?.some((so) => so.status === "delivered")
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100"
                        }`}
                    >
                        {order?.payment ||
                        order?.shopOrders?.some((so) => so.status === "delivered")
                            ? "✅ Paid"
                            : "⏳ Unpaid"}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-dashed border-orange-100" />

            {/* Shop Details & Items */}
            <div className="space-y-4">
                {order?.shopOrders?.map((shopOrder, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-base font-black text-gray-900">
                                    <FaStore className="text-[var(--brand)]" />
                                    {shopOrder?.shop?.name}
                                </h2>
                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                    <MdLocationOn className="text-sm text-gray-300" />
                                    {shopOrder?.shop?.address}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    shopOrder?.status === "delivered"
                                        ? "bg-green-50 text-green-700 border border-green-100"
                                        : "bg-orange-50 text-orange-700 border border-orange-100 animate-pulse"
                                }`}
                            >
                                {shopOrder?.status}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="grid gap-2 sm:grid-cols-2">
                            {shopOrder?.shopOrderItems?.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-2xl bg-orange-50/30 border border-orange-100/30 p-2.5"
                                >
                                    <img
                                        src={item.item?.image}
                                        className="size-11 rounded-xl object-cover shadow-sm"
                                        alt=""
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-black text-gray-800">
                                            {item?.name}
                                        </p>
                                        <p className="mt-0.5 text-[10px] font-bold text-gray-400">
                                            ₹{item?.price} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="text-xs font-black text-gray-900">
                                        ₹{item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Sub Total */}
                        <div className="flex justify-end text-xs font-bold text-gray-500">
                            Subtotal: <span className="ml-1 text-gray-950">₹{shopOrder?.subTotal}</span>
                        </div>

                        {/* Divider only if not last shop order */}
                        {idx !== order.shopOrders.length - 1 && (
                            <div className="my-3 border-t border-dashed border-orange-100" />
                        )}
                    </div>
                ))}
            </div>

            {/* Bill Summary */}
            <div className="mt-4 rounded-2xl bg-orange-50/50 border border-orange-100/50 p-4">
                <div className="flex justify-between text-xs text-gray-600">
                    <span>Item total</span>
                    <span className="font-bold">₹{order?.itemTotal || order?.totalAmount}</span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span>Delivery fee</span>
                    {order?.delivaryFee === 0 ? (
                        <div className="flex gap-2">
                            <span className="line-through text-gray-400">₹49</span>
                            <span className="font-bold text-green-600">Free</span>
                        </div>
                    ) : (
                        <span className="font-bold">₹{order?.delivaryFee}</span>
                    )}
                </div>

                <div className="my-3 border-t border-dashed border-orange-100" />

                <div className="flex justify-between items-center text-sm font-black text-gray-900">
                    <span>Grand total</span>
                    <span className="text-lg text-[var(--brand)]">
                        ₹{order?.payableAmount}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
                {/* Track Order */}
                {!isFullyDelivered && (
                    <motion.button
                        onClick={() => navigate(`/track-order/${order?._id}`)}
                        className="btn-ghost flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black"
                        whileTap={{ scale: 0.97 }}
                    >
                        <LuNavigation size={14} />
                        Track order
                    </motion.button>
                )}

                {/* Rating Section */}
                {isFullyDelivered && (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-orange-50/20 border border-orange-100/30 p-2 sm:flex-row sm:justify-between sm:px-3">
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={18}
                                    onClick={() => {
                                        if (!isSubmitted) {
                                            setRating(star);
                                            setIsRatingMode(true);
                                        }
                                    }}
                                    onMouseEnter={() => !isSubmitted && setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className={`transition-all duration-200 ${
                                        isSubmitted ? "cursor-default" : "cursor-pointer"
                                    } ${
                                        star <= (hover || rating)
                                            ? "fill-yellow-400 text-yellow-400 scale-110"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>

                        <AnimatePresence>
                            {isRatingMode && !isSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mt-2 flex w-full gap-1.5 sm:mt-0 sm:w-auto"
                                >
                                    <button
                                        onClick={handleRating}
                                        disabled={submittingRating}
                                        className="btn-primary rounded-lg px-3 py-1 text-[10px] font-black flex items-center gap-1"
                                    >
                                        {submittingRating ? (
                                            <ImSpinner2 className="size-3 animate-spin" />
                                        ) : (
                                            <LuCheck size={12} />
                                        )}
                                        Submit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRating(0);
                                            setIsRatingMode(false);
                                        }}
                                        disabled={submittingRating}
                                        className="rounded-lg bg-gray-200 px-3 py-1 text-[10px] font-black text-gray-700 hover:bg-gray-300 transition"
                                    >
                                        Reset
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSubmitted && (
                            <span className="mt-1 text-[10px] font-bold text-green-600 sm:mt-0">
                                Rated!
                            </span>
                        )}
                    </div>
                )}

                {/* Reorder Button */}
                {!isRatingMode && (
                    <motion.button
                        onClick={() => navigate("/")}
                        className="btn-primary flex-1 rounded-xl py-2 text-xs font-black"
                        whileTap={{ scale: 0.97 }}
                    >
                        Reorder
                    </motion.button>
                )}
            </div>
        </div>
    );
}

export default UserOrdersCard;
