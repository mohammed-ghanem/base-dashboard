"use client";

import { useState } from "react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");

  return (
    <div dir="rtl" className="flex h-screen flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-white p-4 shadow-lg w-full fixed top-0 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold">{activePage}</h1>
      </header>

      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 right-0 z-30 w-64 bg-gray-900 text-white transition-transform transform ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0 lg:relative lg:shadow-lg h-full`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16">
            <span className="text-lg font-semibold">Dashboard</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              ✕
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setActivePage("Home");
                setSidebarOpen(false);
              }}
              className="block p-3 rounded-md hover:bg-gray-800 w-full text-right"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActivePage("Profile");
                setSidebarOpen(false);
              }}
              className="block p-3 rounded-md hover:bg-gray-800 w-full text-right"
            >
              Profile
            </button>
            <button
              onClick={() => {
                setActivePage("Settings");
                setSidebarOpen(false);
              }}
              className="block p-3 rounded-md hover:bg-gray-800 w-full text-right"
            >
              Settingsss
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col w-full">
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 bg-gray-100">
            {activePage === "Home" && <div>Home Content</div>}
            {activePage === "Profile" && <div>Profile Content</div>}
            {activePage === "Settings" && <div>Settings Content</div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;