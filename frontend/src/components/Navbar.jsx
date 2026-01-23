import React, { useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import {serverUrl} from "../App";

const Navbar = () => {
    // const { userData, city } = useSelector((state) => {
    //     return state.user?.userData?.data;
    // });

    const { userData, city } = useSelector((state) => state?.user);
    const actualUserData = userData?.data;
    // console.log(actualUserData);
    // console.log(city);

    const [showInfo, setShowInfo] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = async (e) => {
        try {
            await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true,
            });
            dispatch(
                setUserData(null),
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className={`w-full h-15 md:h-20 flex items-center justify-between md:justify-center gap-10 px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible`}
        >
            <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">
                {/* <img src="../../public/logo2.png" alt="" /> */}
                FoodTalab
            </h1>
            <div className="md:w-[60%] lg:w-[40%] h-15 bg-white shadow-xl rounded-lg items-center hidden  md:flex gap-[20px]">
                <div className="flex items-center w-[40%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
                    <MdLocationPin size={25} className="text-[#ff4d2d]" />
                    <div className="w-[80%] truncate text-gray-600">{city}</div>
                </div>
                <div className="flex items-center w-full gap-2 px-[10px] py-2">
                    <FaSearch size={20} className="text-[#ff4d2d]" />
                    <input
                        className="w-full px-3 focus:outline-none"
                        type="text"
                        placeholder="Search delicious Food... 😋"
                    />
                </div>
            </div>

            <div className=" flex justify-center items-center gap-5">
                <div
                    onClick={() => setShowSearch((prev) => !prev)}
                    className="md:hidden cursor-pointer transition-all ease-in-out duration-500 text-[#ff4d2d] text-sm font-medium"
                >
                    {showSearch ? (
                        <IoClose size={25} className="text-[#ff4d2d]" />
                    ) : (
                        <FaSearch
                            size={20}
                            className="text-[#ff4d2d] md:hidden"
                        />
                    )}
                </div>
                <div className="relative cursor-pointer">
                    <IoMdCart size={25} className="text-[#ff4d2d]" />
                    <span className="absolute text-sm text-[#ff4d2d] top-[-11px] left-6.5">
                        0
                    </span>
                </div>

                <button className="cursor-pointer hover:bg-[#ff4d2d]/5 hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/15 text-[#ff4d2d] text-sm font-medium">
                    Orders
                </button>

                <div
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="w-9 h-9 text-lg font-semibold shadow-2xl bg-[#ff4d2d] text-white rounded-full flex justify-center items-center cursor-pointer "
                >
                    {actualUserData?.fullName?.charAt(0)}
                </div>

                {showInfo && (
                    <div className="fixed top-20 right-15 md:right-[5%] lg:right-[20%] w-50 bg-white shadow-2xl rounded-xl p-5 flex flex-col gap-3 z-[9999]">
                        <div className="text-sm font-semibold">
                            Hey.. {actualUserData.fullName}
                        </div>
                        <div className="md:hidden font-semibold text-sm cursor-pointer hover:text-[#ff4d2d]">
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

                {showSearch && (
                    <div className="md:hidden fixed top-15 right-[10%] w-[80%]">
                        <div className=" h-15 bg-white shadow-xl rounded-lg flex items-center gap-1">
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
