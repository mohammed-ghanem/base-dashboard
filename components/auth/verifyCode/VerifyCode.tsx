"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import { notification } from "antd" // Replace message with notification
import Cookies from 'js-cookie'
import Image from 'next/image' 
import whiteAuthBk from '@/public/assets/images/Vector.svg'
import optImage from '@/public/assets/images/otp.svg'
import TranslateHook from '../../translate/TranslateHook'
import LangUseParams from "@/components/translate/LangUseParams"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Import FontAwesomeIcon
import { faSpinner } from '@fortawesome/free-solid-svg-icons' // Import the spinner icon

const VerifyCode = () => {
    const [otp, setOtp] = useState<string[]>(Array(4).fill("")) // Array of 4 empty strings
    const [email, setEmail] = useState<string | null>(null)
    const [source, setSource] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes in seconds
    const [loading, setLoading] = useState<boolean>(false) // Add loading state for the submit button
    const router = useRouter()
    const searchParams = useSearchParams()
    // lang param (ar Or en)
    const lang = LangUseParams() // Access dynamic [lang] parameter
    const translate = TranslateHook();

    useEffect(() => {
        // Retrieve email and access_token from query parameters
        const emailParam = searchParams.get("email");
        const accessTokenParam = searchParams.get("access_token");
        const sourceParam = searchParams.get("source") || Cookies.get('source');

        if (emailParam) {
            setEmail(emailParam);
        }
        if (sourceParam) {
            setSource(sourceParam);
        }
    }, [searchParams, router, lang]);

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

    // Timer for resend OTP button
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isButtonDisabled && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsButtonDisabled(false)
            setTimeLeft(120) // Reset time for the next resend
        }
        return () => clearInterval(timer)
    }, [isButtonDisabled, timeLeft])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Move to the next input field if a digit is entered
            if (value && index < otp.length - 1) {
                (e.target.nextElementSibling as HTMLInputElement)?.focus()
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = e.target as HTMLInputElement
                ; (prevInput.previousElementSibling as HTMLInputElement)?.focus()
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true) // Enable loading state for the submit button

        // Retrieve access_token from query parameters
        const accessToken = searchParams.get("access_token");

        if (!accessToken) {
            setError("User is not authenticated")
            notification.error({
                message: translate ? translate.pages.verifyCode.notAuthenticated : "Not Authenticated",
                description: translate ? translate.pages.verifyCode.notAuthenticatedDescription : "Please log in to continue.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });
            setLoading(false) // Disable loading state
            return
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/verify-otp`,
                { email, code: otp.join("") },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )

            // Show big success notification
            notification.success({
                message: translate ? translate.pages.verifyCode.titleSwal : "Account Verified Successfully!",
                description: translate ? translate.pages.verifyCode.textSwal : "Your account has been verified successfully.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });

            if (source === "forgot-password") {
                Cookies.remove('source')
                // Replace the current history entry with the reset-password page
                router.replace(`/${lang}/reset-password?access_token=${accessToken}`); // Use replace instead of push
            } else {
                Cookies.remove('source')
                // Replace the current history entry with the home page
                router.replace(`/${lang}`) // Use replace instead of push
            }
        } catch (error: any) {
            // Show big error notification
            notification.error({
                message: translate ? translate.pages.verifyCode.faildOtp : "Invalid Code",
                description: error.response?.data?.message || "Invalid code. Please try again.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });
            setError(error.response?.data?.message || "Invalid code. Please try again.")
        } finally {
            setLoading(false) // Disable loading state
        }
    }

    const handleResendOtp = async () => {
        setIsButtonDisabled(true)
        setLoading(true) // Enable loading state for the resend button

        // Retrieve access_token from query parameters
        const accessToken = searchParams.get("access_token");

        if (!accessToken) {
            notification.error({
                message: translate ? translate.pages.verifyCode.notAuthenticated : "Not Authenticated",
                description: translate ? translate.pages.verifyCode.notAuthenticatedDescription : "Please log in to continue.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });
            setIsButtonDisabled(false) // Re-enable the button if there's an issue
            setLoading(false) // Disable loading state
            return
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/resend-otp`,
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Include the access token in the headers
                    }
                }
            )
            // Show big success notification
            notification.success({
                message: translate ? translate.pages.verifyCode.newOptSent : "New Verification Code Sent!",
                description: translate ? translate.pages.verifyCode.newOptSentDescription : "A new verification code has been sent to your email.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });
        } catch (error) {
            // Show big error notification
            notification.error({
                message: translate ? translate.pages.verifyCode.faildOtp : "Failed to Resend Code",
                description: translate ? translate.pages.verifyCode.faildOtpDescription : "Unable to resend the verification code. Please try again later.",
                placement: "top", // Display at the top of the screen
                duration: 5, // Display for 5 seconds
                style: {
                    width: 500, // Set the width of the notification
                    fontSize: 16, // Increase font size
                    padding: 20, // Add padding
                },
            });
        } finally {
            setIsButtonDisabled(false) // Re-enable the button
            setLoading(false) // Disable loading state
        }
    }

    return (
        <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div className="my-10" style={{ direction: "ltr" }}>
                    <div>
                        <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
                            {translate ? translate.pages.verifyCode.title : ""}
                        </h1>
                        <p className="text-center mt-3 mainColor text-lg md:text-2xl">
                            {translate ? translate.pages.verifyCode.titleDescription : ""}
                        </p>
                    </div>
                    <form onSubmit={handleVerifyCode}
                        className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-16 p-2 border border-gray-300 rounded-md shadow-sm text-center outline-none"
                                    required
                                />
                            ))}
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
                                    {translate ? translate.pages.verifyCode.processing : "Processing..."}
                                </>
                            ) : (
                                translate ? translate.pages.verifyCode.verifyButton : "Verify"
                            )}
                        </button>
                    </form>
                    {/*start resend verify code  */}
                    <div className='text-center'>
                        <p className="ml-2 mainColor font-bold">{translate ? translate.pages.verifyCode.didntGetOtp : "Didn't receive a verification code?"}</p>
                        <button
                            onClick={handleResendOtp} // Directly call handleResendOtp
                            disabled={isButtonDisabled || loading} // Disable button when loading or disabled
                            className={`mt-3 py-3 px-4 rounded-lg font-bold text-sm ${isButtonDisabled ? "text-red-700" : " text-blue-600"}`}
                        >
                            {isButtonDisabled ? `${translate ? translate.pages.verifyCode.resendNewOtp : "Resend New OTP"}
            
            ${translate ? translate.pages.verifyCode.in : ""}

            ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`
                                : `${translate ? translate.pages.verifyCode.resendNewOtp : "Resend New OTP"}`
                            }
                        </button>
                    </div>
                    {/*end resend verify code  */}

                </div>
                <div className="relative">
                    <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
                    <Image src={optImage} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
                </div>
            </div>
        </div>
    )
}

