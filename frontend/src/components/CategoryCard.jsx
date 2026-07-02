import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ data, onClick, isActive = false }) => {
    return (
        <motion.button
            type="button"
            className={`group flex w-[5.5rem] shrink-0 flex-col items-center sm:w-28 ${isActive ? "" : ""}`}
            onClick={onClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
        >
            <div
                className={`aspect-square w-full overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300 ${
                    isActive
                        ? "border-[var(--brand)] shadow-lg shadow-orange-200/40 ring-2 ring-[var(--brand)]/20"
                        : "border-transparent soft-card"
                }`}
            >
                <img
                    src={data.image}
                    alt={data.category}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
            </div>
            <span
                className={`mt-2 line-clamp-2 text-center text-[11px] font-bold leading-tight sm:text-xs transition-colors duration-200 ${
                    isActive ? "text-[var(--brand)] font-black" : "text-gray-600"
                }`}
            >
                {data.category}
            </span>
            {isActive && (
                <motion.div
                    layoutId="categoryIndicator"
                    className="mt-1.5 h-[3px] w-6 rounded-full bg-[var(--brand)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
        </motion.button>
    );
};

export default CategoryCard;
