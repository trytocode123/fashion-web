import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button} from "@headlessui/react";
import {Link, useNavigate} from "react-router-dom";
import {addAccount} from "../../service/Account/AccountService.js";
import {toast} from "react-toastify";
import {useState} from "react";
import {FaSpinner, FaUserEdit} from "react-icons/fa";

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
    };

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
                const {passwordAgain, ...data} = value;
                const res = await addAccount(data, avatar);
                if (res) {
                    toast.info(res);
                    navigate("/");
                }
            } catch (e) {
                setServerError(e.message || "Registration failed.");
                toast.error(e.message || "Registration failed.");
            }
            setDisable(false);
        }

        register();
    };

    const validation = Yup.object({
        username: Yup.string().required("Please enter your user name!"),
        password: Yup.string().required("Please enter your password!"),
        fullName: Yup.string()
            .required("Please enter your full name!")
            .matches(/^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/, "Invalid format full name.")
            .min(7, "Full name must be more than 7 characters"),
        phoneNumber: Yup.string()
            .required("Please enter your phone number!")
            .min(10)
            .max(10),
        dob: Yup.string().required("Please enter your date of birth!"),
        address: Yup.string().required("Please enter your address!"),
        email: Yup.string()
            .required("Please enter your email!")
            .email("Wrong format (example@gmail.com)!"),
        gender: Yup.string().required("Please select your gender!"),
        passwordAgain: Yup.string()
            .required("Please enter your confirmed password!")
            .oneOf([Yup.ref("password")], "Your confirmed password is not matched"),
    });

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
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-3 sm:px-4 py-6 mt-[-12px]">
            <div
                className="w-full max-w-md sm:max-w-xl lg:max-w-[1100px] bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-zinc-200 border border-zinc-100 p-5 sm:p-6 lg:p-8">

                {/* Header */}
                <div className="text-center mb-5 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 uppercase">
                        Create Account
                    </h2>
                    <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                        Join the Fashion Hub community today
                    </p>
                </div>

                <Formik
                    initialValues={user}
                    onSubmit={handleRegister}
                    validationSchema={validation}
                    validateOnChange={false}
                >
                    <Form>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">

                            {/* LEFT COLUMN */}
                            <div className="space-y-3">
                                {["fullName", "phoneNumber", "dob", "address"].map((field, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <label
                                            className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                                            {field === "dob"
                                                ? "Date of Birth"
                                                : field === "fullName"
                                                    ? "Full Name"
                                                    : field === "phoneNumber"
                                                        ? "Phone Number"
                                                        : "Address"}
                                        </label>

                                        <Field
                                            type={field === "dob" ? "date" : "text"}
                                            name={field}
                                            placeholder={`Enter ${field}...`}
                                            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                        />
                                        <ErrorMessage name={field} component="small"
                                                      className="text-red-500 text-[11px] font-bold"/>
                                    </div>
                                ))}

                                {/* Avatar */}
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                                        Profile Image
                                    </label>

                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview"
                                                     className="w-full h-full object-cover"/>
                                            ) : (
                                                <FaUserEdit className="text-zinc-300 text-lg"/>
                                            )}
                                        </div>

                                        <label
                                            className="cursor-pointer text-[10px] sm:text-xs font-black uppercase bg-white border border-zinc-200 px-3 py-2 rounded-lg hover:border-indigo-500 transition">
                                            Choose File
                                            <input type="file" className="hidden" accept="image/*"
                                                   onChange={handleFileChange}/>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-3">
                                {["email", "username", "password", "passwordAgain"].map((field, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <label
                                            className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                                            {field === "passwordAgain" ? "Confirm Password" : field}
                                        </label>

                                        <Field
                                            type={field.includes("password") ? "password" : "text"}
                                            name={field}
                                            placeholder={`Enter ${field}...`}
                                            className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-2.5 px-4 text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                        />
                                        <ErrorMessage name={field} component="small"
                                                      className="text-red-500 text-[11px] font-bold"/>
                                        {field === "email" && serverError && (
                                            <small
                                                className="text-red-500 text-[11px] font-bold block">{serverError}</small>
                                        )}
                                    </div>
                                ))}

                                {/* Gender */}
                                <div className="space-y-1.5">
                                    <label
                                        className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                                        Gender
                                    </label>

                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <Field type="radio" name="gender" value="MALE"/>
                                            Male
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <Field type="radio" name="gender" value="FEMALE"/>
                                            Female
                                        </label>
                                    </div>

                                    <ErrorMessage name="gender" component="small"
                                                  className="text-red-500 text-[11px] font-bold"/>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5">
                            {disable ? (
                                <div className="flex items-center justify-center h-11 bg-zinc-900 rounded-xl">
                                    <FaSpinner className="animate-spin text-white text-lg"/>
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-zinc-900 py-3 rounded-xl text-white font-black tracking-widest uppercase text-xs hover:bg-zinc-800 active:scale-95 transition-all"
                                >
                                    Register Account
                                </Button>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="text-center pt-3">
                            <p className="text-zinc-500 text-xs sm:text-sm">
                                Already a member?{" "}
                                <Link to="/" className="text-indigo-600 font-bold hover:underline">
                                    Log in here
                                </Link>
                            </p>
                        </div>

                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default Register;