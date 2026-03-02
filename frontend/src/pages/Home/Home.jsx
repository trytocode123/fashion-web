import { useEffect, useState } from "react";
import { dataFromGoogle } from "../../service/Account/AccountService.js";
import { useDispatch } from "react-redux";
import { logInByGoogle } from "../../redux/Reducer/authSlice.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Home.css";

import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import { LuTruck } from "react-icons/lu";
import { TbExchange, TbWorld } from "react-icons/tb";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { getTop8Trailer } from "../../service/Product/ProductService.js";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            async function fetchData() {
                const data = await dataFromGoogle(code);
                dispatch(logInByGoogle(data));
                toast.success("Logged in by Google successfully!")
                console.log(data);
            }

            fetchData();
        }

        async function getTrailerProduct() {
            const fetchData = await getTop8Trailer();
            if (fetchData.length > 0) {
                setProducts(fetchData);
            }
        }

        getTrailerProduct();

        window.history.replaceState({}, document.title, "/home");
    }, [dispatch]);

    const handleDetail = (id) => {
        navigate(`/detail/${id}`)
    }

    return (
        <div className="bg-white min-h-screen w-full overflow-x-hidden">
            {/* Hero Section with Swiper */}
            <div className="relative w-full min-w-0 overflow-hidden">
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    allowTouchMove={true}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    className="h-[400px] md:h-[500px] lg:h-[650px] home-swiper w-full"
                >
                    {[img1, img2, img3, img4].map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-full overflow-hidden">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                                    src={img}
                                    alt={`Banner ${index + 1}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-10 lg:p-20">
                                    <div className="text-white animate-scale-in">
                                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">NEW COLLECTION</h1>
                                        <p className="text-lg text-zinc-200 font-medium max-w-md">Discover the latest trends in modern fashion. Premium quality, timeless style.</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-12">
                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: LuTruck, title: "Free Shipping", desc: "On orders over 500k VND" },
                        { icon: TbExchange, title: "Easy Returns", desc: "Using only phone number" },
                        { icon: TbWorld, title: "Global Reach", desc: "Fast national delivery" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-zinc-50 border border-zinc-100/50 hover:shadow-xl hover:shadow-zinc-100 transition-all duration-500 group">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-zinc-900 tracking-tight">{item.title}</h3>
                                <p className="text-zinc-500 text-sm font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Explore Categories */}
                <div className="mb-16">
                    <div className="flex flex-col mb-8">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-2">Discovery</span>
                        <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">
                            Start exploring. <span className="text-zinc-300">Wait no more.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={() => navigate('/products?gender=Men')}
                            className="relative h-[180px] rounded-[2rem] bg-indigo-50 overflow-hidden cursor-pointer group flex items-center px-10 border border-indigo-100/30"
                        >
                            <div className="z-10 relative">
                                <h3 className="text-2xl font-black text-indigo-950 mb-1">For Men's</h3>
                                <p className="text-indigo-700 font-medium text-sm mb-4">Minimal & modern styles</p>
                                <div className="flex items-center gap-2 text-indigo-950 font-black text-sm group-hover:gap-4 transition-all">
                                    <span>Browse Shop</span>
                                    <FaArrowRightLong />
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-indigo-100/50 -skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-700"></div>
                        </div>

                        <div
                            onClick={() => navigate('/products?gender=Women')}
                            className="relative h-[180px] rounded-[2rem] bg-violet-50 overflow-hidden cursor-pointer group flex items-center px-10 border border-violet-100/30"
                        >
                            <div className="z-10 relative">
                                <h3 className="text-2xl font-black text-violet-950 mb-1">For Women's</h3>
                                <p className="text-violet-700 font-medium text-sm mb-4">Elegant everyday wear</p>
                                <div className="flex items-center gap-2 text-violet-950 font-black text-sm group-hover:gap-4 transition-all">
                                    <span>Browse Shop</span>
                                    <FaArrowRightLong />
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-violet-100/50 -skew-x-12 translate-x-10 group-hover:translate-x-0 transition-transform duration-700"></div>
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                <div className="mt-20">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <span className="text-zinc-400 font-black text-xs uppercase tracking-widest mb-2 block">Curated</span>
                            <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">Featured Products</h2>
                        </div>
                        <button
                            onClick={() => navigate('/products')}
                            className="group flex items-center gap-2 text-zinc-900 font-black text-sm hover:text-indigo-600 transition-colors"
                        >
                            View All Collection
                            <FaArrowRightLong className="transition-transform group-hover:translate-x-2" />
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <FaSpinner className="animate-spin text-3xl text-zinc-200" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => handleDetail(product.id)}
                                    className="group cursor-pointer flex flex-col h-full animate-scale-in"
                                >
                                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 mb-6 shadow-sm border border-zinc-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200 group-hover:-translate-y-2">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            src={product.img}
                                            alt={product.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
                                        />
                                        <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-900 hover:bg-indigo-600 hover:text-white shadow-lg transition-all">
                                                <FaArrowRightLong className="-rotate-45" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-zinc-900 text-lg line-clamp-1 flex-grow uppercase tracking-tight" title={product.name}>
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                                {product.subCategory?.name || "General"}
                                            </span>
                                            <span className="font-black text-indigo-600 text-sm">
                                                {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="flex justify-center mt-20">
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black tracking-widest uppercase text-xs 
                                         shadow-2xl shadow-zinc-200 hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-1 
                                         active:scale-95 transition-all duration-300 flex items-center gap-4 group"
                            >
                                Shop the collection
                                <FaArrowRightLong className="transition-transform group-hover:translate-x-2" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;