import './App.css'

import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout.jsx";
import LogIn from "./pages/LogIn/LogIn.jsx";
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import Detail from "./pages/Detail/Detail.jsx";
import VNPaySuccess from "./pages/VNPayResult/VNPaySuccess/VNPaySuccess.jsx";
import VNPayFail from "./pages/VNPayResult/VNPayFail/VNPayFail.jsx";
import PaypalSuccess from "./pages/PaypalResult/PaypalSuccess/PaypalSuccess.jsx";
import PaypalFail from "./pages/PaypalResult/PaypalFail/PaypalFail.jsx";
import About from "./pages/About/About.jsx";
import PrivateRoute from "./route/PrivateRoute/PrivateRoute.jsx";
import PublicRoute from "./route/PublicRoute/PublicRoute.jsx";
import ScrollToStart from "./components/ScrollToStart/ScrollToStart.jsx";
import PreventToHome from "./components/PreventToHome/PreventToHome.jsx";
import NotFound from "./pages/404/NotFound.jsx";
import Verify from "./pages/Verify/Verify.jsx";


function App() {
    return (
        <div>
            <ScrollToStart/>
            <Routes>
                <Route element={<DefaultLayout/>}>
                    <Route element={<PublicRoute/>}>
                        <Route element={<PreventToHome/>}>
                            <Route path={"/"} element={<LogIn/>}/>
                        </Route>
                        <Route path={"/register"} element={<Register/>}/>
                        <Route path={"/about"} element={<About/>}/>
                        <Route path={"/verify"} element={<Verify/>}/>
                    </Route>
                    <Route path={"/home"} element={<Home/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path={"/detail/:id"} element={<Detail/>}/>
                        <Route path={"/vnpaySuccess"} element={<VNPaySuccess/>}/>
                        <Route path={"/vnpayFail"} element={<VNPayFail/>}/>
                        <Route path={"/paypalSuccess"} element={<PaypalSuccess/>}/>
                        <Route path={"/paypalFail"} element={<PaypalFail/>}/>
                    </Route>
                </Route>

                <Route path={"*"} element={<NotFound/>}>

                </Route>
            </Routes>
            <ToastContainer position="top-right" theme="colored" autoClose="2000" closeOnClick="true"/>
        </div>
    )
}

export default App
