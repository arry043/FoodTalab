import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import {
    FaDrumstickBite,
    FaLeaf,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from "react-icons/fa";

function FoodCard({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.user.userData);
    const cartItems = useSelector((state) => state.user.cartItems);
    const cartItem = cartItems.find((i) => i.id === data._id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrease = () => {
        if (!userData) {
            navigate("/signin");
            return;
        }

        dispatch(
            addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                foodType: data.foodType,
            }),
        );
    };

    const handleDecrease = () => {
        dispatch(removeFromCart(data._id));
    };

    // ⭐ Proper Half-Star Logic
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FaStar
                    key={`full-${i}`}
                    className="text-yellow-400 text-[11px]"
                />,
            );
        }

        if (hasHalfStar) {
            stars.push(
                <FaStarHalfAlt
                    key="half"
                    className="text-yellow-400 text-[11px]"
                />,
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <FaRegStar
                    key={`empty-${i}`}
                    className="text-white/40 text-[11px]"
                />,
            );
        }

        return stars;
    };

    const ratingAvg = data.rating?.avg || 0;
    const ratingCount = data.rating?.count || 0;

    return (
        <div className="w-full bg-white rounded-2xl border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
            {/* IMAGE SECTION */}
            <div
                className="relative w-full h-[180px] overflow-hidden"
                onClick={() => navigate(`/food-preview/${data._id}`)}
            >
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Veg / Non-Veg */}
                <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow">
                    {data.foodType?.toLowerCase() === "veg" ? (
                        <FaLeaf className="text-green-600 text-sm" />
                    ) : (
                        <FaDrumstickBite className="text-red-600 text-sm" />
                    )}
                </div>

                {/* ⭐ Subtle Rating Badge */}
                {ratingAvg > 0 && ratingCount > 0 && (
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1.5 text-[11px] shadow-sm">
                        <div className="flex items-center gap-[2px]">
                            {renderStars(ratingAvg)}
                        </div>
                        <span className="text-white font-medium">
                            {ratingAvg.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-4">
                {/* Title + Rating Count */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {data.name}
                    </h3>

                    {ratingCount > 0 && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {ratingCount >= 1000
                                ? `${(ratingCount / 1000).toFixed(1)}k`
                                : ratingCount}{" "}
                            ratings
                        </span>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-0.5">{data.category}</p>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {data.description}
                </p>

                {/* PRICE + BUTTON */}
                <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-lg font-bold text-[#ff4d2d]">
                        ₹{data.price}
                    </span>

                    <div className="h-[36px] flex items-center">
                        {quantity === 0 ? (
                            <button
                                onClick={handleIncrease}
                                className="h-full px-4 text-sm font-semibold rounded-full border border-[#ff4d2d] text-[#ff4d2d] hover:bg-[#ff4d2d] hover:text-white transition"
                            >
                                ADD
                            </button>
                        ) : (
                            <div className="h-full flex items-center gap-3 px-3 border border-[#ff4d2d] rounded-full text-[#ff4d2d] font-semibold">
                                <button
                                    onClick={handleDecrease}
                                    className="text-lg leading-none"
                                >
                                    −
                                </button>
                                <span className="text-sm">{quantity}</span>
                                <button
                                    onClick={handleIncrease}
                                    className="text-lg leading-none"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FoodCard;
