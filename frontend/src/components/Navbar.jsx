import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { LuMapPin, LuReceipt, LuUserRound, LuLogOut, LuPackage } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    setCity,
    setIsSearching,
    setSearchItems,
    setUserData,
} from "../redux/userSlice";
import { serverUrl } from "../config/api";

const Navbar = () => {
    const { userData, city, cartItems, myOrders } = useSelector(
        (state) => state?.user,
    );
    const { myShopData } = useSelector((state) => state?.owner);
    const actualUserData = userData?.data;
    const role = actualUserData?.role;

    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(0);
    const [cartBounce, setCartBounce] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const isCustomer = !role || role === "user";
    const activeOrders =
        myOrders?.filter((o) => o?.shopOrders?.[0]?.status !== "delivered")
            ?.length || 0;

    // Scroll shadow effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cart badge bounce
    useEffect(() => {
        if (cartItems?.length > prevCartCount) {
            setCartBounce(true);
            const timer = setTimeout(() => setCartBounce(false), 400);
            return () => clearTimeout(timer);
        }
        setPrevCartCount(cartItems?.length || 0);
    }, [cartItems?.length]);

    // Click outside to close profile dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowInfo(false);
            }
        };
        if (showInfo) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showInfo]);

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            dispatch(setUserData(null));
            setShowInfo(false);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchItems = async (searchText) => {
        const trimmed = searchText.trim();
        if (!trimmed) return;

        try {
            setSearchLoading(true);
            const cityQuery = city ? `&city=${city}` : "";
            const res = await axios.get(
                `${serverUrl}/api/item/search-items?query=${encodeURIComponent(trimmed)}${cityQuery}`,
                { withCredentials: true },
            );
            dispatch(setSearchItems(res.data.data || []));
        } catch (error) {
            console.error("Error searching items:", error);
            dispatch(setSearchItems([]));
        } finally {
            setSearchLoading(false);
        }
    };

<<<<<<< HEAD
    // GEOLOCATION FETCH 
