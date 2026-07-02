import React from "react";
import { FaUserTie, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const OwnerCard = ({ owner }) => {
    if (!owner) return null;

    return (
        <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-5">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
                <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand)] text-white text-lg shadow-md shadow-orange-100"
                >
                    <FaUserTie />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Shop partner
                    </p>
                    <h3 className="text-base font-black text-gray-900 mt-0.5">
                        {owner.fullName}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                        <FaEnvelope className="text-gray-400" />
                        {owner.email}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default OwnerCard;
