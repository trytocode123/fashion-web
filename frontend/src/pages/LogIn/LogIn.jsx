import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "@headlessui/react";
import { FcGoogle } from "react-icons/fc";
import { logIn, logInGoogle } from "../../service/Account/AccountService.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/Reducer/authSlice.js";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const LogIn = () => {
    const [error, setError] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const user = {
        username: "",
        password: ""
    };

    const handleLogin = async (value) => {
        setDisable(true);
        const data = await logIn(value);
        if (data.message) {
            setError(data.message);
        } else {
            dispatch(loginSuccess(data));
            toast.success(`Login successfully. Welcome, ${data.fullName}!`);
            navigate("/home");
        }
        setDisable(false);
    }

    const handleOnchange = () => {
        setError(null);
    }

    const handleLoginWithGoogle = () => {
        logInGoogle();
    }

    const validation = Yup.object({
        username: Yup.string().required("Please enter your user name!"),
        password: Yup.string().required("Please enter your password!")
    })

    return (
        <div className="min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-50 px-4 py-4 lg:py-8">
            <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl shadow-zinc-200 border border-zinc-100 p-6 md:p-8 animate-scale-in">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-1">Welcome Back</h2>
                    <p className="text-zinc-500 text-xs font-medium">Log in to your Fashion Hub account</p>
                </div>

                <Formik initialValues={user} onSubmit={handleLogin} validationSchema={validation} validateOnChange={false}>
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Username</label>
                            <div className="group transition-all duration-300">
                                <Field
                                    onFocus={handleOnchange}
                                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 
                                             text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 
                                             focus:bg-white transition-all shadow-sm group-hover:border-zinc-200"
                                    name="username"
                                    placeholder="your_username"
                                />
                            </div>
                            <ErrorMessage name="username" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                            <div className="group transition-all duration-300">
                                <Field
                                    onFocus={handleOnchange}
                                    type="password"
                                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 
                                             text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-indigo-500 
                                             focus:bg-white transition-all shadow-sm group-hover:border-zinc-200"
                                    name="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <ErrorMessage name="password" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 animate-pulse">
                                <p className="text-red-600 text-[12px] font-bold text-center">{error}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            {disable ? (
                                <div className="flex items-center justify-center h-[54px] bg-zinc-900 rounded-2xl">
                                    <FaSpinner className="animate-spin text-white text-xl" />
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-zinc-900 py-4 rounded-2xl text-white font-black tracking-wide
                                             hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-zinc-200"
                                >
                                    Continue
                                </Button>
                            )}
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-zinc-500 text-sm font-medium">
                                New user? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
                            </p>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="bg-white px-4 text-zinc-400 font-bold">or</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLoginWithGoogle}
                            className="w-full h-[50px] rounded-2xl border-2 border-zinc-100 bg-white
                                     flex items-center justify-center gap-3 text-zinc-700 font-bold
                                     hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                            <FcGoogle className="text-2xl" />
                            <span>Continue with Google</span>
                        </button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default LogIn;