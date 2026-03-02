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
                    setSearchResults(uniqueResults.slice(0, 5));
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
        navigate("/");
        localStorage.clear();
    }

    return (
        <header
            className="fixed top-0 left-0 right-0 h-[70px] lg:h-[80px] w-full z-[100] transition-all duration-300
                       bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 text-white
                       flex items-center justify-between px-4 md:px-10 lg:px-20 shadow-2xl shadow-black/20"
        >
            {/* Mobile Menu Toggle (Simplified for brevity as logic stays same) */}
            <div className="flex items-center gap-4">
                <MdOutlineMenu className="md:hidden text-2xl cursor-pointer hover:text-indigo-400 transition-colors" />

                <div className="flex flex-col justify-center group">
                    <Link to="/home" className="flex items-baseline gap-1 group">
                        <span className="font-black text-2xl tracking-tighter group-hover:text-indigo-400 transition-colors">FASHION</span>
                        <span className="text-zinc-500 font-medium text-sm group-hover:text-indigo-300 transition-colors">hub</span>
                    </Link>
                </div>
            </div>

            {/* Premium Search Bar */}
            {account && (
                <div ref={searchRef} className="relative hidden md:flex items-center flex-1 max-w-lg mx-8 group">
                    <div className="absolute left-4 z-10 text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <FaSearch size={14} />
                    </div>
                    <input
                        placeholder="Search arrivals, brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm && setShowDropdown(true)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2.5 pl-11 pr-10 
                                 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 
                                 placeholder-zinc-600 transition-all duration-300"
                    />
                    <div className="absolute right-4 flex items-center gap-2">
                        {searchTerm && !isSearching && (
                            <IoMdClose
                                className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                                size={18}
                                onClick={() => { setSearchTerm(""); setSearchResults([]); setShowDropdown(false); }}
                            />
                        )}
                        {isSearching && <FaSpinner className="animate-spin text-indigo-500" size={14} />}
                    </div>

                    {/* Search Dropdown - Sophisticated styling */}
                    {showDropdown && searchTerm && (
                        <div className="absolute top-[120%] left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-2xl 
                                      shadow-2xl shadow-black/50 overflow-hidden z-50 animate-scale-in">
                            {searchResults.length > 0 ? (
                                <ul className="p-2 space-y-1">
                                    {searchResults.map((product) => (
                                        <li key={product.id}>
                                            <div
                                                onClick={() => { navigate(`/detail/${product.id}`); setShowDropdown(false); setSearchTerm(""); }}
                                                className="flex items-center gap-4 p-2.5 hover:bg-zinc-800 rounded-xl cursor-pointer transition-all border border-transparent hover:border-zinc-700"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700">
                                                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm text-zinc-100 line-clamp-1">{product.name}</span>
                                                    <span className="text-indigo-400 font-black text-xs uppercase tracking-wider">
                                                        {product.price.toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !isSearching && (
                                    <div className="p-6 text-center text-zinc-500 text-sm italic">
                                        No matches for "<span className="text-zinc-300">{searchTerm}</span>"
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 md:gap-6">
                {account && (
                    <div className="flex items-center gap-6 text-zinc-400">
                        <Link to="/home" className="hover:text-indigo-400 transition-all duration-300 hover:scale-110">
                            <IoMdHome size={22} title="Home" />
                        </Link>

                        <div className="relative group cursor-pointer hover:text-indigo-400 transition-all duration-300 hover:scale-110"
                            onClick={() => navigate("/cart")}>
                            <FaCartShopping size={20} />
                            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 rounded-full 
                                           bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center 
                                           border-2 border-zinc-950 shadow-lg group-hover:bg-indigo-500 transition-colors">
                                {totalCartItems}
                            </span>
                        </div>

                        <div className="h-6 w-px bg-zinc-800 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-3 bg-zinc-900/50 hover:bg-zinc-800 py-1 pl-1 pr-3 
                                         rounded-full border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
                                onClick={() => navigate("/profile")}
                            >
                                {account.imgUrl ? (
                                    <img src={account.imgUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 group-hover:ring-indigo-500" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-indigo-500">
                                        <FaRegUser size={12} className="text-zinc-500 group-hover:text-indigo-400" />
                                    </div>
                                )}
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-zinc-200 text-xs font-black truncate max-w-[80px]">{account.fullName.split(' ').pop()}</span>
                                </div>
                            </div>

                            <button onClick={handleLogOut} title="Sign Out" className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;