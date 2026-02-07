import React from "react";
import { FaUserTie, FaEnvelope } from "react-icons/fa";

const OwnerCard = ({ owner }) => {
    return (
        <div className="max-w-7xl mx-auto px-5 mt-8">
            <div
                className="bg-white rounded-2xl shadow-md
                p-5 flex flex-col sm:flex-row gap-4
                items-start sm:items-center"
            >
                <div
                    className="w-14 h-14 rounded-full bg-[#ff4d2d]
                    flex items-center justify-center text-white text-xl"
                >
                    <FaUserTie />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {owner.fullName}
                    </h3>

                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <FaEnvelope />
                        {owner.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OwnerCard;
