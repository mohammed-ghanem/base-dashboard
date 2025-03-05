"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Form, Input, Select, Button, message } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import "./style.css";
import LangUseParams from "../translate/LangUseParams";

const { Option } = Select;

interface Role {
  id: number;
  name: string;
}

const CreateAdmin = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({}); // Store API errors
  const lang = LangUseParams();

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get("access_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "api-key": process.env.NEXT_PUBLIC_API_KEY,
              "Accept-Language": lang,
            },
          }
        );
        setRoles(response.data.data.data); // Assuming the roles are in response.data.data
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        message.error("Failed to fetch roles");
      }
    };

    fetchRoles();
  }, [lang]);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setLoading(true);
    setErrors({}); // Clear previous errors
    try {
      const token = Cookies.get("access_token");

      // Fetch CSRF token
      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      // Extract CSRF token from cookies
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      // Send POST request to create admin
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
          mobile: values.mobile,
          flag: values.flag,
          country_code: values.country_code,
          role_id: values.role_id,
        },
        {
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${token}`,
            "api-key": process.env.NEXT_PUBLIC_API_KEY,
            "Accept-Language": lang,

          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Admin created successfully");
        form.resetFields(); // Reset the form after successful submission
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        // Handle validation errors
        const apiErrors = error.response.data.errors;
        const formattedErrors: Record<string, string[]> = {};

        // Map API errors to form fields
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key];
        });

        setErrors(formattedErrors); // Set errors in state
        form.setFields(
          Object.keys(formattedErrors).map((field) => ({
            name: field,
            errors: formattedErrors[field],
          }))
        );
      } else {
        console.error("Failed to create admin:", error);
        message.error("Failed to create admin");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value: string, country: any) => {
    form.setFieldsValue({
      mobile: value,
      flag: country.countryCode.toUpperCase(),
      country_code: `+${country.dialCode}`,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Admin</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="container w-[75%] bg-white rounded-md"
        style={{ padding: "30px", margin: "auto", direction: "ltr" }}
      >
        <Form.Item
          label="Name"
          name="name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.[0]}
        >
          <Input placeholder="Enter admin name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.[0]}
        >
          <Input placeholder="Enter admin email" />
        </Form.Item>

        <Form.Item
          label="Mobile"
          name="mobile"
          validateStatus={errors.mobile ? "error" : ""}
          help={errors.mobile?.[0]}
        >
          <PhoneInput
            country={"sa"}
            placeholder="Enter mobile number"
            inputProps={{ name: "mobile", required: true }}
            onChange={handlePhoneChange}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.[0]}
        >
          <Input.Password placeholder="Enter admin password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="password_confirmation"
          validateStatus={errors.password_confirmation ? "error" : ""}
          help={errors.password_confirmation?.[0]}
        >
          <Input.Password placeholder="Confirm admin password" />
        </Form.Item>

        <Form.Item
          label="Roles"
          name="role_id"
          validateStatus={errors.role_id ? "error" : ""}
          help={errors.role_id?.[0]}
        >
          <Select mode="multiple" placeholder="Select roles">
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Admin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAdmin;




// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { Form, Input, Select, Button, message } from 'antd';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css'; // Import the styles
// import './style.css';

// const { Option } = Select;

// interface Role {
//     id: number;
//     name: string;
// }

// const CreateAdmin = () => {
//     const [form] = Form.useForm();
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string[]>>({}); // Store API errors

//     // Fetch roles from the API
//     useEffect(() => {
//         const fetchRoles = async () => {
//             try {
//                 const token = Cookies.get('access_token');
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                         'Accept-Language': 'ar',
//                     },
//                 });
//                 setRoles(response.data.data.data); // Assuming the roles are in response.data.data
//             } catch (error) {
//                 console.error('Failed to fetch roles:', error);
//                 message.error('Failed to fetch roles');
//             }
//         };

//         fetchRoles();
//     }, []);

//     // Handle form submission
//     const handleSubmit = async (values: any) => {
//         setLoading(true);
//         setErrors({}); // Clear previous errors
//         try {
//             const token = Cookies.get('access_token');

//             // Fetch CSRF token
//             await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//                 withCredentials: true,
//             });

//             // Extract CSRF token from cookies
//             const csrfToken = document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('XSRF-TOKEN='))
//                 ?.split('=')[1];

//             // Send POST request to create admin
//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins`,
//                 {
//                     name: values.name,
//                     email: values.email,
//                     password: values.password,
//                     password_confirmation: values.password_confirmation, // Add password confirmation
//                     mobile: values.mobile, // Add mobile to the request payload
//                     flag: values.flag, // Add flag to the request payload
//                     country_code: values.country_code, // Add country_code to the request payload
//                     role_id: values.role_id, // Send selected roles
//                 },
//                 {
//                     headers: {
//                         'X-XSRF-TOKEN': csrfToken,
//                         Authorization: `Bearer ${token}`,
//                         'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                         'Accept-Language': 'ar',
//                     },
//                     withCredentials: true,
//                 }
//             );

//             if (response.status === 200) {
//                 message.success('Admin created successfully');
//                 form.resetFields(); // Reset the form after successful submission
//             }
//         } catch (error: any) {
//             if (error.response && error.response.status === 422) {
//                 // Handle validation errors
//                 const apiErrors = error.response.data.errors;
//                 const formattedErrors: Record<string, string[]> = {};

//                 // Map API errors to form fields
//                 Object.keys(apiErrors).forEach((key) => {
//                     formattedErrors[key] = apiErrors[key];
//                 });

//                 setErrors(formattedErrors); // Set errors in state
//             } else {
//                 console.error('Failed to create admin:', error);
//                 message.error('Failed to create admin');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle phone input change
//     const handlePhoneChange = (value: string, country: any) => {
//         // Update form values with the selected phone number, flag, and country code
//         form.setFieldsValue({
//             mobile: value,
//             flag: country.countryCode.toUpperCase(), // Extract flag (country code in uppercase)
//             country_code: `+${country.dialCode}`, // Extract country code
//         });
//     };

//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">Create Admin</h1>
//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleSubmit}
//                 className="container w-[75%] bg-white rounded-md"
//                 style={{ padding: '30px', margin: 'auto', direction: 'ltr' }}
//             >
//                 {/* Name Field */}
//                 <Form.Item
//                     label="Name"
//                     name="name"
//                     validateStatus={errors.name ? 'error' : undefined}
//                     help={errors.name ? errors.name.join(', ') : undefined}
//                     rules={[{ required: true, message: 'Please enter the admin name' }]}
//                 >
//                     <Input placeholder="Enter admin name" />
//                 </Form.Item>

//                 {/* Email Field */}
//                 <Form.Item
//                     label="Email"
//                     name="email"
//                     validateStatus={errors.email ? 'error' : ''}
//                     //help={errors.email ? errors.email[0] : ''}
//                     rules={[
//                         { required: true, message: 'Please enter the admin email' },
//                         { type: 'email', message: 'Please enter a valid email' },
//                     ]}
//                 >
//                     <Input placeholder="Enter admin email" />
//                 </Form.Item>

//                 {/* Mobile Field with react-phone-input-2 */}
//                 <Form.Item
//                     label="Mobile"
//                     name="mobile"
//                     validateStatus={errors.mobile ? 'error' : ''}
//                     //help={errors.mobile ? errors.mobile[0] : ''}
//                     rules={[
//                         { required: true, message: 'Please enter the admin mobile number' },
//                     ]}
//                 >
//                     <PhoneInput
//                         country={'sa'} // Default country
//                         placeholder="Enter mobile number"
//                         inputProps={{
//                             name: 'mobile',
//                             required: true,
//                         }}
//                         onChange={handlePhoneChange} // Handle phone input change
//                     />
//                 </Form.Item>

//                 {/* Hidden Fields for Flag and Country Code */}
//                 <Form.Item name="flag" noStyle>
//                     <Input type="hidden" />
//                 </Form.Item>
//                 <Form.Item name="country_code" noStyle>
//                     <Input type="hidden" />
//                 </Form.Item>

//                 {/* Password Field */}
//                 <Form.Item
//                     label="Password"
//                     name="password"
//                     validateStatus={errors.password ? 'error' : ''}
//                     //help={errors.password ? errors.password[0] : ''}
//                     rules={[{ required: true, message: errors.password ? errors.password[0] : 'Please enter the admin password' }]}
//                 >
//                     <Input.Password placeholder="Enter admin password" />
//                 </Form.Item>

//                 {/* Confirm Password Field */}
//                 <Form.Item
//                     label="Confirm Password"
//                     name="password_confirmation"
//                     validateStatus={errors.password_confirmation ? 'error' : ''}
//                     //help={errors.password_confirmation ? errors.password_confirmation[0] : ''}
//                     dependencies={['password']} // Ensure this field depends on the password field
//                     rules={[
//                         { required: true, message: 'Please confirm the admin password' },
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 if (!value || getFieldValue('password') === value) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('The two passwords do not match!'));
//                             },
//                         }),
//                     ]}
//                 >
//                     <Input.Password placeholder="Confirm admin password" />
//                 </Form.Item>

