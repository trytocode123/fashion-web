import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findProductById, findProductByName } from "../../service/Product/ProductService.js";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/Reducer/cartSlice.js";
import { toast } from "react-toastify";
import { IoBagOutline } from "react-icons/io5";
import { savePayment } from "../../service/VNPay/VNPayServer.js";
import { progressPaypal } from "../../service/Paypal/PaypalService.js";
import { FaSpinner, FaCheck, FaStar } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi2";
import { MdOutlineSecurity } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { FiMinus, FiPlus } from "react-icons/fi";

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useSelector(state => state.auth?.account?.token);
    const [detail, setDetail] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentSize, setCurrentSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("VNPAY");
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const data = await findProductById(id, token);
                setDetail(data);
                if (data?.name) {
                    const res = await findProductByName(data.name, token);
                    setProducts(res);
                    if (res.length > 0) {
                        setCurrentSize(res[0].size);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Could not load product details.");
            }
        };

        fetchData();
    }, [id, token, navigate]);

    const handleInputQuantity = (e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) return;

        if (value === "") {
            setQuantity("");
            return;
        }

        const num = parseInt(value, 10);
        setQuantity(num < 1 ? 1 : num);
    };

    const handlePay = async () => {
        if (!currentSize) return toast.warning("Please select a size");
        setIsProcessing(true);
        const res = await savePayment(detail.price * quantity, token, detail.id, currentSize, quantity);
        if (res) window.location.href = res;
    };

    const handlePaypal = async () => {
        if (!currentSize) return toast.warning("Please select a size");
        setIsProcessing(true);
        const res = await progressPaypal((detail.price / 27000) * quantity, token, detail.id, currentSize, quantity);
        if (res) window.location.href = res;
    };

    const handleAddToCart = () => {
        if (!currentSize) return toast.warning("Please select a size");
        setIsProcessing(true);
        dispatch(addToCart({ id: detail.id, size: currentSize, quantity: quantity }))
            .unwrap()
            .then(() => {
                toast.success(`Added ${quantity} ${detail.name} (Size ${currentSize}) to cart!`);
                setQuantity(1);
            })
            .catch((error) => {
                toast.error("Failed to add to cart: " + (error.message || "Unknown error"));
            })
            .finally(() => setIsProcessing(false));
    };

    const handleUpdateQuantity = (delta) => {
        setQuantity(prev => {
            const current = Number(prev) || 1;
            return Math.max(1, current + delta);
        });
    };

    if (!detail) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-[100px] lg:pt-[130px] pb-20 px-4 md:px-10 lg:px-20">
            <div className="max-w-[1400px] mx-auto">
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-zinc-400 hover:text-indigo-600 transition-all group mb-8"
                >
                    <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Back to products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Product Image */}
                    <div className="animate-scale-in">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-zinc-50 border border-zinc-100 shadow-2xl shadow-zinc-100 group">
                            <img src={detail.img} alt={detail.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-indigo-100/50">
                                    {detail.subCategory?.name || "Premium Collection"}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 leading-tight mb-4 uppercase tracking-tighter">
                                {detail.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-black text-indigo-600">
                                    {detail.price?.toLocaleString('vi-VN')} ₫
                                </p>
                                <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest border-l border-zinc-200 pl-4 py-1">
                                    In Stock
                                </span>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 text-left">Select Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {products?.map((p, i) => (
                                        p.size && (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentSize(p.size)}
                                                className={`w-14 h-14 rounded-2xl font-black text-sm transition-all duration-300 border-2 relative
                                                         ${currentSize === p.size
                                                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl shadow-zinc-200'
                                                        : 'border-zinc-100 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'}`}
                                            >
                                                {p.size}
                                                {currentSize === p.size && (
                                                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-md animate-scale-in">
                                                        <FaCheck size={8} />
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 text-left">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod("VNPAY")}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300
                                                 ${paymentMethod === "VNPAY"
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-lg shadow-indigo-100'
                                                : 'border-zinc-100 grayscale hover:grayscale-0 hover:border-zinc-200'}`}
                                    >
                                        <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg" className="h-4" alt="VNPay" />
                                        <span className="text-xs font-black uppercase tracking-widest">VNPay</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod("PAYPAL")}
                                        className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300
                                                 ${paymentMethod === "PAYPAL"
                                                ? 'border-[#003087] bg-blue-50/50 text-[#003087] shadow-lg shadow-blue-100'
                                                : 'border-zinc-100 grayscale hover:grayscale-0 hover:border-zinc-200'}`}
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                                        <span className="text-xs font-black uppercase tracking-widest text-[#003087]">PayPal</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex items-center bg-zinc-50 rounded-2xl p-1 border border-zinc-100 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleUpdateQuantity(-1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white text-zinc-500 hover:text-indigo-600 transition-all"
                                        >
                                            <FiMinus />
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={handleInputQuantity}
                                            onBlur={() => {
                                                if (!quantity || quantity < 1) setQuantity(1);
                                            }}
                                            className="w-12 text-center font-black text-zinc-900 text-lg outline-none"
                                        />
                                        <button
                                            onClick={() => handleUpdateQuantity(1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white text-zinc-500 hover:text-indigo-600 transition-all"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <button
                                        disabled={isProcessing}
                                        onClick={handleAddToCart}
                                        className="flex-grow w-full bg-zinc-100 text-zinc-900 py-4.5 rounded-2xl font-black uppercase tracking-widest text-[11px]
                                                 hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <IoBagOutline size={18} />
                                        Add to bag
                                    </button>
                                </div>

                                <button
                                    disabled={isProcessing}
                                    onClick={() => paymentMethod === "PAYPAL" ? handlePaypal() : handlePay()}
                                    className="w-full bg-zinc-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs
                                             shadow-2xl shadow-zinc-200 hover:bg-indigo-600 hover:shadow-indigo-100 hover:-translate-y-1 
                                             active:scale-95 transition-all duration-300"
                                >
                                    Proceed to payment • {(detail.price * quantity).toLocaleString('vi-VN')} ₫
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-50">
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100/50">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                                        <TbTruckReturn />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">30 Day Return Policy</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100/50">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                                        <MdOutlineSecurity />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fully Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
