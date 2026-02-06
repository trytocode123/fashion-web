import {useEffect, useState} from "react";
import {dataFromGoogle} from "../../service/Acount/AccountService.js";
import {useDispatch} from "react-redux";
import {logInByGoogle} from "../../redux/Reducer/authSlice.js";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Home.css";

import img1 from "../../assets/img/img1.jpg";
import img2 from "../../assets/img/img2.jpg";
import img3 from "../../assets/img/img3.jpg";
import img4 from "../../assets/img/img4.jpg";
import {LuTruck} from "react-icons/lu";
import {TbExchange, TbWorld} from "react-icons/tb";
import {FaArrowRightLong} from "react-icons/fa6";
import {toast} from "react-toastify";
import {FaSpinner} from "react-icons/fa";
import {getTop8Trailer} from "../../service/Product/ProductService.js";
import {useNavigate} from "react-router-dom";


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
                                          alt={`Picture${index + 1}`}/></SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>

        <div className={"lg:px-[80px] mt-5"}>
            <div
                className={"lg:grid lg:grid-cols-3 lg:px-[30px] lg:h-[100px] lg:justify-between rounded-2xl border border-gray-500"}>

                <div className={"lg:flex lg:items-center border-r-2 border-r-gray-600"}>
                    <div className={"mr-2"}>
                        <LuTruck className={"lg:text-[20px]"}/>
                    </div>
                    <div>
                        <p className={"font-bold"}>Free shipping</p>
                        <p>On order over 500.000 VND</p>
                    </div>
                </div>

                <div className={"lg:flex lg:items-center lg:pl-[25px] border-r-2 border-r-gray-600"}>
                    <div className={"mr-2"}>
                        <TbExchange className={"lg:text-[20px]"}/>
                    </div>
                    <div>
                        <p className={"font-bold"}>Very easy to return</p>
                        <p>Just phone number</p>
                    </div>
                </div>

                <div className={"lg:flex lg:items-center lg:pl-[25px]"}>
                    <div className={"mr-2"}>
                        <TbWorld className={"lg:text-[20px]"}/>
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

                <div className={"lg:grid lg:grid-cols-2 lg:gap-2 lg:mt-5"}>

                    <div
                        className={"lg:flex lg:justify-evenly lg:items-center lg:rounded-2xl bg-blue-300 lg:h-[100px]"}>
                        <div>
                            <p className={"font-bold"}>
                                For Men's
                            </p>

                            <p className="text-sm text-gray-500">Minimal & modern styles</p>
                        </div>

                        <div
                            className={"lg:flex items-center border-l-2 border-r-gray-600 lg:pl-[5px] cursor-pointer group"}>
                            <span>Shop now</span>
                            <button className={"group-hover:cursor-pointer"}>
                                <FaArrowRightLong
                                    className={"transition-transform duration-300 ml-[5px] group-hover:translate-x-2"}/>
                            </button>

                        </div>
                    </div>

                    <div
                        className={"lg:flex lg:justify-evenly lg:items-center lg:rounded-2xl bg-purple-300 lg:h-[100px]"}>
                        <div>
                            <p className={"font-bold"}>
                                For Women's
                            </p>

                            <p className="text-sm text-gray-500">Elegant everyday wear</p>
                        </div>

                        <div
                            className={"lg:flex items-center border-l-2 border-r-gray-600 lg:pl-[5px] cursor-pointer group"}>
                            <span>Shop now</span>
                            <button className={"group-hover:cursor-pointer"}>
                                <FaArrowRightLong
                                    className={"transition-transform duration-300 ml-[5px] group-hover:translate-x-2"}/>
                            </button>

                        </div>
                    </div>

                </div>
            </div>

            <div>
                <p className={"lg:text-[25px] lg:font-bold lg:mb-5 lg:mt-3"}>Products</p>
                {products.length === 0 ?
                    <div className={"flex items-center justify-center"}>
                        <FaSpinner className={"animate-spin text-[20px]"}/>
                    </div> :

                    <div className={"lg:grid lg:grid-cols-4 lg:gap-4"}>
                        {products.map(product => (
                            <div key={product.id} onClick={() => {
                                handleDetail(product.id)
                            }}
                                 className={"lg:hover:-translate-y-2 lg:transition-transform duration-150"}>
                                <div>
                                    <img alt={"img"} className={"lg:rounded-2xl lg:h-[495px] lg:w-[100%]"}
                                         src={product.img}/>
                                </div>

                                <div className={"lg:flex lg:justify-between lg:px-[10px]"}>
                                    <div className={"lg:flex flex-col"}>
                                        <p className={"font-bold"}>{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {product.subCategory.name}
                                        </p>
                                    </div>

                                    <div className={"lg:flex flex-col"}>
                                        <p className={"font-bold"}>{product.price.toLocaleString("vi-VN") + "VND"}</p>
                                        <p className="text-sm text-gray-500">
                                            {product.gender}
                                        </p>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                }
            </div>
        </div>
    </div>);
}

export default Home;