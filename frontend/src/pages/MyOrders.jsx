import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserOrdersCard from "../components/UserOrdersCard";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OwnerOrderCard from "../components/OwnerOrderCard";
import DeliveryBoyOrderCard from "../components/DeliveryBoyOrderCard";
import { IoFastFoodOutline } from "react-icons/io5";
import { setMyOrders } from "../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { LuHistory, LuListTodo } from "react-icons/lu";

const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

function MyOrders() {
    const navigate = useNavigate();
    const { userData, myOrders, socket } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("active"); // "active" or "history"

    useEffect(() => {
        if (!socket) return;
        socket.on("newOrder", (response) => {
            console.log("SOCKET NEW ORDER DATA:", response);
            const newOrderData = response.data;

            if (
                newOrderData?.shopOrders?.owner?._id === userData?.data?._id ||
                newOrderData?.shopOrders?.owner === userData?.data?._id
            ) {
                const formattedOrder = {
                    ...newOrderData,
                    shopOrders: [newOrderData.shopOrders],
                };
                dispatch(setMyOrders([formattedOrder, ...myOrders]));
            }
        });
        return () => {
            socket?.off("newOrder");
        };
    }, [socket, userData?.data?._id, myOrders, dispatch]);

    const isFullyDelivered = (order) => {
        return order?.shopOrders?.every((so) => so.status === "delivered");
    };

    // Filter orders based on active tab
    const filteredOrders = myOrders.filter((order) => {
        if (userData?.data?.role === "user") {
            const delivered = isFullyDelivered(order);
            return activeTab === "active" ? !delivered : delivered;
        }
        // For owner or delivery boy, we display all or filter similarly if status is available
        return true;
    });

    const renderEmptyState = (title, description, buttonText, onClick) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="panel flex flex-col items-center justify-center p-8 text-center sm:p-12"
        >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50 text-[var(--brand)]">
                <IoFastFoodOutline size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-950">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{description}</p>
            {buttonText && onClick && (
                <button onClick={onClick} className="btn-primary mt-6 rounded-full px-6 py-2.5 text-sm font-black">
                    {buttonText}
                </button>
            )}
        </motion.div>
    );

    return (
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-16">
            <Navbar />
            <div className="mx-auto w-full max-w-[800px] px-4 pt-20 md:pt-24">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-1 text-sm font-black text-[var(--brand)] transition-all hover:gap-2"
                >
                    <IoIosArrowRoundBack size={26} />
                    Back
                </button>

                {/* USER ROLE FLOW */}
                {userData?.data?.role === "user" && (
                    <div>
                        {/* Page Header */}
                        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-gray-950">
                                    My orders
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Track and view your recent food orders.
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 flex gap-2 rounded-2xl bg-orange-50/50 p-1.5 border border-orange-100/50">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                                    activeTab === "active"
                                        ? "bg-white text-[var(--brand)] shadow-sm border border-orange-100"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                <LuListTodo size={14} />
                                Active orders
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black transition-all ${
                                    activeTab === "history"
                                        ? "bg-white text-[var(--brand)] shadow-sm border border-orange-100"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                <LuHistory size={14} />
                                Order history
                            </button>
                        </div>

                        {/* Orders List */}
                        <AnimatePresence mode="wait">
                            {filteredOrders.length === 0 ? (
                                <div key="empty">
                                    {activeTab === "active"
                                        ? renderEmptyState(
                                              "No active orders",
                                              "You don't have any ongoing deliveries. Satisfy your cravings now!",
                                              "Explore food",
                                              () => navigate("/")
                                          )
                                        : renderEmptyState(
                                              "No order history",
                                              "Looks like you haven't placed any orders yet.",
                                              "Explore food",
                                              () => navigate("/")
                                          )}
                                </div>
                            ) : (
                                <motion.div
                                    key="list"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-5"
                                >
                                    {filteredOrders.map((order, index) => (
                                        <motion.div
                                            key={order._id || index}
                                            variants={{
                                                hidden: { opacity: 0, y: 15 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <UserOrdersCard order={order} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* OWNER ROLE FLOW */}
                {userData?.data?.role === "owner" && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl font-black tracking-tight text-gray-950">
                                Pending orders
                            </h1>
                            <p className="text-sm text-gray-500">
                                Prepare and deliver orders to your customers as fast as possible.
                            </p>
                        </div>

                        {myOrders.length === 0 ? (
                            renderEmptyState(
                                "No orders yet",
                                "No customers have placed orders to your shop yet. Once they do, they'll appear here."
                            )
                        ) : (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-5"
                            >
                                {myOrders.map((order, index) => (
                                    <motion.div
                                        key={order._id || index}
                                        variants={{
                                            hidden: { opacity: 0, y: 15 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <OwnerOrderCard order={order} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                )}

                {/* DELIVERY BOY ROLE FLOW */}
                {userData?.data?.role === "deliveryBoy" && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl font-black tracking-tight text-gray-950">
                                Delivery history
                            </h1>
                            <p className="text-sm text-gray-500">
                                Track all your completed deliveries.
                            </p>
                        </div>

                        {myOrders.length === 0 ? (
                            renderEmptyState(
                                "No deliveries yet",
                                "You haven't completed any deliveries yet. Head to the dashboard to accept deliveries.",
                                "Go to Dashboard",
                                () => navigate("/")
                            )
                        ) : (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-5"
                            >
                                {myOrders.map((order, index) => (
                                    <motion.div
                                        key={order._id || index}
                                        variants={{
                                            hidden: { opacity: 0, y: 15 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <DeliveryBoyOrderCard order={order} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default MyOrders;
