import React, { useRef } from "react";
import Navbar from "./Navbar";
import CategoryCard from "./CategoryCard";
import { category } from "../category.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import ShopsInMyCityCard from "./ShopsInMyCityCard.jsx";
import FoodCard from "./FoodCard.jsx";

const UserDashboard = () => {
    // REDUX - getting user data
    const { userData, city, shopsInMyCity, itemsInMyCity } = useSelector(
        (state) => state.user,
    );
    // console.log(userData);
    console.log("Shops: ", shopsInMyCity);

    // SCROLL REFS
    const categoryScrollRef = useRef(null);
    const shopScrollRef = useRef(null);

    // CATEGORY SCROLL
    const scrollCategoryLeft = () => {
        categoryScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollCategoryRight = () => {
        categoryScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    // SHOP SCROLL
    const scrollShopLeft = () => {
        shopScrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };

    const scrollShopRight = () => {
        shopScrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };

    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center">
            <Navbar />

            {/* CATEGORY */}
            <div className="w-full max-w-7xl px-5 mt-10 md:mt-17 relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {userData?.data?.fullName}, what's on your mind today?
                        😋
                    </h2>

                    <div className="hidden md:flex gap-3">
                        <button
                            onClick={scrollCategoryLeft}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded-full"
                        >
                            <FaChevronLeft size={14} className="md:text-base" />
                        </button>

                        <button
                            onClick={scrollCategoryRight}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded-full"
                        >
                            <FaChevronRight
                                size={14}
                                className="md:text-base"
                            />
                        </button>
                    </div>
                </div>

                {/* CATEGORY STRIP */}
                <div
                    ref={categoryScrollRef}
                    className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                >
                    {category.map((cate, index) => (
                        <CategoryCard key={index} data={cate} />
                    ))}
                </div>
            </div>
            {/* BEST SHOPS */}
            <div className="w-full max-w-7xl px-5 mt-10 md:mt-17 relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Best Shops in {city}
                    </h2>

                    <div className="hidden md:flex gap-3">
                        <button
                            onClick={scrollShopLeft}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded-full"
                        >
                            <FaChevronLeft size={14} className="md:text-base" />
                        </button>

                        <button
                            onClick={scrollShopRight}
                            className="bg-gray-200 hover:bg-gray-300 p-1.5 md:p-2 rounded-full"
                        >
                            <FaChevronRight
                                size={14}
                                className="md:text-base"
                            />
                        </button>
                    </div>
                </div>

                {/* SHOP STRIP */}
                <div
                    ref={shopScrollRef}
                    className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                >
                    {shopsInMyCity &&
                        shopsInMyCity.length > 0 &&
                        shopsInMyCity.map((shop, index) => (
                            <ShopsInMyCityCard
                                key={shop._id || index}
                                name={shop.name}
                                image={shop.image}
                            />
                        ))}
                </div>
            </div>
            {/* PRODUCT */}
            <div className="w-full max-w-7xl px-5 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Suggested foods for you 😋
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-stretch">
                    {itemsInMyCity?.map((item, index) => (
                        <FoodCard key={index} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
