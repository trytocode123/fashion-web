import { FiXCircle, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

const PaymentFail = () => {
    return (
        <div className="w-full flex justify-center px-4 pt-6 mb-5">
            <div
                className="
                    w-full max-w-md bg-white
                    rounded-3xl overflow-hidden
                    p-8 text-center
                    shadow-[0_-2px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.12)]
                "
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FiXCircle className="text-red-600 text-3xl" />
                    </div>
                </div>

                <h1 className="text-xl font-bold text-gray-900">
                    Payment Unsuccessful
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    We couldn’t process your <span className={"font-bold"}>PayPal</span> payment
                </p>

                <p className="text-sm text-gray-400 mt-4">
                    No charges were made to your account.
                    <br />
                    You may try a different products.
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
                        <FiShoppingBag className="text-lg" />
                        Continue Shopping
                    </Link>

                </div>

                <p className="text-xs text-gray-400 mt-6">
                    If the issue persists, please contact our support team
                </p>
            </div>
        </div>
    );
};

export default PaymentFail;