//                 {/* Roles Field */}
//                 <Form.Item
//                     label="Roles"
//                     name="role_id"
//                     validateStatus={errors.role_id ? 'error' : ''}
//                     // help={errors.role_id ? errors.role_id[0] : ''}
//                     rules={[{ required: true, message: 'Please select at least one role' }]}
//                 >
//                     <Select
//                         mode="multiple" // Allow multiple roles to be selected
//                         placeholder="Select roles"
//                     >
//                         {roles.map((role) => (
//                             <Option key={role.id} value={role.id}>
//                                 {role.name}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 {/* Submit Button */}
//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" loading={loading}>
//                         Create Admin
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };

// export default CreateAdmin;





// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { Form, Input, Select, Button, message } from 'antd';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css'; // Import the styles
// import './style.css';

// const { Option } = Select;

// interface Role {
//     id: number;
//     name: string;
// }

// const CreateAdmin = () => {
//     const [form] = Form.useForm();
//     const [roles, setRoles] = useState<Role[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string[]>>({}); // Store API errors

//     // Fetch roles from the API
//     useEffect(() => {
//         const fetchRoles = async () => {
//             try {
//                 const token = Cookies.get('access_token');
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                         'Accept-Language': 'ar',
//                     },
//                 });
//                 setRoles(response.data.data.data); // Assuming the roles are in response.data.data
//             } catch (error) {
//                 console.error('Failed to fetch roles:', error);
//                 message.error('Failed to fetch roles');
//             }
//         };

