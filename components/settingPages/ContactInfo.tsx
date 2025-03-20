"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import TranslateHook from "../translate/TranslateHook";
import LangUseParams from "../translate/LangUseParams";
import PhoneInput from "react-phone-input-2";
import { DeleteOutlined, LockOutlined } from "@ant-design/icons";
import "react-phone-input-2/lib/style.css"; // Import the styles
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// Define the structure of the contact data
interface ContactValue {
    mobile: string[];
    whatsapp: string[];
    email: string;
    social: {
        facebook: string;
        instagram: string;
        snapchat: string;
        tiktok: string;
        twitter: string;
        youtube: string;
        play_store: string;
        app_store: string;
    };
}

interface ContactData {
    id: number;
    key: string;
    name: string;
    value: ContactValue;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    errors?: { general?: string[] };
    message: string;
    data: {
        data: ContactData[];
    };
}

const ContactInfo = () => {
    const [contactInfo, setContactInfo] = useState<ContactValue | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    // lang param (ar Or en)
    const lang = LangUseParams()
    const translate = TranslateHook();

    // Fetch contact info
    const fetchContactInfo = useCallback(async () => {
        setLoading(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY,
                "Accept-Language": lang,
            };

            const response = await axios.get<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=app-contacts`,
                { headers }
            );

            setContactInfo(response.data.data.data[0]?.value);
        } catch (error) {
            console.error("Failed to fetch contact info:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to fetch contact info"]);
            }
            toast.error("Failed to fetch contact info");
        } finally {
            setLoading(false);
        }
    }, [lang]);

    useEffect(() => {
        fetchContactInfo();
    }, [fetchContactInfo]);

    // Handle input changes for mobile and whatsapp
    const handleArrayInputChange = (
        field: "mobile" | "whatsapp", // Only allow "mobile" or "whatsapp"
        index: number,
        value: string
    ) => {
        setContactInfo((prev) => ({
            ...prev!,
            [field]: prev![field].map((item, i) => (i === index ? value : item)),
        }));
    };

    // Handle adding a new input for mobile or whatsapp
    const handleAddInput = (field: "mobile" | "whatsapp") => {
        setContactInfo((prev) => ({
            ...prev!,
            [field]: [...prev![field], ""],
        }));
    };

    // Handle removing an input for mobile or whatsapp
    const handleRemoveInput = (field: "mobile" | "whatsapp", index: number) => {
        setContactInfo((prev) => ({
            ...prev!,
            [field]: prev![field].filter((_, i) => i !== index),
        }));
    };

    // Handle input changes for email and social links
    const handleInputChange = (field: keyof ContactValue, value: string) => {
        setContactInfo((prev) => ({
            ...prev!,
            [field]: value,
        }));
    };

    const handleSocialChange = (platform: keyof ContactValue["social"], value: string) => {
        setContactInfo((prev) => ({
            ...prev!,
            social: {
                ...prev!.social,
                [platform]: value,
            },
        }));
    };

    // Submit contact info
    const submitContactInfo = async () => {
        setSubmitting(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY!,
                "Accept-Language": lang,
            };

            // Make the POST request
            const response = await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=app-contacts`,
                { value: contactInfo },
                { headers }
            );

            // Show success toast
            toast.success("Contact info updated successfully");
        } catch (error) {
            console.error("Failed to update contact info:", error);

            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                // Check if the error has a response from the server
                if (error.response) {
                    // Set errors for display in the UI
                    if (error.response.data.errors?.general) {
                        setErrors(error.response.data.errors.general);
                    }

                    // Show the error message from the server in a toast
                    toast.error(error.response.data.message || "Failed to update contact info");
                } else {
                    // Handle network errors or other Axios errors
                    setErrors(["Failed to update contact info"]);
                    toast.error("Network error or server unavailable");
                }
            } else {
                // Handle non-Axios errors
                setErrors(["Failed to update contact info"]);
                toast.error("An unexpected error occurred");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitContactInfo();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">
            <ToastContainer /> {/* Add ToastContainer here */}
            <h1 className="text-sm font-semibold mb-4 titleBox">
                {translate ? translate.pages.setting.contactInfo.title : ""}
            </h1>

            {errors.length > 0 && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
                    <ul>
                        {errors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Mobile Inputs */}
                <div className="mb-4 lightBlueBk p-8 rounded-md">
                    <label className="block text-xs font-bold titleBox mb-4">
                        {translate ? translate.pages.setting.contactInfo.phoneNumbers : ""}
                    </label>
                    {contactInfo?.mobile.map((number, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2" style={{ direction: "ltr" }}>
                            <PhoneInput
                                country={"kw"} // Default country (Kuwait)
                                value={number}
                                onChange={(value) => handleArrayInputChange("mobile", index, value)}
                                inputClass="w-full py-5 px-4 m-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
                                containerClass="w-full"
                            />
                            {/* Disable the "Remove" button for the first input */}
                            <button
                                type="button"
                                onClick={() => handleRemoveInput("mobile", index)}
                                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={index === 0} // Disable if it's the first input
                            >
                                {index === 0 ? <LockOutlined /> : <DeleteOutlined />}
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddInput("mobile")}
                        className="mt-4 px-4 py-2 text-xs font-bold block mr-auto bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {translate ? translate.pages.setting.contactInfo.addOtherNumber : ""}
                    </button>
                </div>

                {/* WhatsApp Inputs */}
                <div className="mb-4 lightBlueBk p-8 rounded-md">
                    <label className="block text-xs font-bold titleBox mb-4">
                        {translate ? translate.pages.setting.contactInfo.whatsappNumbers : ""}
                    </label>
                    {contactInfo?.whatsapp.map((number, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2" style={{ direction: "ltr" }}>
                            <PhoneInput
                                country={"sa"} // Default country (Saudi Arabia)
                                value={number}
                                onChange={(value) => handleArrayInputChange("whatsapp", index, value)}
                                inputClass="w-full py-5 px-4 m-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
                                containerClass="w-full"
                            />
                            {/* Disable the "Remove" button for the first input */}
                            <button
                                type="button"
                                onClick={() => handleRemoveInput("whatsapp", index)}
                                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${index === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={index === 0} // Disable if it's the first input
                            >
                                {index === 0 ? <LockOutlined /> : <DeleteOutlined />}
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleAddInput("whatsapp")}
                        className="mt-4 px-4 py-2 text-xs font-bold block mr-auto bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {translate ? translate.pages.setting.contactInfo.addOtherNumber : ""}
                    </button>
                </div>

                {/* Email Input */}
                <div className="mb-4 lightBlueBk p-8 rounded-md">
                    <label className="block text-xs font-bold titleBox mb-4">
                        {translate ? translate.pages.setting.contactInfo.email : ""}
                    </label>
                    <input
                        type="email"
                        value={contactInfo?.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full py-2 px-4 m-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
                    />
                </div>

                {/* Social Links Input */}
                <div className="lightBlueBk p-8 rounded-md ">
                    <div className="mb-4">
                        <label className="block text-xs font-bold titleBox mb-4">
                            {translate ? translate.pages.setting.contactInfo.socialLinks : ""}
                        </label>
                        <div className=" grid grid-cols-2 gap-2 items-center">
                            {Object.entries(contactInfo?.social || {}).map(([platform, link]) => (
                                <div key={platform}>
                                    <label className="block text-sm font-bold text-gray-700">{platform}</label>
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={(e) => handleSocialChange(platform as keyof ContactValue["social"], e.target.value)}
                                        className="w-full py-2 px-4 m-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="block mx-auto my-4 font-semibold px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    {submitting
                        ?
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mx-4" />
                        </>

                        :
                        <>
                            {translate ? translate.pages.setting.contactInfo.save : ""}
                        </>
                    }
                </button>



            </form>
        </div>
    );
};

export default ContactInfo;