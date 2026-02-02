import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button} from "@headlessui/react";
import {Link} from "react-router-dom";

const Register = () => {
    const user = {
        fullName: "",
        phoneNumber: "",
        dob: "",
        address: "",
        email: "",
        gender: "",
        username: "",
        password: "",
        passwordAgain: ""
    }

    const handleRegister = (value) => {
        console.log(value)
    }

    const validation = Yup.object({
        username: Yup.string().required("Please enter your user name!"),
        password: Yup.string().required("Please enter your password!"),
        fullName: Yup.string().required("Please enter your full name!").matches(/^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/, "Each word must start with a capital letter."),
        phoneNumber: Yup.string().required("Please enter your phone number!")
            .min(10, "Phone number must be 10 numbers")
            .max(10, "Phone number must be 10 numbers"),
        dob: Yup.string().required("Please enter your date of birth!"),
        address: Yup.string().required("Please enter your address!"),
        email: Yup.string().required("Please enter your email!").email("Wrong format (example@gmail.com)!"),
        gender: Yup.string().required("Please select your gender!"),
        passwordAgain: Yup.string().required("Please enter your confirmed password!"),
    })
    return (
        <div className={"flex flex-col lg:w-[100%] items-center justify-center px-[80px]"}>
            <h2 className={"font-bold text-2xl align-middle"}>Register</h2>
            <Formik initialValues={user} onSubmit={handleRegister} validationSchema={validation}>
                <Form className={"w-[100%]"}>
                    <div className={"grid grid-cols-2 gap-28"}>
                        {/*Column 1*/}
                        <div className={"flex flex-col"}>
                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Full name</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"fullName"} placeholder={"Enter full name..."}/>
                                </div>
                                <ErrorMessage name={"fullName"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Phone number</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"phoneNumber"} placeholder={"Enter phone number..."}/>
                                </div>
                                <ErrorMessage name={"phoneNumber"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Date of Birth</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field type={"date"} className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"dob"} placeholder={"Enter date of birth..."}/>
                                </div>
                                <ErrorMessage name={"dob"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Address</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"address"} placeholder={"Enter address..."}/>
                                </div>
                                <ErrorMessage name={"address"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                        </div>

                        {/*Column 2*/}
                        <div className={"flex flex-col lg:mt-2"}>

                            <div className={"flex flex-col"}>
                                <label className={"font-bold"}>Email</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"email"} placeholder={"Enter email..."}/>
                                </div>
                                <ErrorMessage name={"email"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold mb-2"}>Gender</label>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Field
                                            type="radio"
                                            name="gender"
                                            value="MALE"
                                            className="w-4 h-4 accent-gray-900"
                                        />
                                        <span>Male</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Field
                                            type="radio"
                                            name="gender"
                                            value="FEMALE"
                                            className="w-4 h-4 accent-gray-900"
                                        />
                                        <span>Female</span>
                                    </label>
                                </div>
                                <ErrorMessage name={"gender"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Username</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"username"} placeholder={"Enter username..."}/>
                                </div>
                                <ErrorMessage name={"username"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Password</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field type={"password"} className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"password"} placeholder={"Enter password..."}/>
                                </div>
                                <ErrorMessage name={"password"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>

                            <div className={"flex flex-col lg:mt-2"}>
                                <label className={"font-bold"}>Password (Again)</label>
                                <div className={"border-2 rounded-2xl py-[10px] px-[10px]"}>
                                    <Field type={"password"}
                                           className={"w-full h-full focus:outline-hidden focus:bg-white"}
                                           name={"passwordAgain"} placeholder={"Enter confirmed password..."}/>
                                </div>
                                <ErrorMessage name={"passwordAgain"} component={"small"}
                                              className={"text-red-800 text-[13px] font-bold"}/>
                            </div>
                        </div>
                    </div>

                    <Button type={"submit"}
                            className={"w-[100%] bg-gray-900 h-[50px] rounded-full text-white lg:mt-5 cursor-pointer hover:bg-gray-700"}>
                        Continue
                    </Button>

                    <div>
                        <div className={"border-b-gray-500 h-[2px] flex items-center gap-4 my-6"}>
                            <div className="flex-1 h-px bg-gray-300"/>
                            <span className="text-xs text-gray-400 uppercase">or</span>
                            <div className="flex-1 h-px bg-gray-300"/>
                        </div>
                    </div>
                    <p className={"p-0 -mt-5"}>Already a member? <Link
                        to={"/"}
                        type="button"
                    >
                        <span className="font-medium text-blue-600">Log in</span>
                    </Link></p>
                </Form>
            </Formik>
        </div>
    )
}

export default Register;