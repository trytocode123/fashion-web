import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../service/Account/AccountService.js";
import { toast } from "react-toastify";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/Reducer/authSlice.js";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasCalled = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Missing verification token.");
            return;
        }

        if (hasCalled.current) return;
        hasCalled.current = true;

        const triggerVerify = async () => {
            try {
                const res = await verifyEmail(token);
                dispatch(loginSuccess(res));
                setStatus("success");
                setMessage(`Hello ${res.fullName}! Your account has been verified successfully.`);
                toast.success(`Welcome, ${res.fullName}!`);
                setTimeout(() => navigate("/home"), 3000);
            } catch (e) {
                setStatus("error");
                setMessage(e.message || "Verification failed.");
                toast.error("Verification failed.");
            }
        };

        triggerVerify();
    }, [token, navigate, dispatch]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full border border-gray-100">
                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800">Verifying your account...</h2>
                        <p className="text-gray-500 mt-2">Please wait a moment.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-5xl text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-green-600">Success!</h2>
                        <p className="text-gray-700 mt-2">{message}</p>
                        <p className="text-gray-400 mt-3 text-sm">Redirecting to home page...</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <FaTimesCircle className="text-5xl text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
                        <p className="text-gray-700 mt-2">{message}</p>
                        <button
                            onClick={() => navigate("/register")}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                        >
                            Back to Register
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Verify;