//         fetchRoles();
//     }, []);

//     // Handle form submission
//     const handleSubmit = async (values: any) => {
//         setLoading(true);
//         setErrors({}); // Clear previous errors
//         try {
//             const token = Cookies.get('access_token');

//             // Fetch CSRF token
//             await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//                 withCredentials: true,
//             });

//             // Extract CSRF token from cookies
//             const csrfToken = document.cookie
//                 .split('; ')
//                 .find((row) => row.startsWith('XSRF-TOKEN='))
//                 ?.split('=')[1];

//             // Send POST request to create admin
//             const response = await axios.post(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins`,
//                 {
//                     name: values.name,
//                     email: values.email,
//                     password: values.password,
//                     password_confirmation: values.password_confirmation, // Add password confirmation
//                     mobile: values.mobile, // Add mobile to the request payload
//                     flag: values.flag, // Add flag to the request payload
//                     country_code: values.country_code, // Add country_code to the request payload
//                     role_id: values.role_id, // Send selected roles
//                 },
//                 {
//                     headers: {
//                         'X-XSRF-TOKEN': csrfToken,
//                         Authorization: `Bearer ${token}`,
//                         'api-key': process.env.NEXT_PUBLIC_API_KEY,
//                         'Accept-Language': 'ar',
//                     },
//                     withCredentials: true,
//                 }


//             );



//             if (response.status === 200) {
//                 message.success('Admin created successfully');
//                 form.resetFields(); // Reset the form after successful submission
//             }
//         } catch (error: any) {
//             if (error.response && error.response.status === 422) {
//                 // Handle validation errors
//                 const apiErrors = error.response.data.errors;
//                 const formattedErrors: Record<string, string[]> = {};



//                 // Map API errors to form fields
//                 Object.keys(apiErrors).forEach((key) => {
//                     formattedErrors[key] = apiErrors[key];
//                 });

