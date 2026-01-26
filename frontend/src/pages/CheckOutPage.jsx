import { IoIosArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CustomPinLocationMarker } from "../components/CustomPinLocationMarker";
import { setLocation, setMapAddress } from "../redux/mapSlice";
import axios from "axios";
import { serverUrl } from "../App";

function RecenterMap({ location }) {
    if (location.lat && location.lng) {
        const map = useMap();
        map.setView([location.lat, location.lng], 16, {
            animate: true,
            duration: 1,
        });
    }
    return null;
}

function CheckOutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems, totalAmount, delivaryFee, address, city } = useSelector(
        (state) => state.user,
    );
    const { location, mapAddress } = useSelector((state) => state.map);
    // console.log("location:  and map add", location, mapAddress);

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [addressInput, setAddressInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);

    const onDragEnd = (e) => {
        const { lat, lng } = e.target.getLatLng();
        // console.log(lat, lng);
        dispatch(
            setLocation({
                lat: lat,
                lng: lng,
            }),
        );
        getAddressByLatLng(lat, lng);
    };

    const getAddressByLatLng = async (lat, lng) => {
        try {
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
            );
            const formattedAddress = result?.data?.results[0]?.formatted;
            // console.log(formattedAddress);
            dispatch(setMapAddress(formattedAddress));
        } catch (error) {
            console.log("fetch location error checkout: ", error);
        }
    };

    const fetchSuggestions = async (text) => {
        if (!text || text.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            setLoadingSuggest(true);

            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                    text,
                )}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
            );
            console.log("Suggestions: ", result);
            setSuggestions(result.data?.results || []);
            setShowSuggestions(true);
        } catch (error) {
            console.log("autocomplete error:", error);
        } finally {
            setLoadingSuggest(false);
        }
    };

    useEffect(() => {
        setAddressInput(mapAddress);
    }, [mapAddress]);

    const handlePlaceOrder = async () => {
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
                {
                    withCredentials: true,
                },
            );
            console.log("order placed: ", result.data);
            navigate("/order-placed")
        } catch (error) {
            console.log("place order error: ", error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                // console.log(position);
                const lattitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                dispatch(setLocation({ lat: lattitude, lng: longitude }));
                // console.log(`lattitude: ${lattitude} longitude: ${longitude}`);

                try {
                    const location = await axios.get(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${lattitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEO_LOCATION_API_KEY}`,
                    );
                    const formatted = location?.data?.results[0]?.formatted;
                    dispatch(setLocation({ lat: lattitude, lng: longitude }));
                    dispatch(setMapAddress(formatted));
                } catch (error) {
                    console.log("fetch location error: ", error);
                }
            });
        } catch (error) {
            console.log("fetch location error: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 pb-24">
            <div className="w-full md:mt-10 mt-5 max-w-3xl">
                {/* 🔙 BACK */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-[#ff4d2d] mb-4"
                >
                    <IoIosArrowRoundBack size={30} />
                    <span className="font-medium">Back</span>
                </button>

                <h1 className="text-2xl font-bold mb-5">Checkout</h1>

                {/* 📍 DELIVERY ADDRESS */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-2">Delivery Address</h3>
                    <p className="text-sm text-gray-600">
                        {address || "Hostel / Home Address not set"}
                    </p>
                    <p className="text-sm text-gray-500">{city}</p>

                    <button
                        className="mt-2 text-sm text-[#ff4d2d] font-medium"
                        onClick={() => navigate("/profile")}
                    >
                        Change Address
                    </button>
                </div>

                {/* 📍 LOCATION PICKER */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MdLocationPin className="text-[#ff4d2d]" />
                        Pick Delivery Location
                    </h3>

                    <div className="flex items-center gap-2">
                        {/* INPUT */}
                        <div className="flex items-center flex-1 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400">
                            <FaSearch className="text-gray-400 text-sm mr-2" />
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
                                placeholder="Search for area, street, landmark..."
                                className="w-full outline-none text-sm bg-transparent"
                            />
                        </div>

                        {/* CURRENT LOCATION BTN */}
                        <button
                            onClick={getCurrentLocation}
                            className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                            <MdOutlineMyLocation size={18} />
                        </button>
                    </div>

                    {loadingSuggest && (
                        <p className="text-xs text-gray-400 mt-1">
                            Searching...
                        </p>
                    )}
                    {/* 🔽 SUGGESTION DROPDOWN */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul
                            className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100
    max-h-64 overflow-y-auto text-sm divide-y"
                        >
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setAddressInput(item.formatted);
                                        setShowSuggestions(false);
                                        setSuggestions([]);

                                        dispatch(
                                            setLocation({
                                                lat: item.lat,
                                                lng: item.lon,
                                            }),
                                        );

                                        dispatch(setMapAddress(item.formatted));
                                    }}
                                    className="flex gap-3 px-4 py-3 cursor-pointer
            hover:bg-orange-50 transition-all"
                                >
                                    {/* 📍 ICON */}
                                    <div className="mt-1 text-[#ff4d2d]">
                                        <MdLocationPin size={18} />
                                    </div>

                                    {/* TEXT */}
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800 line-clamp-1">
                                            {item.address_line1 || item.name}
                                        </span>

                                        <span className="text-xs text-gray-500 line-clamp-1">
                                            {item.address_line2 ||
                                                item.formatted}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* INFO TEXT */}
                    <p className="text-xs text-gray-500 mt-2">
                        Use current location or search manually
                    </p>
                </div>

                {/* 🗺️ MAP PREVIEW */}
                <div className="bg-white rounded-2xl shadow-md p-3 mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        📍 Pin your exact location
                    </h3>

                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                        {/* MAP */}
                        <div className="h-[260px] w-full">
                            <MapContainer
                                center={[location.lat, location.lng]}
                                zoom={15}
                                scrollWheelZoom={false}
                                className="w-full h-full z-0"
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
                    </div>

                    {/* INFO BAR */}
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                        <span>Move map to adjust location</span>
                        <span className="text-[#ff4d2d] font-medium cursor-pointer">
                            Change
                        </span>
                    </div>
                </div>

                {/* 🧾 ORDER SUMMARY */}
                <div className="bg-white rounded-xl shadow p-4 mb-5">
                    <h3 className="font-semibold mb-3">Order Summary</h3>

                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm mb-2"
                        >
                            <span className="line-clamp-1">
                                {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalAmount + delivaryFee}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                        Includes ₹{delivaryFee} delivery fee
                    </p>
                </div>

                {/* 💳 PAYMENT METHOD */}
                <div className="bg-white rounded-xl shadow p-4 mb-6">
                    <h3 className="font-semibold mb-3">Payment Method</h3>

                    <div className="md:flex flex-row w-full gap-5 justify-center">
                        {/* COD */}
                        <label
                            className={`flex items-center gap-3 h-15 p-3 w-full rounded-lg border cursor-pointer mb-3 ${
                                paymentMethod === "COD"
                                    ? "border-[#ff4d2d] bg-orange-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                                className="accent-[#ff4d2d]"
                            />
                            <FaMoneyBillWave className="text-green-600" />
                            <span className="text-sm font-medium">
                                Cash on Delivery
                            </span>
                        </label>

                        {/* ONLINE */}
                        <label
                            className={`flex items-center gap-3 h-15 w-full p-3 rounded-lg border cursor-pointer ${
                                paymentMethod === "ONLINE"
                                    ? "border-[#ff4d2d] bg-orange-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                value="ONLINE"
                                checked={paymentMethod === "ONLINE"}
                                onChange={() => setPaymentMethod("ONLINE")}
                                className="accent-[#ff4d2d]"
                            />
                            <FaCreditCard className="text-blue-600" />
                            <span className="text-sm font-medium">
                                UPI / Creadit / Debit Card
                            </span>
                        </label>
                    </div>
                </div>

                {/* ✅ PLACE ORDER */}
                <button
                    className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl
                    font-semibold text-lg hover:bg-[#e64528] transition"
                    onClick={handlePlaceOrder}
                >
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
                </button>
            </div>
        </div>
    );
}

export default CheckOutPage;
