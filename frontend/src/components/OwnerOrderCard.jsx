import React from "react";
import { MdLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

function OwnerOrderCard() {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
            {/* Top Row */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaUserCircle className="text-[#ff4d2d]" />
                        Customer Name
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MdLocationOn />
                        Hostel Block C, CCS University
                    </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    Pending
                </span>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-dashed"></div>

            {/* Items */}
            <div className="space-y-1 text-sm text-gray-600">
                <p>🍕 Cheese Pizza x1</p>
                <p>🥤 Cold Drink x2</p>
                <p>🍟 Fries x1</p>
            </div>

            {/* Bottom Info */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                    <IoTimeOutline />
                    10 mins ago
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">Bill</p>
                    <p className="text-lg font-bold text-gray-800">₹420</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
                <button className="flex-1 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition">
                    Accept
                </button>
                <button className="flex-1 py-2 text-sm rounded-xl bg-red-500 text-white hover:bg-red-600 transition">
                    Reject
                </button>
            </div>
        </div>
    );
}

export default OwnerOrderCard;
