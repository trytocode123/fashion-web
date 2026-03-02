import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { addAccount } from "../../service/Account/AccountService.js";
import { toast } from "react-toastify";
import { useState } from "react";
import { FaSpinner, FaUserEdit } from "react-icons/fa";

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
        passwordAgain: "",
        roles: [
            {
                id: 2,
                role: "ROLE_CUSTOMER"
            }
        ],
        provider: "LOCAL"
    }

    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);
    const [serverError, setServerError] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleRegister = (value) => {
        async function register() {
            setDisable(true);
            setServerError("");
            try {
                const { passwordAgain, ...data } = value;
                const res = await addAccount(data, avatar);
                if (res) {
                    toast.info(res);
                    navigate("/");
                }
            } catch (e) {
                setServerError(e.message || "Registration failed. Please try again.");
                toast.error(e.message || "Registration failed.");
            }
            setDisable(false);
        }

        register();
    }

    const validation = Yup.object({
        username: Yup.string().required("Please enter your user name!"),
        password: Yup.string().required("Please enter your password!"),
        fullName: Yup.string().required("Please enter your full name!").matches(/^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/, "Invalid format full name.").min(7, "Full name must be more than 7 characters"),
        phoneNumber: Yup.string().required("Please enter your phone number!")
            .min(10, "Phone number must be 10 numbers")
            .max(10, "Phone number must be 10 numbers"),
        dob: Yup.string().required("Please enter your date of birth!"),
        address: Yup.string().required("Please enter your address!"),
        email: Yup.string().required("Please enter your email!").email("Wrong format (example@gmail.com)!"),
        gender: Yup.string().required("Please select your gender!"),
        passwordAgain: Yup.string().required("Please enter your confirmed password!").oneOf([Yup.ref("password")], "Your confirmed password is not matched"),
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-50 px-4 py-8 lg:py-12">
            <div className="w-full max-w-[800px] bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200 border border-zinc-100 p-8 md:p-12 animate-scale-in">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-2 uppercase">Create Account</h2>
                    <p className="text-zinc-500 text-sm font-medium">Join the Fashion Hub community today</p>
                </div>

                <Formik initialValues={user} onSubmit={handleRegister} validationSchema={validation} validateOnChange={false}>
                    <Form className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {/* Column 1 */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                                    <Field name="fullName" placeholder="Enter full name..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="fullName" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                                    <Field name="phoneNumber" placeholder="Enter phone number..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="phoneNumber" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Date of Birth</label>
                                    <Field type="date" name="dob" className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="dob" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Address</label>
                                    <Field name="address" placeholder="Enter address..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="address" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Profile Image</label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="w-14 h-14 rounded-2xl border-2 border-zinc-100 overflow-hidden bg-zinc-50 flex items-center justify-center shadow-sm">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserEdit className="text-zinc-300 text-xl" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer bg-white border-2 border-zinc-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 transition-all shadow-sm">
                                            Choose File
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                                    <Field name="email" placeholder="Enter email..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="email" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                    {serverError && <small className="text-red-500 text-[11px] font-bold ml-1 block">{serverError}</small>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Gender</label>
                                    <div className="flex gap-6 p-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <Field type="radio" name="gender" value="MALE" className="w-4 h-4 accent-indigo-600" />
                                            <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <Field type="radio" name="gender" value="FEMALE" className="w-4 h-4 accent-indigo-600" />
                                            <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Female</span>
                                        </label>
                                    </div>
                                    <ErrorMessage name="gender" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Username</label>
                                    <Field name="username" placeholder="Enter username..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="username" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
                                    <Field type="password" name="password" placeholder="Enter password..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="password" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm Password</label>
                                    <Field type="password" name="passwordAgain" placeholder="Confirm password..." className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-3 px-5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm" />
                                    <ErrorMessage name="passwordAgain" component="small" className="text-red-500 text-[11px] font-bold ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            {disable ? (
                                <div className="flex items-center justify-center h-[54px] bg-zinc-900 rounded-2xl">
                                    <FaSpinner className="animate-spin text-white text-xl" />
                                </div>
                            ) : (
                                <Button type="submit" className="w-full bg-zinc-900 py-4 rounded-2xl text-white font-black tracking-widest uppercase text-xs hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-zinc-200">
                                    Register Account
                                </Button>
                            )}
                        </div>

                        <div className="text-center pt-2">
                            <p className="text-zinc-500 text-sm font-medium">
                                Already a member? <Link to="/" className="text-indigo-600 font-bold hover:underline">Log in here</Link>
                            </p>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default Register;