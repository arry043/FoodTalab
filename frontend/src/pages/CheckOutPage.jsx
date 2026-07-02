import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
    LuCheck,
    LuCreditCard,
    LuMapPin,
    LuNavigation,
    LuSearch,
    LuWallet,
} from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CustomPinLocationMarker } from "../components/CustomPinLocationMarker";
import { setLocation, setMapAddress } from "../redux/mapSlice";
import { addMyOrders } from "../redux/userSlice";
import { serverUrl } from "../config/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

function RecenterMap({ location }) {
    const map = useMap();

    useEffect(() => {
        if (location.lat && location.lng) {
            map.setView([location.lat, location.lng], 16, {
                animate: true,
                duration: 0.7,
            });
        }
    }, [location.lat, location.lng, map]);

    return null;
}

const steps = [
    { label: "Location", icon: LuMapPin },
    { label: "Payment", icon: LuCreditCard },
    { label: "Confirm", icon: LuCheck },
];

function CheckOutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, totalAmount, delivaryFee } = useSelector(
        (state) => state.user,
    );
    const { location, mapAddress } = useSelector((state) => state.map);

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [addressInput, setAddressInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    const toPay = totalAmount + delivaryFee;
    const hasValidLocation = Boolean(location?.lat && location?.lng);
    const canPlaceOrder =
        cartItems.length > 0 &&
        hasValidLocation &&
        addressInput.trim().length > 8 &&
        !placingOrder;

    // Calculate step for indicator
    const currentStep = hasValidLocation && addressInput.trim().length > 8 ? 2 : 1;

    const onDragEnd = (e) => {
        const { lat, lng } = e.target.getLatLng();
        dispatch(setLocation({ lat, lng }));
        getAddressByLatLng(lat, lng);
    };

    const getAddressByLatLng = async (lat, lng) => {
        try {
            setLocationLoading(true);
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
            );
            const formattedAddress = result?.data?.results[0]?.formatted;
            dispatch(setMapAddress(formattedAddress || ""));
        } catch (error) {
            console.log("fetch location error checkout: ", error);
        } finally {
            setLocationLoading(false);
        }
    };

    const fetchSuggestions = async (text) => {
        if (!text || text.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            setLoadingSuggest(true);
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    text,
                )}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
            );
            setSuggestions(result.data?.results || []);
            setShowSuggestions(true);
        } catch (error) {
            console.log("autocomplete error:", error);
        } finally {
            setLoadingSuggest(false);
        }
    };

    useEffect(() => {
        setAddressInput(mapAddress || "");
    }, [mapAddress]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems.length, navigate]);

    const handlePlaceOrder = async () => {
        if (!canPlaceOrder) {
            setError("Please select a delivery address before placing order.");
            toast.error("Please select a delivery address first");
            return;
        }

        setPlacingOrder(true);
        setError("");
        try {
            const result = await axios.post(
                `${serverUrl}/api/order/place-order`,
                {
                    paymentMethod,
                    delivaryAddress: {
                        text: addressInput,
                        lattitude: location.lat,
                        longitude: location.lng,
                    },
                    totalAmount,
                    delivaryFee,
                    cartItems,
                },
                { withCredentials: true },
            );

            if (paymentMethod === "COD") {
                dispatch(addMyOrders(result.data.data));
                navigate("/order-placed");
            } else {
                openRazorPayWindow(
                    result.data.data.orderId,
                    result.data.data.razorOrder,
                );
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Could not place order";
            setError(message);
            toast.error(message);
        } finally {
            setPlacingOrder(false);
        }
    };

    const openRazorPayWindow = async (orderId, razorOrder) => {
        try {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorOrder.amount,
                currency: razorOrder.currency,
                name: "Food Talab",
                description: "Order ID: " + orderId,
                order_id: razorOrder.id,
                handler: async function (response) {
                    try {
                        setPlacingOrder(true);
                        const result = await axios.post(
                            `${serverUrl}/api/order/verify-payment`,
                            {
                                razorpayOrderId: razorOrder.id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                orderId,
                            },
                            { withCredentials: true },
                        );
                        dispatch(addMyOrders(result.data.data));
                        navigate("/order-placed");
                    } catch (error) {
                        setError(
                            error.response?.data?.message ||
                                "Payment verification failed",
                        );
                    } finally {
                        setPlacingOrder(false);
                    }
                },
                modal: {
                    ondismiss: () => setPlacingOrder(false),
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log("razorpay error: ", error);
            setError("Could not open payment window.");
            setPlacingOrder(false);
        }
    };

    const getCurrentLocation = () => {
        if (!("geolocation" in navigator)) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        setLocationLoading(true);
        setError("");
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                dispatch(setLocation({ lat, lng }));
                await getAddressByLatLng(lat, lng);
            },
            (error) => {
                console.log("fetch location error: ", error);
                setLocationLoading(false);
                setError("Please allow location access or search manually.");
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    if (cartItems.length === 0) {
        return (
            <motion.div {...pageVariants} className="app-shell flex min-h-screen items-center justify-center px-4">
                <Navbar />
                <div className="panel max-w-md rounded-3xl p-8 text-center">
                    <h1 className="text-2xl font-black text-gray-950">
                        Your cart is empty
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Add items before continuing to checkout.
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
        <motion.div {...pageVariants} className="app-shell min-h-screen pb-24">
            <Navbar />

            <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 pt-24 md:grid-cols-[1fr_340px] md:px-5 md:pt-28 lg:grid-cols-[1fr_380px]">
                <section>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-1 text-sm font-black text-[var(--brand)] transition-all hover:gap-2"
                    >
                        <IoIosArrowRoundBack size={26} />
                        Back
                    </button>

                    <h1 className="text-3xl font-black text-gray-950">
                        Checkout
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Confirm your location and payment method.
                    </p>

                    {/* Step Indicator */}
                    <div className="mt-6 flex items-center gap-1">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep >= index + 1;
                            const isCompleted = currentStep > index + 1;
                            return (
                                <React.Fragment key={step.label}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <motion.div
                                            className={`step-dot ${isCompleted ? "completed" : isActive ? "active" : ""}`}
                                            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {isCompleted ? <LuCheck size={14} /> : <StepIcon size={14} />}
                                        </motion.div>
                                        <span className={`text-[10px] font-bold ${isActive ? "text-[var(--brand)]" : "text-gray-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`step-line mb-5 ${isCompleted ? "active" : ""}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Location Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="panel mt-6 rounded-3xl p-4 sm:p-5"
                    >
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-gray-950">
                            <LuMapPin className="text-[var(--brand)]" />
                            Delivery location
                        </h2>

                        <div className="relative">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <LuSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={addressInput}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setAddressInput(value);
                                            fetchSuggestions(value);
                                        }}
                                        onFocus={() =>
                                            suggestions.length &&
                                            setShowSuggestions(true)
                                        }
                                        placeholder="Search area, street, landmark..."
                                        className="field pl-10"
                                    />
                                </div>

                                <motion.button
                                    onClick={getCurrentLocation}
                                    className="btn-ghost flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
                                    type="button"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {locationLoading ? (
                                        <ImSpinner2 className="size-4 animate-spin" />
                                    ) : (
                                        <LuNavigation className="size-4" />
                                    )}
                                    Current
                                </motion.button>
                            </div>

                            {loadingSuggest && (
                                <p className="mt-2 text-xs font-semibold text-gray-400">
                                    Searching addresses...
                                </p>
                            )}

                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.ul
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-orange-100 bg-white shadow-2xl"
                                    >
                                        {suggestions.map((item) => (
                                            <li key={`${item.lat}-${item.lon}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAddressInput(
                                                            item.formatted,
                                                        );
                                                        setShowSuggestions(false);
                                                        setSuggestions([]);
                                                        dispatch(
                                                            setLocation({
                                                                lat: item.lat,
                                                                lng: item.lon,
                                                            }),
                                                        );
                                                        dispatch(
                                                            setMapAddress(
                                                                item.formatted,
                                                            ),
                                                        );
                                                    }}
                                                    className="flex w-full gap-3 px-4 py-3 text-left transition-all hover:bg-orange-50"
                                                >
                                                    <LuMapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-sm font-bold text-gray-900">
                                                            {item.address_line1 ||
                                                                item.name ||
                                                                "Selected place"}
                                                        </span>
                                                        <span className="block truncate text-xs text-gray-500">
                                                            {item.address_line2 ||
                                                                item.formatted}
                                                        </span>
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="panel mt-5 overflow-hidden rounded-3xl p-3"
                    >
                        <div className="h-[300px] overflow-hidden rounded-2xl sm:h-[340px]">
                            <MapContainer
                                center={[location.lat, location.lng]}
                                zoom={15}
                                scrollWheelZoom={false}
                                className="h-full w-full z-0"
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <RecenterMap location={location} />
                                <Marker
                                    position={[location.lat, location.lng]}
                                    draggable
                                    icon={CustomPinLocationMarker}
                                    eventHandlers={{ dragend: onDragEnd }}
                                >
                                    <Popup>Your delivery location</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <p className="px-2 pt-3 text-xs font-semibold text-gray-500">
                            Drag the pin to fine-tune your doorstep location.
                        </p>
                    </motion.div>

                    {/* Payment Method */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="panel mt-5 rounded-3xl p-5"
                    >
                        <h2 className="mb-4 text-lg font-black text-gray-950">
                            Payment method
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                {
                                    value: "COD",
                                    label: "Cash on Delivery",
                                    icon: LuWallet,
                                },
                                {
                                    value: "ONLINE",
                                    label: "UPI / Card",
                                    icon: LuCreditCard,
                                },
                            ].map(({ value, label, icon: Icon }) => (
                                <motion.button
                                    key={value}
                                    type="button"
                                    onClick={() => setPaymentMethod(value)}
                                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition-all ${
                                        paymentMethod === value
                                            ? "border-[var(--brand)] bg-orange-50 text-[var(--brand)] shadow-md shadow-orange-100"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-orange-200"
                                    }`}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className={`flex size-10 items-center justify-center rounded-xl ${
                                        paymentMethod === value
                                            ? "bg-[var(--brand)] text-white"
                                            : "bg-gray-100 text-gray-500"
                                    }`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black">{label}</p>
                                        {paymentMethod === value && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="text-[10px] font-semibold text-[var(--brand)]/70"
                                            >
                                                Selected
                                            </motion.p>
                                        )}
                                    </div>
                                    {paymentMethod === value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto flex size-6 items-center justify-center rounded-full bg-[var(--brand)] text-white"
                                        >
                                            <LuCheck size={14} />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Order Summary Sidebar */}
                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="panel h-fit rounded-3xl p-5 md:sticky md:top-24"
                >
                    <h2 className="text-xl font-black text-gray-950">
                        Order summary
                    </h2>

                    <div className="mt-5 max-h-64 space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm"
                            >
                                <span className="line-clamp-1 font-semibold text-gray-700">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="shrink-0 font-black text-gray-950">
                                    ₹{item.price * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 space-y-3 border-t border-orange-100 pt-4 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Items</span>
                            <span className="font-semibold">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span className="font-semibold">
                                {delivaryFee === 0
                                    ? <span className="text-green-600">Free</span>
                                    : `₹${delivaryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-gray-950">
                            <span>To pay</span>
                            <span className="text-[var(--brand)]">₹{toPay}</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                        className="btn-primary mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black disabled:opacity-50"
                        onClick={handlePlaceOrder}
                        disabled={!canPlaceOrder}
                        whileTap={canPlaceOrder ? { scale: 0.97 } : {}}
                        whileHover={canPlaceOrder ? { scale: 1.01 } : {}}
                    >
                        {placingOrder && (
                            <ImSpinner2 className="size-4 animate-spin" />
                        )}
                        {placingOrder
                            ? "Placing order..."
                            : paymentMethod === "COD"
                                ? "Place order"
                                : "Pay now"}
                    </motion.button>

                    {!hasValidLocation && (
                        <p className="mt-3 text-center text-[10px] font-semibold text-gray-400">
                            Select a location to continue.
                        </p>
                    )}
                </motion.aside>
            </main>
        </motion.div>
    );
}

export default CheckOutPage;
