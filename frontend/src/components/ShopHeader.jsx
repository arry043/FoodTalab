import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ShopHeader = ({ shop }) => {
    const navigate = useNavigate();

    return (
        <div className="mt-17 relative w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden">
            {/* IMAGE */}
            <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50" />

            {/* 🔙 BACK BUTTON (inside image) */}
            <button
                onClick={() => navigate(-1)}
                className="
                    absolute top-4 left-4 z-20
                    flex items-center gap-1
                    bg-white/90 backdrop-blur
                    text-gray-800
                    px-3 py-1.5 rounded-full
                    shadow-md
                    hover:bg-white hover:scale-105
                    transition-all duration-200
                "
            >
                <IoIosArrowRoundBack size={26} />
                <span className="text-sm font-semibold">Back</span>
            </button>

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-end z-10">
                <div className="max-w-7xl mx-auto px-5 pb-6 text-white w-full">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {shop.name}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-200">
                        <span className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {shop.address}, {shop.city}
                        </span>

                        <span className="flex items-center gap-1">
                            <FaPhone />
                            {shop.contact}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopHeader;
