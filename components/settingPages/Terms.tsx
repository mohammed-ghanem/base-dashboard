






"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { message, Spin } from "antd";
import LangUseParams from "../translate/LangUseParams";
import Cookies from "js-cookie";
import TiptapEditor from "../tiptab/TiptapEditor";

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

const Terms: React.FC = () => {
    const [termsData, setTermsData] = useState<TermsValue | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const lang = LangUseParams();

    const fetchTermsData = useCallback(async () => {
        setLoading(true);
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

            const response = await axios.get<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
                { headers }
            );

            setTermsData(response.data.data.data[0]?.value || { ar: "", en: "" });
        } catch (error) {
            console.error("Failed to fetch terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to fetch terms"]);
            }
            message.error("Failed to fetch terms");
        } finally {
            setLoading(false);
        }
    }, [lang]);

    useEffect(() => {
        fetchTermsData();
    }, [fetchTermsData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TermsValue) => {
        if (termsData) {
            setTermsData((prev) => ({ ...prev!, [field]: e.target.value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termsData) return;

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

            await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
                { value: termsData },
                { headers }
            );

            message.success("Terms updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to update terms"]);
            }
            message.error("Failed to update terms");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">


            <div className="my-10">
                <TiptapEditor />
            </div>


            <h1 className="text-xl font-semibold mb-4">Terms and Conditions</h1>



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
                    <label htmlFor="terms-ar" className="block font-medium">
                        Arabic Terms and Conditions
                    </label>
                    <input
                        id="terms-ar"
                        type="text"
                        value={termsData?.ar || ""}
                        onChange={(e) => handleInputChange(e, "ar")}
                        className="w-full p-2 border rounded mt-1"

                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="terms-en" className="block font-medium">
                        English Terms and Conditions
                    </label>
                    <input
                        id="terms-en"
                        type="text"
                        value={termsData?.en || ""}
                        onChange={(e) => handleInputChange(e, "en")}
                        className="w-full p-2 border rounded mt-1"

                    />
                </div>

                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {submitting ? "Saving..." : "Save"}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Terms;






// "use client"

// import React, { useEffect, useState } from 'react';
// import axios, { AxiosError } from 'axios';
// import { message } from 'antd';
// import LangUseParams from '../translate/LangUseParams';
// import Cookies from 'js-cookie';

// // Define the structure of the terms data
// interface TermsValue {
//     ar: string;
//     en: string;
// }

// interface TermsData {
//     id: number;
//     key: string;
//     name: string;
//     value: TermsValue;
//     created_at: string;
//     updated_at: string;
// }

// interface ApiResponse {
//     errors: { general: string[] };
//     status: number;
//     message: string;
//     data: {
//         data: TermsData[];
//     };
// }

// const Terms: React.FC = () => {
//     const [termsData, setTermsData] = useState<TermsValue | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [errors, setErrors] = useState<Record<string, string[]>>({}); // Store API errors
//     const [isEditing, setIsEditing] = useState<boolean>(false); // Track editing state
//     const lang = LangUseParams();

//     // Fetch terms data
//     useEffect(() => {
//         const fetchTermsData = async () => {
//             try {
//                 const token = Cookies.get('access_token');
//                 if (!token) {
//                     throw new Error('No access token found');
//                 }

//                 const response = await axios.get<ApiResponse>(
//                     `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                             'Accept-Language': lang,
//                         },
//                     }
//                 );

//                 if (response.status !== 200) {
//                     throw new Error('Network response was not ok');
//                 }

//                 setTermsData(response.data.data.data[0].value);
//             } catch (error) {
//                 console.error('Failed to fetch terms:', error);

//                 if (axios.isAxiosError(error)) {
//                     const axiosError = error as AxiosError<ApiResponse>;
//                     if (axiosError.response) {
//                         setErrors(axiosError.response.data?.errors || { general: ['An error occurred'] });
//                     } else {
//                         setErrors({ general: [axiosError.message] });
//                     }
//                 } else {
//                     setErrors({ general: ['Failed to fetch terms'] });
//                 }

//                 message.error('Failed to fetch terms');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTermsData();
//     }, [lang]);

//     // Handle input changes
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TermsValue) => {
//         if (termsData) {
//             setTermsData({
//                 ...termsData,
//                 [field]: e.target.value,
//             });
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsEditing(false);

//         try {
//             const token = Cookies.get('access_token');
//             if (!token) {
//                 throw new Error('No access token found');
//             }

//             const response = await axios.post<ApiResponse>(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                 {
//                     value: termsData,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                         'Accept-Language': lang,
//                     },
//                 }
//             );

//             if (response.status !== 200) {
//                 throw new Error('Network response was not ok');
//             }

//             message.success('Terms updated successfully');
//         } catch (error) {
//             console.error('Failed to update terms:', error);

//             if (axios.isAxiosError(error)) {
//                 const axiosError = error as AxiosError<ApiResponse>;
//                 if (axiosError.response) {
//                     setErrors(axiosError.response.data?.errors || { general: ['An error occurred'] });
//                 } else {
//                     setErrors({ general: [axiosError.message] });
//                 }
//             } else {
//                 setErrors({ general: ['Failed to update terms'] });
//             }

//             message.error('Failed to update terms');
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (Object.keys(errors).length > 0) {
//         return (
//             <div>
//                 Error:
//                 <ul>
//                     {Object.entries(errors).map(([key, messages]) =>
//                         messages.map((message, index) => (
//                             <li key={`${key}-${index}`}>{message}</li>
//                         ))
//                     )}
//                 </ul>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h1>Terms and Conditions</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="terms-ar">Arabic Terms and Conditions</label>
//                     <input
//                         id="terms-ar"
//                         type="text"
//                         value={termsData?.ar || ''}
//                         onChange={(e) => handleInputChange(e, 'ar')}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="terms-en">English Terms and Conditions</label>
//                     <input
//                         id="terms-en"
//                         type="text"
//                         value={termsData?.en || ''}
//                         onChange={(e) => handleInputChange(e, 'en')}
//                     />
//                 </div>
//                 {isEditing ? (
//                     <button type="submit">Save</button>
//                 ) : (
//                     <button type="button" onClick={() => setIsEditing(true)}>
//                         Edit
//                     </button>
//                 )}
//             </form>
//         </div>
//     );
// };

// export default Terms;