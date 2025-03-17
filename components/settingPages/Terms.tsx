"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import LangUseParams from "../translate/LangUseParams";
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';

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

const Terms: React.FC = () => {
    const [arData, setArData] = useState<string>("");
    const [enData, setEnData] = useState<string>("");
    const [loadingAr, setLoadingAr] = useState<boolean>(true);
    const [loadingEn, setLoadingEn] = useState<boolean>(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [submittingAr, setSubmittingAr] = useState<boolean>(false);
    const [submittingEn, setSubmittingEn] = useState<boolean>(false);
    const lang = LangUseParams();

    // Fetch Arabic terms data
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
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions-ar`,
                { headers }
            );

            setArData(response.data.data.data[0]?.value.ar || "");
        } catch (error) {
            console.error("Failed to fetch Arabic terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to fetch Arabic terms"]);
            }
            message.error("Failed to fetch Arabic terms");
        } finally {
            setLoadingAr(false);
        }
    }, []);

    // Fetch English terms data
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
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions-en`,
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
            message.error("Failed to fetch English terms");
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
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions-ar`,
                { value: { ar: arData } },
                { headers }
            );

            message.success("Arabic terms updated successfully");
        } catch (error) {
            console.error("Failed to update Arabic terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to update Arabic terms"]);
            }
            message.error("Failed to update Arabic terms");
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
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions-en`,
                { value: { en: enData } },
                { headers }
            );

            message.success("English terms updated successfully");
        } catch (error) {
            console.error("Failed to update English terms:", error);
            if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
                setErrors(error.response.data.errors.general);
            } else {
                setErrors(["Failed to update English terms"]);
            }
            message.error("Failed to update English terms");
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
                    <CkEditor
                        editorData={arData}
                        setEditorData={(value: any) => handleEditorChange("ar", value)}
                        handleOnUpdate={(editor, field) => handleEditorChange("ar", editor)}
                        config={{
                            language: "ar",
                            direction: "rtl",
                            placeholder: "Write Arabic terms and conditions...",
                            toolbar: "full",
                            height: "400px",
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="terms-en" className="block font-medium">
                        English Terms and Conditions
                    </label>
                    <CkEditor
                        editorData={enData}
                        setEditorData={(value: any) => handleEditorChange("en", value)}
                        handleOnUpdate={(editor, field) => handleEditorChange("en", editor)}
                        config={{
                            language: "en",
                            direction: "ltr",
                            placeholder: "Write English terms and conditions...",
                            toolbar: "full",
                            height: "600px",
                        }}
                    />
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
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Terms;











// //trem with quill editor
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { message } from "antd";
// import LangUseParams from "../translate/LangUseParams";
// import Cookies from "js-cookie";
// import dynamic from 'next/dynamic';
// import { replaceInlineColorsWithClasses } from "../quillEditor/QuillEditor";

// const QuillEditor = dynamic(() => import('../quillEditor/QuillEditor'), {
//     ssr: false, // Disable SSR for this component
// });


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
//     errors?: { general?: string[] };
//     message: string;
//     data: {
//         data: TermsData[];
//     };
// }

// const Terms: React.FC = () => {
//     const [termsData, setTermsData] = useState<TermsValue | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [errors, setErrors] = useState<string[]>([]);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [submitting, setSubmitting] = useState<boolean>(false);
//     const lang = LangUseParams();

//     const fetchTermsData = useCallback(async () => {
//         setLoading(true);
//         setErrors([]);

//         try {
//             const token = Cookies.get("access_token");
//             if (!token) {
//                 throw new Error("No access token found");
//             }

//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//                 "Accept-Language": lang,
//             };

//             const response = await axios.get<ApiResponse>(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                 { headers }
//             );

//             setTermsData(response.data.data.data[0]?.value || { ar: "", en: "" });
//         } catch (error) {
//             console.error("Failed to fetch terms:", error);
//             if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//                 setErrors(error.response.data.errors.general);
//             } else {
//                 setErrors(["Failed to fetch terms"]);
//             }
//             message.error("Failed to fetch terms");
//         } finally {
//             setLoading(false);
//         }
//     }, [lang]);

//     useEffect(() => {
//         fetchTermsData();
//     }, [fetchTermsData]);


//     // const handleQuillChange = (field: keyof TermsValue, value: string) => {
//     //     const sanitizedValue = DOMPurify.sanitize(value, {
//     //         ALLOWED_ATTR: ["class"], // Allow classes but remove inline styles
//     //     });
//     //     setTermsData((prev) => ({ ...prev!, [field]: sanitizedValue }));
//     // };

//     // const replaceInlineColorsWithClasses = (html: string) => {

//     //     return html.replace(
//     //         /style="color:\s?rgb\((\d+),\s?(\d+),\s?(\d+)\);?"/g,
//     //         (match, r, g, b) => {
//     //             const colorMap: Record<string, string> = {
//     //                 "230, 0, 0": "text-red-600",
//     //                 "0, 0, 255": "text-blue-600",
//     //                 // Add more colors as needed
//     //             };
//     //             const colorClass = colorMap[`${r}, ${g}, ${b}`] || "";
//     //             return colorClass ? `class="${colorClass}"` : "";
//     //         }
//     //     );
//     // };

//     const handleQuillChange = (field: keyof TermsValue, value: string) => {
//         const cleanedValue = replaceInlineColorsWithClasses(value);
//         setTermsData((prev) => ({ ...prev!, [field]: cleanedValue }));
//     };


//     // const handleQuillChange = (field: keyof TermsValue, value: string) => {
//     //     console.log(`Field: ${field}, Value: ${value}`); // Debug log
//     //     if (termsData) {
//     //         setTermsData((prev) => ({ ...prev!, [field]: value }));
//     //     }
//     // };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!termsData) return;

//         setSubmitting(true);
//         setErrors([]);

//         try {
//             console.log("Payload being sent:", { value: termsData }); // Log the payload

//             const token = Cookies.get("access_token");
//             if (!token) {
//                 throw new Error("No access token found");
//             }

//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//                 "Accept-Language": lang,
//             };

//             await axios.post<ApiResponse>(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                 { value: termsData },
//                 { headers }
//             );

//             message.success("Terms updated successfully");
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Failed to update terms:", error);
//             if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//                 setErrors(error.response.data.errors.general);
//             } else {
//                 setErrors(["Failed to update terms"]);
//             }
//             message.error("Failed to update terms");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">
//             <h1 className="text-xl font-semibold mb-4">Terms and Conditions</h1>

//             {errors.length > 0 && (
//                 <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//                     <ul>
//                         {errors.map((err, index) => (
//                             <li key={index}>{err}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4" dir="ltr">
//                     <label htmlFor="terms-ar" className="block font-medium">
//                         Arabic Terms and Conditions
//                     </label>
//                     <QuillEditor
//                         key="ar"
//                         toolbarId="ar" // Add a unique key
//                         value={termsData?.ar || ""}
//                         onChange={(value) => handleQuillChange("ar", value)}
//                     />
//                 </div>

//                 <div className="mb-4" dir="ltr">
//                     <label htmlFor="terms-en" className="block font-medium">
//                         English Terms and Conditions
//                     </label>
//                     <div>
//                         <QuillEditor
//                             key="en"
//                             toolbarId="en" // Add a unique key
//                             value={termsData?.en || ""}
//                             onChange={(value) => handleQuillChange("en", value)}
//                         />
//                     </div>
//                 </div>

//                 <div className="flex space-x-2">
//                     {isEditing ? (
//                         <>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//                             >
//                                 {submitting ? "Saving..." : "Save"}
//                             </button>
//                         </>
//                     ) : (
//                         <button
//                             type="button"
//                             onClick={() => setIsEditing(true)}
//                             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                         >
//                             Edit
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Terms;









// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { message } from "antd";
// import LangUseParams from "../translate/LangUseParams";
// import Cookies from "js-cookie";
// import TiptapEditor from "../tiptab/TiptapEditor";

// // Define the structure of the terms data
// interface TermsValue {
//   ar: string;
//   en: string;
// }

// interface TermsData {
//   id: number;
//   key: string;
//   name: string;
//   value: TermsValue;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiResponse {
//   errors?: { general?: string[] };
//   message: string;
//   data: {
//     data: TermsData[];
//   };
// }

// const Terms: React.FC = () => {
//   const [termsData, setTermsData] = useState<TermsValue>({ ar: "", en: "" });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [errors, setErrors] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const lang = LangUseParams();

//   // Fetch terms data
//   const fetchTermsData = useCallback(async () => {
//     setLoading(true);
//     setErrors([]);

//     try {
//       const token = Cookies.get("access_token");
//       if (!token) throw new Error("No access token found");

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//         "Accept-Language": lang,
//       };

//       const response = await axios.get<ApiResponse>(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//         { headers }
//       );

//       // setTermsData(response.data.data.data[0]?.value || { ar: "", en: "" });
//       setTermsData({
//         ar: response.data.data.data[0]?.value.ar || "<p></p>",
//         en: response.data.data.data[0]?.value.en || "<p></p>",
//       });
      
//     } catch (error) {
//       console.error("Failed to fetch terms:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//         setErrors(error.response.data.errors.general);
//       } else {
//         setErrors(["Failed to fetch terms"]);
//       }
//       message.error("Failed to fetch terms");
//     } finally {
//       setLoading(false);
//     }
//   }, [lang]);

//   useEffect(() => {
//     fetchTermsData();
//   }, [fetchTermsData]);

//   // Handle Tiptap editor changes
//   const handleEditorChange = (field: keyof TermsValue, value: string) => {
//     setTermsData((prev) => ({
//       ...prev!,
//       [field]: value,
//     }));
//   };

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!termsData) return;

//     setSubmitting(true);
//     setErrors([]);

//     try {
//       const token = Cookies.get("access_token");
//       if (!token) throw new Error("No access token found");

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//         "Accept-Language": lang,
//       };

//       await axios.post<ApiResponse>(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//         { value: termsData },
//         { headers }
//       );

//       message.success("Terms updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Failed to update terms:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//         setErrors(error.response.data.errors.general);
//       } else {
//         setErrors(["Failed to update terms"]);
//       }
//       message.error("Failed to update terms");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">
//       <h1 className="text-xl font-semibold mb-4">Terms and Conditions</h1>

//       {errors.length > 0 && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//           <ul>
//             {errors.map((err, index) => (
//               <li key={index}>{err}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Arabic Terms Editor */}
//         <div className="mb-4">
//           <label htmlFor="terms-ar" className="block font-medium">
//             Arabic Terms and Conditions
//           </label>
//           <TiptapEditor
//             key="tiptap-ar"
//             value={termsData.ar}
//             onChange={(value) => handleEditorChange("ar", value)}
//             placeholder="Write Arabic terms and conditions..."
//           />
//         </div>

//         {/* English Terms Editor */}
//         <div className="mb-4">
//           <label htmlFor="terms-en" className="block font-medium">
//             English Terms and Conditions
//           </label>
//           <TiptapEditor
//            key="tiptap-en"
//             value={termsData.en}
//             onChange={(value) => handleEditorChange("en", value)}
//             placeholder="Write English terms and conditions..."
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-2">
//           {isEditing ? (
//             <>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//               >
//                 {submitting ? "Saving..." : "Save"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Edit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Terms;




// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { message } from "antd";
// import LangUseParams from "../translate/LangUseParams";
// import Cookies from "js-cookie";
// import TiptapEditor from "../tiptab/TiptapEditor";

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
//     errors?: { general?: string[] };
//     message: string;
//     data: {
//         data: TermsData[];
//     };
// }

// const Terms: React.FC = () => {
//   const [termsData, setTermsData] = useState<TermsValue | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [errors, setErrors] = useState<string[]>([]);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const lang = LangUseParams();

//   const fetchTermsData = useCallback(async () => {
//     setLoading(true);
//     setErrors([]);

//     try {
//       const token = Cookies.get("access_token");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//         "Accept-Language": lang,
//       };

//       const response = await axios.get<ApiResponse>(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//         { headers }
//       );

//       setTermsData(response.data.data.data[0]?.value || { ar: "", en: "" });
//     } catch (error) {
//       console.error("Failed to fetch terms:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//         setErrors(error.response.data.errors.general);
//       } else {
//         setErrors(["Failed to fetch terms"]);
//       }
//       message.error("Failed to fetch terms");
//     } finally {
//       setLoading(false);
//     }
//   }, [lang]);

//   useEffect(() => {
//     fetchTermsData();
//   }, [fetchTermsData]);

  

//   const handleInputChange = (field: keyof TermsValue, value: string) => {
//     if (termsData) {
//       setTermsData((prev) => ({ ...prev!, [field]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!termsData) return;

//     setSubmitting(true);
//     setErrors([]);

//     try {
//       const token = Cookies.get("access_token");
//       if (!token) {
//         throw new Error("No access token found");
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//         "Accept-Language": lang,
//       };

//       await axios.post<ApiResponse>(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//         { value: termsData },
//         { headers }
//       );

//       message.success("Terms updated successfully");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Failed to update terms:", error);
//       if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//         setErrors(error.response.data.errors.general);
//       } else {
//         setErrors(["Failed to update terms"]);
//       }
//       message.error("Failed to update terms");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">
//       <h1 className="text-xl font-semibold mb-4">Terms and Conditions</h1>

//       {errors.length > 0 && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//           <ul>
//             {errors.map((err, index) => (
//               <li key={index}>{err}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="terms-ar" className="block font-medium">
//             Arabic Terms and Conditions
//           </label>
//           <TiptapEditor
//             value={termsData?.ar || ""}
//             onChange={(value) => handleInputChange("ar", value)}
//             placeholder="Write Arabic terms and conditions..."
//             key="ar-editor"
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="terms-en" className="block font-medium">
//             English Terms and Conditions
//           </label>
//           <TiptapEditor
//             value={termsData?.en || ""}
//             onChange={(value) => handleInputChange("en", value)}
//             placeholder="Write English terms and conditions..."
//             key="en-editor"
//           />
//         </div>

//         <div className="flex space-x-2">
//           {isEditing ? (
//             <>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//               >
//                 {submitting ? "Saving..." : "Save"}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               type="button"
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Edit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Terms;










// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { message } from "antd";
// import LangUseParams from "../translate/LangUseParams";
// import Cookies from "js-cookie";

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
//     errors?: { general?: string[] };
//     message: string;
//     data: {
//         data: TermsData[];
//     };
// }

// const Terms: React.FC = () => {
//     const [termsData, setTermsData] = useState<TermsValue | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [errors, setErrors] = useState<string[]>([]);
//     const [isEditing, setIsEditing] = useState<boolean>(false);
//     const [submitting, setSubmitting] = useState<boolean>(false);
//     const lang = LangUseParams();

//     const fetchTermsData = useCallback(async () => {
//         setLoading(true);
//         setErrors([]);

//         try {
//             const token = Cookies.get("access_token");
//             if (!token) {
//                 throw new Error("No access token found");
//             }

//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//                 "Accept-Language": lang,
//             };

//             const response = await axios.get<ApiResponse>(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                 { headers }
//             );

//             setTermsData(response.data.data.data[0]?.value || { ar: "", en: "" });
//         } catch (error) {
//             console.error("Failed to fetch terms:", error);
//             if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//                 setErrors(error.response.data.errors.general);
//             } else {
//                 setErrors(["Failed to fetch terms"]);
//             }
//             message.error("Failed to fetch terms");
//         } finally {
//             setLoading(false);
//         }
//     }, [lang]);

//     useEffect(() => {
//         fetchTermsData();
//     }, [fetchTermsData]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TermsValue) => {
//         if (termsData) {
//             setTermsData((prev) => ({ ...prev!, [field]: e.target.value }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!termsData) return;

//         setSubmitting(true);
//         setErrors([]);

//         try {
//             const token = Cookies.get("access_token");
//             if (!token) {
//                 throw new Error("No access token found");
//             }

//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 "api-key": process.env.NEXT_PUBLIC_API_KEY!,
//                 "Accept-Language": lang,
//             };

//             await axios.post<ApiResponse>(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/settings?key=terms-and-conditions`,
//                 { value: termsData },
//                 { headers }
//             );

//             message.success("Terms updated successfully");
//             setIsEditing(false);
//         } catch (error) {
//             console.error("Failed to update terms:", error);
//             if (axios.isAxiosError(error) && error.response?.data?.errors?.general) {
//                 setErrors(error.response.data.errors.general);
//             } else {
//                 setErrors(["Failed to update terms"]);
//             }
//             message.error("Failed to update terms");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mt-8 container w-[95%] mx-auto p-4 bg-white shadow-md rounded">





//             <h1 className="text-xl font-semibold mb-4">Terms and Conditions</h1>



//             {errors.length > 0 && (
//                 <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
//                     <ul>
//                         {errors.map((err, index) => (
//                             <li key={index}>{err}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label htmlFor="terms-ar" className="block font-medium">
//                         Arabic Terms and Conditions
//                     </label>
//                     <input
//                         id="terms-ar"
//                         type="text"
//                         value={termsData?.ar || ""}
//                         onChange={(e) => handleInputChange(e, "ar")}
//                         className="w-full p-2 border rounded mt-1"

//                     />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="terms-en" className="block font-medium">
//                         English Terms and Conditions
//                     </label>
//                     <input
//                         id="terms-en"
//                         type="text"
//                         value={termsData?.en || ""}
//                         onChange={(e) => handleInputChange(e, "en")}
//                         className="w-full p-2 border rounded mt-1"

//                     />
//                 </div>

//                 <div className="flex space-x-2">
//                     {isEditing ? (
//                         <>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//                             >
//                                 {submitting ? "Saving..." : "Save"}
//                             </button>
//                         </>
//                     ) : (
//                         <button
//                             type="button"
//                             onClick={() => setIsEditing(true)}
//                             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                         >
//                             Edit
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Terms;




















