import Navbar from "../components/Navbar";
import UserOrdersCard from "../components/UserOrdersCard";
import { useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import OwnerOrderCard from "../components/OwnerOrderCard";
import { IoFastFoodOutline } from "react-icons/io5";

function MyOrders() {
    const navigate = useNavigate();
    const { userData, myOrders } = useSelector((state) => state.user);
    return (
        <div className="min-h-screen w-full bg-[#fff9f6] flex justify-center">
            <Navbar />
            <div className="w-full mt-15 md:mt-22 max-w-[800px]">
                {/* 🔙 BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex cursor-pointer items-center mt-5 gap-1 text-[#ff4d2d] mb-4"
                >
                    <IoIosArrowRoundBack size={30} />
                    <span className="font-medium">Back</span>
                </button>

                {/* USER ORDERS */}
                {userData.data.role === "user" && (
                    <div>
                        {/* Page Header */}
                        <div className="w-full max-w-6xl px-4 mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                My Orders 🍽️
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Track your recent and past food orders
                            </p>
                        </div>

                        {/* Orders List */}
                        <div className="w-full max-w-6xl px-4 pb-10 grid gap-5">
                            {myOrders.length === 0 && (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                                    <div className="bg-[#fff1ec] p-4 rounded-full mb-4">
                                        <IoFastFoodOutline
                                            className="text-[#ff4d2d]"
                                            size={40}
                                        />
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-700">
                                        No Orders Yet
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                        Looks like you haven’t placed any orders
                                        yet. Start exploring and satisfy your
                                        cravings 😋
                                    </p>

                                    {userData.data.role === "user" && (
                                        <button
                                            onClick={() => navigate("/")}
                                            className="mt-5 px-6 py-2 rounded-xl bg-[#ff4d2d] text-white text-sm hover:bg-[#e64427] transition"
                                        >
                                            Explore Food
                                        </button>
                                    )}
                                </div>
                            )}
                            {myOrders.map((order, index) => (
                                <UserOrdersCard key={index} order={order} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* OWNER ORDERS */}
                {userData.data.role === "owner" && (
                    <div>
                        {/* Page Header */}
                        <div className="w-full max-w-6xl px-4 mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Pending Orders 🍽️
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Deliver your food to your customers as soon as
                            </p>
                        </div>

                        {/* Orders List */}
                        <div className="w-full max-w-6xl px-4 pb-10 grid gap-5">
                            {myOrders.length === 0 && (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center shadow-sm">
                                    <div className="bg-[#fff1ec] p-4 rounded-full mb-4">
                                        <IoFastFoodOutline
                                            className="text-[#ff4d2d]"
                                            size={40}
                                        />
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-700">
                                        No Orders Yet
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                        Looks like no orders have been placed to your shop yet. Start accepting orders and satisfy your cravings 😋
                                    </p>

                                    {userData.data.role === "user" && (
                                        <button
                                            onClick={() => navigate("/")}
                                            className="mt-5 px-6 py-2 rounded-xl bg-[#ff4d2d] text-white text-sm hover:bg-[#e64427] transition"
                                        >
                                            Explore Food
                                        </button>
                                    )}
                                </div>
                            )}

                            {myOrders.map((order, index) => (
                                <OwnerOrderCard key={index} order={order} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
