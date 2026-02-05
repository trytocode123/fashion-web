import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "@headlessui/react";
import {FcGoogle} from "react-icons/fc";
import {logIn, logInGoogle} from "../../service/Acount/AccountService.js";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {loginSuccess, logOut} from "../../redux/Reducer/authSlice.js";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";

const LogIn = () => {
    const [error, setError] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = {
        username: "",
        password: ""
    };

    useEffect(() => {
        dispatch(logOut());
    }, [dispatch]);

    const handleLogin = async (value) => {
        const data = await logIn(value);
        if (data.message) {
            setError(data);
        } else {
            dispatch(loginSuccess(data));
            toast.success(`Login successfully. Welcome, ${data.name}!`);
            navigate("/home");
        }
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
        <div className={"flex flex-col lg:w-[100%] items-center justify-center"}>
            <h2 className={"font-bold text-2xl align-middle"}>Login</h2>
            <Formik initialValues={user} onSubmit={handleLogin} validationSchema={validation}>
                <Form className={"lg:mt-4"}>
                    <div className={"flex flex-col lg:w-[300px]"}>
                        <label className={"font-bold"}>Username</label>
                        <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                            <Field onFocus={handleOnchange}
                                   className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                   name={"username"}
                                   placeholder="Enter user name..."/>
                        </div>
                        <ErrorMessage name={"username"} component={"small"}
                                      className={"text-red-800 text-[13px] font-bold"}/>
                    </div>

                    <div className={"flex flex-col lg:w-[300px] lg:mt-2"}>
                        <label className={"font-bold"}>Password</label>
                        <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                            <Field onFocus={handleOnchange} type={"password"}
                                   className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                   name={"password"}
                                   placeholder="Enter password..."/>
                        </div>
                        <ErrorMessage name={"password"} component={"small"}
                                      className={"text-red-800 text-[13px] font-bold"}/>
                    </div>
                    {error && <p className={"text-red-800 text-[13px] font-bold"}>{error.message}</p>}
                    <Button
                        type={"submit"}
                        className={"w-[100%] bg-gray-900 h-[50px] rounded-full text-white lg:mt-5 cursor-pointer hover:bg-gray-700"}>
                        Continue
                    </Button>

                    <div className={"lg:mt-3"}>
                        <p>New user? <Link to={"/register"} className={"text-blue-600"}>Create an account!</Link></p>
                    </div>

                    <div>
                        <div className={"border-b-gray-500 h-[2px] flex items-center gap-4 my-6"}>
                            <div className="flex-1 h-px bg-gray-300"/>
                            <span className="text-xs text-gray-400 uppercase">or</span>
                            <div className="flex-1 h-px bg-gray-300"/>
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={handleLoginWithGoogle}
                        className="
              w-[100%]
              h-[50px]
              rounded-full
              border
              border-gray-300
              bg-white
              flex items-center justify-center gap-3
              text-gray-700
              cursor-pointer
              hover:bg-gray-100
              transition
            "
                    >
                        <FcGoogle className="text-xl"/>
                        <span className="font-medium">Continue with Google</span>
                    </Button>
                </Form>
            </Formik>
        </div>
    )
}

export default LogIn;