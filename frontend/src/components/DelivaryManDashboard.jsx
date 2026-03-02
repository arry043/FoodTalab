import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { useNavigate } from "react-router-dom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const DelivaryManDashboard = () => {
    const { userData, socket } = useSelector((state) => state.user);
    const actualUserData = userData?.data;
    const [availableAssignments, setAvailableAssignments] = React.useState([]);
    const [currentOrder, setCurrentOrder] = React.useState({});
    const hasCurrentOrder = currentOrder && currentOrder.assignmentId;
    const [showOtpBox, setShowOtpBox] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const [isSendingOtp, setIsSendingOtp] = React.useState(false);
    const [isDelivering, setIsDelivering] = React.useState(false);
    const [liveLocation, setLiveLocation] = React.useState(null);
    const [todayDeliveries, setTodayDeliveries] = React.useState([]);
    const navigate = useNavigate();

    // update delivery boy location every each second
    useEffect(() => {
        if (!socket || userData?.data?.role !== "deliveryBoy") return;
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLiveLocation({ lat: latitude, lng: longitude });
                    socket.emit("updateLocation", {
                        latitude,
                        longitude,
                        userId: userData?.data?._id,
                    });
                },
                (error) => {
                    console.log("Error getting location:", error);
                },
                {
                    enableHighAccuracy: true,
                    // maximumAge: 10000,
                    // timeout: 5000,
                },
            );
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [socket, userData]);

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
            await getCurrentOrder();
            console.log(result.data);
        } catch (error) {
            console.log("err: fetcing aceept order", error);
        }
    };

    const sendOtp = async (shopOrderId) => {
        setIsSendingOtp(true);
        try {
            const result = await axios.post(
                `${serverUrl}/api/order/send-delivery-otp`,
                {
                    orderId: currentOrder?._id,
                    shopOrderId: shopOrderId,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(result.data);
            setShowOtpBox(true);
        } catch (error) {
            console.log("err: sending otp", error);
        } finally {
            setIsSendingOtp(false);
        }
    };

    const verifyOtp = async (shopOrderId) => {
        setIsDelivering(true);
        try {
            const result = await axios.post(
                `${serverUrl}/api/order/verify-delivery-otp`,
                {
                    orderId: currentOrder?._id,
                    shopOrderId: shopOrderId,
                    otp,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(result.data);
            alert("Order delivered successfully!");
            navigate("/my-orders");
        } catch (error) {
            console.log("err: verifying otp", error);
            alert("Failed to verify OTP.");
        } finally {
            setIsDelivering(false);
        }
    };

    const getCurrentOrder = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-current-order`,
                {
                    withCredentials: true,
                },
            );
            setCurrentOrder(result?.data?.data);
            console.log("current order :", result.data);
        } catch (error) {
            console.log("err: fetcing aceept order", error);
        }
    };

    const handleTodayDeliveries = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-today-deliveries`,
                {
                    withCredentials: true,
                },
            );
            setTodayDeliveries(result?.data?.data || []);
            console.log("today deliveries:", result?.data?.data);
        } catch (error) {
            console.log("err: fetcing today deliveries", error);
        }
    };

    const formatHour = (hour) => {
        const h = parseInt(hour);
        const suffix = h >= 12 ? "PM" : "AM";
        const formatted = h % 12 === 0 ? 12 : h % 12;
        return `${formatted} ${suffix}`;
    };
    const totalTodayDeliveries = todayDeliveries.reduce(
        (sum, item) => sum + (item.count || 0),
        0,
    );

    const chartData = {
        labels: todayDeliveries.map((d) => formatHour(d.hour)),
        datasets: [
            {
                label: "# of Deliveries",
                data: todayDeliveries.map((d) => d.count),
                backgroundColor: "rgba(255, 77, 45, 0.25)", // soft brand fill
                borderColor: "#ff4d2d", // brand border
                borderWidth: 2,
                borderRadius: 10,
                hoverBackgroundColor: "rgba(255, 77, 45, 0.4)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#374151",
                    font: {
                        size: 13,
                        weight: "600",
                    },
                },
            },
            tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#6b7280",
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0,0,0,0.05)",
                },
                ticks: {
                    stepSize: 1,
                    color: "#6b7280",
                },
            },
        },
    };

    useEffect(() => {
        getAssignments();
        getCurrentOrder();
        handleTodayDeliveries();
    }, [userData]);

    useEffect(() => {
        if (socket) {
            socket.on("newDeliveryAssignment", (data) => {
                console.log("SOCKET NEW DELIVERY ASSIGNMENT:", data);
                getAssignments();
            });

            return () => {
                socket.off("newDeliveryAssignment");
            };
        }
    }, [socket]);

    console.log("availableAssignments:", availableAssignments);
    console.log("currentOrder:", currentOrder);
    console.log("liveLocation:", liveLocation);
    console.log("todayDeliveries:", todayDeliveries);

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

                {/* ===== DASHBOARD SUMMARY SECTION ===== */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* STATUS CARD */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Current Status
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                🟢 Available
                            </span>

                            <span className="text-2xl">🚚</span>
                        </div>
                    </div>

                    {/* TOTAL EARNINGS CARD */}
                    <div className="bg-gradient-to-br from-[#ffede8] to-white rounded-2xl shadow-md border border-orange-100 p-5 hover:shadow-lg transition">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Earnings
                        </p>

                        <div className="mt-3 flex items-end justify-between">
                            <h2 className="text-2xl font-bold text-[#ff4d2d]">
                                ₹0
                            </h2>

                            <span className="text-xs text-gray-400">
                                This Month
                            </span>
                        </div>
                    </div>

                    {/* TODAY DELIVERIES CARD */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Today Deliveries
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {totalTodayDeliveries}
                            </h2>

                            <span className="text-sm text-gray-400">
                                📦 Orders
                            </span>
                        </div>
                    </div>
                </div>

                {/* ===== DELIVERY ACTIVITY CHART SECTION ===== */}

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">
                            📊 Delivery Activity (Today)
                        </h3>

                        <span className="text-xs text-gray-400">Hour-wise</span>
                    </div>

                    <div className="h-[280px]">
                        {todayDeliveries.length > 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                No delivery data available today 📭
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Section */}

                {!hasCurrentOrder ? (
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
                                                Order #
                                                {order.orderId || "XXXXXX"}
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
                                                    {order.shopName ||
                                                        "Shop Name"}
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
                                                    {order.deliveryAddress
                                                        ?.text ||
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
                                                                {item.quantity ||
                                                                    1}
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
                                                💰 Total: ₹
                                                {order.subTotal || "0"}
                                            </p>

                                            <button
                                                onClick={() =>
                                                    acceptOrder(
                                                        order.assignmentId,
                                                    )
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
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold text-gray-800">
                                🚚 Current Delivery
                            </h2>

                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                {currentOrder?.shopOrder?.status}
                            </span>
                        </div>

                        {/* Shop Info */}
                        <div className="bg-gray-50 rounded-xl p-4 border mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                                🏪 Pickup From
                            </p>

                            <p className="text-sm font-medium text-gray-800">
                                {currentOrder?.shop?.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                📍 {currentOrder?.shop?.address},{" "}
                                {currentOrder?.shop?.city}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                📞 {currentOrder?.shop?.contact}
                            </p>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-gray-50 rounded-xl p-4 border mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                                🧍 Customer Details
                            </p>

                            <p className="text-sm font-medium text-gray-800">
                                {currentOrder?.customer?.fullName}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                📞 {currentOrder?.customer?.mobile}
                            </p>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-[#fff9f6] border border-orange-100 rounded-xl p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                                📦 Delivery Address
                            </p>

                            <p className="text-sm text-gray-700 leading-relaxed">
                                {currentOrder?.deliveryAddress?.text}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="bg-white border rounded-xl p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 mb-3">
                                🧾 Items
                            </p>

                            <div className="space-y-2">
                                {currentOrder?.shopOrder?.shopOrderItems?.map(
                                    (item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between text-sm text-gray-700"
                                        >
                                            <span className="flex-1">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-semibold">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="flex justify-between items-center border-t pt-4">
                            <div className="text-sm text-gray-600">
                                <p>Payment: {currentOrder?.paymentMethod}</p>
                                <p>
                                    Delivery Fee: ₹{currentOrder?.deliveryFee}
                                </p>
                            </div>

                            <p className="text-lg font-bold text-green-600">
                                ₹{currentOrder?.payableAmount}
                            </p>
                        </div>

                        {/* Delivery Boy Tracking */}
                        <DeliveryBoyTracking
                            data={currentOrder}
                            liveLocation={liveLocation}
                        />

                        {/* Action Section */}
                        <div className="mt-5 bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
                            {!showOtpBox ? (
                                <button
                                    onClick={() =>
                                        sendOtp(currentOrder?.shopOrder?._id)
                                    }
                                    disabled={isSendingOtp}
                                    className={`w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white transition ${isSendingOtp ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-[0.99]"}`}
                                >
                                    {isSendingOtp
                                        ? "Sending OTP..."
                                        : "📦 Mark Order as Delivered"}
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {/* Info */}
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        🔐 Enter OTP sent to{" "}
                                        <span className="font-semibold text-gray-800">
                                            {currentOrder?.customer?.fullName}
                                        </span>
                                    </p>

                                    {/* OTP + Button */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                            value={otp}
                                            placeholder="Enter 4-digit OTP"
                                            className="w-full sm:flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />

                                        <button
                                            onClick={() =>
                                                verifyOtp(
                                                    currentOrder?.shopOrder
                                                        ?._id,
                                                )
                                            }
                                            disabled={isDelivering || !otp}
                                            className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm sm:text-base font-semibold text-white transition ${isDelivering || !otp ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-[0.98]"}`}
                                        >
                                            {isDelivering
                                                ? "Verifying..."
                                                : "✅ Confirm Delivery"}
                                        </button>
                                    </div>

                                    {/* Cancel */}
                                    <button
                                        onClick={() => setShowOtpBox(false)}
                                        className="self-center text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DelivaryManDashboard;
