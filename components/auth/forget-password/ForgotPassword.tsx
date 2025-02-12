"use client"
import { useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useParams, useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import Image from 'next/image';
import whiteAuthBk from '@/public/assets/images/Vector.svg';
import forgetPass from '@/public/assets/images/forgetPass.svg';
import TranslateHook from '../../translate/TranslateHook'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();
  const { lang }: { lang?: string } = useParams();
  const translate = TranslateHook();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Show loading indicator
    Swal.fire({
      title: `${translate ? translate.pages.changePassword.loadingTitle : "Please wait..."}`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/client-api/v1/auth/forget-password`, {
        email: email
      });

      const { access_token } = response.data.data;
      Cookies.set('access_token', access_token, { expires: 1, secure: true, sameSite: 'Strict' });

      // Show success message and close loading indicator
      Swal.fire({
        icon: 'success',
        title: `${translate ? translate.pages.forgotPassword.VerificationLinkSent : "Verification link sent!"}`,
        text: `${translate ? translate.pages.forgotPassword.checkEmail : "Please check your email."}`,
        confirmButtonText: `${translate ? translate.pages.signin.ok : "OK"}`
      }).then(() => {
        Cookies.set('source', 'forgot-password');
        router.push(`/${lang}/verify-code?email=${email}`);
      });
    } catch (error: any) {
      Swal.close(); // Close loading indicator in case of an error
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative grdianBK overflow-hidden" style={{ direction: "rtl" }}>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <div className="my-10" style={{ direction: "ltr" }}>
          <div>
            <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
              {translate ? translate.pages.forgotPassword.title : ""}
            </h1>
            <p className="text-center mt-3 mainColor text-lg md:text-2xl">
              {translate ? translate.pages.forgotPassword.titleDescription : ""}
            </p>
          </div>
          <form onSubmit={handleForgotPassword}
            className="p-4 w-[95%] md:w-[80%] mx-auto z-50 relative my-6">
            <div>
              <label
                className={`block text-sm font-bold leading-6 mainColor mb-3 ${lang === "en" ? 'text-start' : 'text-end'}`}>
                {translate ? translate.pages.signin.email : ""}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg"
            >
              {translate ? translate.pages.forgotPassword.sendVerifyCode : ""}
            </button>
          </form>
        </div>
        <div className="relative">
          <Image src={whiteAuthBk} className="w-full" height={100} alt="authsvg" />
          <Image src={forgetPass} fill className="max-w-[70%] max-h-[50%] m-auto" alt="loginauth" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;