'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { notification } from 'antd'; // Replace message with notification
import { axiosDefaultConfig, axiosWithCredentials } from "@/utils/axiosConfig"
import Link from 'next/link'
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import Image from 'next/image'
import whiteAuthBk from '@/public/assets/images/Vector.svg'
import loginIcon from '@/public/assets/images/loginIcon.svg'
import TranslateHook from '../../translate/TranslateHook';
import LangUseParams from "@/components/translate/LangUseParams"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import the spinner icon

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
  const [loading, setLoading] = useState(false); // Add loading state

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true); // Set loading to true when the form is submitted

    try {
      // Step 1: Get the CSRF token from the backend
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      // Step 2: Make the login request
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/login`, form, {
        headers: {
          'X-XSRF-TOKEN': csrfToken,
          'Api-Key': process.env.NEXT_PUBLIC_API_KEY,
          
        },
        withCredentials: true,
      });

      // Extract necessary fields from the response
      const accessToken = response.data.data.access_token;

      // Store the access token securely in cookies instead of localStorage
      Cookies.set('access_token', accessToken, { expires: 7 }); // Expires in 7 days (optional)

      // Show big success notification
      notification.success({
        message: translate ? translate.pages.signin.LoginSuccessful : "Login Successful!",
        description: translate ? translate.pages.signin.LoginSuccessfulDescription : "You have successfully logged in.",
        placement: "top", // Display at the top of the screen
        duration: 5, // Display for 5 seconds
        style: {
          width: 500, // Set the width of the notification
          fontSize: 16, // Increase font size
          padding: 20, // Add padding
        },
      });

      // Redirect after a delay
      setTimeout(() => {
        window.location.href = `/${lang}/`;
      }, 1000);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          setErrors(`${translate ? translate.pages.signin.InvalidEmailOrPassword : "Invalid Email Or Password"}`);
          // Show big error notification for invalid credentials
          notification.error({
            message: translate ? translate.pages.signin.InvalidEmailOrPassword : "Invalid Email Or Password",
            description: translate ? translate.pages.signin.InvalidEmailOrPasswordDescription : "Please check your email and password and try again.",
            placement: "top", // Display at the top of the screen
            duration: 5, // Display for 5 seconds
            style: {
              width: 500, // Set the width of the notification
              fontSize: 16, // Increase font size
              padding: 20, // Add padding
            },
          });
        } else if (error.code === 'ERR_NETWORK') {
          // Show big error notification for network errors
          notification.error({
            message: translate ? translate.pages.signin.NetworkError : "Network Error",
            description: translate ? translate.pages.signin.NetworkErrorDescription : "Please check your internet connection and try again.",
            placement: "top", // Display at the top of the screen
            duration: 5, // Display for 5 seconds
            style: {
              width: 500, // Set the width of the notification
              fontSize: 16, // Increase font size
              padding: 20, // Add padding
            },
          });
        } else {
          // Show big error notification for other errors
          notification.error({
            message: translate ? translate.pages.signin.SomethingWentWrong : "Something went wrong!",
            description: translate ? translate.pages.signin.SomethingWentWrongDescription : "Please try again later.",
            placement: "top", // Display at the top of the screen
            duration: 5, // Display for 5 seconds
            style: {
              width: 500, // Set the width of the notification
              fontSize: 16, // Increase font size
              padding: 20, // Add padding
            },
          });
        }
      } else {
        console.error("Error", error);
      }
    } finally {
      setLoading(false); // Reset loading state after submission is complete
    }
  };

  return (
    <div className='relative grdianBK' style={{ direction: "rtl" }}>
      <div className=' grid  lg:grid-cols-2 gap-4 items-center'>
        <div className='my-10' style={{ direction: "ltr" }}>
          <h1 className="text-center font-bold text-2xl md:text-4xl mainColor">
            {translate ? translate.pages.signin.loginTitle : ""}
          </h1>
          <form onSubmit={handleSubmit} className="p-4 w-[95%] md:w-[80%] mx-auto z-30 relative">
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
              }>
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
            <a href={`/${lang}/forget-password`} className="border-b border-regal-blue">
              {translate ? translate.pages.signin.forgetPassword : ""}
            </a>
            <div>
              <button
                type="submit"
                className="w-full bkPrimaryColor text-white font-light py-3 px-4 mt-5 rounded-lg flex justify-center items-center"
                disabled={loading} // Disable the button when loading
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> {/* Spinner with spin animation */}
                    {translate ? translate.pages.signin.processing : "Processing..."}
                  </>
                ) : (
                  translate ? translate.pages.signin.loginButton : "Login"
                )}
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