// i make verify code in SuspenseWrapper coz the vercl server didnt work without it
const SuspenseWrapper = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <VerifyCode />
    </Suspense>
)

export default SuspenseWrapper








// "use client"
// import { useState, useEffect, Suspense } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import axios from "axios"
// import { notification } from "antd" // Replace message with notification
// import Cookies from 'js-cookie'
// import Image from 'next/image' 
// import whiteAuthBk from '@/public/assets/images/Vector.svg'
// import optImage from '@/public/assets/images/otp.svg'
// import TranslateHook from '../../translate/TranslateHook'
// import LangUseParams from "@/components/translate/LangUseParams"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' // Import FontAwesomeIcon
// import { faSpinner } from '@fortawesome/free-solid-svg-icons' // Import the spinner icon

// const VerifyCode = () => {
//     const [otp, setOtp] = useState<string[]>(Array(4).fill("")) // Array of 4 empty strings
//     const [email, setEmail] = useState<string | null>(null)
//     const [source, setSource] = useState<string | null>(null)
//     const [error, setError] = useState<string | null>(null)
//     const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
//     const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes in seconds
//     const [loading, setLoading] = useState<boolean>(false) // Add loading state for the submit button
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     // lang param (ar Or en)
//     const lang = LangUseParams() // Access dynamic [lang] parameter
//     const translate = TranslateHook();

