import {useEffect} from "react";
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


const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            async function fetchData() {
                const data = await dataFromGoogle(code);
                dispatch(logInByGoogle(data));
                console.log(data);
            }

            fetchData();
        }

        window.history.replaceState(
            {},
            document.title,
            "/home"
        );
    }, [dispatch]);


    return (
        <div className={"lg:w-[100%] lg:-mt-5"}>
            <Swiper className={"lg-[300px]"}
                    modules={[Pagination, Navigation, Autoplay]}
                    allowTouchMove={false}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                        waitForTransition: false
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    slidesPerView={1}
                    spaceBetween={30}
            >
                <SwiperSlide><img className={"lg:w-[100%] lg:h-[600px]"} src={img1}
                                  alt={"Picture1"}/></SwiperSlide>
                <SwiperSlide><img className={"lg:w-[100%] lg:h-[600px]"} src={img2}
                                  alt={"Picture2"}/></SwiperSlide>
                <SwiperSlide><img className={"lg:w-[100%] lg:h-[600px]"} src={img3}
                                  alt={"Picture3"}/></SwiperSlide>
            </Swiper>
        </div>


    );
}

export default Home;