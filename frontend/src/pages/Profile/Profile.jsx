import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../service/Account/AccountService.js";
import { FaUserEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const account = useSelector((state) => state.auth.account);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        dob: "",
        address: "",
        email: "",
        gender: "MALE",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!account?.token) return;
            try {
                setLoading(true);
                const data = await getProfile(account.token);
                setFormData({
                    fullName: data.fullName || "",
                    phoneNumber: data.phoneNumber || "",
                    dob: data.dob || "",
                    address: data.address || "",
                    email: data.email || "",
                    gender: data.gender || "MALE",
                });
            } catch (error) {
                toast.error("Failed to load profile information.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!account?.token) return;

        try {
            setSaving(true);
            await updateProfile(formData, account.token);
            toast.success("Profile updated successfully!");
            setTimeout(() => {
                navigate("/products");
            }, 1000);
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-24 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-4 sm:py-6 lg:py-10 bg-white flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Sidebar - Quick Info */}
                        <div className="w-full lg:w-[32%] bg-white p-8 lg:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 text-center">
                            <div className="relative mb-6">
                                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full p-2 shadow-sm border border-gray-200/50">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center text-blue-600 text-4xl shadow-inner">
                                        <FaUserEdit className="drop-shadow-sm" />
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{formData.fullName || "User Profile"}</h1>
                            <p className="text-gray-500 text-sm mb-6 font-medium">{formData.email}</p>
                            <div className="px-5 py-1.5 bg-white border border-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                Personal Account
                            </div>
                        </div>

                        <div className="w-full lg:w-[68%] p-8 lg:p-10">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Account Details</h2>
                                <p className="text-gray-400 text-sm">Update your information to keep your profile current.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                    {/* Full Name */}
                                    <div className="sm:col-span-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 hover:border-gray-300 transition-all text-sm placeholder:text-gray-300 shadow-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 hover:border-gray-300 transition-all text-sm placeholder:text-gray-300 shadow-sm"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 hover:border-gray-300 transition-all text-sm shadow-sm"
                                        />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 hover:border-gray-300 transition-all text-sm shadow-sm appearance-none"
                                        >
                                            <option value="MALE">♂ &nbsp; Male</option>
                                            <option value="FEMALE">♀ &nbsp; Female</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Residential Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 hover:border-gray-300 transition-all resize-none text-sm placeholder:text-gray-300 shadow-sm"
                                            placeholder="Enter your street, ward, and district..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <FiSave size={20} className="group-hover:scale-110 transition-transform" />
                                        )}
                                        <span className="tracking-wide">Update Profile</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
