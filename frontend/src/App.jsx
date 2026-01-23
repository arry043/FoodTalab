import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import { Home } from "./pages/Home";
import useGetCity from "./hooks/useGetCity";

export const serverUrl = "http://localhost:8000";

function App() {

    useGetCurrentUser();
    useGetCity();

    const {userData} = useSelector((state) => state.user);

    return (
        <Routes>
            <Route path="/" element={ userData ? <Home /> : <Navigate to="/signin" />} /> 
            <Route path="/signup" element={ userData ? <Navigate to="/" /> : <SignUp />} /> 
            <Route path="/signin" element={ userData ? <Navigate to="/" /> : <SignIn />} />
            <Route path="/forgot-password" element={ userData ? <Navigate to="/" /> : <ForgotPassword />} />
        </Routes>
    );
}

export default App;