=======
>>>>>>> d53c1ff (Improving UI/UX)
    const fetchLocation = () => {
        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                    );
                    const fetchedCity =
                        res.data?.address?.city ||
                        res.data?.address?.town ||
                        res.data?.address?.village ||
                        res.data?.address?.county;

                    if (fetchedCity) {
                        dispatch(setCity(fetchedCity));
                    } else {
                        alert("Could not determine city from location.");
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    alert("Could not fetch location right now.");
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationLoading(false);
                alert("Please allow location access to fetch your city.");
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    useEffect(() => {
        if (!query.trim()) {
            dispatch(setIsSearching(false));
            dispatch(setSearchItems([]));
            setSearchLoading(false);
            return;
        }

        dispatch(setIsSearching(true));
        const timer = setTimeout(() => handleSearchItems(query), 280);
        return () => clearTimeout(timer);
    }, [query, city]);

    const SearchBox = ({ compact = false }) => (
        <div
            className={`panel flex items-center overflow-hidden !rounded-2xl ${compact ? "h-12" : "h-13"
                }`}
        >
            <button
                type="button"
                onClick={fetchLocation}
                className="flex h-full min-w-0 items-center gap-2 border-r border-orange-100 px-3 text-left transition-all duration-200 hover:bg-orange-50/80 sm:px-4"
            >
                {locationLoading ? (
                    <ImSpinner2 className="size-4 animate-spin text-[var(--brand)]" />
                ) : (
                    <LuMapPin className="size-4 shrink-0 text-[var(--brand)]" />
                )}
                <span className="max-w-[100px] truncate text-xs font-bold text-gray-700 sm:max-w-[140px] sm:text-sm">
                    {city || "Set location"}
                </span>
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                {searchLoading ? (
                    <ImSpinner2 className="size-4 animate-spin text-[var(--brand)]" />
                ) : (
                    <FaSearch className="size-3.5 shrink-0 text-[var(--brand)]" />
                )}
                <input
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                    type="text"
                    placeholder="Search food, snacks, shops..."
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                        className="rounded-full p-1 text-gray-400 transition-all hover:bg-orange-50 hover:text-[var(--brand)]"
                    >
                        <IoClose size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <header className={`glass-nav fixed inset-x-0 top-0 z-[9999] ${scrolled ? "scrolled" : ""}`}>
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 md:h-[4.5rem] md:px-5">
                <Link
                    to="/"
                    className="shrink-0 text-[1.4rem] font-black tracking-tight text-[var(--brand)] transition-transform duration-200 hover:scale-[1.02] md:text-[1.7rem]"
                >
                    FoodTalab
                </Link>

                {isCustomer && (
                    <div className="hidden w-full max-w-xl md:block lg:max-w-2xl">
                        <SearchBox />
                    </div>
                )}

                <div className="flex items-center gap-1.5 md:gap-2">
                    {isCustomer && (
                        <button
                            type="button"
                            onClick={() => setShowSearch((prev) => !prev)}
                            aria-label="Search"
                            className="btn-ghost flex size-10 items-center justify-center rounded-full md:hidden"
                        >
                            {showSearch ? <IoClose size={18} /> : <FaSearch size={14} />}
                        </button>
                    )}

                    {role === "owner" && myShopData && (
                        <button
                            type="button"
                            onClick={() => navigate("/add-item")}
                            className="btn-ghost flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold"
                        >
                            <FaPlus size={11} />
                            <span className="hidden sm:inline">Add Item</span>
                        </button>
                    )}

                    {isCustomer && (
                        <motion.button
                            type="button"
                            onClick={() =>
                                userData ? navigate("/cart") : navigate("/signin")
                            }
                            className="btn-ghost relative flex size-10 items-center justify-center rounded-full"
                            aria-label="Cart"
                            whileTap={{ scale: 0.92 }}
                        >
                            <IoMdCart size={20} />
                            <AnimatePresence>
                                {cartItems?.length > 0 && (
                                    <motion.span
                                        key={cartItems.length}
                                        initial={{ scale: 0.3, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white shadow-md"
                                    >
                                        {cartItems.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    )}

                    {(role === "user" ||
                        role === "owner" ||
                        role === "deliveryBoy") && (
                            <button
                                type="button"
                                onClick={() => navigate("/my-orders")}
                                className="btn-ghost relative flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold sm:px-3"
                            >
                                <LuReceipt size={16} />
                                <span className="hidden sm:inline">
                                    {role === "deliveryBoy"
                                        ? "Deliveries"
                                        : "Orders"}
                                </span>
                                <AnimatePresence>
                                    {role === "owner" && activeOrders > 0 && (
                                        <motion.span
                                            key={activeOrders}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-[var(--brand)] text-[10px] font-bold text-white"
                                        >
                                            {activeOrders}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        )}

                    {!userData ? (
                        <button
                            type="button"
                            onClick={() => navigate("/signin")}
                            className="btn-primary h-9 rounded-full px-4 text-xs font-bold"
                        >
                            Login
                        </button>
                    ) : (
                        <div className="relative" ref={profileRef}>
                            <motion.button
                                type="button"
                                onClick={() => setShowInfo((prev) => !prev)}
                                className="flex size-9 items-center justify-center rounded-full bg-[#19120f] text-xs font-black uppercase text-white shadow-lg ring-2 ring-transparent transition-all hover:ring-[var(--brand)]/30"
                                aria-label="Open profile menu"
                                whileTap={{ scale: 0.92 }}
                            >
                                {actualUserData?.fullName?.charAt(0) || (
                                    <LuUserRound size={16} />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        className="panel absolute right-0 top-12 w-60 p-4"
                                    >
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            Signed in as
                                        </p>
                                        <p className="mt-1.5 truncate text-sm font-black text-gray-900">
                                            {actualUserData?.fullName}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">
                                            {actualUserData?.email}
                                        </p>
                                        <div className="mt-4 space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate("/my-orders");
                                                    setShowInfo(false);
                                                }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 transition-all hover:bg-orange-50 hover:text-[var(--brand)]"
                                            >
                                                <LuPackage size={16} />
                                                My orders
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                                            >
                                                <LuLogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showSearch && isCustomer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-orange-100/60 px-4 md:hidden"
                    >
                        <div className="py-3">
                            <SearchBox compact />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
