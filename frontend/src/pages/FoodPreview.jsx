import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLeaf, FaDrumstickBite, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/userSlice";
import { serverUrl } from "../App";
import Navbar from "../components/Navbar";
import { IoIosArrowRoundBack } from "react-icons/io";

function FoodPreview() {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);

    const cartItems = useSelector((state) => state.user.cartItems);
    const cartItem = cartItems.find((i) => i.id === food?._id);
    const quantity = cartItem?.quantity || 0;

    const fetchFoodData = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/item/get-item-by-id/${itemId}`,
                { withCredentials: true },
            );
            setFood(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoodData();
    }, [itemId]);

    const handleIncrease = () => {
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
            <div className="min-h-screen flex items-center justify-center">
                <p className="animate-pulse text-gray-500">Loading food...</p>
            </div>
        );
    }

    if (!food) return <p>Food not found</p>;

    return (
        <div className="min-h-screen bg-[#fff9f6] pb-24 md:pb-0">
            <Navbar />

            {/* FLOATING BACK BUTTON */}
            <div className="fixed top-[80px] left-4 z-40">
                <button
                    onClick={() => navigate(-1)}
                    className="
            flex items-center gap-1
            bg-white/90 backdrop-blur
            px-3 py-1.5
            rounded-full
            shadow-md
            text-gray-700
            hover:bg-white
            transition
        "
                >
                    <IoIosArrowRoundBack size={28} />
                    <span className="text-sm font-medium hidden sm:block">
                        Back
                    </span>
                </button>
            </div>

            {/* MAIN */}
            <div className="max-w-7xl mt-17 mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="sticky top-24"
                >
                    <div className="relative overflow-hidden rounded-3xl shadow-xl">
                        <img
                            src={food.image}
                            alt={food.name}
                            className="w-full h-[420px] object-cover hover:scale-105 transition duration-500"
                        />

                        {/* VEG / NON VEG */}
                        <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
                            {food.foodType?.toLowerCase() === "veg" ? (
                                <FaLeaf className="text-green-600" />
                            ) : (
                                <FaDrumstickBite className="text-red-600" />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* DETAILS */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-6"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        {food.name}
                    </h1>

                    {/* PRICE + RATING */}
                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-[#ff4d2d]">
                            ₹{food.price}
                        </span>

                        {food.rating?.avg > 0 && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FaStar className="text-yellow-500" />
                                {food.rating.avg.toFixed(1)} (
                                {food.rating.count})
                            </div>
                        )}
                    </div>

                    {/* TAGS */}
                    <div className="flex gap-2 flex-wrap">
                        <span className="px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                            {food.category}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                            {food.foodType}
                        </span>
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                            About this item
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            {food.description}
                        </p>
                    </div>

                    {/* ADD TO CART (DESKTOP) */}
                    <div className="hidden md:block">
                        {quantity === 0 ? (
                            <button
                                onClick={handleIncrease}
                                className="px-10 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <div className="flex flex-col items-start gap-3">
                                <div className="flex items-center gap-6 px-6 py-3 border border-[#ff4d2d] rounded-full w-fit text-[#ff4d2d] font-bold">
                                    <button onClick={handleDecrease}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={handleIncrease}>+</button>
                                </div>

                                {/* 👇 VIEW CART */}
                                <button
                                    onClick={() => navigate("/cart")}
                                    className="text-sm font-semibold text-[#ff4d2d] hover:underline"
                                >
                                    View Cart →
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* SHOP CARD */}
            <div className="max-w-7xl mx-auto px-5 pb-12">
                <div
                    onClick={() => navigate(`/shop-view/${food.shop._id}`)}
                    className="cursor-pointer bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition"
                >
                    <img
                        src={food.shop.image}
                        alt={food.shop.name}
                        className="w-full md:w-56 h-40 object-cover rounded-2xl"
                    />

                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">
                                {food.shop.name}
                            </h3>
                            <p className="text-gray-500">
                                📍 {food.shop.address}, {food.shop.city}
                            </p>
                        </div>

                        <button className="mt-4 w-fit px-6 py-2 rounded-full border border-black hover:bg-black hover:text-white transition">
                            View Shop
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY CART BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">₹{food.price}</span>

                    {quantity === 0 ? (
                        <button
                            onClick={handleIncrease}
                            className="px-6 py-2 bg-[#ff4d2d] text-white rounded-full font-semibold"
                        >
                            ADD
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 px-4 py-2 border border-[#ff4d2d] rounded-full text-[#ff4d2d] font-bold">
                            <button onClick={handleDecrease}>−</button>
                            <span>{quantity}</span>
                            <button onClick={handleIncrease}>+</button>
                        </div>
                    )}
                </div>

                {/* 👇 VIEW CART (only when item in cart) */}
                {quantity > 0 && (
                    <button
                        onClick={() => navigate("/cart")}
                        className="mt-3 w-full py-2 text-center text-sm font-semibold text-[#ff4d2d] border border-[#ff4d2d] rounded-full"
                    >
                        View Cart
                    </button>
                )}
            </div>
        </div>
    );
}

export default FoodPreview;
