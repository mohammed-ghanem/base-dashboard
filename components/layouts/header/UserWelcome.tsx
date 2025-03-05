"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, message, Modal, Spin, Form, Input, Button } from "antd"; // Import Ant Design components
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import type { MenuProps } from "antd"; // Import MenuProps type
import TranslateHook from "@/components/translate/TranslateHook";
import { UserOutlined, EditOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2'; // Import SweetAlert2

const UserWelcome = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ user: any } | null>(null); // State to store user data
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [modalType, setModalType] = useState<string | null>(null); // State to track which modal to open
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
    const [profileData, setProfileData] = useState<any>(null); // State to store profile data
    const [profileLoading, setProfileLoading] = useState<boolean>(false); // Loading state for profile data
    const [form] = Form.useForm(); // Form instance for Ant Design forms
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false); // State to manage logout loading overlay
    // lang
    const translate = TranslateHook();

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = Cookies.get("access_token"); // Get the access token from cookies
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the request headers
                        "api-key": process.env.NEXT_PUBLIC_API_KEY,
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

    // Handle logout confirmation
    const handleLogoutConfirmation = () => {
        Swal.fire({
            title: translate ? translate.pages.welcomeUser.confirmLogout : "Are you sure?",
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: translate ? translate.pages.welcomeUser.logOut : "Logout",
            cancelButtonText: translate ? translate.pages.welcomeUser.cancel : "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
        });
    };

    // Handle actual logout
    const handleLogout = () => {
        setIsLoggingOut(true); // Show loading overlay
        Cookies.remove("access_token"); // Remove the access token
        message.success(<span className="font-cairo">{translate ? translate.pages.welcomeUser.logoutSuccess : "Logout successful"}</span>); // Show success message

        // Delay the redirection to show the loading overlay
        setTimeout(() => {
            router.push("/login"); // Redirect to login page
            setIsLoggingOut(false); // Hide loading overlay after redirection
        }, 1000); // 1 second delay
    };

    // Open modal based on the selected option
    const handleMenuClick = async (key: string) => {
        setModalType(key);
        setIsModalOpen(true);

        // Fetch profile data when "Profile" or "Update Profile" is clicked
        if (key === "profile" || key === "updateProfile") {
            setProfileLoading(true);
            try {
                const token = Cookies.get("access_token"); // Get the access token from cookies
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the request headers
                        "api-key": process.env.NEXT_PUBLIC_API_KEY,
                    },
                });
                setProfileData(response.data.data); // Set the profile data in the state

                // Pre-fill the form if "Update Profile" is clicked
                if (key === "updateProfile") {
                    form.setFieldsValue({
                        name: response.data.data.user.name,
                        email: response.data.data.user.email,
                        mobile: response.data.data.user.mobile,
                    });
                }
            } catch (error: any) {
                console.error("Error fetching profile data:", error);
                message.error("Failed to fetch profile data.");
            } finally {
                setProfileLoading(false);
            }
        }
    };

    // Close modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalType(null);
        setProfileData(null); // Reset profile data when modal is closed
        form.resetFields(); // Reset form fields
    };

    // Handle Edit Profile form submission
    const handleEditProfile = async (values: any) => {
        try {
            const token = Cookies.get("access_token"); // Get the access token from cookies

            // Step 1: Fetch the CSRF token from the backend
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/update-profile`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the request headers
                        "api-key": process.env.NEXT_PUBLIC_API_KEY,

                    },
                    withCredentials: true, // Ensure cookies are sent with the request
                }
            );

            message.success("Profile updated successfully!");
            setUser(response.data.data); // Update user data in the state
            handleModalClose(); // Close the modal
        } catch (error: any) {
            console.error("Error updating profile:", error);
            if (error.response) {
                console.error("Response Data:", error.response.data); // Debugging: Log the error response
                console.error("Response Status:", error.response.status); // Debugging: Log the status code
            }
            message.error("Failed to update profile.");
        }
    };

    // Handle Change Password form submission
    const handleChangePassword = async (values: any) => {
        try {
            const token = Cookies.get("access_token"); // Get the access token from cookies

            // Step 1: Fetch the CSRF token from the backend
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });

            // Step 2: Extract the CSRF token from cookies
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            // Step 3: Make the change password request with the CSRF token
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/changpassword`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the access token in the request headers
                        'X-XSRF-TOKEN': csrfToken, // Include the CSRF token in the request headers
                        "api-key": process.env.NEXT_PUBLIC_API_KEY,

                    },
                    withCredentials: true, // Ensure cookies are sent with the request
                }
            );

            // Step 4: Show success message
            message.success("Password changed successfully! You will be redirected to the login page in 3 seconds.");

            // Step 5: Remove the access token
            Cookies.remove("access_token");

            // Step 6: Delay the redirection to the login page
            setTimeout(() => {
                router.push("/login");
            }, 3000); // 3 seconds delay

            // Step 7: Close the modal
            handleModalClose();
        } catch (error: any) {
            console.error("Error changing password:", error);
            message.error("Failed to change password.");
        }
    };

    // Dropdown menu items
    const items: MenuProps["items"] = [
        {
            key: "profile",
            label: `${translate ? translate.pages.welcomeUser.profile : ""}`,
            icon: <UserOutlined />,
            className: "personalDrop",
            onClick: () => handleMenuClick("profile"),
        },
        {
            key: "updateProfile",
            label: `${translate ? translate.pages.welcomeUser.editProfile : ""}`,
            icon: <EditOutlined />,
            className: "personalDrop",
            onClick: () => handleMenuClick("updateProfile"),
        },
        {
            key: "changePassword",
            label: `${translate ? translate.pages.welcomeUser.changePassword : ""}`,
            icon: <LockOutlined />,
            className: "personalDrop",
            onClick: () => handleMenuClick("changePassword"),
        },
        {
            key: "logout",
            label: `${translate ? translate.pages.welcomeUser.logOut : ""}`,
            icon: <LogoutOutlined />,
            className: "personalDrop",
            onClick: handleLogoutConfirmation,
        },
    ];

    // Render content based on the modal type
    const renderModalContent = () => {
        switch (modalType) {
            case "updateProfile":
                return (
                    <Form className="font-bold" form={form} onFinish={handleEditProfile} layout="vertical">
                        <Form.Item
                            name="name"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.name : ""}</span>}
                            rules={[{ required: true, message: "Please enter your name" }]}
                        >
                            <Input placeholder="Enter your name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.email : ""}</span>}
                            rules={[{ required: true, message: "Please enter your email" }]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item
                            name="mobile"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.mobile : ""}</span>}
                            rules={[{ required: true, message: "Please enter your mobile number" }]}
                        >
                            <Input placeholder="Enter your mobile number" />
                        </Form.Item>
                        <Form.Item>
                            <Button className="ms-auto customBtn font-cairo" type="primary" htmlType="submit">
                                {translate ? translate.pages.welcomeUser.edit : ""}
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case "profile":
                return (
                    <Spin spinning={profileLoading}>
                        {profileData ? (
                            <div className="font-bold font-cairo">
                                <h3 className="titleBox">
                                    {translate ? translate.pages.welcomeUser.profile : ""}
                                </h3>
                                <p className="mt-2">
                                    <strong className="mx-1">
                                        {translate ? translate.pages.welcomeUser.name : ""}
                                    </strong>
                                    {profileData.user.name}
                                </p>
                                <p className="my-2">
                                    <strong className="mx-1">
                                        {translate ? translate.pages.welcomeUser.email : ""}
                                    </strong>
                                    {profileData.user.email}
                                </p>
                                <p>
                                    <strong className="mx-1">
                                        {translate ? translate.pages.welcomeUser.mobile : ""}
                                    </strong>
                                    {profileData.user.mobile}
                                </p>
                            </div>
                        ) : (
                            <p>....</p>
                        )}
                    </Spin>
                );
            case "changePassword":
                return (
                    <Form form={form} onFinish={handleChangePassword} layout="vertical">
                        <Form.Item
                            name="old_password"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.oldPassword : ""}</span>}
                            rules={[{ required: true, message: "Please enter your old password" }]}
                        >
                            <Input.Password placeholder={translate ? translate.pages.welcomeUser.oldPassword : ""} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.newPassword : ""}</span>}
                            rules={[{ required: true, message: "Please enter your new password" }]}
                        >
                            <Input.Password placeholder={translate ? translate.pages.welcomeUser.newPassword : ""} />
                        </Form.Item>
                        <Form.Item
                            name="password_confirmation"
                            label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.confirmNewPassword : ""}</span>}
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("The two passwords do not match!");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder={translate ? translate.pages.welcomeUser.confirmNewPassword : ""} />
                        </Form.Item>
                        <Form.Item>
                            <Button className="ms-auto customBtn font-cairo" type="primary" htmlType="submit">
                                {translate ? translate.pages.welcomeUser.changePassword : ""}
                            </Button>
                        </Form.Item>
                    </Form>
                );
            default:
                return null;
        }
    };

    // Loading Overlay Component
    const LoadingOverlay = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div className="flex items-center">
            {isLoggingOut && <LoadingOverlay />} {/* Show loading overlay if logging out */}
            {loading ? (
                <span>Loading...</span>
            ) : user ? (
                <>
                    <span className="mx-4 bold">{user.user.name}</span>
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                        overlayClassName="w-[200px] userDropDown"
                    >
                        <div className="cursor-pointer">
                            {/* Replace with your avatar or user icon */}
                            <div className="w-10 h-10 bg-[#398AB7] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{user.user.name.charAt(0)}</span>
                            </div>
                        </div>
                    </Dropdown>

                    {/* Modal for displaying content */}
                    <Modal
                        open={isModalOpen}
                        onCancel={handleModalClose}
                        footer={null}
                    >
                        {renderModalContent()}
                    </Modal>
                </>
            ) : (
                <span className="">Not logged in</span>
            )}
        </div>
    );
};

