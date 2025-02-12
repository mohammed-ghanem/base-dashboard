"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import Swal from "sweetalert2"
import Cookies from 'js-cookie'
import Image from 'next/image' 
import whiteAuthBk from '@/public/assets/images/Vector.svg'
import optImage from '@/public/assets/images/otp.svg'
import TranslateHook from '../../translate/TranslateHook'
import LangUseParams from "@/components/translate/LangUseParams"

const VerifyCode = () => {
    const [otp, setOtp] = useState<string[]>(Array(4).fill("")) // Array of 4 empty strings
    const [email, setEmail] = useState<string | null>(null)
    const [source, setSource] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number>(120) // 2 minutes in seconds
    const router = useRouter()
    const searchParams = useSearchParams()
    // lang param (ar Or en)
    const lang = LangUseParams() // Access dynamic [lang] parameter
    const translate = TranslateHook();

    useEffect(() => {
        const sourceParam = searchParams.get("source") || Cookies.get('source')
        if (sourceParam) {
            setSource(sourceParam)
        }
    }, [searchParams, router, lang])

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
        Swal.fire({
            title: `${translate ? translate.pages.verifyCode.loadingTitle : "please wait ..."}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        })

        const token = Cookies.get('access_token')
        if (!token) {
            setError("User is not authenticated")
            Swal.close()
            return
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/client-api/v1/auth/verify-otp`,
                { email, code: otp.join("") },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            Swal.close()
            Swal.fire({
                icon: 'success',
                title: `${translate ? translate.pages.verifyCode.titleSwal : "Account Verified successfully!"}`,
                text: `${translate ? translate.pages.verifyCode.textSwal : "Your account has been verified successfully, Now login with your email and password."}`,
                confirmButtonText: `${translate ? translate.pages.verifyCode.ok : "ok"}`
            }).then(() => {
                 if (source === "forgot-password") {
                    Cookies.remove('source')
                    router.push(`/${lang}/auth/reset-password`)
                } else {
                    Cookies.remove('source')
                    router.push(`/${lang}`)
                }
            })
        } catch (error: any) {
            Swal.close()
            setError(error.response?.data?.message || "Invalid code. Please try again.")
        }
    }

    const handleResendOtp = async () => {
        setIsButtonDisabled(true)
        Swal.fire({
            title: `${translate ? translate.pages.verifyCode.resendOtptitleSwal : "Resending verification code ..."}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        })
        const token = Cookies.get('access_token') // Retrieve the access token from cookies

        if (!token) {
            Swal.close()
            Swal.fire(`${translate ? translate.pages.verifyCode.notAuthenticated : "Not Authenticated ..."}`)
            setIsButtonDisabled(false) // Re-enable the button if there's an issue
            return
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/client-api/v1/auth/resend-otp`,
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the access token in the headers
                    }
                }
            )
            Swal.close()
            Swal.fire(`${translate ? translate.pages.verifyCode.newOptSent : "new verify code has been sent to your email"}`)
        } catch (error) {
            Swal.close()
            Swal.fire(`${translate ? translate.pages.verifyCode.faildOtp : "Unable to resend verify code. Please try again later"}`)
            setIsButtonDisabled(false) // Re-enable the button if there's an error
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
                        <button type="submit" className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg">
                            {translate ? translate.pages.verifyCode.verifyButton : ""}
                        </button>
                    </form>
                    {/*start resend verify code  */}
                    <div className='text-center'>
                        <p className="ml-2 mainColor font-bold">{translate ? translate.pages.verifyCode.didntGetOtp : "didnt receive a verification code"}</p>
                        <button
                            onClick={handleResendOtp}
                            disabled={isButtonDisabled}
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
