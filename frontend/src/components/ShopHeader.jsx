import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ShopHeader = ({ shop }) => {
    const navigate = useNavigate();

    return (
        <div className="relative w-full pt-16">
            <div className="relative h-[260px] w-full overflow-hidden rounded-b-[2rem] shadow-lg md:h-[340px]">
                {/* IMAGE */}
                <motion.img
                    initial={{ scale: 1.05, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={shop.image}
                    alt={shop.name}
                    className="h-full w-full object-cover"
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg hover:scale-105"
                >
                    <IoIosArrowRoundBack size={20} />
                    <span>Back</span>
                </button>

                {/* CONTENT */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-8">
                    <div className="mx-auto max-w-7xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl"
                        >
                            {shop.name}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-gray-200 sm:text-sm"
                        >
                            <span className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-[var(--brand-light)]" />
                                {shop.address}, {shop.city}
                            </span>

                            {shop.contact && (
                                <span className="flex items-center gap-1.5">
                                    <FaPhone className="text-[var(--brand-light)]" />
                                    {shop.contact}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopHeader;
