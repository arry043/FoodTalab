import React, { useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import {
    setSearchItems,
    setUserData,
    setItemsInMyCity,
    setIsSearching,
} from "../redux/userSlice";
import { serverUrl } from "../App";
import { FaPlus } from "react-icons/fa";
import { LuReceipt } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Navbar = () => {
    const { userData, city, cartItems, myOrders, searchItems } = useSelector(
        (state) => state?.user,
    );
    const { myShopData } = useSelector((state) => state?.owner);
    // console.log("myShopData: ",myShopData);
    const actualUserData = userData?.data;
    const role = actualUserData?.role;

    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const isConfirm = window.confirm("Are you sure you want to logout?");
        if (!isConfirm) {
            setShowInfo((prev) => !prev);
            return;
        }
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
        } catch (error) {
            console.log(error);
        }
    };

    // SEARCH FUNCTIONALITY
    const [query, setQuery] = useState("");
    const handleSearchItems = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/item/search-items?query=${query}&city=${city}`,
                { withCredentials: true },
            );

            console.log("Search Results:", res.data.data);
            dispatch(setSearchItems(res.data.data));
        } catch (error) {
            console.error("Error searching items:", error);
        }
    };

    useEffect(() => {
        if (query.trim()) {
            dispatch(setIsSearching(true));

            const timer = setTimeout(() => {
                handleSearchItems();
            }, 100);

            return () => clearTimeout(timer);
        } else {
            dispatch(setIsSearching(false));
            dispatch(setSearchItems([]));
        }
    }, [query]);

    return (
        <div
            className={`w-full ${role === "deliveryBoy" ? "gap-30" : ""} h-15 md:h-17 flex items-center justify-between md:justify-center gap-10 px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible`}
        >
            <h1
                onClick={() => navigate("/")}
                className="text-3xl cursor-pointer font-bold mb-2 text-[#ff4d2d]"
            >
                FoodTalab
            </h1>

            {/* ================= USER DESKTOP SEARCH BAR ================= */}
            {role === "user" && (
                <div className="md:w-[60%] lg:w-[40%] h-15 bg-white shadow-xl rounded-lg items-center hidden md:flex gap-[20px]">
                    <div className="flex items-center w-[40%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
                        <MdLocationPin size={25} className="text-[#ff4d2d]" />
                        <div className="w-[80%] truncate text-gray-600">
                            {city}
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-2 px-[10px] py-2">
                        <FaSearch size={20} className="text-[#ff4d2d]" />
                        <input
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            className="w-full px-3 focus:outline-none"
                            type="text"
                            placeholder="Search delicious Food... 😋"
                        />
                        {query && (
                            <IoClose
                                onClick={() => setQuery("")}
                                size={40}
                                title="Clear search"
                                className="text-gray-800 cursor-pointer p-1.5 transition-all duration-200 hover:text-[#ff4d2d] hover:scale-110 hover:rotate-90"
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-5">
                {/* ================= USER MOBILE SEARCH TOGGLE ================= */}
                {role === "user" && (
                    <div
                        onClick={() => setShowSearch((prev) => !prev)}
                        className="md:hidden cursor-pointer transition-all ease-in-out duration-500 text-[#ff4d2d] text-sm font-medium"
                    >
                        {showSearch ? (
                            <IoClose size={25} className="text-[#ff4d2d]" />
                        ) : (
                            <FaSearch
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                                size={20}
                                className="text-[#ff4d2d] md:hidden"
                            />
                        )}
                    </div>
                )}

                {/* ================= OWNER ADD FOOD BUTTON ================= */}
                {role === "owner" && myShopData && (
                    <button
                        onClick={() => navigate("/add-item")}
                        className="cursor-pointer flex items-center w-10 h-10 md:w-auto md:h-auto hover:bg-[#ff4d2d]/5 px-3 py-1 rounded-full md:rounded-lg bg-[#ff4d2d]/15 text-[#ff4d2d] text-sm font-medium"
                    >
                        <FaPlus size={18} />
                        <span className="ml-2 hidden md:inline">
                            Add Food Items
                        </span>
                    </button>
                )}

                {/* ================= USER CART ================= */}
                {role === "user" && (
                    <div
                        className="relative cursor-pointer"
                        onClick={() => navigate("/cart")}
                    >
                        <IoMdCart size={25} className="text-[#ff4d2d]" />
                        <span className="absolute text-sm text-[#ff4d2d] left-3 bottom-4.5">
                            {cartItems?.length ? cartItems?.length : ""}
                        </span>
                    </div>
                )}

                {/* ================= USER ORDERS BUTTON ================= */}
                {role === "user" && (
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="cursor-pointer hover:bg-[#ff4d2d]/5 hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/15 text-[#ff4d2d] text-sm font-medium"
                    >
                        Orders
                    </button>
                )}

                {/* ================= OWNER ORDERS PENDING BUTTON ================= */}
                {role === "owner" && (
                    <div className="relative">
                        <button
                            onClick={() => navigate("/my-orders")}
                            className="cursor-pointer flex items-center w-10 h-10 md:w-auto md:h-auto hover:bg-[#ff4d2d]/5 px-3 py-1 rounded-full md:rounded-lg bg-[#ff4d2d]/15 text-[#ff4d2d] text-sm font-medium"
                        >
                            <LuReceipt size={20} />
                            <span className="ml-2 hidden md:inline">
                                Orders
                            </span>
                        </button>

                        <span className="absolute top-[-6px] right-[-6px] bg-[#ff4d2d] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {myOrders.length}
                        </span>
                    </div>
                )}

                <div
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="w-9 h-9 text-lg font-semibold shadow-2xl bg-[#ff4d2d] text-white rounded-full flex justify-center items-center cursor-pointer "
                >
                    {actualUserData?.fullName?.charAt(0)}
                </div>

                {/* ================= PROFILE DROPDOWN ================= */}
                {showInfo && (
                    <div className="fixed top-20 right-15 md:right-[5%] lg:right-[20%] w-50 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-3 z-[9999]">
                        <div className="text-sm font-semibold">
                            Hey...! {actualUserData.fullName}
                        </div>
                        <div
                            onClick={() => navigate("/my-orders")}
                            className="md:hidden font-semibold text-sm cursor-pointer hover:text-[#ff4d2d]"
                        >
                            My Orders
                        </div>
                        <div
                            onClick={handleLogout}
                            className="text-[#ff4d2d] font-semibold text-sm text-end cursor-pointer hover:text-[#ff4d2d]/75"
                        >
                            Logout
                        </div>
                    </div>
                )}

                {/* ================= USER MOBILE SEARCH BOX ================= */}
                {showSearch && role === "user" && (
                    <div className="md:hidden fixed top-15 right-[10%] w-[80%]">
                        <div className="h-15 bg-white shadow-xl rounded-lg flex items-center gap-1">
                            <div className="flex items-center w-[40%] overflow-hidden gap-1 px-2 border-r-[2px] border-gray-400">
                                <MdLocationPin
                                    size={22}
                                    className="text-[#ff4d2d]"
                                />
                                <div className="w-[60%] text-sm truncate text-gray-600">
                                    {city}
                                </div>
                            </div>
                            <div className="flex items-center w-full gap-1 px-2 py-2">
                                <FaSearch
                                    onChange={(e) => setQuery(e.target.value)}
                                    value={query}
                                    size={20}
                                    className="text-[#ff4d2d]"
                                />
                                <input
                                    className="w-full px-1 focus:outline-none text-sm"
                                    type="text"
                                    placeholder="Search delicious Food... 😋"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