export default UserWelcome;





// "use client";
// import React, { useEffect, useState } from "react";
// import { Dropdown, message, Modal, Spin, Form, Input, Button } from "antd"; // Import Ant Design components
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import axios from "axios";
// import type { MenuProps } from "antd"; // Import MenuProps type
// import TranslateHook from "@/components/translate/TranslateHook";
// import { UserOutlined, EditOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";

// const UserWelcome = () => {
//     const router = useRouter();
//     const [user, setUser] = useState<{ user: any } | null>(null); // State to store user data
//     const [loading, setLoading] = useState<boolean>(true); // Loading state
//     const [modalType, setModalType] = useState<string | null>(null); // State to track which modal to open
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
//     const [profileData, setProfileData] = useState<any>(null); // State to store profile data
//     const [profileLoading, setProfileLoading] = useState<boolean>(false); // Loading state for profile data
//     const [form] = Form.useForm(); // Form instance for Ant Design forms
//     const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false); // State to control logout confirmation modal visibility
//     const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false); // State to manage logout loading overlay
//     // lang
//     const translate = TranslateHook();

//     // Fetch user profile data
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const token = Cookies.get("access_token"); // Get the access token from cookies
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Include the access token in the request headers
//                         "api-key": process.env.NEXT_PUBLIC_API_KEY,
//                     },
//                 });
//                 setUser(response.data.data); // Set the user data in the state
//             } catch (error: any) {
//                 console.error("Error fetching profile:", error);
//             } finally {
//                 setLoading(false); // Set loading to false when the request is complete
//             }
//         };

