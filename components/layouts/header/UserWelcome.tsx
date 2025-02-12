"use client"
import React, { useEffect, useState } from "react";
import { Dropdown, message } from "antd"; // Import Ant Design components
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import type { MenuProps } from "antd"; // Import MenuProps type

const UserWelcome = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ user: any } | null>(null); // State to store user data
    const [loading, setLoading] = useState<boolean>(true); // Loading state



    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get("access_token"); // Get the access token from cookies
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the request headers
                    },
                });
                setUser(response.data.data); // Set the user data in the state
            } catch (error: any) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false); // Set loading to false when the request is complete
            }
        };

        fetchProfile();
    }, []);

    // Handle logout
    const handleLogout = () => {
        Cookies.remove("access_token"); // Remove the access token
        message.success("You have been logged out."); // Show success message
        router.push("/login"); // Redirect to login page
    };

    // Dropdown menu items
    const items: MenuProps["items"] = [

        {
            key: "edit Profile",
            label: "Edit Profile",
            onClick: () => router.push("/edit-profile"),
        },
        {
            key: "profile",
            label: "Profile",
            onClick: () => router.push("/profile"),
        },
        {
            key: "changePassword",
            label: "Change Password",
            onClick: () => router.push("/change-password"),
        },
        {
            key: "setting",
            label: "Setting",
            onClick: () => router.push("/setting"),
        },
        {
            key: "logout",
            label: "Logout",
            onClick: handleLogout,
        },

    ];

    return (

        <div className="flex items-center">
            {loading ? (
                <span>Loading...</span>
            ) : user ? (
                <>
                    <span className="mr-4">Welcome, {user.user.name}!</span>
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <div className="cursor-pointer">
                            {/* Replace with your avatar or user icon */}
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-white">{user.user.name.charAt(0)}</span>
                            </div>
                        </div>
                    </Dropdown>
                </>
            ) : (
                <span>Not logged in</span>
            )}
        </div>

    );
};

export default UserWelcome;







// "use client"
// import React, { useEffect, useState } from "react";
// import { Dropdown, Menu, message } from "antd"; // Import Ant Design components
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import axios from "axios";

// const NavBar = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<{ user: any; } | null>(null); // State to store user data
//   const [loading, setLoading] = useState<boolean>(true); // Loading state

//   // Fetch user profile data
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = Cookies.get("access_token"); // Get the access token from cookies
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include the access token in the request headers
//           },
//         });
//         setUser(response.data.data); // Set the user data in the state
//       } catch (error: any) {
//         console.error("Error fetching profile:", error);
//       } finally {
//         setLoading(false); // Set loading to false when the request is complete
//       }
//     };

//     fetchProfile();
//   }, []);

//   // Handle logout
//   const handleLogout = () => {
//     Cookies.remove("access_token"); // Remove the access token
//     message.success("You have been logged out."); // Show success message
//     router.push("/login"); // Redirect to login page
//   };

//   // Dropdown menu items
//   const menu = (
//     <Menu>
//       <Menu.Item key="profile" onClick={() => router.push("/profile")}>
//         Profile
//       </Menu.Item>
//       <Menu.Item key="editProfile" onClick={() => router.push("/edit-profile")}>
//         Edit Profile
//       </Menu.Item>
//       <Menu.Item key="logout" onClick={handleLogout}>
//         Logout
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <nav className="bg-white p-4 w-full h-16 shadow-[0_4px_4px_#398ab71c]">
//       <div className="container mx-auto flex justify-between items-center">
//         <h1 className="text-xl font-bold">Dashboard</h1>
//         <div className="flex items-center">
//           {loading ? (
//             <span>Loading...</span>
//           ) : user ? (
//             <>
//               <span className="mr-4">Welcome, {user.user.name}!</span>
//               <Dropdown overlay={menu} trigger={["click"]}>
//                 <div className="cursor-pointer">
//                   {/* Replace with your avatar or user icon */}
//                   <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                     {/* <span className="text-white">{user.user.name}</span> */}
//                   </div>
//                 </div>
//               </Dropdown>
//             </>
//           ) : (
//             <span>Not logged in</span>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;