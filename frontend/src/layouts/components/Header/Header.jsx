import { FaRegUser, FaSearch, FaSpinner } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../../redux/Reducer/authSlice.js";
import { IoMdHome, IoMdClose } from "react-icons/io";
import { MdOutlineMenu } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { findProductByName } from "../../../service/Product/ProductService.js";


const Header = () => {
    const account = useSelector(state => state.auth.account);
    const cartItems = useSelector(state => state.cart?.items || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    const totalCartItems = cartItems.length;

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim() !== "") {
                setIsSearching(true);
                setShowDropdown(true);
                try {
                    const responseData = await findProductByName(searchTerm.trim(), account?.token);
                    const productsList = Array.isArray(responseData) ? responseData : (responseData?.content || []);
                    const uniqueResults = productsList.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
                    setSearchResults(uniqueResults.slice(0, 5)); // Hiển thị tối đa 5 kết quả
                } catch (error) {
                    console.error("Search error:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, account?.token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogOut = () => {
        dispatch(logOut());
        localStorage.clear();
    }
    return (
        <header
            className={"fixed h-[100px] w-[100%] top-0 left-0 right-0 bg-gray-900 text-white items-center " +
                "shadow-md shadow-gray-900 justify-between md:flex md:px-[40px] lg:px-[80px] lg:z-10 lg:h-[150px] xl:px-[80px] xl:z-10 xl:h-[100px]"}>

            <MdOutlineMenu className={"md:hidden mt-3 ml-3"} />

            <div className={"hidden md:flex lg:flex flex-col justify-center flex-wrap-reverse group"}>
                <Link to={"/about"}
                    className={"lg:font-bold lg:text-3xl cursor-pointer group-hover:text-amber-50"}>FASHION</Link>
                <Link to={"/about"}
                    className={"text-start md:text-end group-hover:text-amber-50 cursor-pointer"}>hub</Link>
            </div>

            {account &&
                <div ref={searchRef} className={"relative lg:flex justify-center hidden w-[550px]"}>
                    <div
                        className={"flex items-center justify-between bg-white rounded-full w-full h-[50px] text-black px-4 border-2 border-transparent focus-within:border-blue-500 transition-colors"}>
                        <FaSearch className={"text-gray-400 mr-2"} />
                        <input
                            placeholder={"Search for products..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => { if (searchTerm) setShowDropdown(true); }}
                            className={"w-[100%] h-[100%] focus:outline-none bg-transparent placeholder-gray-400"}
                        />
                        <div className="flex items-center gap-2">
                            {searchTerm && (
                                <IoMdClose
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                    size={20}
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSearchResults([]);
                                        setShowDropdown(false);
                                    }}
                                />
                            )}
                            {isSearching && <FaSpinner className="animate-spin text-blue-500" />}
                        </div>
                    </div>

                    {showDropdown && searchTerm && (
                        <div className="absolute top-[60px] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-black">
                            {searchResults.length > 0 ? (
                                <ul className="max-h-[400px] overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <li key={product.id}>
                                            <div
                                                onClick={() => {
                                                    navigate(`/detail/${product.id}`);
                                                    setShowDropdown(false);
                                                    setSearchTerm("");
                                                }}
                                                className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</span>
                                                    <span className="text-blue-600 font-bold text-sm">{product.price.toLocaleString('vi-VN')} ₫</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !isSearching && (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No products found for "{searchTerm}"
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            }

            <div className={"md:flex lg:justify-end lg:min-w-[100px] text-[16px]"}>
                {account?.fullName && (
                    <div className="flex items-center gap-4 font-medium text-gray-200">
                        <div className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 py-1.5 pl-1.5 pr-4 rounded-full border border-gray-700/50 transition-all cursor-pointer group"
                            onClick={() => navigate("/profile")}>
                            {account.imgUrl ? (
                                <img src={account.imgUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-600 group-hover:border-blue-500 transition-colors" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 group-hover:border-blue-500 transition-colors">
                                    <FaRegUser size={14} className="text-gray-400" />
                                </div>
                            )}
                            <div className="hidden lg:flex flex-col text-left">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-none">Account</span>
                                <span className="text-white text-sm font-bold leading-tight truncate max-w-[100px]">{account.fullName}</span>
                            </div>
                        </div>

                        <Link to={"/"} onClick={handleLogOut} title="Log out">
                            <FiLogOut className="text-red-400 hover:text-red-500 h-6 w-6 hover:bg-red-500/10 p-1 rounded-full transition-all" />
                        </Link>
                    </div>
                )}

                <div className="md:flex md:justify-end lg:items-center gap-6 ml-4">
                    {account && (
                        <Link to={"/home"} className="hover:text-blue-400 transition-colors">
                            <IoMdHome size={22} />
                        </Link>
                    )}
                    <div className={"relative cursor-pointer hover:text-blue-400 transition-colors"} onClick={() => navigate("/cart")}>
                        <FaCartShopping size={22} />
                        <span
                            className={"absolute -top-3 -right-3 w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-gray-900"}>{totalCartItems}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;