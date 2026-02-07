import React, { useRef } from "react";
import Navbar from "./Navbar";
import CategoryCard from "./CategoryCard";
import { category } from "../category.js";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import ShopsInMyCityCard from "./ShopsInMyCityCard.jsx";
import FoodCard from "./FoodCard.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const UserDashboard = () => {
    // REDUX - getting user data
    const {
        userData,
        city,
        shopsInMyCity,
        itemsInMyCity,
        searchItems,
        isSearching,
    } = useSelector((state) => state.user);
    const navigate = useNavigate();
    // console.log(userData);
    // console.log("Shops: ", shopsInMyCity);
    const [selectedCategoryList, setSelectedCategoryList] =
        useState(itemsInMyCity);

    const handleFilterByCategory = (category) => {
        if (category === "All") {
            setSelectedCategoryList(itemsInMyCity);
        } else {
            const filteredItems = itemsInMyCity.filter(
                (item) => item.category === category,
            );
            setSelectedCategoryList(filteredItems);
        }
    };

    const handleFilterByShop = (shopId) => {
        const filteredItems = itemsInMyCity.filter(
            (item) => item?.shop?._id === shopId,
        );
        setSelectedCategoryList(filteredItems);
    };

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

    const showSearchResults = searchItems && searchItems.length > 0;
    const showNoSearchResult = searchItems && searchItems.length === 0;

    useEffect(() => {
        if (!isSearching) {
            setSelectedCategoryList(itemsInMyCity);
        }
    }, [itemsInMyCity, isSearching]);

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
                        <CategoryCard
                            key={index}
                            data={cate}
                            onClick={() =>
                                handleFilterByCategory(cate.category)
                            }
                        />
                    ))}
                </div>
            </div>
            {/* BEST SHOPS */}
            <div className="w-full max-w-7xl px-5 mt-10 md:mt-17 relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Best Shops in {city}
                    </h2>
                    {/* <button onClick={() => navigate("shop-view/6986d4fb8c0f5fd125e2555d")}>new shop</button> */}

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
                                onClick={() => handleFilterByShop(shop._id)}
                                key={shop._id || index}
                                name={shop.name}
                                image={shop.image}
                            />
                        ))}
                    <div
                        onClick={() => setSelectedCategoryList(itemsInMyCity)}
                        className="flex flex-col items-center shrink-0 cursor-pointer group"
                    >
                        <div
                            className="w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] md:w-[120px] md:h-[120px]
                rounded-xl overflow-hidden bg-white shadow-md
                group-hover:shadow-xl transition"
                        >
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIeaFxft3L8b0IPngXWlPR0mP5qY-2Rbsc0zQLF9OZmQ&s"
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                        </div>

                        <p className=" mt-2 text-sm sm:text-base font-medium text-gray-700 text-center w-[90px] leading-tight line-clamp-2">
                            All Shops
                        </p>
                    </div>
                </div>
            </div>
            {/* PRODUCT */}
            <div className="w-full max-w-7xl px-5 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isSearching
                        ? "Search Results 🍽️"
                        : "Suggested foods for you 😋"}
                </h2>

                {/* 🔍 WHEN SEARCHING */}
                {isSearching ? (
                    searchItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchItems.map((item) => (
                                <FoodCard key={item._id} data={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-[40vh]">
                            <h2 className="text-xl font-semibold text-gray-400">
                                Food Not Found...!
                            </h2>
                        </div>
                    )
                ) : (
                    /* 🏠 NORMAL DASHBOARD */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {selectedCategoryList.map((item) => (
                            <FoodCard key={item._id} data={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
