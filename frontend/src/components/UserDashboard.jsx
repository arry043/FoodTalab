import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LuMapPin, LuSearchX, LuSparkles, LuTrendingUp } from "react-icons/lu";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import CategoryCard from "./CategoryCard";
import ShopsInMyCityCard from "./ShopsInMyCityCard.jsx";
import FoodCard from "./FoodCard.jsx";
import { category } from "../category.js";
import { serverUrl } from "../config/api";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const FoodSkeletonGrid = () => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white border border-orange-50 p-2.5 sm:p-3"
            >
                <div className="skeleton aspect-[4/3] w-full rounded-xl" />
                <div className="mt-3 space-y-2 px-1">
                    <div className="skeleton h-4 w-3/4 rounded-lg" />
                    <div className="skeleton h-3 w-full rounded-lg" />
                    <div className="flex items-center justify-between pt-2">
                        <div className="skeleton h-5 w-16 rounded-lg" />
                        <div className="skeleton h-8 w-14 rounded-full" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const UserDashboard = () => {
    const {
        userData,
        city,
        shopsInMyCity,
        itemsInMyCity,
        searchItems,
        isSearching,
    } = useSelector((state) => state.user);

    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [rawGuestItems, setRawGuestItems] = useState([]);
    const [loadingGuestItems, setLoadingGuestItems] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    const categoryScrollRef = useRef(null);
    const shopScrollRef = useRef(null);

    const sourceList = userData ? itemsInMyCity : rawGuestItems;
    const visibleItems = isSearching ? searchItems : selectedCategoryList;
    const showLoading = !userData && loadingGuestItems;

    const handleFilterByCategory = (selectedCategory) => {
        setActiveCategory(selectedCategory);
        if (selectedCategory === "All") {
            setSelectedCategoryList(sourceList);
            return;
        }

        setSelectedCategoryList(
            sourceList.filter((item) => item.category === selectedCategory),
        );
    };

    const handleFilterByShop = (shopId) => {
        setActiveCategory("All");
        setSelectedCategoryList(
            itemsInMyCity.filter((item) => item?.shop?._id === shopId),
        );
    };

    const scroll = (ref, direction) => {
        ref.current?.scrollBy({
            left: direction === "left" ? -260 : 260,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (!isSearching) {
            setSelectedCategoryList(sourceList);
        }
    }, [itemsInMyCity, rawGuestItems, isSearching, userData]);

    useEffect(() => {
        const fetchGuestItems = async () => {
            if (userData) return;
            try {
                setLoadingGuestItems(true);
                const res = await axios.get(`${serverUrl}/api/item/guest-items`);
                setRawGuestItems(res.data.data || []);
                setSelectedCategoryList(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch guest items: ", error);
            } finally {
                setLoadingGuestItems(false);
            }
        };

        fetchGuestItems();
    }, [userData]);

    return (
        <div className="app-shell w-full pb-16">
            <Navbar />

            <main className="mx-auto w-full max-w-7xl px-4 pt-24 md:px-5 md:pt-28">
                {/* ── Hero Section ── */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"
                >
                    <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
                        <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--brand)]">
                            <LuSparkles className="size-4" />
                            Fast local cravings
                        </p>
                        <h1 className="max-w-3xl text-3xl font-black tracking-tight text-gray-950 sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                            {userData?.data?.fullName
                                ? `${userData.data.fullName}, what sounds good today?`
                                : "Fresh food, nearby shops, zero friction."}
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
                            Browse dishes, add favorites to cart, pick an exact
                            delivery pin, and follow the order flow in real
                            time.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="panel flex items-center justify-between rounded-3xl p-5"
                    >
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Delivering around
                            </p>
                            <p className="mt-1.5 flex items-center gap-2 text-lg font-black text-gray-950">
                                <LuMapPin className="text-[var(--brand)]" />
                                {city || "your location"}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 px-4 py-3 text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Available
                            </p>
                            <p className="text-2xl font-black text-[var(--brand)]">
                                {sourceList?.length || 0}
                            </p>
                        </div>
                    </motion.div>
                </motion.section>

                {/* ── Categories ── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-10"
                >
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-950 sm:text-2xl">
                            Explore categories
                        </h2>
                        <div className="hidden gap-2 md:flex">
                            <button
                                onClick={() => scroll(categoryScrollRef, "left")}
                                className="btn-ghost flex size-9 items-center justify-center rounded-full"
                            >
                                <FaChevronLeft size={11} />
                            </button>
                            <button
                                onClick={() => scroll(categoryScrollRef, "right")}
                                className="btn-ghost flex size-9 items-center justify-center rounded-full"
                            >
                                <FaChevronRight size={11} />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={categoryScrollRef}
                        className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth py-2 sm:gap-4"
                    >
                        {category.map((cate) => (
                            <CategoryCard
                                key={cate.category}
                                data={cate}
                                isActive={activeCategory === cate.category}
                                onClick={() =>
                                    handleFilterByCategory(cate.category)
                                }
                            />
                        ))}
                    </div>
                </motion.section>

                {/* ── Shops ── */}
                {userData && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mt-10"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-950 sm:text-2xl">
                                Best shops {city ? `in ${city}` : "near you"}
                            </h2>
                            <div className="hidden gap-2 md:flex">
                                <button
                                    onClick={() => scroll(shopScrollRef, "left")}
                                    className="btn-ghost flex size-9 items-center justify-center rounded-full"
                                >
                                    <FaChevronLeft size={11} />
                                </button>
                                <button
                                    onClick={() => scroll(shopScrollRef, "right")}
                                    className="btn-ghost flex size-9 items-center justify-center rounded-full"
                                >
                                    <FaChevronRight size={11} />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={shopScrollRef}
                            className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth py-2"
                        >
                            {shopsInMyCity?.map((shop, index) => (
                                <ShopsInMyCityCard
                                    onClick={() => handleFilterByShop(shop._id)}
                                    key={shop._id || index}
                                    name={shop.name}
                                    image={shop.image}
                                />
                            ))}
                            <button
                                onClick={() => setSelectedCategoryList(itemsInMyCity)}
                                className="group flex w-24 shrink-0 flex-col items-center sm:w-28"
                            >
                                <div className="soft-card flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-sm font-black text-[var(--brand)]">
                                    All
                                </div>
                                <span className="mt-2 text-xs font-bold text-gray-700 sm:text-sm">
                                    All shops
                                </span>
                            </button>
                        </div>
                    </motion.section>
                )}

                {/* ── Food Grid ── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10"
                >
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="flex items-center gap-2 text-xl font-black text-gray-950 sm:text-2xl">
                                {isSearching ? (
                                    "Search results"
                                ) : (
                                    <>
                                        <LuTrendingUp className="text-[var(--brand)]" />
                                        Suggested for you
                                    </>
                                )}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {isSearching
                                    ? "Matching dishes from your current search."
                                    : "Handy picks based on what is available now."}
                            </p>
                        </div>
                    </div>

                    {showLoading ? (
                        <FoodSkeletonGrid />
                    ) : visibleItems?.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
                        >
                            {visibleItems.map((item) => (
                                <motion.div key={item._id} variants={fadeInUp} transition={{ duration: 0.35 }}>
                                    <FoodCard data={item} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="panel flex min-h-[280px] flex-col items-center justify-center rounded-3xl px-6 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-50">
                                <LuSearchX className="size-8 text-[var(--brand)]" />
                            </div>
                            <h3 className="text-xl font-black text-gray-950">
                                No food found
                            </h3>
                            <p className="mt-2 max-w-md text-sm text-gray-500">
                                Try another search, pick a different category,
                                or update your location.
                            </p>
                        </div>
                    )}
                </motion.section>
            </main>
        </div>
    );
};

export default UserDashboard;
