import { data, Navigate, Route, Routes } from "react-router-dom";
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

export const serverUrl = "http://localhost:8000";

function App() {
    useGetCurrentUser();
    useGetCity();
    const { userData, socket } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    // console.log(userData);
    // if(userData?.data?.role === "owner"){
    //     useGetMyShop();
    // }
    useGetMyShop();
    useGetShopByCity();
    useGetItemByCity();
    useGetMyOrders();
    useUpdateLocation();

    // socket test
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
        <Routes>
            <Route
                path="/"
                element={userData ? <Home /> : <Navigate to="/signin" />}
            />
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
                    !userData ? <Navigate to="/signup" /> : <ForgotPassword />
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
                element={
                    !userData ? <Navigate to="/signin" /> : <FoodPreview />
                }
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
        </Routes>
    );
}

export default App;
