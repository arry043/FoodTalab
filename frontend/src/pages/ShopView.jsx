import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../config/api";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import ShopHeader from "../components/ShopHeader";
import OwnerCard from "../components/OwnerCard";
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};

function ShopView() {
    const { shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);

    const getShopById = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/shop/get-shop-by-id/${shopId}`,
                { withCredentials: true }
            );
            setShop(res.data.data);
        } catch (err) {
            console.error("Error fetching shop:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (shopId) getShopById();
    }, [shopId]);

    if (loading) {
        return (
            <motion.div {...pageVariants} className="app-shell min-h-screen pb-16">
                <Navbar />
                {/* Shop Header Banner Skeleton */}
                <div className="mx-auto w-full pt-16">
                    <div className="skeleton h-[240px] w-full rounded-b-[2rem] md:h-[300px]" />
                </div>

                {/* Owner Card Skeleton */}
                <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-5">
                    <div className="skeleton h-20 w-full rounded-2xl" />
                </div>

                {/* Menu items Skeleton */}
                <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-5">
                    <div className="skeleton h-8 w-40 rounded-xl mb-6" />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="rounded-2xl border bg-white p-3 space-y-3">
                                <div className="skeleton aspect-[4/3] w-full rounded-xl" />
                                <div className="skeleton h-4 w-3/4 rounded-lg" />
                                <div className="skeleton h-3 w-1/2 rounded-lg" />
                                <div className="flex justify-between items-center pt-2">
                                    <div className="skeleton h-5 w-12 rounded-lg" />
                                    <div className="skeleton h-8 w-14 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    if (!shop) {
        return (
            <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center">
                <Navbar />
                <div className="panel max-w-md p-8 text-center rounded-3xl">
                    <h2 className="text-xl font-black text-gray-950">Shop not found</h2>
                    <p className="mt-2 text-sm text-gray-500">The shop you are trying to view does not exist or was closed.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-16">
            <Navbar />
            
            {/* SHOP HERO */}
            <ShopHeader shop={shop} />

            {/* OWNER */}
            <OwnerCard owner={shop.owner} />

            {/* PRODUCTS */}
            <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-5">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-950">
                        Menu ({shop.items?.length || 0})
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Choose dishes fresh from this shop.
                    </p>
                </div>

                {shop.items?.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
                    >
                        {shop.items.map((item) => (
                            <motion.div key={item._id} variants={fadeInUp} transition={{ duration: 0.35 }}>
                                <FoodCard data={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="panel py-12 text-center rounded-3xl">
                        <p className="text-sm font-semibold text-gray-400">
                            No menu items added to this shop yet.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default ShopView;