//         fetchProfile();
//     }, []);

//     // Handle logout confirmation
//     const handleLogoutConfirmation = () => {
//         setIsLogoutModalOpen(true);
//     };

//     // Handle actual logout
//     const handleLogout = () => {
//         setIsLoggingOut(true); // Show loading overlay
//         Cookies.remove("access_token"); // Remove the access token
//         message.success("You have been logged out."); // Show success message

//         // Delay the redirection to show the loading overlay
//         setTimeout(() => {
//             router.push("/login"); // Redirect to login page
//             setIsLoggingOut(false); // Hide loading overlay after redirection
//         }, 1000); // 1 second delay
//     };

//     // Open modal based on the selected option
//     const handleMenuClick = async (key: string) => {
//         setModalType(key);
//         setIsModalOpen(true);

//         // Fetch profile data when "Profile" or "Update Profile" is clicked
//         if (key === "profile" || key === "updateProfile") {
//             setProfileLoading(true);
//             try {
//                 const token = Cookies.get("access_token"); // Get the access token from cookies
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/profile`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Include the access token in the request headers
//                         "api-key": process.env.NEXT_PUBLIC_API_KEY,
//                     },
//                 });
//                 setProfileData(response.data.data); // Set the profile data in the state

//                 // Pre-fill the form if "Update Profile" is clicked
//                 if (key === "updateProfile") {
//                     form.setFieldsValue({
//                         name: response.data.data.user.name,
//                         email: response.data.data.user.email,
//                         mobile: response.data.data.user.mobile,
//                     });
//                 }
//             } catch (error: any) {
//                 console.error("Error fetching profile data:", error);
//                 message.error("Failed to fetch profile data.");
//             } finally {
//                 setProfileLoading(false);
//             }
//         }
//     };

//     // Close modal
//     const handleModalClose = () => {
//         setIsModalOpen(false);
//         setModalType(null);
//         setProfileData(null); // Reset profile data when modal is closed
//         form.resetFields(); // Reset form fields
//     };

//     // Handle Edit Profile form submission
//     const handleEditProfile = async (values: any) => {
//         try {
//             const token = Cookies.get("access_token"); // Get the access token from cookies

//             // Step 1: Fetch the CSRF token from the backend
//             await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//                 withCredentials: true,
//             });

//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/update-profile`,
//                 values,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Include the access token in the request headers
//                     },
//                     withCredentials: true, // Ensure cookies are sent with the request
//                 }
//             );

