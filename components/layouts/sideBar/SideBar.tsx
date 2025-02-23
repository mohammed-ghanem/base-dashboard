"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardOutlined, SettingOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import LangUseParams from "@/components/translate/LangUseParams";
import TranslateHook from "@/components/translate/TranslateHook";
import { Spin } from "antd";

const SideBar = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

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
          <Spin size="large" className="custom_spinner"/>
        </div>
      )}

      <aside className="bg-white text-gray-500 h-screen transition-all duration-300 w-16 md:w-64 p-2 md:p-4">
        <div className="text-center my-2 bg-zinc-950 py-10">logo</div>
        <ul className="space-y-2">
          <li>
            <button onClick={() => handleNavigation(`/${lang}`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <DashboardOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("#")} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <SettingOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation(`/${lang}/users`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <UserOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">العملاء</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation(`/${lang}/roles`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <UserOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">الصلاحيات</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation(`/${lang}/contact-us`)} className="w-full text-left flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
              <MailOutlined className="text-xl ml-2" />
              <span className="hidden md:inline">اتصل بنا</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SideBar;







// "use client";

// import Link from "next/link";
// import { DashboardOutlined, SettingOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
// import LangUseParams from "@/components/translate/LangUseParams";
// import TranslateHook from "@/components/translate/TranslateHook";

// const SideBar = () => {
//   // lang
//   const lang = LangUseParams();
//   const translate = TranslateHook();
//   return (
//     <aside className="bg-white text-gray-500 h-screen transition-all duration-300 w-16 md:w-64 p-2 md:p-4 ">
//       <div className="text-center my-2 bg-zinc-950 py-10">logo</div>
//       <ul className="space-y-2">
//         <li>
//           <Link href="/" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//             <DashboardOutlined className="text-xl ml-2" />
//             <span className="hidden md:inline">Dashboard</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="#" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//             <SettingOutlined className="text-xl ml-2" />
//             <span className="hidden md:inline">Settings</span>
//           </Link>
//         </li>
//         <li>
//           <Link prefetch={true} href={`/${lang}/users`} className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//             <UserOutlined className="text-xl ml-2" />
//             <span className="hidden md:inline">العملاء</span> 
//           </Link>
//         </li>
//         <li>
//           <Link prefetch={true} href={`/${lang}/roles`} className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//             <UserOutlined className="text-xl ml-2" />
//             <span className="hidden md:inline">الصلاحيات</span>
//           </Link>
//         </li>
//         <li>
//           <Link href="/contact-us" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
//             <MailOutlined className="text-xl ml-2" />
//             <span className="hidden md:inline">اتصل بنا</span>
//           </Link>
//         </li>
//       </ul>
//     </aside>
//   );
// };

// export default SideBar;
