"use client";
import React from "react";
import Link from "next/link";
import { DashboardOutlined, SettingOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";

const SideBar = () => {
  return (
    <aside className="bg-white text-gray-500 h-screen transition-all duration-300 w-16 md:w-64 p-2 md:p-4 ">
      <div className="text-center my-2 bg-zinc-950 py-10">logo</div>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
            <DashboardOutlined className="text-xl ml-2" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="#" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
            <SettingOutlined className="text-xl ml-2" />
            <span className="hidden md:inline">Settings</span>
          </Link>
        </li>
        <li>
          <Link prefetch={true} href="/users" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
            <UserOutlined className="text-xl ml-2" />
            <span className="hidden md:inline">العملاء</span>
          </Link>
        </li>
        <li>
          <Link href="/contact-us" className="flex items-center space-x-3 p-2 rounded transition duration-200 hover:bg-[#398AB7] hover:text-white">
            <MailOutlined className="text-xl ml-2" />
            <span className="hidden md:inline">اتصل بنا</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
