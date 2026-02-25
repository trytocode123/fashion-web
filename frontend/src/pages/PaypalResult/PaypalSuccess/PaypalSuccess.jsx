import {FiCheckCircle, FiShoppingBag} from "react-icons/fi";
import {Link, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {paypalSuccess} from "../../../service/Paypal/PaypalService.js";

const PaypalSuccess = () => {
    const [searchParam] = useSearchParams();
    const paymentId = searchParam.get("paymentId");
    const payerID = searchParam.get("PayerID");

    useEffect(() => {
        async function excutePaypal() {
            const res = await paypalSuccess(paymentId, payerID);
            console.log(res);
        }

        excutePaypal();
    }, [payerID, paymentId]);
    return (
        <div className="w-full flex justify-center px-4 pt-6 mb-3">
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
                    Thank you for your <span className={"font-bold"}>PayPal</span> payment
                </p>

                <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                    Your payment has been confirmed successfully.
                    <br/>
                    We are preparing your order for shipment.
                </p>

                <div className="mt-6 space-y-3">
                    <Link
                        to={"/products"}
                        className="
                            flex items-center justify-center gap-2 w-full
                            bg-black text-white py-3 rounded-xl
                            font-semibold hover:bg-gray-800 transition
                        "
                    >
                        <FiShoppingBag className="text-lg"/>
                        Continue Shopping
                    </Link>

                    {/*<Link*/}
                    {/*    to={"/orders"}*/}
                    {/*    className="block text-sm text-gray-500 hover:underline"*/}
                    {/*>*/}
                    {/*    View My Orders*/}
                    {/*</Link>*/}
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    A confirmation email has been sent to your registered email address
                </p>
            </div>
        </div>
    );
};

export default PaypalSuccess;