//     useEffect(() => {
//         // Retrieve email and access_token from query parameters
//         const emailParam = searchParams.get("email");
//         const accessTokenParam = searchParams.get("access_token");
//         const sourceParam = searchParams.get("source") || Cookies.get('source');

//         if (emailParam) {
//             setEmail(emailParam);
//         }
//         if (sourceParam) {
//             setSource(sourceParam);
//         }
//     }, [searchParams, router, lang]);

//     // Timer for resend OTP button
//     useEffect(() => {
//         let timer: NodeJS.Timeout
//         if (isButtonDisabled && timeLeft > 0) {
//             timer = setInterval(() => {
//                 setTimeLeft((prevTime) => prevTime - 1)
//             }, 1000)
//         } else if (timeLeft === 0) {
//             setIsButtonDisabled(false)
//             setTimeLeft(120) // Reset time for the next resend
//         }
//         return () => clearInterval(timer)
//     }, [isButtonDisabled, timeLeft])

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//         const { value } = e.target
//         if (/^[0-9]$/.test(value) || value === "") {
//             const newOtp = [...otp]
//             newOtp[index] = value
//             setOtp(newOtp)

//             // Move to the next input field if a digit is entered
//             if (value && index < otp.length - 1) {
//                 (e.target.nextElementSibling as HTMLInputElement)?.focus()
//             }
//         }
//     }

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             const prevInput = e.target as HTMLInputElement
//                 ; (prevInput.previousElementSibling as HTMLInputElement)?.focus()
//         }
//     }

//     const handleVerifyCode = async (e: React.FormEvent) => {
//         e.preventDefault()
//         setError(null)
//         setLoading(true) // Enable loading state for the submit button

//         // Retrieve access_token from query parameters
//         const accessToken = searchParams.get("access_token");

//         if (!accessToken) {
//             setError("User is not authenticated")
//             notification.error({
//                 message: translate ? translate.pages.verifyCode.notAuthenticated : "Not Authenticated",
//                 description: translate ? translate.pages.verifyCode.notAuthenticatedDescription : "Please log in to continue.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });
//             setLoading(false) // Disable loading state
//             return
//         }

//         try {
//             await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/verify-otp`,
//                 { email, code: otp.join("") },
//                 { headers: { Authorization: `Bearer ${accessToken}` } }
//             )

//             // Show big success notification
//             notification.success({
//                 message: translate ? translate.pages.verifyCode.titleSwal : "Account Verified Successfully!",
//                 description: translate ? translate.pages.verifyCode.textSwal : "Your account has been verified successfully.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });

//             if (source === "forgot-password") {
//                 Cookies.remove('source')
//                 router.push(`/${lang}/reset-password?access_token=${accessToken}`);
//             } else {
//                 Cookies.remove('source')
//                 router.push(`/${lang}`)
//             }
//         } catch (error: any) {
//             // Show big error notification
//             notification.error({
//                 message: translate ? translate.pages.verifyCode.faildOtp : "Invalid Code",
//                 description: error.response?.data?.message || "Invalid code. Please try again.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });
//             setError(error.response?.data?.message || "Invalid code. Please try again.")
//         } finally {
//             setLoading(false) // Disable loading state
//         }
//     }

//     const handleResendOtp = async () => {
//         setIsButtonDisabled(true)
//         setLoading(true) // Enable loading state for the resend button

//         // Retrieve access_token from query parameters
//         const accessToken = searchParams.get("access_token");

//         if (!accessToken) {
//             notification.error({
//                 message: translate ? translate.pages.verifyCode.notAuthenticated : "Not Authenticated",
//                 description: translate ? translate.pages.verifyCode.notAuthenticatedDescription : "Please log in to continue.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });
//             setIsButtonDisabled(false) // Re-enable the button if there's an issue
//             setLoading(false) // Disable loading state
//             return
//         }