//             message.success("Profile updated successfully!");
//             setUser(response.data.data); // Update user data in the state
//             handleModalClose(); // Close the modal
//         } catch (error: any) {
//             console.error("Error updating profile:", error);
//             if (error.response) {
//                 console.error("Response Data:", error.response.data); // Debugging: Log the error response
//                 console.error("Response Status:", error.response.status); // Debugging: Log the status code
//             }
//             message.error("Failed to update profile.");
//         }
//     };

//     // Handle Change Password form submission
//     const handleChangePassword = async (values: any) => {
//         try {
//             const token = Cookies.get("access_token"); // Get the access token from cookies

//             // Step 1: Fetch the CSRF token from the backend
//             await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//                 withCredentials: true,
//             });

//             // Step 2: Extract the CSRF token from cookies
//             const csrfToken = document.cookie
//                 .split('; ')
//                 .find(row => row.startsWith('XSRF-TOKEN='))
//                 ?.split('=')[1];

//             // Step 3: Make the change password request with the CSRF token
//             await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/auth/changpassword`,
//                 values,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Include the access token in the request headers
//                         'X-XSRF-TOKEN': csrfToken, // Include the CSRF token in the request headers
//                     },
//                     withCredentials: true, // Ensure cookies are sent with the request
//                 }
//             );

//             // Step 4: Show success message
//             message.success("Password changed successfully! You will be redirected to the login page in 3 seconds.");

//             // Step 5: Remove the access token
//             Cookies.remove("access_token");

//             // Step 6: Delay the redirection to the login page
//             setTimeout(() => {
//                 router.push("/login");
//             }, 3000); // 3 seconds delay

//             // Step 7: Close the modal
//             handleModalClose();
//         } catch (error: any) {
//             console.error("Error changing password:", error);
//             message.error("Failed to change password.");
//         }
//     };

//     // Dropdown menu items
//     const items: MenuProps["items"] = [
//         {
//             key: "profile",
//             label: `${translate ? translate.pages.welcomeUser.profile : ""}`,
//             icon: <UserOutlined />,
//             className: "personalDrop",
//             onClick: () => handleMenuClick("profile"),
//         },
//         {
//             key: "updateProfile",
//             label: `${translate ? translate.pages.welcomeUser.editProfile : ""}`,
//             icon: <EditOutlined />,
//             className: "personalDrop",
//             onClick: () => handleMenuClick("updateProfile"),
//         },
//         {
//             key: "changePassword",
//             label: `${translate ? translate.pages.welcomeUser.changePassword : ""}`,
//             icon: <LockOutlined />,
//             className: "personalDrop",
//             onClick: () => handleMenuClick("changePassword"),
//         },
//         {
//             key: "logout",
//             label: `${translate ? translate.pages.welcomeUser.logOut : ""}`,
//             icon: <LogoutOutlined />,
//             className: "personalDrop",
//             onClick: handleLogoutConfirmation,
//         },
//     ];

