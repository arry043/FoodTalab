import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaDrumstickBite, FaLeaf, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { LuCheck, LuMinus, LuPlus } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart, removeFromCart } from "../redux/userSlice";

function FoodCard({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showAdded, setShowAdded] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    const userData = useSelector((state) => state.user.userData);
    const cartItems = useSelector((state) => state.user.cartItems);
    const cartItem = cartItems.find((i) => i.id === data._id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrease = (event) => {
        event.stopPropagation();
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

        // Show micro-toast on first add
        if (quantity === 0) {
            setShowAdded(true);
            setTimeout(() => setShowAdded(false), 1200);
        }
    };

    const handleDecrease = (event) => {
        event.stopPropagation();
        dispatch(removeFromCart(data._id));
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" />);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} />);
        }

        return stars;
    };

    const ratingAvg = data.rating?.avg || 0;
    const ratingCount = data.rating?.count || 0;

    return (
        <motion.article
            onClick={() => navigate(`/food-preview/${data._id}`)}
            className="soft-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            layout
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50">
                {!imgLoaded && (
                    <div className="skeleton absolute inset-0" />
                )}
                <img
                    src={data.image}
                    alt={data.name}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />

                <div className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 shadow-lg backdrop-blur-sm">
                    {data.foodType?.toLowerCase() === "veg" ? (
                        <FaLeaf className="text-green-600 text-xs" />
                    ) : (
                        <FaDrumstickBite className="text-red-500 text-xs" />
                    )}
                </div>

                {ratingAvg > 0 && ratingCount > 0 && (
                    <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                        <span className="flex items-center gap-[1px] text-yellow-300">
                            {renderStars(ratingAvg)}
                        </span>
                        {ratingAvg.toFixed(1)}
                    </div>
                )}

                {/* Micro-toast */}
                <AnimatePresence>
                    {showAdded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                        >
                            <LuCheck size={14} />
                            Added!
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="line-clamp-1 text-sm font-black text-gray-950">
                            {data.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            {data.category}
                        </p>
                    </div>
                    {ratingCount > 0 && (
                        <span className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                            {ratingCount >= 1000
                                ? `${(ratingCount / 1000).toFixed(1)}k`
                                : ratingCount}
                        </span>
                    )}
                </div>

                <p className="mt-1.5 line-clamp-2 min-h-[2rem] text-[11px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
                    {data.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <motion.span
                        key={quantity}
                        className="text-base font-black text-[var(--brand)] sm:text-lg"
                    >
                        ₹{data.price}
                    </motion.span>

                    {quantity === 0 ? (
                        <motion.button
                            type="button"
                            onClick={handleIncrease}
                            className="btn-primary h-8 rounded-full px-3.5 text-[11px] font-black sm:h-9 sm:px-4 sm:text-xs"
                            whileTap={{ scale: 0.92 }}
                        >
                            Add
                        </motion.button>
                    ) : (
                        <div
                            onClick={(event) => event.stopPropagation()}
                            className="flex h-8 items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-orange-50 px-1.5 text-[var(--brand)] sm:h-9 sm:gap-3 sm:px-2"
                        >
                            <motion.button
                                type="button"
                                onClick={handleDecrease}
                                className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm sm:size-7"
                                aria-label="Decrease quantity"
                                whileTap={{ scale: 0.85 }}
                            >
                                <LuMinus size={12} />
                            </motion.button>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={quantity}
                                    initial={{ y: -8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 8, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="min-w-3 text-center text-xs font-black sm:min-w-4 sm:text-sm"
                                >
                                    {quantity}
                                </motion.span>
                            </AnimatePresence>
                            <motion.button
                                type="button"
                                onClick={handleIncrease}
                                className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm sm:size-7"
                                aria-label="Increase quantity"
                                whileTap={{ scale: 0.85 }}
                            >
                                <LuPlus size={12} />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

export default FoodCard;
