import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { fetchCart, updateCartItemQuantity, removeFromCart, clearCart } from "../../redux/Reducer/cartSlice";
import { savePayment } from "../../service/VNPay/VNPayServer";
import { progressPaypal } from "../../service/Paypal/PaypalService";
import { IoBagOutline, IoTrashOutline } from "react-icons/io5";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { HiArrowLeft } from "react-icons/hi2";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, status } = useSelector(state => state.cart);
    const token = useSelector(state => state.auth?.account?.token);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (token) {
            dispatch(fetchCart());
        }
    }, [dispatch, token]);

    const handleUpdateQuantity = (cartItemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty > 0) {
            dispatch(updateCartItemQuantity({ cartItemId, quantity: newQty }))
                .unwrap()
                .catch(err => toast.error("Update failed: " + err.message));
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
            .then(() => toast.success("Cart cleared successfully"))
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
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4 lg:py-6">
            <div className="mb-4 sm:mb-5 flex flex-col items-start">
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group mb-2"
                >
                    <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={18} />
                    <span className="font-semibold text-xs uppercase tracking-wider">Continue Shopping</span>
                </button>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">Your Cart</h1>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IoBagOutline size={40} className="text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Looks like you haven't added anything to
                        your cart yet. Discover our latest collections!</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-gray-900 text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                    {/* Cart Items List */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Shopping Bag <span
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{items.length} items</span>
                            </h2>
                            <button
                                onClick={handleClearCart}
                                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 transition-colors group"
                            >
                                <IoTrashOutline size={16} className="group-hover:animate-pulse" /> Clear All
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id}
                                    className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-[30px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-gray-200 group relative">
                                    <div
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer relative"
                                        onClick={() => navigate(`/detail/${item.productId}`)}>
                                        <img src={item.productImg} alt={item.productName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div
                                            className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    <div className="flex-1 w-full flex flex-col justify-center">
                                        <div className="flex justify-between items-start mb-2 gap-3 w-full">
                                            <h3
                                                className="font-bold text-gray-900 text-lg leading-tight hover:text-[#005BAA] cursor-pointer transition-colors max-w-[280px] truncate"
                                                onClick={() => navigate(`/detail/${item.productId}`)}
                                                title={item.productName}
                                            >
                                                {item.productName}
                                            </h3>
                                            <div className="text-right flex-shrink-0 ml-auto">
                                                <p className="font-bold text-gray-900 hidden sm:block text-xl">{(item.productPrice * item.quantity).toLocaleString('vi-VN')} ₫</p>
                                            </div>
                                        </div>

                                        <div
                                            className="inline-flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-4 items-center">
                                            <span
                                                className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-md font-medium text-gray-600">Size {item.size}</span>
                                            <span
                                                className="font-medium text-gray-400">{item.productPrice?.toLocaleString('vi-VN')} ₫ / item</span>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-start gap-6">
                                            <div
                                                className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
                                                >
                                                    <CiCircleMinus size={20} />
                                                </button>
                                                <span
                                                    className="w-10 text-center font-semibold text-gray-900 select-none">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
                                                >
                                                    <CiCirclePlus size={20} />
                                                </button>
                                            </div>

                                            <div className="sm:hidden font-bold text-gray-900 text-lg">
                                                {(item.productPrice * item.quantity).toLocaleString('vi-VN')} ₫
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="hidden sm:flex text-gray-400 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-50 ml-auto"
                                                title="Remove item"
                                            >
                                                <IoTrashOutline size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="sm:hidden absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 transition-colors"
                                    >
                                        <IoTrashOutline size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 w-full max-w-[420px] xl:max-w-[460px] mx-auto xl:ml-auto">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 lg:p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 border border-blue-200/50">
                                    <IoBagOutline size={18} />
                                </div>
                                <span className="tracking-tight">Order Summary</span>
                            </h2>

                            <div className="space-y-3 mb-5 text-[14px]">
                                <div className="flex justify-between text-gray-600 items-center">
                                    <span className="font-medium">Subtotal</span>
                                    <span
                                        className="font-bold text-gray-900 tracking-tight text-base">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <hr className="border-gray-200/80 my-3" />
                                <div className="flex justify-between items-center rounded-xl bg-white p-3 border border-gray-100 shadow-sm">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-blue-600 tracking-tight">{totalPrice.toLocaleString('vi-VN')} <span className="text-blue-500/80 text-lg font-bold">₫</span></p>
                                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5">~
                                            ${(totalPrice / 27000).toFixed(2)} USD</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-1">
                                <button
                                    onClick={handlePay}
                                    className="w-full bg-white hover:bg-[#F0F8FF] text-[#005BAA] py-3 rounded-xl transition-all shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,91,170,0.15)] active:scale-[0.98] flex items-center justify-center border-2 border-[#005BAA]/10 hover:border-[#005BAA]/30 relative"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="tracking-wider text-[15px] font-bold">Checkout with</span>
                                        <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg"
                                            alt="VNPay" className="h-[20px] translate-y-[1px]" />
                                    </div>
                                </button>

                                <div className="relative flex items-center py-2 opacity-60">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span
                                        className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">or</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                <button
                                    onClick={handlePaypal}
                                    className="w-full bg-[#FFC439] hover:bg-[#F4BB33] text-gray-900 py-3 rounded-xl font-bold transition-all shadow-[0_2px_10px_rgba(255,196,57,0.2)] hover:shadow-[0_4px_16px_rgba(255,196,57,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 border border-[#FFC439]/50"
                                >
                                    <span className="tracking-wider text-[15px] font-bold text-[#003087]">Checkout with</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                        className="h-[18px]" alt="PayPal" />
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-2 text-gray-400 mb-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                    <span
                                        className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400/80">Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
