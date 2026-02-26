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


    return (<div className={"lg:w-[100%] md:w-[100%] w-[100%] lg:-mt-5 mt-[100px]"}>
        <div>
            <div>
                <Swiper className={"lg-[300px]"}
                    modules={[Pagination, Navigation, Autoplay]}
                    allowTouchMove={false}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 1500, disableOnInteraction: false, waitForTransition: false
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    slidesPerView={1}
                    spaceBetween={30}
                >
                    {[img1, img2, img3, img4].map((img, index) => (
                        <SwiperSlide><img className={"lg:w-[100%] lg:h-[650px]"} src={img}
                            alt={`Picture${index + 1}`} /></SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>

        <div className={"lg:px-[80px] mt-5"}>
            <div
                className={"lg:grid lg:grid-cols-3 lg:px-[30px] lg:h-[100px] lg:justify-between rounded-2xl border border-gray-500"}>

                <div className={"lg:flex lg:items-center border-r-2 border-r-gray-600"}>
                    <div className={"mr-2"}>
                        <LuTruck className={"lg:text-[20px]"} />
                    </div>
                    <div>
                        <p className={"font-bold"}>Free shipping</p>
                        <p>On order over 500.000 VND</p>
                    </div>
                </div>

                <div className={"lg:flex lg:items-center lg:pl-[25px] border-r-2 border-r-gray-600"}>
                    <div className={"mr-2"}>
                        <TbExchange className={"lg:text-[20px]"} />
                    </div>
                    <div>
                        <p className={"font-bold"}>Very easy to return</p>
                        <p>Just phone number</p>
                    </div>
                </div>

                <div className={"lg:flex lg:items-center lg:pl-[25px]"}>
                    <div className={"mr-2"}>
                        <TbWorld className={"lg:text-[20px]"} />
                    </div>
                    <div>
                        <p className={"font-bold"}>National delivery</p>
                        <p>Fast delivery</p>
                    </div>
                </div>
            </div>

            <div className={"lg:mt-5"}>
                <span className={"font-bold lg:text-[25px]"}>Start exploring.</span> <span
                    className={"text-gray-400 font-bold lg:text-[25px]"}>Good things are waiting for you</span>

                <div className={"lg:grid lg:grid-cols-2 lg:gap-4 lg:mt-5 mb-10"}>

                    <div
                        onClick={() => navigate('/products?gender=Men')}
                        className={"flex justify-between items-center rounded-2xl bg-blue-100 h-[100px] p-6 cursor-pointer hover:shadow-md transition-shadow group"}
                    >
                        <div>
                            <p className={"font-bold text-lg text-blue-900"}>
                                For Men's
                            </p>
                            <p className="text-sm text-blue-700">Minimal & modern styles</p>
                        </div>

                        <div className={"flex items-center text-blue-900 font-semibold"}>
                            <span>Shop now</span>
                            <FaArrowRightLong
                                className={"transition-transform duration-300 ml-[8px] group-hover:translate-x-2"}
                            />
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/products?gender=Women')}
                        className={"flex justify-between items-center rounded-2xl bg-purple-100 h-[100px] p-6 cursor-pointer hover:shadow-md transition-shadow group mt-4 lg:mt-0"}
                    >
                        <div>
                            <p className={"font-bold text-lg text-purple-900"}>
                                For Women's
                            </p>
                            <p className="text-sm text-purple-700">Elegant everyday wear</p>
                        </div>

                        <div className={"flex items-center text-purple-900 font-semibold"}>
                            <span>Shop now</span>
                            <FaArrowRightLong
                                className={"transition-transform duration-300 ml-[8px] group-hover:translate-x-2"}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-12">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className={"text-2xl lg:text-[28px] font-bold text-gray-900"}>Featured Products</h2>
                        <p className="text-gray-500 mt-1">Handpicked for you</p>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
                    >
                        View All
                        <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>

                {products.length === 0 ?
                    <div className={"flex items-center justify-center"}>
                        <FaSpinner className={"animate-spin text-[20px]"} />
                    </div> :

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div
                                key={product.id}
                                onClick={() => handleDetail(product.id)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group flex flex-col h-full border border-gray-100"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={product.img}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x500?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg line-clamp-1 flex-grow pr-2" title={product.name}>
                                            {product.name}
                                        </h3>
                                        <span className="font-bold text-blue-600 whitespace-nowrap">
                                            {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
                                        </span>
                                    </div>

                                    <div className="mt-auto space-y-2">
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md">
                                                {product.subCategory?.name || "Uncategorized"}
                                            </span>
                                            <span className="capitalize text-gray-600 font-medium">
                                                {product.gender?.toLowerCase() || "Unisex"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {/* Bottom View All Button */}
                {products.length > 0 && (
                    <div className="flex justify-center mt-10 mb-8 lg:mb-12">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 group"
                        >
                            View All Products
                            <FaArrowRightLong className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>);
}

export default Home;