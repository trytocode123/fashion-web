import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/Reducer/cartSlice.js";

const DefaultLayout = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth?.account?.token);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [dispatch, token]);

    return (
        <div className={"w-[100%]"}>
            <Header />
            <div className={"w-[100%] flex items-center justify-center lg:mt-[110px]"}>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default DefaultLayout;
