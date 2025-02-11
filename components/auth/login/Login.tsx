'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { axiosDefaultConfig, axiosWithCredentials } from "@/utils/axiosConfig"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import Image from 'next/image'
import whiteAuthBk from '@/public/assets/images/Vector.svg'
import loginIcon from '@/public/assets/images/loginIcon.svg'
import TranslateHook from '../../translate/TranslateHook';
import LangUseParams from "@/components/translate/LangUseParams"


axiosWithCredentials;
axiosDefaultConfig;



interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  // lang param (ar Or en)
  const lang = LangUseParams() // Access dynamic [lang] parameter
  const translate = TranslateHook();

  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const router = useRouter(); // Use Next.js router for navigation

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Step 1: Get the CSRF token from the backend
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      // Step 2: Make the login request
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/client-api/v1/auth/login`, form, {
        headers: {
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
      });
      // Extract necessary fields from the response
      const accessToken = response.data.data.access_token;
      const isVerified = response.data.data.user.is_verified;
      // Step 3: Check if the user is verified
      if (!isVerified) {
        Swal.fire({
          title: `${translate ? translate.pages.signin.NotVerified : "Account Not Verified !"}`,
          text: `${translate ? translate.pages.signin.newVerifyCode : "Please verify your account !"}`,
          icon: 'warning',
          confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
        });
        return;
      }

      // Store the access token securely in cookies instead of localStorage
      Cookies.set('access_token', accessToken, { expires: 7 }); // Expires in 7 days (optional)
      Cookies.set('is_verified', isVerified, { expires: 7 });


      // Show success message and redirect
      Swal.fire({
        title: `${translate ? translate.pages.signin.LoginSuccessful : "Login Successful!"}`,
        text: `${translate ? translate.pages.signin.redirectHome : "You will be redirected to the home page !"}`,
        icon: 'success',
        confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
      }).then(() => {
        window.location.href = `/${lang}/`
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          setErrors(`${translate ? translate.pages.signin.InvalidEmailOrPassword : "Invalid Email Or Password"}`);
          Swal.fire({
            text: `${translate ? translate.pages.signin.InvalidEmailOrPassword : "Invalid Email Or Password"}`,
            icon: 'error',
            confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
          });
        } else if (error.response?.status === 401) {
          // Resend verification code
          const storeTokenToVerify = error.response?.data.data.access_token
          Cookies.set('access_token', storeTokenToVerify, { expires: 7 }); // Expires in 7 days (optional)
          try {
            // Show success message with SweetAlert2
            Swal.fire({
              title: `${translate ? translate.pages.signin.NotVerified : "Not Verified"}`,
              text: `${translate ? translate.pages.signin.newVerifyCode : " Please verify your account"}`,
              icon: 'warning',
              confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
            }).then(() => {
              //Redirect to the verify code page
              // router.push(`/${lang}/auth/verify-code`);
              window.location.href = `/${lang}/auth/verify-code`
            });
          } catch (resendError) {
            console.error("Error resending verification code", resendError);
            Swal.fire({
              title: `${translate ? translate.pages.signin.Error : "Error"}`,
              text: `${translate ? translate.pages.signin.failedResendCode : "Error"}`,
              icon: 'error',
              confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
            });
          }
        } else if (error.code === 'ERR_NETWORK') {
          Swal.fire({
            text: `${translate ? translate.pages.signin.NetworkError : "Error"}`,
            icon: 'error',
            confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
          });
        } else {
          Swal.fire({
            title: `${translate ? translate.pages.signin.Error : "Error"}`,
            text: `${translate ? translate.pages.signin.SomethingWentWrong : "ok"}`,
            icon: 'error',
            confirmButtonText: `${translate ? translate.pages.signin.ok : "ok"}`
          });
        }
      } else {
        console.error("Error", error);
      }
    }
  };
  return (
    <div className='relative grdianBK' style={{ direction: "rtl" }}>
      <div className=' grid  lg:grid-cols-2 gap-4 items-center'>
        <div className='my-10' style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            {translate ? translate.pages.signin.loginTitle : ""}
          </h1>
          <form onSubmit={handleSubmit}
            className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative">
            <div className="mb-4">
              <label className={`block text-sm font-bold leading-6 mainColor
                                                ${lang === "en" ? 'text-start' : 'text-end'}`
              }>
                {translate ? translate.pages.signin.email : ""}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
              />
              {errors && <p className="text-red-500">{errors}</p>}
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-bold leading-6 mainColor
                                                ${lang === "en" ? 'text-start' : 'text-end'}`
              }
              >

                {translate ? translate.pages.signin.passwordName : ""}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm outline-none"
              />
              {errors && <p className="text-red-500">{errors}</p>}
            </div>
            <Link href={`/${lang}/forget-password`} className="border-b border-regal-blue">
              {translate ? translate.pages.signin.forgetPassword : ""}
            </Link>
            <div>
              <button type="submit"
                className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg">
                {translate ? translate.pages.signin.loginButton : ""}
              </button>
            </div>
          </form>
        </div>
        <div className='relative  lg:block'>
          <div>
            <Image src={whiteAuthBk} className='w-full' height={100} alt='authsvg' />
          </div>
          <Image src={loginIcon} fill className='max-w-[70%] max-h-[50%] m-auto' alt='loginauth' />
        </div>
      </div>
    </div>
  );
}

export default Login;