import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
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

export const serverUrl = "http://localhost:8000";

function App() {
    
    useGetCurrentUser();
    useGetCity();
    const {userData} = useSelector((state) => state.user);
    // console.log(userData);
    // if(userData?.data?.role === "owner"){
    //     useGetMyShop();
    // }
    useGetMyShop();
    useGetShopByCity();
    useGetItemByCity();
    useGetMyOrders();


    return (
        <Routes>
            <Route path="/" element={ userData ? <Home /> : <Navigate to="/signin" />} /> 
            <Route path="/signup" element={ userData ? <Navigate to="/" /> : <SignUp />} /> 
            <Route path="/signin" element={ userData ? <Navigate to="/" /> : <SignIn />} />
            <Route path="/forgot-password" element={ !userData ? <Navigate to="/signup" /> : <ForgotPassword />} />
            <Route path="/create-edit-shop" element={ !userData ? <Navigate to="/signin" /> : <CreateEditShop />} />
            <Route path="/add-item" element={ !userData ? <Navigate to="/signin" /> : <AddItem />} />
            <Route path="/edit-item/:itemId" element={ !userData ? <Navigate to="/signin" /> : <EditItem />} />
            <Route path="/cart" element={ !userData ? <Navigate to="/signin" /> : <CartPage />} />
            <Route path="/checkout" element={ !userData ? <Navigate to="/signin" /> : <CheckOutPage />} />
            <Route path="/order-placed" element={ !userData ? <Navigate to="/signin" /> : <OrderPlaced />} />
            <Route path="/my-orders" element={ !userData ? <Navigate to="/signin" /> : <MyOrders />} />
        </Routes>
    );
}

export default App;
