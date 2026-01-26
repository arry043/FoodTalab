import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

function OrderPlaced() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">

            {/* 🎉 Decorative Circles */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-70"></div>

            {/* ✅ MAIN CARD */}
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full z-10">

                {/* CHECK ICON */}
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Order Placed Successfully 🎉
                </h1>

                <p className="text-gray-500 text-sm mb-6">
                    Your delicious food is being prepared.  
                    Sit back and relax, we’ll deliver it soon 😋
                </p>

                {/* ORDER STATUS */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-600">
                        Estimated Delivery Time
                    </p>
                    <p className="text-lg font-semibold text-[#ff4d2d]">
                        30 – 40 mins 
                    </p>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold hover:bg-[#e64528] transition"
                    >
                        Track Order
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full border border-[#ff4d2d] text-[#ff4d2d] py-3 rounded-xl font-semibold hover:bg-[#ff4d2d] hover:text-white transition"
                    >
                        Order More Food 😋
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderPlaced;
