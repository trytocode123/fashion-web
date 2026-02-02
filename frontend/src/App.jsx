import './App.css'

import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout.jsx";
import LogIn from "./pages/LogIn/LogIn.jsx";
import {ToastContainer} from "react-toastify";
import {Route, Routes} from "react-router-dom";
import Register from "./pages/Register/Register.jsx";
import Home from "./pages/Home/Home.jsx";

function App() {

    return (
        <div>
            <DefaultLayout>
                <Routes>
                    <Route path={"/"} element={<LogIn/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                    <Route path={"/home"} element={<Home/>}/>
                </Routes>
            </DefaultLayout>
            <ToastContainer position="top-right" theme="colored" autoClose="2000" closeOnClick="true"/>

        </div>
    )
}

export default App
