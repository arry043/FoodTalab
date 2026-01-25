import React from "react";
import { FaDrumstickBite, FaLeaf, FaStar } from "react-icons/fa";

function FoodCard({ data }) {

    const renderStars = (rating) => {

        const stars = [];
        const rounded = Math.round(rating);
        for (let i = 0; i < rounded; i++) {
            stars.push(<FaStar key={i} className="text-yellow-500 text-xs" />);
        }
        return stars;
    };

    const ratingAvg = data.rating?.avg || 0;
    const ratingCount = data.rating?.count || 0;

    return (
        <div
            className="w-full h-full bg-white rounded-2xl border border-orange-100
            shadow-md hover:shadow-xl transition-all duration-300
            overflow-hidden flex flex-col group"
        >
            {/* IMAGE */}
            <div className="relative w-full h-[180px] overflow-hidden shrink-0">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* VEG/NON-VEG */}
                <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow">
                    {data.foodType?.toLowerCase() === "veg" ? (
                        <FaLeaf className="text-green-600 text-sm" />
                    ) : (
                        <FaDrumstickBite className="text-red-600 text-sm" />
                    )}
                </div>

                {/* ⭐ STAR BADGE (only if rating > 0) */}
                {ratingAvg > 0 && (
                    <div
                        className="absolute top-3 left-3 bg-white/90 backdrop-blur
                        rounded-full px-2.5 py-1 text-xs font-semibold
                        flex items-center gap-1 shadow"
                    >
                        {renderStars(ratingAvg)}
                        <span className="ml-1">{ratingAvg.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-4">

                {/* NAME + RATING COUNT */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {data.name}
                    </h3>

                    {/* rating count only if > 0 */}
                    {ratingCount > 0 && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {ratingCount >= 1000
                                ? `${(ratingCount / 1000).toFixed(1)}k`
                                : ratingCount}{" "}
                            ratings
                        </span>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-0.5">
                    {data.category}
                </p>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {data.description}
                </p>

                {/* PRICE + BUTTON */}
                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-lg font-bold text-[#ff4d2d]">
                        ₹{data.price}
                    </span>

                    <button
                        className="px-4 py-1.5 text-sm font-semibold rounded-full
                        border border-[#ff4d2d] text-[#ff4d2d]
                        hover:bg-[#ff4d2d] hover:text-white transition"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FoodCard;
