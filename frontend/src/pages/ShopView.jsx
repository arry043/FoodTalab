import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import ShopHeader from "../components/ShopHeader";
import OwnerCard from "../components/OwnerCard";

function ShopView() {
    const { shopId } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);

    const getShopById = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/shop/get-shop-by-id/${shopId}`
            );
            setShop(res.data.data);
            console.log("res: ", res.data.data);
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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 animate-pulse">Loading shop...</p>
            </div>
        );
    }

    if (!shop) {
        return <p className="text-center mt-20">Shop not found</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* SHOP HERO */}
            <ShopHeader shop={shop} />

            {/* OWNER */}
            <OwnerCard owner={shop.owner} />

            {/* PRODUCTS */}
            <div className="max-w-7xl mx-auto px-5 mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Menu ({shop.items.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {shop.items.map((item) => (
                        <FoodCard key={item._id} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopView;
