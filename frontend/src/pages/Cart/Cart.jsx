import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCart, updateCartItemQuantity, removeFromCart, clearCart } from "../../redux/Reducer/cartSlice";
import { savePayment } from "../../service/VNPay/VNPayServer";
import { progressPaypal } from "../../service/Paypal/PaypalService";
import { IoBagOutline, IoTrashOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi2";
import { FaCartShopping, FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, status } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth?.account?.token);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [dispatch, token]);

    const handleUpdateQuantity = (cartItemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            setIsUpdating(true);
            dispatch(updateCartItemQuantity({ cartItemId, quantity: newQty }))
                .unwrap()
                .catch(err => toast.error("Update failed: " + err.message))
                .finally(() => setIsUpdating(false));
        }
    };

    const handleRemove = (cartItemId) => {
        dispatch(removeFromCart(cartItemId))
            .unwrap()
            .then(() => toast.success("Item removed from cart"))
            .catch(err => toast.error("Remove failed: " + err.message));
    };

    const handleClearCart = () => {
        setIsModalOpen(true);
    };

    const confirmClearCart = () => {
        dispatch(clearCart())
            .unwrap()
            .then(() => {
                toast.success("Cart cleared successfully");
                setIsModalOpen(false);
            })
            .catch(err => toast.error("Clear failed: " + err.message));
    };

    const handlePay = async () => {
        if (items.length === 0) return;
        const res = await savePayment(totalPrice, token);
        if (res) window.location.href = res;
    };

    const handlePaypal = async () => {
        if (items.length === 0) return;
        const res = await progressPaypal((totalPrice / 27000), token);
        if (res) window.location.href = res;
    };

    if (status === 'loading' && items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <FaSpinner className="animate-spin text-5xl text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-[100px] lg:pt-[130px] pb-24 px-4 md:px-10 lg:px-20">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-10 flex flex-col items-start">
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-zinc-400 hover:text-indigo-600 transition-all group mb-4"
                    >
                        <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Discovery</span>
                    </button>
                    <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter">My Cart</h1>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-100 border border-zinc-100 p-16 text-center animate-scale-in">
                        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <FaCartShopping size={32} className="text-zinc-200" />
                        </div>
                        <h2 className="text-2xl font-black text-zinc-900 mb-4">Your cart is empty</h2>
                        <p className="text-zinc-500 font-medium mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find something special for you.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-zinc-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-zinc-100"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* Cart Items List */}
                        <div className="xl:col-span-8 flex flex-col gap-6">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">
                                    {items.length} Items in bag
                                </h2>
                                <button
                                    onClick={handleClearCart}
                                    className="text-red-500 hover:text-red-600 text-xs font-black uppercase tracking-widest transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group bg-white rounded-[2rem] p-6 border border-zinc-100/50 shadow-sm hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col md:flex-row gap-8 items-center"
                                    >
                                        <div
                                            className="w-full md:w-32 h-40 md:h-32 rounded-2xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-50 cursor-pointer"
                                            onClick={() => navigate(`/detail/${item.productId}`)}
                                        >
                                            <img src={item.productImg} alt={item.productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between w-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3
                                                        className="text-xl font-black text-zinc-900 tracking-tight uppercase cursor-pointer hover:text-indigo-600 transition-colors"
                                                        onClick={() => navigate(`/detail/${item.productId}`)}
                                                    >
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mt-1">Size {item.size}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="text-zinc-200 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                                                >
                                                    <RiDeleteBin6Line size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mt-6 md:mt-2">
                                                <div className="flex items-center bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                                                    <button
                                                        disabled={isUpdating || item.quantity <= 1}
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-zinc-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                                    >
                                                        <FiMinus />
                                                    </button>
                                                    <span className="w-12 text-center font-black text-zinc-900">{item.quantity}</span>
                                                    <button
                                                        disabled={isUpdating}
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-zinc-500 hover:text-indigo-600 disabled:opacity-30 transition-all"
                                                    >
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.productPrice.toLocaleString('vi-VN')} ₫ / item</p>
                                                    <span className="text-2xl font-black text-indigo-600">
                                                        {(item.productPrice * item.quantity).toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="xl:col-span-4 mt-10 xl:mt-0">
                            <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 sticky top-32 overflow-hidden group">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] transition-transform duration-[3000ms] group-hover:scale-150"></div>

                                <h2 className="text-2xl font-black mb-10 tracking-tighter relative z-10 flex items-center gap-3">
                                    <IoBagOutline />
                                    Summary
                                </h2>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center text-zinc-400 font-medium">
                                        <span className="text-xs font-black uppercase tracking-widest">Base Total</span>
                                        <span className="text-white font-black">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>

                                    <div className="h-px bg-zinc-800 my-8"></div>

                                    <div className="flex justify-between items-end mb-10">
                                        <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Estimated Total</span>
                                        <span className="text-4xl font-black text-indigo-400">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <button
                                            onClick={handlePay}
                                            className="w-full bg-white text-zinc-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs 
                                                     hover:bg-indigo-400 hover:text-white transition-all duration-300 shadow-xl shadow-black/20 flex items-center justify-center gap-3"
                                        >
                                            Checkout with <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg" className="h-5" alt="VNPay" />
                                        </button>

                                        <div className="relative py-2 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">or</span>
                                        </div>

                                        <button
                                            onClick={handlePaypal}
                                            className="w-full bg-[#FFC439] text-indigo-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs 
                                                     hover:bg-[#f4bb33] transition-all duration-300 shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                                        >
                                            Checkout with <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                                        </button>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
                                        <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Secure Payments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmClearCart}
                title="Clear Shopping Cart?"
                message="Are you sure you want to remove all items from your cart? This action cannot be undone."
                confirmText="Yes, Clear Cart"
                cancelText="Keep Items"
                type="danger"
            />
        </div>
    );
};

export default Cart;
