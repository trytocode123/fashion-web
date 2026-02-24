import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {findProductById, findProductByName} from "../../service/Product/ProductService.js";
import {useSelector} from "react-redux";
import {CiCircleMinus, CiCirclePlus} from "react-icons/ci";
import {IoBagOutline} from "react-icons/io5";
import {savePayment} from "../../service/VNPay/VNPayServer.js";
import {progressPaypal} from "../../service/Paypal/PaypalService.js";
import {FaSpinner} from "react-icons/fa";

const Detail = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const token = useSelector(state => state.auth?.account?.token);

    const [detail, setDetail] = useState({});
    const [products, setProducts] = useState([]);
    const [currentSize, setCurrentSize] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("VNPAY");
    const quantityRef = useRef(null);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
      
        const fetchData = async () => {
            const data = await findProductById(id, token);
            setDetail(data);

            if (data?.name) {
                const res = await findProductByName(data.name, token);
                setProducts(res);
            }
        };

        fetchData();

    }, [id, token, navigate]);

    const handleUpdateQuantity = (action) => {
        if (action === "+") {
            setQuantity(prevState => prevState + 1);
        }
        if (action === "-" && quantity > 0) {
            setQuantity(prevState => prevState - 1);
        }
    };

    const handleOnchangeQuantity = (value) => {
        if (value >= 0) setQuantity(+value);
    };

    const handlePay = async () => {
        const res = await savePayment(detail.price * quantity, token);
        if (res) window.location.href = res;
    };

    const handlePaypal = async () => {
        const res = await progressPaypal((detail.price / 27000) * quantity, token);
        if (res) window.location.href = res;
    };

    const isDisabled = currentSize === "" || quantity === 0;

    return (<div className="lg:w-full lg:px-[80px]">
        {
            detail !== null ? (
                <div className="lg:grid lg:grid-cols-2 lg:gap-6 items-start">

                    <img
                        className="rounded-2xl w-full h-[600px] object-cover"
                        src={detail?.img}
                        alt=""
                    />

                    <div className="border border-gray-300 rounded-2xl p-6">
                        <p className="font-bold text-lg mb-2">
                            Price: {detail?.price?.toLocaleString("vi-VN")} VND
                        </p>

                        <p className="font-semibold mb-2">Size: {currentSize || "-"}</p>
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {products?.map((p, i) => (p.size && (<button
                                key={i}
                                onClick={() => setCurrentSize(p.size)}
                                className={`rounded-xl border p-2 font-semibold
                                    ${p.size === currentSize ? "bg-sky-500 text-white border-sky-500" : "border-gray-300 text-gray-600 hover:border-gray-500"}
                                    `}
                            >
                                {p.size}
                            </button>)))}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => handleUpdateQuantity("-")}>
                                <CiCircleMinus size={22}/>
                            </button>

                            <input
                                ref={quantityRef}
                                value={quantity}
                                onChange={(e) => handleOnchangeQuantity(e.target.value)}
                                className="w-16 text-center border rounded-lg py-1"
                            />

                            <button onClick={() => handleUpdateQuantity("+")}>
                                <CiCirclePlus size={22}/>
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="font-semibold mb-2">Payment Method</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setPaymentMethod("VNPAY")}
                                    className={`flex-1 p-3 rounded-xl border transition-all duration-200
                                 ${paymentMethod === "VNPAY" ? "bg-gradient-to-r from-[#d32f2f] to-[#1976d2] text-white border-transparent shadow-md scale-[1.02]" : "border-gray-300 text-gray-700 hover:border-[#1976d2] hover:text-[#1976d2]"}`}
                                >
                                    VNPay (VND)
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("PAYPAL")}
                                    className={`flex-1 p-3 rounded-xl border transition-all duration-200
                                 ${paymentMethod === "PAYPAL" ? "bg-gradient-to-r from-[#003087] to-[#009cde] text-white border-transparent shadow-lg scale-[1.02]" : "border-gray-300 text-gray-700 hover:border-[#009cde] hover:text-[#003087]"}`}
                                >
                                    PayPal (USD)
                                </button>

                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-gray-600 mb-4">
                            <span>Total</span>
                            <span className="font-semibold">
                            {paymentMethod === "PAYPAL" ? `$${((detail.price / 27000) * quantity).toFixed(2)}` : `${(detail.price * quantity).toLocaleString("vi-VN")} VND`}
                        </span>
                        </div>

                        {/* Pay button */}
                        <button
                            disabled={isDisabled}
                            onClick={() => {
                                paymentMethod === "PAYPAL" ? handlePaypal() : handlePay();
                            }}
                            className={`w-full flex items-center justify-center gap-2 p-4 rounded-3xl text-white transition-all
                         ${isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : paymentMethod === "PAYPAL"
                                    ? "bg-gradient-to-r from-[#003087] to-[#009cde] hover:brightness-110"
                                    : "bg-gradient-to-r from-[#d32f2f] to-[#1976d2] hover:brightness-110"}
`}

                        >
                            <IoBagOutline/>
                            Pay with {paymentMethod === "PAYPAL" ? "PayPal" : "VNPay"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className={"flex justify-center items-center"}><FaSpinner
                    className={"animate-spin text-[20px] xl:text-[100px]"}/></div>
            )
        }

    </div>);
};

export default Detail;
