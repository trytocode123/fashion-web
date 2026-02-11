import {FaRegUser, FaSearch} from "react-icons/fa";
import {FaCartShopping} from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import {FiLogOut} from "react-icons/fi";
import {Link} from "react-router-dom";
import {logOut} from "../../../redux/Reducer/authSlice.js";
import {IoMdHome} from "react-icons/io";


const Header = () => {
    const account = useSelector(state => state.auth.account);
    const dispatch = useDispatch();

    const handleLogOut = () => {
        dispatch(logOut());
        localStorage.clear();
    }
    return (
        <header
            className={"flex fixed h-[100px] w-[100%] top-0 left-0 right-0 bg-gray-900 text-white items-center " +
                "justify-between px-[80px] lg:z-10 shadow-md shadow-gray-900"}>
            <div className={"flex flex-col justify-center flex-wrap-reverse group"}>
                <Link to={"/about"}
                      className={"lg:font-bold lg:text-3xl cursor-pointer group-hover:text-amber-50"}>FASHION</Link>
                <Link to={"/about"} className={"text-end group-hover:text-amber-50 cursor-pointer"}>hub</Link>
            </div>

            {account &&
                <div
                    className={"flex items-center justify-between bg-white rounded-full lg:w-[550px] lg:h-[50px] text-black lg:px-4"}>
                    <FaSearch className={"lg:mr-2"}/>
                    <input placeholder={"Search in product..."}
                           className={"lg:w-[100%] lg:h-[100%] focus:outline-hidden"}/>
                </div>
            }

            <div className={"lg:flex lg:justify-end lg:w-[350px] text-[16px]"}>
                {(account?.name || account?.fullName) && (
                    <div className="flex items-center justify-evenly font-medium text-gray-200 lg:min-w-[120px]">
                        Hello, <span
                        className="text-white font-semibold lg:ml-1 lg:p-0 lg:min-w-[50px]">{account.name || account.fullName}</span>
                        <Link to={"/"}>
                            <FiLogOut onClick={handleLogOut} className={"lg:m-2 text-red-400\n" +
                                "hover:text-red-500\n" +
                                "hover:bg-red-500/15" +
                                "rounded-full"}/>
                        </Link>
                    </div>
                )}

                <div className={"lg:flex lg:justify-end lg:justify-evenly lg:items-center lg:w-[100px]"}>
                    {account && (
                        <Link to={"/home"}>
                            <IoMdHome className={"lg:text-[20px]"}/>
                        </Link>
                    )}
                    <FaRegUser/>
                    <div className={"relative"}>
                        <FaCartShopping/>
                        <span
                            className={"absolute -top-4 -right-3 w-5 h-5 rounded-full bg-blue-800 text-amber-50 font-bold text-xs flex items-center justify-center"}>0</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;