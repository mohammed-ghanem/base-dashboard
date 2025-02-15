"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { notification } from "antd" // Replace message with notification
import Image from 'next/image'
import whiteAuthBk from '@/public/assets/images/Vector.svg'
import restpass from '@/public/assets/images/restpass.svg'
import TranslateHook from '../../translate/TranslateHook'
import LangUseParams from "@/components/translate/LangUseParams"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Import FontAwesomeIcon
import { faSpinner } from '@fortawesome/free-solid-svg-icons' // Import the spinner icon

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false) // Add loading state
    const router = useRouter()
    const searchParams = useSearchParams()
    // lang param (ar Or en)
    const lang = LangUseParams() // Access dynamic [lang] parameter
    const translate = TranslateHook()

    // Retrieve access_token from query parameters
    const accessToken = searchParams.get("access_token")

    useEffect(() => {
        const preventBackNavigation = () => {
            window.history.pushState(null, "", window.location.href);
        };
    
        // Add the current state to the history stack
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventBackNavigation);
    
        return () => {
            window.removeEventListener("popstate", preventBackNavigation);
        };
    }, []);

    const handleResetPassword = async () => {
        // Clear previous errors
        setError(null)

        // Validate password confirmation
        if (newPassword !== passwordConfirmation) {
            setError("Passwords do not match.")
            return
        }

        if (!accessToken) {
            setError("User is not authenticated.")
            return
        }

        setLoading(true) // Enable loading state

        try {
            // Make the API request to reset the password
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/reset-password`, {
                password: newPassword,
                password_confirmation: passwordConfirmation
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Use the access_token from query parameters
                }
            })

            // Show big success notification
            notification.success({
                message: translate ? translate.pages.restPassword.resetSuccessful : "Password Reset Successful!",
                description: translate ? translate.pages.restPassword.resetSuccessfulDescription : "Your password has been reset successfully.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });

            // Clear the form and redirect to sign-in page
            setNewPassword("")
            setPasswordConfirmation("")
            router.replace(`/${lang}/login`) // Use replace instead of push to prevent back navigation
        } catch (error: any) {
            // Show big error notification
            notification.error({
                message: translate ? translate.pages.restPassword.errorTitle : "An Error Occurred",
                description: error.response?.data?.message || "An error occurred while resetting the password.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });

            setError(error.response?.data?.message || "An error occurred while resetting the password.")
        } finally {
            setLoading(false) // Disable loading state
        }
    }

    return (
        <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div className="my-10" style={{ direction: "ltr" }}>
                    <div>
                        <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
                            {translate ? translate.pages.restPassword.title : ""}
                        </h1>
                        <p className="text-center mt-3 mainColor text-lg md:text-2xl">
                            {translate ? translate.pages.restPassword.titleDescription : ""}
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Prevent default form submission
                            handleResetPassword(); // Call the reset password function
                        }}
                        className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6"
                    >
                        <div>
                            <label
                                className={`block text-sm font-bold leading-6 mainColor mb-3
                            ${lang === "en" ? 'text-start' : 'text-end'}`}>
                                {translate ? translate.pages.restPassword.password : ""}
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className={`block text-sm font-bold leading-6 mainColor my-3
                            ${lang === "en" ? 'text-start' : 'text-end'}`}>
                                {translate ? translate.pages.restPassword.confirmPassword : ""}
                            </label>
                            <input
                                type="password"
                                id="password-confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
                                required
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg flex justify-center items-center"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> {/* Spinner with spin animation */}
                                    {translate ? translate.pages.restPassword.processing : "Processing..."}
                                </>
                            ) : (
                                translate ? translate.pages.restPassword.sendRestPassword : "Reset Password"
                            )}
                        </button>
                    </form>
                </div>
                <div className="relative">
                    <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
                    <Image src={restpass} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
                </div>
            </div>
        </div>
    )
}

export default ResetPassword


// "use client"
// import { useState } from "react"
// import axios from "axios"
// import { useRouter, useSearchParams } from "next/navigation"
// import { message, Popconfirm } from "antd" // Import Ant Design's message and Popconfirm
// import Image from 'next/image'
// import whiteAuthBk from '@/public/assets/images/Vector.svg'
// import restpass from '@/public/assets/images/restpass.svg'
// import TranslateHook from '../../translate/TranslateHook'
// import LangUseParams from "@/components/translate/LangUseParams"

// const ResetPassword = () => {
//     const [newPassword, setNewPassword] = useState<string>("")
//     const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
//     const [error, setError] = useState<string | null>(null)
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     // lang param (ar Or en)
//     const lang = LangUseParams() // Access dynamic [lang] parameter
//     const translate = TranslateHook()

//     // Retrieve access_token from query parameters
//     const accessToken = searchParams.get("access_token")

//     const handleResetPassword = async () => { // Remove the `e` parameter
//         // Clear previous errors
//         setError(null)

//         // Validate password confirmation
//         if (newPassword !== passwordConfirmation) {
//             setError("Passwords do not match.")
//             return
//         }

//         if (!accessToken) {
//             setError("User is not authenticated.")
//             return
//         }

//         try {
//             // Make the API request to reset the password
//             await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/reset-password`, {
//                 password: newPassword,
//                 password_confirmation: passwordConfirmation
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}` // Use the access_token from query parameters
//                 }
//             })

//             // Show success message with Ant Design's message
//             message.success(translate ? translate.pages.restPassword.resetSuccessful : "Password Reset Successful!")

//             // Clear the form and redirect to sign-in page
//             setNewPassword("")
//             setPasswordConfirmation("")
//             router.push(`/${lang}/login`)

//         } catch (error: any) {
//             // Handle and show error
//             setError(error.response?.data?.message || "An error occurred while resetting the password.")
//             message.error(error.response?.data?.message || "An error occurred while resetting the password.")
//         }
//     }

//     return (
//         <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
//             <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
//                 <div className="my-10" style={{ direction: "ltr" }}>
//                     <div>
//                         <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
//                             {translate ? translate.pages.restPassword.title : ""}
//                         </h1>
//                         <p className="text-center mt-3 mainColor text-lg md:text-2xl">
//                             {translate ? translate.pages.restPassword.titleDescription : ""}
//                         </p>
//                     </div>
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault(); // Prevent default form submission
//                             handleResetPassword(); // Call the reset password function
//                         }}
//                         className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6"
//                     >
//                         <div>
//                             <label
//                                 className={`block text-sm font-bold leading-6 mainColor mb-3
//                             ${lang === "en" ? 'text-start' : 'text-end'}`}>
//                                 {translate ? translate.pages.restPassword.password : ""}
//                             </label>
//                             <input
//                                 type="password"
//                                 id="new-password"
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label
//                                 className={`block text-sm font-bold leading-6 mainColor my-3
//                             ${lang === "en" ? 'text-start' : 'text-end'}`}>
//                                 {translate ? translate.pages.restPassword.confirmPassword : ""}
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password-confirmation"
//                                 value={passwordConfirmation}
//                                 onChange={(e) => setPasswordConfirmation(e.target.value)}
//                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
//                                 required
//                             />
//                         </div>

//                         {error && <p className="text-red-500">{error}</p>}

//                         <Popconfirm
//                             title={translate ? translate.pages.restPassword.confirmReset : "Are you sure you want to reset your password?"}
//                             onConfirm={handleResetPassword} // Use the updated function
//                             okText="Yes"
//                             cancelText="No"
//                         >
//                             <button
//                                 type="submit"
//                                 className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg"
//                             >
//                                 {translate ? translate.pages.restPassword.sendRestPassword : ""}
//                             </button>
//                         </Popconfirm>
//                     </form>
//                 </div>
//                 <div className="relative">
//                     <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
//                     <Image src={restpass} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ResetPassword



// "use client"
// import { useState } from "react"
// import axios from "axios"
// import { useRouter, useSearchParams } from "next/navigation"
// import Swal from "sweetalert2"
// import Image from 'next/image'
// import whiteAuthBk from '@/public/assets/images/Vector.svg'
// import restpass from '@/public/assets/images/restpass.svg'
// import TranslateHook from '../../translate/TranslateHook'
// import LangUseParams from "@/components/translate/LangUseParams"

// const ResetPassword = () => {
//     const [newPassword, setNewPassword] = useState<string>("")
//     const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
//     const [error, setError] = useState<string | null>(null)
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     // lang param (ar Or en)
//     const lang = LangUseParams() // Access dynamic [lang] parameter
//     const translate = TranslateHook()

//     // Retrieve access_token from query parameters
//     const accessToken = searchParams.get("access_token")

//     const handleResetPassword = async (e: React.FormEvent) => {
//         e.preventDefault()

//         // Clear previous errors
//         setError(null)

//         // Validate password confirmation
//         if (newPassword !== passwordConfirmation) {
//             setError("Passwords do not match.")
//             return
//         }

//         if (!accessToken) {
//             setError("User is not authenticated.")
//             return
//         }

//         try {
//             // Make the API request to reset the password
//             await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/reset-password`, {
//                 password: newPassword,
//                 password_confirmation: passwordConfirmation
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}` // Use the access_token from query parameters
//                 }
//             })

//             // Show success message with SweetAlert2
//             Swal.fire({
//                 icon: 'success',
//                 title: `${translate ? translate.pages.restPassword.resetSuccessful : "Password Reset Successful !"}`,
//                 text: `${translate ? translate.pages.restPassword.textReLogin : "You can now login with your new password !"}`,
//                 confirmButtonText: `${translate ? translate.pages.signin.ok : "OK"}`
//             }).then(() => {
//                 // Clear the form and redirect to sign-in page
//                 setNewPassword("")
//                 setPasswordConfirmation("")
//                 router.push(`/${lang}/login`)
//             })

//         } catch (error: any) {
//             // Handle and show error
//             setError(error.response?.data?.message || "An error occurred while resetting the password.")
//         }
//     }

//     return (
//         <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
//             <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
//                 <div className="my-10" style={{ direction: "ltr" }}>
//                     <div>
//                         <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
//                             {translate ? translate.pages.restPassword.title : ""}
//                         </h1>
//                         <p className="text-center mt-3 mainColor text-lg md:text-2xl">
//                             {translate ? translate.pages.restPassword.titleDescription : ""}
//                         </p>
//                     </div>
//                     <form onSubmit={handleResetPassword}
//                         className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6">
//                         <div>
//                             <label
//                                 className={`block text-sm font-bold leading-6 mainColor mb-3
//                             ${lang === "en" ? 'text-start' : 'text-end'}`}>
//                                 {translate ? translate.pages.restPassword.password : ""}
//                             </label>
//                             <input
//                                 type="password"
//                                 id="new-password"
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label
//                                 className={`block text-sm font-bold leading-6 mainColor my-3
//                             ${lang === "en" ? 'text-start' : 'text-end'}`}>
//                                 {translate ? translate.pages.restPassword.confirmPassword : ""}
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password-confirmation"
//                                 value={passwordConfirmation}
//                                 onChange={(e) => setPasswordConfirmation(e.target.value)}
//                                 className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
//                                 required
//                             />
//                         </div>

//                         {error && <p className="text-red-500">{error}</p>}

//                         <button
//                             type="submit"
//                             className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg"
//                         >
//                             {translate ? translate.pages.restPassword.sendRestPassword : ""}
//                         </button>
//                     </form>
//                 </div>
//                 <div className="relative">
//                     <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
//                     <Image src={restpass} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ResetPassword