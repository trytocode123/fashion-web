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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
                >
                    <HiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" size={20} />
                    <span className="font-semibold">Continue Shopping</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <IoBagOutline size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex justify-between items-center px-4 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                            <span>Products ({items.length})</span>
                            <button
                                onClick={handleClearCart}
                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 transition-colors"
                            >
                                <IoTrashOutline size={14} /> Clear Cart
                            </button>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-md">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={item.productImg} alt={item.productName} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{item.productName}</h3>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-700">Size: {item.size}</span>
                                        <span className="font-medium">{item.productPrice?.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                </div>

                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                    >
                                        <CiCircleMinus size={22} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                    >
                                        <CiCirclePlus size={22} />
                                    </button>
                                </div>

                                <div className="sm:w-32 text-center sm:text-right">
                                    <p className="font-bold text-gray-900">{(item.productPrice * item.quantity).toLocaleString('vi-VN')} ₫</p>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-400 hover:text-red-600 p-2 transition-colors"
                                    >
                                        <IoTrashOutline size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <IoBagOutline /> Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-medium">Free</span>
                                </div>
                                <hr className="border-gray-800" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-blue-400">{totalPrice.toLocaleString('vi-VN')} ₫</p>
                                        <p className="text-[10px] text-gray-500 italic mt-1">Approx. ${(totalPrice / 27000).toFixed(2)} USD</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handlePay}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                                >
                                    Checkout with VNPay
                                </button>
                                <button
                                    onClick={handlePaypal}
                                    className="w-full bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" className="h-4" alt="PayPal" />
                                    PayPal
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-500 text-center mt-6">
                                Securing your payment with SSL encryption. <br />
                                By checking out, you agree to our Terms of Service.
                            </p>
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
