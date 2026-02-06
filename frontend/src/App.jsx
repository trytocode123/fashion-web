import './App.css'

import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout.jsx";
import LogIn from "./pages/LogIn/LogIn.jsx";
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import Detail from "./pages/Detail/Detail.jsx";
import PaymentForm from "./pages/PaymentForm/PaymentForm.jsx";
import PaymentSuccess from "./pages/PaymentResult/PaymentSuccess/PaymentSuccess.jsx";
import PaymentFail from "./pages/PaymentResult/PaymentFail/PaymentFail.jsx";


function App() {

    return (
        <div>
            <DefaultLayout>
                <Routes>
                    <Route path={"/"} element={<LogIn/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                    <Route path={"/fashion-web-omega.vercel.app/home"} element={<Home/>}/>
                    <Route path={"/detail/:id"} element={<Detail/>}/>
                    <Route path={"/payForm/:info"} element={<PaymentForm/>}/>
                    <Route path={"/paymentSuccess"} element={<PaymentSuccess/>}/>
                    <Route path={"/fashion-web-omega.vercel.app/paymentFail"} element={<PaymentFail/>}/>
                </Routes>
            </DefaultLayout>
            <ToastContainer position="top-right" theme="colored" autoClose="2000" closeOnClick="true"/>

        </div>
    )
}

export default App
