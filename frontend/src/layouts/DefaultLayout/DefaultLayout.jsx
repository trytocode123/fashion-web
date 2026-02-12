import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";

const DefaultLayout = ({children}) => {
    return (
        <div className={"w-[100%]"}>
            <Header/>
            <div className={"w-[100%] flex items-center justify-center lg:mt-[120px]"}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default DefaultLayout;
