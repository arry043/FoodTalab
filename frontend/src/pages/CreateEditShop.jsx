import { IoIosArrowRoundBack } from "react-icons/io";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function CreateEditShop() {
    const primaryColor = "#f25a13";
    const dispatch = useDispatch();
    const { myShopData } = useSelector((state) => state.owner);

    const { city, state, pincode, address } = useSelector(
        (state) => state.user,
    );

    const [name, setName] = useState(myShopData?.name || "");
    const [email, setEmail] = useState(myShopData?.email || "");
    const [contact, setContact] = useState(myShopData?.contact || "");
    const [inputAddress, setInputAddress] = useState(
        myShopData?.address || address,
    );
    const [inputCity, setInputCity] = useState(myShopData?.city || city);
    const [inputState, setInputState] = useState(myShopData?.state || state);
    const [inputPincode, setInputPincode] = useState(
        myShopData?.pincode || pincode,
    );
    const [frontendImage, setFrontendImage] = useState(
        myShopData?.image || null,
    );
    const [backendImage, setBackendImage] = useState(myShopData?.image || null);
    const [close, setClose] = useState(false);
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const handleImage = async (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    useEffect(() => {
        if (myShopData) {
            setName(myShopData.name || "");
            setEmail(myShopData.email || "");
            setContact(myShopData.contact || "");
            setInputAddress(myShopData.address || "");
            setInputCity(myShopData.city || "");
            setInputState(myShopData.state || "");
            setInputPincode(myShopData.pincode || "");
            setFrontendImage(myShopData.image || null);
        }
    }, [myShopData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("contact", contact);
            formData.append("address", inputAddress);
            formData.append("city", inputCity);
            formData.append("state", inputState);
            formData.append("pincode", inputPincode);
            if (backendImage instanceof File) {
                formData.append("image", backendImage);
            }

            const result = await axios.post(
                `${serverUrl}/api/shop/create-edit`,
                formData,
                { withCredentials: true },
            );
            console.log(result);
            dispatch(setMyShopData(result?.data?.data));
            navigate("/");
        } catch (error) {
            console.log("Error: adding shop: ", error);
        }
    };
    return (
        <div
            className="flex justify-center flex-col items-center p-6 bg-gradient-to-br
from-orange-50 relative Ito-white min-h-screen"
        >
            <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px]">
                <Link to="/">
                    <IoIosArrowRoundBack
                        className="size-20"
                        style={{ color: primaryColor }}
                    />
                </Link>
            </div>
            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
                <div className="flex flex-col items-center mb-6">
                    <div>
                        {" "}
                        <GiForkKnifeSpoon className="text-[#ff4d2d] w-13  h-13 mb-5 sm:w-16 sm:h-16" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-700">
                        {myShopData ? "Edit Your Shop" : "Register Your Shop"}
                    </div>
                </div>

                <form method="POST" className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shop Name:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your Shop Name"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image:
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={handleImage}
                        />
                        <center>
                            {(frontendImage || backendImage) && (
                                <div className="relative inline-block mt-4">
                                    {/* ❌ Close Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFrontendImage(null);
                                            setBackendImage(null);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = ""; // ✅ clears file name
                                            }
                                        }}
                                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition z-10"
                                    >
                                        <IoClose
                                            size={20}
                                            className="text-[#ff4d2d]"
                                        />
                                    </button>

                                    {/* 🖼 Image */}
                                    <img
                                        src={frontendImage || backendImage}
                                        alt="preview"
                                        className="w-auto h-50 rounded-lg border object-cover"
                                    />
                                </div>
                            )}
                        </center>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shop Email:
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your Shop Email"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shop Contact Number:
                        </label>
                        <input
                            type="number"
                            placeholder="Enter your Shop Contact Number"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setContact(e.target.value)}
                            value={contact}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address:
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your Shop Pincode"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setInputAddress(e.target.value)}
                            value={inputAddress}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your Shop City"
                                className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                                name=""
                                id=""
                                onChange={(e) => setInputCity(e.target.value)}
                                value={inputCity}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State:
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your Shop State"
                                className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                                name=""
                                id=""
                                onChange={(e) => setInputState(e.target.value)}
                                value={inputState}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pincode:
                        </label>
                        <input
                            type="number"
                            placeholder="Enter your Shop Pincode"
                            className="border border-gray-500 focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full px-4 py-2"
                            name=""
                            id=""
                            onChange={(e) => setInputPincode(e.target.value)}
                            value={inputPincode}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full cursor-pointer bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-5 00 hover:shadow-lg transition-all duration-200"
                    >
                        {myShopData ? "Save updates" : "Register Shop"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEditShop;
