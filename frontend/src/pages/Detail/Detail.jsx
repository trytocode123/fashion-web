import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { findProductById, findProductByName } from "../../service/Product/ProductService.js";
import { useSelector } from "react-redux";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { savePayment } from "../../service/VNPay/VNPayServer.js";
import { progressPaypal } from "../../service/Paypal/PaypalService.js";
import { FaSpinner, FaCheck } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi2";
import { MdOutlineLocalShipping, MdOutlineSecurity } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const token = useSelector(state => state.auth?.account?.token);

    const [detail, setDetail] = useState(null);
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 lg:py-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 group w-fit"
            >
                <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={16} />
                <span className="font-medium text-sm">Back</span>
            </button>

            {detail === null ? (
                <div className="flex items-center justify-center min-h-[405px]">
                    <FaSpinner className="animate-spin text-[60px] text-gray-300" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    <div className="lg:col-span-5 xl:col-span-5 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group h-full max-h-[500px]">
                        <img
                            className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            src={detail?.img}
                            alt={detail?.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x1000?text=No+Image';
                            }}
                        />

                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                                {detail?.subCategory?.name || "New Arrival"}
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col h-full">

                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                                    {detail?.gender || "Unisex"}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {detail?.name}
                            </h1>
                            <p className="text-2xl font-bold text-blue-600">
                                {detail?.price?.toLocaleString("vi-VN")} <span className="text-xl text-blue-500">₫</span>
                            </p>
                        </div>

                        <hr className="border-gray-100 mb-4" />

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Size</h3>
                                <button className="text-xs text-gray-500 underline hover:text-gray-900 transition-colors">Size Guide</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {products?.map((p, i) => (
                                    p.size && (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSize(p.size)}
                                            className={`relative w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center
                                                ${p.size === currentSize
                                                    ? "bg-gray-900 text-white ring-2 ring-gray-900 ring-offset-1"
                                                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-gray-900"
                                                }`}
                                        >
                                            {p.size}
                                            {p.size === currentSize && (
                                                <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                                                    <FaCheck size={8} />
                                                </span>
                                            )}
                                        </button>
                                    )
                                ))}
                                {(!products || products.length === 0) && (
                                    <p className="text-gray-500 italic text-sm">No sizes available</p>
                                )}
                            </div>
                            {currentSize === "" && (
                                <p className="text-red-500 text-xs mt-1 font-medium">* Please select a size</p>
                            )}
                        </div>

                        <div className="flex gap-6 mb-4">

                            <div className="flex-1">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Quantity</h3>
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg w-28 p-1">
                                    <button
                                        onClick={() => handleUpdateQuantity("-")}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition-all"
                                    >
                                        <CiCircleMinus size={20} />
                                    </button>
                                    <input
                                        ref={quantityRef}
                                        value={quantity}
                                        onChange={(e) => handleOnchangeQuantity(e.target.value)}
                                        className="w-10 h-8 text-center bg-transparent font-bold text-sm text-gray-900 focus:outline-none"
                                    />
                                    <button
                                        onClick={() => handleUpdateQuantity("+")}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition-all"
                                    >
                                        <CiCirclePlus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-2">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPaymentMethod("VNPAY")}
                                        className={`relative p-2 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm
                                            ${paymentMethod === "VNPAY"
                                                ? "border-blue-500 bg-blue-50/50 text-blue-700"
                                                : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:shadow-sm"}`}
                                    >
                                        <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg" alt="VNPay" className="h-4 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                                        <span>VNPay</span>
                                        {paymentMethod === "VNPAY" && (
                                            <div className="absolute top-1 right-1 text-blue-500"><FaCheck size={10} /></div>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setPaymentMethod("PAYPAL")}
                                        className={`relative p-2 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm
                                            ${paymentMethod === "PAYPAL"
                                                ? "border-[#003087] bg-blue-50/50 text-[#003087]"
                                                : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:shadow-sm"}`}
                                    >
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-4 object-contain mix-blend-multiply" onError={(e) => { e.target.style.display = 'none' }} />
                                        <span>PayPal</span>
                                        {paymentMethod === "PAYPAL" && (
                                            <div className="absolute top-1 right-1 text-[#003087]"><FaCheck size={10} /></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary & Checkout */}
                        <div className="mt-auto bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-gray-500 text-sm font-medium">Total Price</span>
                                <div className="text-right">
                                    {paymentMethod === "PAYPAL" ? (
                                        <span className="text-2xl font-extrabold text-gray-900">${((detail?.price / 27000) * quantity).toFixed(2)}</span>
                                    ) : (
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-extrabold text-gray-900">{(detail?.price * quantity).toLocaleString("vi-VN")}</span>
                                            <span className="text-lg font-bold text-gray-700 mb-1">₫</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={isDisabled}
                                onClick={() => paymentMethod === "PAYPAL" ? handlePaypal() : handlePay()}
                                className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3 rounded-xl text-base font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl
                                    ${isDisabled
                                        ? "bg-gray-300 opacity-70 cursor-not-allowed shadow-none"
                                        : paymentMethod === "PAYPAL"
                                            ? "bg-gradient-to-r from-[#003087] to-[#009cde] hover:scale-[1.02]"
                                            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.02]"
                                    }`}
                            >
                                <IoBagOutline size={20} />
                                Checkout with {paymentMethod === "PAYPAL" ? "PayPal" : "VNPay"}
                            </button>
                        </div>

                        {/* Perks */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <MdOutlineLocalShipping size={16} className="text-gray-700" />
                                <span className="text-[11px] font-medium">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <TbTruckReturn size={16} className="text-gray-700" />
                                <span className="text-[11px] font-medium">30 Days Return</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <MdOutlineSecurity size={16} className="text-gray-700" />
                                <span className="text-[11px] font-medium">Secure Payment</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Detail;
