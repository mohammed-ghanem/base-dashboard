"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardOutlined, SettingOutlined, UserOutlined, MailOutlined, DownOutlined, InfoCircleOutlined, FileTextOutlined, CaretDownOutlined } from "@ant-design/icons";
import LangUseParams from "@/components/translate/LangUseParams";
import TranslateHook from "@/components/translate/TranslateHook";
import { Spin } from "antd";
import './style.css'

const SideBar = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNavigation = (href: string) => {
    if (pathname === href) return; // Skip if already on the same page

    setLoading(true);
    router.push(href);
  };

  useEffect(() => {
    setLoading(false); // Hide spinner when route changes
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <Spin size="large" className="custom_spinner" />
        </div>
      )}

      <aside className="bg-white text-gray-500 h-screen transition-all duration-300 w-16 md:w-64 p-2 md:p-4">
        <div className="text-center my-2 bg-zinc-950 py-10">logo</div>
        <ul className="space-y-2">
          <li>
            <Link href={`/${lang}`} onClick={() => handleNavigation(`/${lang}`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <DashboardOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/clients`} onClick={() => handleNavigation(`/${lang}/clients`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <UserOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">العملاء</span>
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/roles`} onClick={() => handleNavigation(`/${lang}/roles`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <UserOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">الصلاحيات</span>
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/admins`} onClick={() => handleNavigation(`/${lang}/admins`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <UserOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">مديرين النظام</span>
            </Link>
          </li>
          <li>
            <Link href={`/${lang}/contact-us`} onClick={() => handleNavigation(`/${lang}/contact-us`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <MailOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">اتصل بنا</span>
            </Link>
          </li>
          <li>
            <div
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full text-left flex items-center p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white cursor-pointer"
            >
              <SettingOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">الاعدادات</span>
              <CaretDownOutlined className={`text-base mr-auto transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${isSettingsOpen ? 'max-h-40' : 'max-h-0'}`}
            >
              <ul className="pr-4">
                <li>
                  <Link href={`/${lang}/about`} onClick={() => handleNavigation(`/${lang}/about`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
                    <InfoCircleOutlined className="text-xl ml-2" />
                    <span className="hidden md:inline">عن التطبيق</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/setting/terms`} onClick={() => handleNavigation(`/${lang}/terms`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
                    <FileTextOutlined className="text-xl ml-2" />
                    <span className="hidden md:inline">الشروط والاحكام</span>
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/privacy-policy`} onClick={() => handleNavigation(`/${lang}/terms`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
                    <FileTextOutlined className="text-xl ml-2" />
                    <span className="hidden md:inline">سياسة الخصوصية</span>
                  </Link>
                </li>
                 <li>
                  <Link href={`/${lang}/general-settings`} onClick={() => handleNavigation(`/${lang}/terms`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
                    <FileTextOutlined className="text-xl ml-2" />
                    <span className="hidden md:inline">الاعدادات العامة</span>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SideBar;





// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { DashboardOutlined, SettingOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
// import LangUseParams from "@/components/translate/LangUseParams";
// import TranslateHook from "@/components/translate/TranslateHook";
// import { Spin } from "antd";

// const SideBar = () => {
//   const lang = LangUseParams();
//   const translate = TranslateHook();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(false);

//   const handleNavigation = (href: string) => {
//     if (pathname === href) return; // Skip if already on the same page

//     setLoading(true);
//     router.push(href);
//   };

//   useEffect(() => {
//     setLoading(false); // Hide spinner when route changes
//   }, [pathname]);

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
//           <Spin size="large" className="custom_spinner" />
//         </div>
//       )}

//       <aside className="bg-white text-gray-500 h-screen transition-all duration-300 w-16 md:w-64 p-2 md:p-4">
//         <div className="text-center my-2 bg-zinc-950 py-10">logo</div>
//         <ul className="space-y-2">
//           <li>
//             <Link href={`/${lang}`} onClick={() => handleNavigation(`/${lang}`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <DashboardOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">Dashboard</span>
//             </Link>
//           </li>
//           <li>
//             <Link href="#" onClick={() => handleNavigation("#")} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <SettingOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">Settings</span>
//             </Link>
//           </li>
//           <li>
//             <Link href={`/${lang}/clients`} onClick={() => handleNavigation(`/${lang}/clients`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <UserOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">العملاء</span>
//             </Link>
//           </li>
//           <li>
//             <Link href={`/${lang}/roles`} onClick={() => handleNavigation(`/${lang}/roles`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <UserOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">الصلاحيات</span>
//             </Link>
//           </li>
//           <li>
//             <Link href={`/${lang}/admins`} onClick={() => handleNavigation(`/${lang}/admins`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <UserOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">مدراء النظام</span>
//             </Link>
//           </li>
//           <li>
//             <Link href={`/${lang}/contact-us`} onClick={() => handleNavigation(`/${lang}/contact-us`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//               <MailOutlined className="text-xl ml-2" />
//               <span className="hidden md:inline">اتصل بنا</span>
//             </Link>
//           </li>
//         </ul>
//       </aside>
//     </>
//   );
// };

// export default SideBar;




