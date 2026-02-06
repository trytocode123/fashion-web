import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import {Outlet} from "react-router-dom";

const DefaultLayout = ({children}) => {
    return (
        <div className={"w-[100%]"}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default DefaultLayout;
