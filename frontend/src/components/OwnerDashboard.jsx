import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
    const { myShopData } = useSelector((state) => state.owner);
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
            <Navbar />

            {!myShopData && (
                <div className="min-h-screen flex justify-center items-center p-4 sm:p-6">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center text-center">
                            <GiForkKnifeSpoon className="text-[#ff4d2d] w-20 h-20 mb-5 sm:w-24 sm:h-24" />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                                Add Your Restuarent / Shop
                            </h1>
                            <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                                Join our food delivary platform{" "}
                                <span className="font-semibold text-[#ff4d2d]">
                                    FoodTalab
                                </span>{" "}
                                and reach thounds of customers hunger everyday
                            </p>
                            <Link
                                to="create-edit-shop"
                                className="cursor-pointer mt-5 px-6 py-2 rounded-full bg-[#ff4d2d] text-white text-sm sm:text-base font-semibold shadow-md hover:bg-[#fa7e65] hover:shadow-lg transition-all duration-300"
                            >
                                Get Started
                            </Link>{" "}
                        </div>
                    </div>
                </div>
            )}

            {myShopData && (
                <div className=" w-full flex flex-col items-center gap-6 px-4 sm:px-6 mt-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mt-8 text-center">
                        <GiForkKnifeSpoon className=" ■ text-[#ff4d2d] w-14 h-14 " />
                        Welcome to {myShopData.name}
                    </h1>
                    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-or ange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
                        <img
                            src={myShopData.image}
                            alt={myShopData.name}
                            className="w-full h-60 object-center sm:h-70"
                        />
                    </div>
                    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-orange-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Left Info */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                {myShopData.name}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                📍 {myShopData.city}, {myShopData.state}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                Address: {myShopData.address}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                Pincode: {myShopData.pincode}
                            </p>
                        </div>

                        {/* Right Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/create-edit-shop")}
                                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] hover:bg-[#ff4d2d]/20 transition"
                            >
                                Edit Shop
                            </button>

                            <Link
                                to={"add-item"}
                                className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e54326] transition shadow"
                            >
                                Add Items
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mt-2">
                        <div className="bg-white rounded-xl p-4 shadow border border-orange-100 text-center">
                            <p className="text-sm text-gray-500">Items</p>
                            <p className="text-xl font-bold text-gray-800">
                                {myShopData.items?.length || 0}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow border border-orange-100 text-center">
                            <p className="text-sm text-gray-500">Orders</p>
                            <p className="text-xl font-bold text-gray-800">0</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow border border-orange-100 text-center">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="text-sm font-semibold text-green-600">
                                Open
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow border border-orange-100 text-center">
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="text-xl font-bold text-gray-800">
                                ★ 4.5
                            </p>
                        </div>
                    </div>

                    {myShopData.items?.length === 0 && (
                        <div className=" flex justify-center items-center p-4 sm:p-6">
                            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <GiForkKnifeSpoon className="text-[#ff4d2d] w-15 h-15 mb-5 sm:w-20 sm:h-20" />
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-600 mb-2">
                                        Add Food Items
                                    </h1>
                                    <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                                        Start adding your delicious food items
                                        to your menu and make your shop live on{" "}
                                        <span className="font-semibold text-[#ff4d2d]">
                                            FoodTalab
                                        </span>
                                        . More items means more visibility and
                                        more orders! 🍽️
                                    </p>
                                    <Link
                                        to="add-item"
                                        className="cursor-pointer mt-5 px-6 py-2 rounded-full bg-[#ff4d2d] text-white text-sm sm:text-base font-semibold shadow-md hover:bg-[#fa7e65] hover:shadow-lg transition-all duration-300"
                                    >
                                        Add Items
                                    </Link>{" "}
                                </div>
                            </div>
                        </div>
                    )}

                    {myShopData.items?.length > 0 && (
                        <div className=" grid grid-cols-1 md:grid-cols-2 items-center gap-4 max-w-3xl">
                            {myShopData.items.map((item, index) => (
                                <OwnerItemCard key={index} data={item} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
