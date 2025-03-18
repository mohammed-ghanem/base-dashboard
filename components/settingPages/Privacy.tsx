"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LangUseParams from "../translate/LangUseParams";
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';
import TranslateHook from "../translate/TranslateHook";

const CkEditor = dynamic(() => import('../ckEditor/CKEditor'), {
    ssr: false, // Disable SSR for this component
});

// Define the structure of the terms data
interface TermsValue {
    ar: string;
    en: string;
}

interface TermsData {
    id: number;
    key: string;
    name: string;
    value: TermsValue;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    errors?: { general?: string[] };
    message: string;
    data: {
        data: TermsData[];
    };
}

const Privacy: React.FC = () => {
    const [arData, setArData] = useState<string>("");
    const [enData, setEnData] = useState<string>("");
    const [loadingAr, setLoadingAr] = useState<boolean>(true);
    const [loadingEn, setLoadingEn] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [submittingAr, setSubmittingAr] = useState<boolean>(false);
    const [submittingEn, setSubmittingEn] = useState<boolean>(false);
    // lang param (ar Or en)
    const lang = LangUseParams()
    const translate = TranslateHook();

    // Fetch Arabic privacy data
    const fetchArData = useCallback(async () => {
        setLoadingAr(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY!,
                "Accept-Language": "ar", // Fetch Arabic data
            };

            const response = await axios.get<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=privacy-policy-ar`,
                { headers }
            );

            setArData(response.data.data.data[0]?.value.ar || "");
        } catch (error) {
            console.error("Failed to fetch Arabic privacy:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to fetch Arabic privacy"]);
            }
            toast.error("Failed to fetch Arabic privacy");
        } finally {
            setLoadingAr(false);
        }
    }, []);

    // Fetch English privacy data
    const fetchEnData = useCallback(async () => {
        setLoadingEn(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY!,
                "Accept-Language": "en", // Fetch English data
            };

            const response = await axios.get<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=privacy-policy-en`,
                { headers }
            );

            setEnData(response.data.data.data[0]?.value.en || "");
        } catch (error) {
            console.error("Failed to fetch English terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to fetch English terms"]);
            }
            toast.error("Failed to fetch English terms");
        } finally {
            setLoadingEn(false);
        }
    }, []);

    useEffect(() => {
        fetchArData();
        fetchEnData();
    }, [fetchArData, fetchEnData]);

    const handleEditorChange = (field: keyof TermsValue, value: string) => {
        if (field === "ar") {
            setArData(value);
        } else if (field === "en") {
            setEnData(value);
        }
    };

    // Submit Arabic terms data
    const submitArData = async () => {
        setSubmittingAr(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY!,
                "Accept-Language": "ar", // Submit Arabic data
            };

            await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=privacy-policy-ar`,
                { value: { ar: arData } },
                { headers }
            );

            toast.success(<span className="font-semibold font-cairo text-xs">{translate ? translate.pages.setting.privacy.privacyArSuccess : ""}</span>);
        } catch (error) {
            console.error("Failed to update Arabic terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to update Arabic terms"]);
            }
            toast.error(<span className="font-semibold font-cairo text-xs">{translate ? translate.pages.setting.privacy.privacyArError : ""}</span>);
        } finally {
            setSubmittingAr(false);
        }
    };

    // Submit English terms data
    const submitEnData = async () => {
        setSubmittingEn(true);
        setErrors([]);

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "api-key": process.env.NEXT_PUBLIC_API_KEY!,
                "Accept-Language": "en", // Submit English data
            };

            await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=privacy-policy-en`,
                { value: { en: enData } },
                { headers }
            );

            toast.success(<span className="font-semibold font-cairo text-xs">{translate ? translate.pages.setting.privacy.privacyEnSuccess : ""}</span>);
        } catch (error) {
            console.error("Failed to update English terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to update English terms"]);
            }
            toast.error(<span className="font-semibold font-cairo text-xs">{translate ? translate.pages.setting.privacy.privacyEnError : ""}</span>);
        } finally {
            setSubmittingEn(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitArData(); // Submit Arabic data
        await submitEnData(); // Submit English data
        setIsEditing(false);
    };

    if (loadingAr || loadingEn) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">
            <ToastContainer


            /> {/* Add ToastContainer here */}
            <h1 className="text-xl font-semibold mb-4 titleBox">
                {translate ? translate.pages.setting.privacy.title : ""}
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
                <div className="mb-4">
                    <label htmlFor="privacy-ar" className="block font-bold my-4">
                        {translate ? translate.pages.setting.privacy.privacyTextAr : ""}
                    </label>
                    <div className="lightBlueBk p-5 rounded-md">
                        <CkEditor
                            editorData={arData}
                            setEditorData={(value: any) => handleEditorChange("ar", value)}
                            handleOnUpdate={(editor, field) => handleEditorChange("ar", editor)}
                            config={{
                                language: "ar",
                                direction: "rtl",
                                placeholder: "",
                                toolbar: "full",
                            }}
                        />
                    </div>

                </div>

                <div className="mb-4">
                    <label htmlFor="privacy-en" className="block font-bold my-6">
                        {translate ? translate.pages.setting.privacy.privacyTextEn : ""}
                    </label>
                    <div className="lightBlueBk p-5 rounded-md">
                        <CkEditor
                            editorData={enData}
                            setEditorData={(value: any) => handleEditorChange("en", value)}
                            handleOnUpdate={(editor, field) => handleEditorChange("en", editor)}
                            config={{
                                language: "en",
                                direction: "ltr",
                                placeholder: "",
                                toolbar: "full",

                            }}
                        />
                    </div>
                </div>

                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                type="submit"
                                disabled={submittingAr || submittingEn}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {submittingAr || submittingEn ? "Saving..." : "Save"}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {translate ? translate.pages.setting.trem.tremBtn : ""}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Privacy;