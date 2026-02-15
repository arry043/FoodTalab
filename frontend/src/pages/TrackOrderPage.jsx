import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import CustomerTracking from "../components/CustomerTracking";

function TrackOrderPage() {
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState({});
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
        handleGetOrder();
    }, [orderId]);

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 pb-24">
            <div className="w-full md:mt-10 mt-5 max-w-3xl">
                {/* 🔙 BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-[#ff4d2d] mb-4"
                >
                    <IoIosArrowRoundBack size={30} />
                    <span className="font-medium">Back</span>
                </button>

                <h1 className="text-2xl text-center font-bold mb-5">
                    Track Your Order
                </h1>

                {currentOrder?.shopOrders?.map((shopOrder, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 
        p-5 sm:p-6 mb-6 animate-fadeIn transition-all"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Order ID
                                </p>
                                <p className="font-semibold text-gray-800">
                                    #{shopOrder._id}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                    shopOrder.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700 animate-pulse"
                }`}
                            >
                                {shopOrder.status}
                            </span>
                        </div>

                        {/* Shop Info */}
                        <div className="bg-gray-50 rounded-2xl p-4 border mb-4">
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                                🏪 Ordered By
                            </p>
                            <p className="text-base font-semibold text-gray-800">
                                {shopOrder.shop.name}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 mb-2">
                                🧾 Items
                            </p>

                            <div className="space-y-2">
                                {shopOrder.shopOrderItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center text-sm 
                        bg-gray-50 px-3 py-2 rounded-xl"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.item.image}
                                                alt=""
                                                className="h-10 w-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {item.item.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="font-semibold text-gray-800">
                                            ₹{item.item.price}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-[#fff9f6] border border-orange-100 rounded-2xl p-4 mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                📍 Delivery Address
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {currentOrder?.delivaryAddress?.text}
                            </p>
                        </div>

                        {/* Delivery Boy */}
                        {shopOrder?.status !== "delivered" ? (
                            <div className="bg-white border rounded-2xl p-4 mb-4">
                                {shopOrder?.assignedDeliveryBoy ? (
                                    <>
                                        <p className="text-xs font-semibold text-gray-500 mb-2">
                                            🧑‍✈️ Delivery Partner
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-12 w-12 rounded-full bg-green-100 
                                flex items-center justify-center font-bold text-green-600"
                                            >
                                                {
                                                    shopOrder
                                                        .assignedDeliveryBoy
                                                        .fullName[0]
                                                }
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        shopOrder
                                                            .assignedDeliveryBoy
                                                            .fullName
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    { 
                                                        shopOrder
                                                            .assignedDeliveryBoy
                                                            .mobile
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className="text-xs px-2 py-1 rounded-full 
                                bg-green-100 text-green-700"
                                            >
                                                On the way
                                            </span>
                                        </div>

                                        {/* Map */}
                                        <div className="mt-2 overflow-hidden rounded-2xl">
                                            <CustomerTracking
                                                data={{
                                                    deliveryBoyLocation: {
                                                        lat: shopOrder
                                                            .assignedDeliveryBoy
                                                            .location
                                                            .coordinates[1],
                                                        lng: shopOrder
                                                            .assignedDeliveryBoy
                                                            .location
                                                            .coordinates[0],
                                                    },
                                                    customerLocation: {
                                                        lat: currentOrder
                                                            ?.delivaryAddress
                                                            ?.lattitude,
                                                        lng: currentOrder
                                                            ?.delivaryAddress
                                                            ?.longitude,
                                                    },
                                                }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No delivery partner assigned yet
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-green-600 font-semibold">
                                ✅ Delivered Successfully
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-between items-center border-t pt-4">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-green-600">
                                ₹{shopOrder.subTotal}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrackOrderPage;
