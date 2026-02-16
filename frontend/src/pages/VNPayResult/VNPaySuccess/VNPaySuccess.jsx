import {FiCheckCircle, FiShoppingBag} from "react-icons/fi";
import {Link} from "react-router-dom";

const VNPaySuccess = () => {
    return (
        <div className="w-full flex justify-center px-4 pt-6 mb-[36px]">
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
                    Paid via{" "}
                    <span
                        className="
                            inline-flex items-center
                            px-2 py-0.5 rounded-full
                            bg-green-50 text-green-600
                            font-semibold text-xs
                        "
                    >
                        VNPay
                    </span>
                </p>

                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                    Your VNPay transaction has been completed successfully.
                    <br/>
                    We are preparing your order for shipment.
                </p>

                <div className="mt-6 space-y-3">
                    <Link
                        to="/home"
                        className="
                            flex items-center justify-center gap-2 w-full
                            bg-gradient-to-r from-green-500 to-green-600
                            text-white py-3 rounded-xl
                            font-semibold
                            hover:from-green-600 hover:to-green-700
                            transition
                        "
                    >
                        <FiShoppingBag className="text-lg"/>
                        Continue Shopping
                    </Link>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    A confirmation email has been sent to your registered email address
                </p>
            </div>
        </div>
    );
};

export default VNPaySuccess;