//                 setErrors(formattedErrors); // Set errors in state
//             } else {
//                 console.error('Failed to create admin:', error);
//                 message.error('Failed to create admin');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//     // Handle phone input change
//     const handlePhoneChange = (value: string, country: any) => {
//         // Update form values with the selected phone number, flag, and country code
//         form.setFieldsValue({
//             mobile: value,
//             flag: country.countryCode.toUpperCase(), // Extract flag (country code in uppercase)
//             country_code: `+${country.dialCode}`, // Extract country code
//         });
//     };


//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">Create Admin</h1>
//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleSubmit}
//                 className="container w-[75%] bg-white rounded-md"
//                 style={{ padding: '30px', margin: 'auto', direction: 'ltr' }}
//             >
//                 {/* Name Field */}
//                 <Form.Item
//                     label="Name"
//                     name="name"
//                     validateStatus={errors.name ? 'error' : ''}
//                     help={errors.name ? errors.name[0] : ''}
//                     rules={[{ required: true, message: 'Please enter the admin name' }]}
//                 >
//                     <Input placeholder="Enter admin name" />
//                 </Form.Item>

//                 {/* Email Field */}
//                 <Form.Item
//                     label="Email"
//                     name="email"
//                     validateStatus={errors.email ? 'error' : ''}
//                     help={errors.email ? errors.email[0] : ''}
//                     rules={[
//                         { required: true, message: 'Please enter the admin email' },
//                         { type: 'email', message: 'Please enter a valid email' },
//                     ]}
//                 >
//                     <Input placeholder="Enter admin email" />
//                 </Form.Item>

//                 {/* Mobile Field with react-phone-input-2 */}
//                 <Form.Item
//                     label="Mobile"
//                     name="mobile"
//                     validateStatus={errors.mobile ? 'error' : ''}
//                     help={errors.mobile ? errors.mobile[0] : ''}
//                     rules={[
//                         { required: true, message: 'Please enter the admin mobile number' },
//                     ]}
//                 >
//                     <PhoneInput
//                         country={'sa'} // Default country
//                         placeholder="Enter mobile number"
//                         inputProps={{
//                             name: 'mobile',
//                             required: true,
//                         }}
//                         onChange={handlePhoneChange} // Handle phone input change
//                     />
//                 </Form.Item>

//                 {/* Hidden Fields for Flag and Country Code */}
//                 <Form.Item name="flag" noStyle>
//                     <Input type="hidden" />
//                 </Form.Item>
//                 <Form.Item name="country_code" noStyle>
//                     <Input type="hidden" />
//                 </Form.Item>

//                 {/* Password Field */}
//                 <Form.Item
//                     label="Password"
//                     name="password"
//                     validateStatus={errors.password ? 'error' : ''}
//                     help={errors.password ? errors.password[0] : ''}
//                     rules={[{ required: true, message: 'Please enter the admin password' }]}
//                 >
//                     <Input.Password placeholder="Enter admin password" />
//                 </Form.Item>

//                 {/* Confirm Password Field */}
//                 <Form.Item
//                     label="Confirm Password"
//                     name="password_confirmation"
//                     validateStatus={errors.password_confirmation ? 'error' : ''}
//                     help={errors.password_confirmation ? errors.password_confirmation[0] : ''}
//                     dependencies={['password']} // Ensure this field depends on the password field
//                     rules={[
//                         { required: true, message: 'Please confirm the admin password' },
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 if (!value || getFieldValue('password') === value) {
//                                     return Promise.resolve();
//                                 }
//                                 return Promise.reject(new Error('The two passwords do not match!'));
//                             },
//                         }),
//                     ]}
//                 >
//                     <Input.Password placeholder="Confirm admin password" />
//                 </Form.Item>

//                 {/* Roles Field */}
//                 <Form.Item
//                     label="Roles"
//                     name="role_id"
//                     validateStatus={errors.roles ? 'error' : ''}
//                     help={errors.roles ? errors.roles[0] : ''}
//                     rules={[{ required: true, message: 'Please select at least one role' }]}
//                 >
//                     <Select
//                         mode="multiple" // Allow multiple roles to be selected
//                         placeholder="Select roles"
//                     >
//                         {roles.map((role) => (
//                             <Option key={role.id} value={role.id}>
//                                 {role.name}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 {/* Submit Button */}
//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" loading={loading}>
//                         Create Admin
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// };

// export default CreateAdmin;