//         try {
//             await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/resend-otp`,
//                 { email },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}` // Include the access token in the headers
//                     }
//                 }
//             )
//             // Show big success notification
//             notification.success({
//                 message: translate ? translate.pages.verifyCode.newOptSent : "New Verification Code Sent!",
//                 description: translate ? translate.pages.verifyCode.newOptSentDescription : "A new verification code has been sent to your email.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });
//         } catch (error) {
//             // Show big error notification
//             notification.error({
//                 message: translate ? translate.pages.verifyCode.faildOtp : "Failed to Resend Code",
//                 description: translate ? translate.pages.verifyCode.faildOtpDescription : "Unable to resend the verification code. Please try again later.",
//                 placement: "top", // Display at the top of the screen
//                 duration: 5, // Display for 5 seconds
//                 style: {
//                     width: 500, // Set the width of the notification
//                     fontSize: 16, // Increase font size
//                     padding: 20, // Add padding
//                 },
//             });
//         } finally {
//             setIsButtonDisabled(false) // Re-enable the button
//             setLoading(false) // Disable loading state
//         }
//     }

//     return (
//         <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
//             <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
//                 <div className="my-10" style={{ direction: "ltr" }}>
//                     <div>
//                         <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
//                             {translate ? translate.pages.verifyCode.title : ""}
//                         </h1>
//                         <p className="text-center mt-3 mainColor text-lg md:text-2xl">
//                             {translate ? translate.pages.verifyCode.titleDescription : ""}
//                         </p>
//                     </div>
//                     <form onSubmit={handleVerifyCode}
//                         className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6">
//                         <div className="flex justify-center gap-2">
//                             {otp.map((digit, index) => (
//                                 <input
//                                     key={index}
//                                     type="text"
//                                     maxLength={1}
//                                     value={digit}
//                                     onChange={(e) => handleInputChange(e, index)}
//                                     onKeyDown={(e) => handleKeyDown(e, index)}
//                                     className="w-16 p-2 border border-gray-300 rounded-md shadow-sm text-center outline-none"
//                                     required
//                                 />
//                             ))}
//                         </div>
//                         {error && <p className="text-red-500">{error}</p>}
//                         <button
//                             type="submit"
//                             className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg flex justify-center items-center"
//                             disabled={loading} // Disable button when loading
//                         >
//                             {loading ? (
//                                 <>
//                                     <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> {/* Spinner with spin animation */}
//                                     {translate ? translate.pages.verifyCode.processing : "Processing..."}
//                                 </>
//                             ) : (
//                                 translate ? translate.pages.verifyCode.verifyButton : "Verify"
//                             )}
//                         </button>
//                     </form>
//                     {/*start resend verify code  */}
//                     <div className='text-center'>
//                         <p className="ml-2 mainColor font-bold">{translate ? translate.pages.verifyCode.didntGetOtp : "Didn't receive a verification code?"}</p>
//                         <button
//                             onClick={handleResendOtp} // Directly call handleResendOtp
//                             disabled={isButtonDisabled || loading} // Disable button when loading or disabled
//                             className={`mt-3 py-3 px-4 rounded-lg font-bold text-sm ${isButtonDisabled ? "text-red-700" : " text-blue-600"}`}
//                         >
//                             {isButtonDisabled ? `${translate ? translate.pages.verifyCode.resendNewOtp : "Resend New OTP"}
            
//             ${translate ? translate.pages.verifyCode.in : ""}

//             ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`
//                                 : `${translate ? translate.pages.verifyCode.resendNewOtp : "Resend New OTP"}`
//                             }
//                         </button>
//                     </div>
//                     {/*end resend verify code  */}

//                 </div>
//                 <div className="relative">
//                     <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
//                     <Image src={optImage} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// // i make verify code in SuspenseWrapper coz the vercl server didnt work without it
// const SuspenseWrapper = () => (
//     <Suspense fallback={<div>Loading...</div>}>
//         <VerifyCode />
//     </Suspense>
// )

// export default SuspenseWrapper