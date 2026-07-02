import React from "react";
import { motion } from "framer-motion";

function ShopsInMyCityCard({ name, image, onClick }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            className="flex w-24 shrink-0 flex-col items-center group sm:w-28"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-md ring-2 ring-transparent transition-all duration-300 group-hover:shadow-xl group-hover:ring-[var(--brand)]/20">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <span className="mt-2 line-clamp-2 w-full text-center text-xs font-bold leading-tight text-gray-700 transition-colors group-hover:text-[var(--brand)] sm:text-sm">
                {name}
            </span>
        </motion.button>
    );
}

export default ShopsInMyCityCard;
