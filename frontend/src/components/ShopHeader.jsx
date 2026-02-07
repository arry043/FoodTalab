import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const ShopHeader = ({ shop }) => {
    return (
        <div className="relative w-full h-[260px] md:h-[320px]">
            {/* IMAGE */}
            <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/50" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-end">
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
