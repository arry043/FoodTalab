import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { Home } from "./pages/Home";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemByCity from "./hooks/useGetItemByCity";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckOutPage";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import ShopView from "./pages/ShopView";
import FoodPreview from "./pages/FoodPreview";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { setSocket, updateOrderStatus } from "./redux/userSlice";
import NotFoundPage from "./pages/NotFoundPage";
import { serverUrl } from "./config/api";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

/* Scroll to top on route change */
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);
    return null;
}

function App() {
    useGetCurrentUser();
    useGetCity();
    const { userData, socket } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useGetMyShop();
    useGetShopByCity();
    useGetItemByCity();
    useGetMyOrders();
    useUpdateLocation();

    const location = useLocation();

    // socket connection
    useEffect(() => {
        const socketInstance = io(serverUrl, {
            withCredentials: true,
        });
        dispatch(setSocket(socketInstance));
        socketInstance.on("connect", () => {
            console.log("Connected to server", socketInstance.id);
            if (userData) {
                socketInstance.emit("identity", userData.data._id);
            }
        });

        // Listen for real-time status updates on user orders
        socketInstance.on("orderStatusUpdate", (response) => {
            console.log("SOCKET ORDER STATUS UPDATE:", response);
            if (response.orderId && response.shopId && response.status) {
                dispatch(
                    updateOrderStatus({
                        orderId: response.orderId,
                        shopId: response.shopId,
                        status: response.status,
                    }),
                );
            }
        });

        return () => {
            socketInstance.off("orderStatusUpdate");
            socketInstance.disconnect();
            console.log("Disconnected from server");
        };
    }, [userData?.data?._id, dispatch]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="colored"
                toastStyle={{ borderRadius: "16px" }}
            />
            <ScrollToTop />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/signup"
                        element={userData ? <Navigate to="/" /> : <SignUp />}
                    />
                    <Route
                        path="/signin"
                        element={userData ? <Navigate to="/" /> : <SignIn />}
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            userData ? <Navigate to="/" /> : <ForgotPassword />
                        }
                    />
                    <Route
                        path="/create-edit-shop"
                        element={
                            !userData ? <Navigate to="/signin" /> : <CreateEditShop />
                        }
                    />
                    <Route
                        path="/add-item"
                        element={!userData ? <Navigate to="/signin" /> : <AddItem />}
                    />
                    <Route
                        path="/edit-item/:itemId"
                        element={!userData ? <Navigate to="/signin" /> : <EditItem />}
                    />
                    <Route
                        path="/food-preview/:itemId"
                        element={<FoodPreview />}
                    />
                    <Route
                        path="/cart"
                        element={!userData ? <Navigate to="/signin" /> : <CartPage />}
                    />
                    <Route
                        path="/checkout"
                        element={
                            !userData ? <Navigate to="/signin" /> : <CheckOutPage />
                        }
                    />
                    <Route
                        path="/order-placed"
                        element={
                            !userData ? <Navigate to="/signin" /> : <OrderPlaced />
                        }
                    />
                    <Route
                        path="/my-orders"
                        element={!userData ? <Navigate to="/signin" /> : <MyOrders />}
                    />
                    <Route
                        path="/track-order/:orderId"
                        element={
                            !userData ? <Navigate to="/signin" /> : <TrackOrderPage />
                        }
                    />
                    <Route
                        path="/shop-view/:shopId"
                        element={!userData ? <Navigate to="/signin" /> : <ShopView />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AnimatePresence>
        </>
    );
}

export default App;
