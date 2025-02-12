"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import Cookies from "js-cookie" // Import js-cookie library
import Image from 'next/image';
import whiteAuthBk from '@/public/assets/images/Vector.svg';
import restpass from '@/public/assets/images/restpass.svg';
import TranslateHook from '../../translate/TranslateHook';
import LangUseParams from "@/components/translate/LangUseParams"

const RestPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    // lang param (ar Or en)
    const lang = LangUseParams() // Access dynamic [lang] parameter
    const translate = TranslateHook();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        // Clear previous errors
        setError(null)

        // Validate password confirmation
        if (newPassword !== passwordConfirmation) {
            setError("Passwords do not match.")
            return
        }

        const token = Cookies.get("access_token") // Retrieve token from cookies

        if (!token) {
            setError("User is not authenticated.")
            return
        }

        try {
            // Make the API request to reset the password
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/client-api/v1/auth/reset-password`, {
                password: newPassword,
                password_confirmation: passwordConfirmation
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                    // Pass the access_token from cookies in the header
                }
            })

            // Show success message with SweetAlert2
            Swal.fire({
                icon: 'success',
                title: `${translate ? translate.pages.restPassword.resetSuccessful : "Password Reset Successful !"}`,
                text: `${translate ? translate.pages.restPassword.textReLogin : "You can now login with your new password !"}`,
                confirmButtonText: `${translate ? translate.pages.signin.ok : "OK"}`
            }).then(() => {
                // Clear the form and redirect to sign-in page
                setNewPassword("")
                setPasswordConfirmation("")
                Cookies.remove("access_token") // Optionally clear token after password reset
                router.push(`/${lang}/auth/signin`)
            })

        } catch (error: any) {
            // Handle and show error
            setError(error.response?.data?.message || "An error occurred while resetting the password.")
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
                    <form onSubmit={handleResetPassword}
                        className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6">
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
                            className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg"
                        >
                            {translate ? translate.pages.restPassword.sendRestPassword : ""}
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

export default RestPassword