//     // Render content based on the modal type
//     const renderModalContent = () => {
//         switch (modalType) {
//             case "updateProfile":
//                 return (
//                     <Form className="font-bold" form={form} onFinish={handleEditProfile} layout="vertical">
//                         <Form.Item
//                             name="name"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.name : ""}</span>}
//                             rules={[{ required: true, message: "Please enter your name" }]}
//                         >
//                             <Input placeholder="Enter your name" />
//                         </Form.Item>
//                         <Form.Item
//                             name="email"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.email : ""}</span>}
//                             rules={[{ required: true, message: "Please enter your email" }]}
//                         >
//                             <Input placeholder="Enter your email" />
//                         </Form.Item>
//                         <Form.Item
//                             name="mobile"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.mobile : ""}</span>}
//                             rules={[{ required: true, message: "Please enter your mobile number" }]}
//                         >
//                             <Input placeholder="Enter your mobile number" />
//                         </Form.Item>
//                         <Form.Item>
//                             <Button className="ms-auto customBtn font-cairo" type="primary" htmlType="submit">
//                                 {translate ? translate.pages.welcomeUser.edit : ""}
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 );
//             case "profile":
//                 return (
//                     <Spin spinning={profileLoading}>
//                         {profileData ? (
//                             <div className="font-bold font-cairo">
//                                 <h3 className="titleBox">
//                                     {translate ? translate.pages.welcomeUser.profile : ""}
//                                 </h3>
//                                 <p className="mt-2">
//                                     <strong className="mx-1">
//                                         {translate ? translate.pages.welcomeUser.name : ""}
//                                     </strong>
//                                     {profileData.user.name}
//                                 </p>
//                                 <p className="my-2">
//                                     <strong className="mx-1">
//                                         {translate ? translate.pages.welcomeUser.email : ""}
//                                     </strong>
//                                     {profileData.user.email}
//                                 </p>
//                                 <p>
//                                     <strong className="mx-1">
//                                         {translate ? translate.pages.welcomeUser.mobile : ""}
//                                     </strong>
//                                     {profileData.user.mobile}
//                                 </p>
//                             </div>
//                         ) : (
//                             <p>....</p>
//                         )}
//                     </Spin>
//                 );
//             case "changePassword":
//                 return (
//                     <Form form={form} onFinish={handleChangePassword} layout="vertical">
//                         <Form.Item
//                             name="old_password"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.oldPassword : ""}</span>}
//                             rules={[{ required: true, message: "Please enter your old password" }]}
//                         >
//                             <Input.Password placeholder={translate ? translate.pages.welcomeUser.oldPassword : ""} />
//                         </Form.Item>
//                         <Form.Item
//                             name="password"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.newPassword : ""}</span>}
//                             rules={[{ required: true, message: "Please enter your new password" }]}
//                         >
//                             <Input.Password placeholder={translate ? translate.pages.welcomeUser.newPassword : ""} />
//                         </Form.Item>
//                         <Form.Item
//                             name="password_confirmation"
//                             label={<span className="font-cairo mainColor">{translate ? translate.pages.welcomeUser.confirmNewPassword : ""}</span>}
//                             dependencies={["newPassword"]}
//                             rules={[
//                                 { required: true, message: "Please confirm your new password" },
//                                 ({ getFieldValue }) => ({
//                                     validator(_, value) {
//                                         if (!value || getFieldValue("password") === value) {
//                                             return Promise.resolve();
//                                         }
//                                         return Promise.reject("The two passwords do not match!");
//                                     },
//                                 }),
//                             ]}
//                         >
//                             <Input.Password placeholder={translate ? translate.pages.welcomeUser.confirmNewPassword : ""} />
//                         </Form.Item>
//                         <Form.Item>
//                             <Button className="ms-auto customBtn font-cairo" type="primary" htmlType="submit">
//                                 {translate ? translate.pages.welcomeUser.changePassword : ""}
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 );
//             default:
//                 return null;
//         }
//     };

//     // Loading Overlay Component
//     const LoadingOverlay = () => (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1000,
//         }}>
//             <Spin size="large" />
//         </div>
//     );

//     return (
//         <div className="flex items-center">
//             {isLoggingOut && <LoadingOverlay />} {/* Show loading overlay if logging out */}
//             {loading ? (
//                 <span>Loading...</span>
//             ) : user ? (
//                 <>
//                     <span className="mx-4 bold">{user.user.name}</span>
//                     <Dropdown
//                         menu={{ items }}
//                         trigger={["click"]}
//                         overlayClassName="w-[200px] userDropDown"
//                     >
//                         <div className="cursor-pointer">
//                             {/* Replace with your avatar or user icon */}
//                             <div className="w-10 h-10 bg-[#398AB7] rounded-full flex items-center justify-center">
//                                 <span className="text-white font-bold">{user.user.name.charAt(0)}</span>
//                             </div>
//                         </div>
//                     </Dropdown>

//                     {/* Modal for displaying content */}
//                     <Modal
//                         open={isModalOpen}
//                         onCancel={handleModalClose}
//                         footer={null}
//                     >
//                         {renderModalContent()}
//                     </Modal>

//                     {/* Logout Confirmation Modal */}
//                     <Modal
//                         title={translate ? translate.pages.welcomeUser.confirmLogout : ""}
//                         open={isLogoutModalOpen}
//                         onOk={handleLogout}
//                         onCancel={() => setIsLogoutModalOpen(false)}
//                         okText={translate ? translate.pages.welcomeUser.logOut : ""}
//                         cancelText={<span className="font-cairo font-bold">{translate ? translate.pages.welcomeUser.cancel : ""}</span>}
//                         className="font-bold font-cairo"
//                         okButtonProps={{
//                             className: "font-cairo bold",
//                             danger: true, // Add danger style
//                         }}
//                         cancelButtonProps={{
//                             className: "btn-success",
//                         }}
//                     >
//                     </Modal>
//                 </>
//             ) : (
//                 <span className="">Not logged in</span>
//             )}
//         </div>
//     );
// };

// export default UserWelcome;