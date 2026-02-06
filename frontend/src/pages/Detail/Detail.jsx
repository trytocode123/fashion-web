import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { findProductById, findProductByName } from "../../service/Product/ProductService.js";
import { useSelector } from "react-redux";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import {savePayment, sendDataToPayForm} from "../../service/VNPay/VNPayServer.js";

const Detail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState({});
    const navigate = useNavigate();
    const [currentSize, setCurrentSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const token = useSelector(state => state.auth?.account?.token);
    const quantityRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [trigger, setTrigger] = useState(false);


    useEffect(() => {
        // Only redirect if rehydration has likely finished and token is still missing
        if (!token) {
            const timeout = setTimeout(() => {
                if (!token) navigate("/");
            }, 500); // 500ms grace period for Redux-Persist rehydration
            return () => clearTimeout(timeout);
        }

        const fetchData = async () => {
            const data = await findProductById(id, token);
            setDetail(data);
            setTrigger(prevState => !prevState);
        }
        fetchData();

        const getProductByName = async () => {
            const res = await findProductByName(detail.name, token);
            setProducts(res);
        };
        getProductByName();
    }, [trigger])

    const handleUpdateCurrentSize = (size) => {
        setCurrentSize(size);
    }

    const handleUpdateQuantity = (action) => {
        switch (action) {
            case "+":
                setQuantity(quantity => quantity + 1);
                quantityRef.current.valueOf = quantity;
                break;

            case "-":
                if (quantity === 0) {
                    return;
                }
                setQuantity(quantity => quantity - 1);
                quantityRef.current.valueOf = quantity;
                break;
        }
    }

    const handleOnchangeQuantity = (value) => {
        if (value >= 0) {
            setQuantity(+value);
        }
    }

    const handlePay = () => {
        async function implementPay() {
            const res = await savePayment(detail.price * quantity, token);
        }
        implementPay();
    }

    return (
        <div className={"lg:w-[100%] lg:px-[80px]"}>
            <div className={"lg:grid lg:grid-cols-2 lg:gap-4 items-start"}>
                <div>
                    <img className={"rounded-2xl lg:w-[100%] lg:h-[600px]"} src={detail?.img} />
                </div>


                <div className={"border-1 border-gray-400 rounded-2xl lg:p-4"}>
                    <p className={"font-bold"}>Price: {detail?.price?.toLocaleString("vi-VN")} VND</p>
                    <div className={"lg:w-[200px] font-bold"}><p>Size: {currentSize}</p></div>
                    <div className={"lg:grid lg:grid-cols-4 lg:mt-[10px] lg:gap-4"}>
                        {
                            products?.map((product, index) => {
                                return (
                                    product.size && <button onClick={() => {
                                        handleUpdateCurrentSize(product.size)
                                    }} key={index}
                                        className={(product.size === currentSize
                                            ? "rounded-xl border border-gray-500 bg-sky-500 text-white lg:p-[10px]"
                                            : "rounded-xl border border-gray-500 text-gray-600 lg:p-[10px]")}>
                                        <span className={"font-bold"}>{product.size}</span>
                                    </button>
                                )
                            })
                        }
                    </div>

                    <div className={"lg:flex lg:mt-3 items-center justify-between"}>
                        <div
                            className={"lg:flex bg-gray-300 lg:w-[200px] lg:justify-between rounded-4xl lg:px-[10px] lg:py-[10px]"}>
                            <button onClick={() => {
                                handleUpdateQuantity("-")
                            }}><CiCircleMinus className={"lg:text-[20px]"} />
                            </button>
                            <input className={"w-[100%] text-center focus:outline-0"} onChange={() => {
                                handleOnchangeQuantity(quantityRef.current.value)
                            }} ref={quantityRef} value={quantity} />
                            <button onClick={() => {
                                handleUpdateQuantity("+")
                            }}><CiCirclePlus className={"lg:text-[20px]"} />
                            </button>
                        </div>

                        <div>
                            <button onClick={handlePay}
                                disabled={currentSize === "" || quantity === 0}
                                className={`flex items-center justify-center text-white lg:w-[200px] lg:p-4 rounded-3xl
                                ${currentSize === "" || quantity === 0
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-black hover:bg-gray-700 cursor-pointer"
                                    }`}>
                                <IoBagOutline className={"text-white"} />
                                <p className={"lg:ml-[14px]"}>Buy</p>
                            </button>
                        </div>
                    </div>

                    <div className={"lg:flex lg:justify-between text-gray-600 lg:mt-5"}>
                        <p>{detail?.price?.toLocaleString("vi-VN")} VND x {quantity}</p>
                        <p>{(detail.price * quantity).toLocaleString("vi-VN")} VND</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail;