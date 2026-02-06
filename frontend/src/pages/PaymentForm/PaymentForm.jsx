import {Link, useParams} from "react-router-dom";
import {Field, Form, Formik} from "formik";
import {useSelector} from "react-redux";
import {savePayment} from "../../service/VNPay/VNPayServer.js";

const PaymentForm = () => {
    const {info} = useParams();

    const infoOptimize = JSON.parse(info);
    console.log(infoOptimize);

    const init = {
        amount: infoOptimize.amount,
        orderId: infoOptimize.orderId,
        language: ""
    };

    const token = useSelector(state => state.auth.account.token);

    const handleSubmit = (value) => {
        async function submitPayment() {
            const res = await savePayment(value, token);
            window.location.href = res;
        }

        submitPayment();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-16">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8">

                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Order Payment Confirmation
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Complete your payment to receive your fashion items
                    </p>
                </div>

                <Formik initialValues={init} onSubmit={handleSubmit}>
                    <Form className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        <div className="space-y-6">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">
                                    {infoOptimize.amount.toLocaleString()} ₫
                                </p>
                            </div>
                            <Field
                                type="hidden"
                                name="orderId"
                                value={infoOptimize.orderId}
                            />
                        </div>

                        <div className="flex flex-col justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Display language
                                </label>
                                <Field
                                    as="select"
                                    name="language"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3
                                    focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    <option value="vn">Vietnamese</option>
                                    <option value="en">English</option>
                                </Field>
                            </div>

                            <div className="mt-12 space-y-4">
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-xl
                                    font-semibold hover:bg-gray-800 transition"
                                >
                                    Pay Now
                                </button>

                                <Link
                                    to={"/home"}
                                    className="block text-center text-sm text-gray-500 hover:underline"
                                >
                                    Continue Shopping
                                </Link>

                                <p className="text-xs text-gray-400 text-center">
                                    You will be redirected to the VNPay gateway to complete the payment
                                </p>
                            </div>
                        </div>

                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default PaymentForm;
