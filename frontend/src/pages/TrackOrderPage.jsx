import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { serverUrl } from "../config/api";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import CustomerTracking from "../components/CustomerTracking";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { LuBike, LuCheck, LuClock, LuMapPin, LuStore } from "react-icons/lu";

const orderSteps = [
    { key: "pending", label: "Confirmed", icon: FaCheckCircle },
    { key: "preparing", label: "Preparing", icon: LuClock },
    { key: "dispatched", label: "On the way", icon: LuBike },
    { key: "delivered", label: "Delivered", icon: LuCheck },
];

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

function TrackOrderPage() {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState({});
    const [liveLocations, setLiveLocations] = useState({});
    const { socket } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-order/${orderId}`,
                {
                    withCredentials: true,
                },
            );
            setCurrentOrder(result?.data?.data);
            console.log("current order user:", result.data);
        } catch (error) {
            console.log("get my orders Error:", error);
        }
    };

    useEffect(() => {
        if (!socket) return;
        socket.on(
            "updateDeliveryLocation",
            ({ deliveryBoyId, latitude, longitude }) => {
                setLiveLocations((prev) => ({
                    ...prev,
                    [deliveryBoyId]: { lat: latitude, lng: longitude },
                }));
            },
        );
        return () => {
            socket.off("updateDeliveryLocation");
        };
    }, [socket]);

    useEffect(() => {
        handleGetOrder();
    }, [orderId]);

    const getStepIndex = (status) => {
        return orderSteps.findIndex((s) => s.key === status);
    };

    return (
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-24">
            <Navbar />

            <div className="mx-auto w-full max-w-3xl px-4 pt-20 md:pt-24">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-5 flex items-center gap-1 text-sm font-black text-[var(--brand)] transition-all hover:gap-2"
                >
                    <IoIosArrowRoundBack size={26} />
                    Back
                </button>

                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-black text-gray-950">
                        Track your order
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Order status updates in real time.
                    </p>
                </div>

                {currentOrder?.shopOrders?.map((shopOrder, index) => {
                    const currentStatusIdx = getStepIndex(shopOrder.status);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="panel mb-6 overflow-hidden rounded-[2rem] p-5 sm:p-7"
                        >
                            {/* Header row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Suborder ID
                                    </p>
                                    <p className="text-sm font-black text-gray-800">
                                        #{shopOrder._id}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-black ${
                                        shopOrder.status === "delivered"
                                            ? "bg-green-50 text-green-700 border border-green-100"
                                            : "bg-orange-50 text-orange-700 border border-orange-100 animate-pulse"
                                    }`}
                                >
                                    {shopOrder.status}
                                </span>
                            </div>

                            {/* Status Timeline */}
                            <div className="mb-6 rounded-2xl bg-orange-50/20 border border-orange-100/30 p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    {orderSteps.map((step, sIdx) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = currentStatusIdx >= sIdx;
                                        const isCurrent = currentStatusIdx === sIdx;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                                <motion.div
                                                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                                                        isCompleted
                                                            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                                                            : "border-gray-200 bg-white text-gray-400"
                                                    } ${isCurrent ? "animate-pulse ring-4 ring-[var(--brand)]/15" : ""}`}
                                                    animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                >
                                                    <StepIcon size={16} />
                                                </motion.div>
                                                <span className={`mt-2 text-center text-[10px] font-black tracking-wide sm:text-xs ${
                                                    isCompleted ? "text-gray-900" : "text-gray-400"
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Ordered By Shop */}
                            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 border p-4">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-[var(--brand)]">
                                    <LuStore size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Ordered from
                                    </p>
                                    <p className="truncate text-base font-black text-gray-800">
                                        {shopOrder.shop?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Items details */}
                            <div className="mb-4">
                                <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">
                                    Items
                                </p>
                                <div className="space-y-2">
                                    {shopOrder.shopOrderItems?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between rounded-xl bg-gray-50/50 px-3 py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <img
                                                    src={item.item?.image}
                                                    alt=""
                                                    className="size-10 rounded-lg object-cover shadow-sm"
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-gray-800">
                                                        {item.item?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-950">
                                                ₹{item.item?.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Location */}
                            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-orange-50/30 border border-orange-100/30 p-4">
                                <LuMapPin className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Delivery address
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-gray-700">
                                        {currentOrder?.delivaryAddress?.text}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Boy Info & Live Map */}
                            {shopOrder?.status !== "delivered" ? (
                                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                                    {shopOrder?.assignedDeliveryBoy ? (
                                        <>
                                            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">
                                                Delivery partner
                                            </p>

                                            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                                                <div className="flex size-11 items-center justify-center rounded-full bg-green-50 font-black text-green-600">
                                                    {shopOrder.assignedDeliveryBoy.fullName[0].toUpperCase()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate font-black text-gray-800">
                                                        {shopOrder.assignedDeliveryBoy.fullName}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-semibold">
                                                        📞 {shopOrder.assignedDeliveryBoy.mobile}
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">
                                                    On the way
                                                </span>
                                            </div>

                                            {/* Map Container */}
                                            <div className="overflow-hidden rounded-2xl shadow-inner border border-gray-100">
                                                <CustomerTracking
                                                    data={{
                                                        deliveryBoyLocation: liveLocations[
                                                            shopOrder.assignedDeliveryBoy._id
                                                        ] || {
                                                            lat: shopOrder.assignedDeliveryBoy.location?.coordinates?.[1] || 0,
                                                            lng: shopOrder.assignedDeliveryBoy.location?.coordinates?.[0] || 0,
                                                        },
                                                        customerLocation: {
                                                            lat: currentOrder?.delivaryAddress?.lattitude || 0,
                                                            lng: currentOrder?.delivaryAddress?.longitude || 0,
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-2 text-center text-sm font-semibold text-gray-400">
                                            ⌛ Waiting to assign delivery partner
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-green-50/50 p-4 text-center font-bold text-green-700 border border-green-100/50">
                                    🎉 Delivered successfully
                                </div>
                            )}

                            {/* Subtotal Footer */}
                            <div className="mt-5 flex items-center justify-between border-t border-dashed border-gray-100 pt-4">
                                <p className="text-sm font-bold text-gray-500">Subtotal</p>
                                <p className="text-xl font-black text-green-600">
                                    ₹{shopOrder.subTotal}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default TrackOrderPage;
