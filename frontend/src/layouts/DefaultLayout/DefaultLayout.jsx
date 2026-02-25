import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
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
