import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaDrumstickBite, FaLeaf, FaStar } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuArrowRight, LuMinus, LuPlus, LuShoppingCart, LuStore } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/userSlice";
import { serverUrl } from "../config/api";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

function FoodPreview() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [suggestedItems, setSuggestedItems] = useState([]);

    const userData = useSelector((state) => state.user.userData);
    const cartItems = useSelector((state) => state.user.cartItems);
    const cartItem = cartItems.find((i) => i.id === food?._id);
    const quantity = cartItem?.quantity || 0;

    const fetchFoodData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${serverUrl}/api/item/get-item-by-id/${itemId}`,
                { withCredentials: true },
            );
            setFood(res.data.data);
            setError("");
            if (res.data.data?.shop?._id) {
                try {
                    const shopRes = await axios.get(
                        `${serverUrl}/api/shop/get-shop-by-id/${res.data.data.shop._id}`,
                        { withCredentials: true }
                    );
                    const moreItems = (shopRes.data.data?.items || [])
                        .filter((item) => item._id !== res.data.data._id)
                        .slice(0, 4);
                    setSuggestedItems(moreItems);
                } catch (shopErr) {
                    console.error("Failed to load suggested items: ", shopErr);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Food item could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodData();
    }, [itemId]);

    const handleIncrease = () => {
        if (!userData) {
            navigate("/signin");
            return;
        }
        dispatch(
            addToCart({
                id: food._id,
                name: food.name,
                price: food.price,
                image: food.image,
                shop: food.shop,
                foodType: food.foodType,
            }),
        );
    };

    const handleDecrease = () => {
        dispatch(removeFromCart(food._id));
    };

    if (loading) {
        return (
            <motion.div {...pageVariants} className="app-shell min-h-screen">
                <Navbar />
                <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-28 md:grid-cols-2 md:px-5">
                    <div className="skeleton h-[380px] rounded-3xl sm:h-[460px]" />
                    <div className="space-y-5 py-4">
                        <div className="flex gap-2">
                            <div className="skeleton h-7 w-16 rounded-full" />
                            <div className="skeleton h-7 w-24 rounded-full" />
                        </div>
                        <div className="skeleton h-10 w-3/4 rounded-2xl" />
                        <div className="skeleton h-8 w-32 rounded-xl" />
                        <div className="skeleton h-24 w-full rounded-2xl" />
                        <div className="skeleton h-12 w-44 rounded-full" />
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!food || error) {
        return (
            <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center px-4">
                <div className="panel max-w-md rounded-3xl p-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50">
                        <LuStore className="size-8 text-[var(--brand)]" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-950">
                        Food not found
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {error || "This item is unavailable right now."}
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary mt-6 rounded-full px-6 py-3 text-sm font-black"
                    >
                        Browse foods
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-28 md:pb-14">
            <Navbar />

            <main className="mx-auto grid max-w-7xl gap-8 px-4 pt-24 md:grid-cols-[1fr_0.9fr] md:px-5 md:pt-28">
                {/* Image Section */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-sm font-black text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
                    >
                        <IoIosArrowRoundBack size={22} />
                        Back
                    </button>

                    <div className="group overflow-hidden rounded-[2rem] shadow-2xl">
                        <img
                            src={food.image}
                            alt={food.name}
                            className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[440px] md:h-[540px]"
                        />
                    </div>
                </motion.section>

                {/* Info Section */}
                <motion.section
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-5"
                >
                    <div className="panel rounded-[2rem] p-5 sm:p-7">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4 flex flex-wrap items-center gap-2"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-[var(--brand)]">
                                {food.foodType?.toLowerCase() === "veg" ? (
                                    <FaLeaf />
                                ) : (
                                    <FaDrumstickBite />
                                )}
                                {food.foodType}
                            </span>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                                {food.category}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl lg:text-5xl"
                        >
                            {food.name}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-5 flex flex-wrap items-center gap-3"
                        >
                            <span className="text-3xl font-black text-[var(--brand)]">
                                ₹{food.price}
                            </span>
                            {food.rating?.avg > 0 && (
                                <span className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-700">
                                    <FaStar className="text-yellow-400" />
                                    {food.rating.avg.toFixed(1)} ({food.rating.count})
                                </span>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="mt-6"
                        >
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
                                About this item
                            </h2>
                            <p className="mt-2 leading-7 text-gray-600">
                                {food.description}
                            </p>
                        </motion.div>

                        {/* Desktop Cart Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-7 hidden md:block"
                        >
                            {quantity === 0 ? (
                                <motion.button
                                    onClick={handleIncrease}
                                    className="btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-black"
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <LuShoppingCart size={18} />
                                    Add to cart
                                </motion.button>
                            ) : (
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex h-12 items-center gap-4 rounded-full border border-[var(--brand)]/30 bg-orange-50 px-3 text-[var(--brand)]">
                                        <motion.button
                                            onClick={handleDecrease}
                                            className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm"
                                            whileTap={{ scale: 0.85 }}
                                        >
                                            <LuMinus size={16} />
                                        </motion.button>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={quantity}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 10, opacity: 0 }}
                                                className="min-w-5 text-center text-lg font-black"
                                            >
                                                {quantity}
                                            </motion.span>
                                        </AnimatePresence>
                                        <motion.button
                                            onClick={handleIncrease}
                                            className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm"
                                            whileTap={{ scale: 0.85 }}
                                        >
                                            <LuPlus size={16} />
                                        </motion.button>
                                    </div>
                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="btn-ghost rounded-full px-6 py-3 text-sm font-black"
                                    >
                                        View cart →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Shop Card */}
                    {food.shop && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            onClick={() => navigate(`/shop-view/${food.shop._id}`)}
                            className="soft-card flex gap-4 rounded-[2rem] p-4 text-left group/shop"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <img
                                src={food.shop.image}
                                alt={food.shop.name}
                                className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24"
                            />
                            <span className="min-w-0 flex-1">
                                <span className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">
                                    <LuStore size={12} />
                                    Shop
                                </span>
                                <span className="block truncate text-lg font-black text-gray-950 sm:text-xl">
                                    {food.shop.name}
                                </span>
                                <span className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                    {food.shop.address}, {food.shop.city}
                                </span>
                            </span>
                            <LuArrowRight className="mt-1 size-5 shrink-0 text-gray-400 transition-transform group-hover/shop:translate-x-1" />
                        </motion.button>
                    )}
                </motion.section>
            </main>

            {/* Suggested Items Section */}
            {suggestedItems.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 mt-12 sm:px-5">
                    <h2 className="text-2xl font-black text-gray-950 mb-6">
                        More from this shop
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {suggestedItems.map((item) => (
                            <FoodCard key={item._id} data={item} />
                        ))}
                    </div>
                </section>
            )}

            {/* Mobile Bottom Bar */}
            <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 p-4 backdrop-blur-lg md:hidden"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Total</p>
                        <p className="text-xl font-black text-gray-950">
                            ₹{food.price * Math.max(quantity, 1)}
                        </p>
                    </div>

                    {quantity === 0 ? (
                        <motion.button
                            onClick={handleIncrease}
                            className="btn-primary rounded-full px-6 py-3 text-sm font-black"
                            whileTap={{ scale: 0.95 }}
                        >
                            Add to cart
                        </motion.button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 items-center gap-3 rounded-full border border-[var(--brand)]/30 bg-orange-50 px-2 text-[var(--brand)]">
                                <motion.button
                                    onClick={handleDecrease}
                                    className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm"
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <LuMinus size={14} />
                                </motion.button>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={quantity}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="min-w-4 text-center font-black"
                                    >
                                        {quantity}
                                    </motion.span>
                                </AnimatePresence>
                                <motion.button
                                    onClick={handleIncrease}
                                    className="flex size-8 items-center justify-center rounded-full bg-white shadow-sm"
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <LuPlus size={14} />
                                </motion.button>
                            </div>
                            <motion.button
                                onClick={() => navigate("/cart")}
                                className="btn-primary rounded-full px-5 py-3 text-sm font-black"
                                whileTap={{ scale: 0.95 }}
                            >
                                Cart →
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default FoodPreview;
