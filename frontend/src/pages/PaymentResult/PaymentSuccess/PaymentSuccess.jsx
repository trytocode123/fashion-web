import {FiCheckCircle, FiShoppingBag} from "react-icons/fi";
import {Link} from "react-router-dom";

const PaymentSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const txnRef = params.get("vnp_TxnRef");

    return (
        <div className="w-full flex justify-center px-4 pt-6">
            <div
                className="
                    w-full max-w-md bg-white
                    rounded-3xl overflow-hidden
                    p-8 text-center
                    shadow-[0_-2px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.12)]
                "
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <FiCheckCircle className="text-green-600 text-3xl"/>
                    </div>
                </div>

                <h1 className="text-xl font-bold text-gray-900">
                    Payment Successful
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Thank you for shopping at Fashion Hub
                </p>

                <div className="mt-5 rounded-xl border border-gray-200 px-5 py-4">
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="mt-1 font-semibold text-gray-800 break-all text-sm">
                        {txnRef}
                    </p>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                    Your order is being processed and will be delivered soon
                </p>

                <div className="mt-6 space-y-3">
                    <Link
                        to={"/home"}
                        className="
                            flex items-center justify-center gap-2 w-full
                            bg-black text-white py-3 rounded-xl
                            font-semibold hover:bg-gray-800 transition
                        "
                    >
                        <FiShoppingBag className="text-lg"/>
                        Continue Shopping
                    </Link>

                    <a
                        href="/orders"
                        className="block text-sm text-gray-500 hover:underline"
                    >
                        View My Orders
                    </a>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    If you have any issues, please contact our support team
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
