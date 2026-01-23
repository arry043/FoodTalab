import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { GiForkKnifeSpoon } from "react-icons/gi";

const OwnerDashboard = () => {
    const { myShopData } = useSelector((state) => state.owner);

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
                            <button className="cursor-pointer mt-5 px-6 py-2 rounded-full bg-[#ff4d2d] text-white text-sm sm:text-base font-semibold shadow-md hover:bg-[#fa7e65] hover:shadow-lg transition-all duration-300">
                                Get Started
                            </button>{" "}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
