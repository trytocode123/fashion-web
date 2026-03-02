import {FiXCircle} from "react-icons/fi";
import {Link, useNavigate} from "react-router-dom";
import {IoMdArrowBack} from "react-icons/io";

const VNPayFail = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full flex justify-center px-4 pt-6 mb-[100px]">
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
                        <FiXCircle className="text-red-600 text-3xl"/>
                    </div>
                </div>

                <h1 className="text-xl font-bold text-gray-900">
                    Payment Failed
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Payment via{" "}
                    <span
                        className="
                            inline-flex items-center
                            px-2 py-0.5 rounded-full
                            bg-red-50 text-red-600
                            font-semibold text-xs
                        "
                    >
                        VNPay
                    </span>{" "}
                    was unsuccessful
                </p>

                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                    Your transaction could not be completed.
                    <br/>
                    Please try again or choose another payment method.
                </p>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => {
                            navigate("/products");
                        }}
                        className="
                            flex items-center justify-center gap-2 w-full
                            bg-gray-900 text-white py-3 rounded-xl
                            font-semibold
                            hover:bg-gray-800 transition
                            group
                        "
                    >
                        <IoMdArrowBack
                            className="text-[20px] group-hover:-translate-x-1 transition"
                        />
                        Back to Home
                    </button>

                </div>

                <p className="text-xs text-gray-400 mt-6">
                    If the problem persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default VNPayFail;
