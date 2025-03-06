"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Form, Input, Select, Button, message } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the styles
import "./style.css";
import LangUseParams from "../translate/LangUseParams";
import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter

const { Option } = Select;

interface Role {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  mobile: string;
  flag: string;
  country_code: string;
  role_id: number[];
}

const EditAdmin = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({}); // Store API errors
  const [admin, setAdmin] = useState<Admin | null>(null); // Store admin data
  const lang = LangUseParams();
  const { id } = useParams(); // Get the admin ID from the URL
  const router = useRouter(); // Initialize useRouter

  // Fetch roles and admin data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("access_token");

        // Fetch roles
        const rolesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "api-key": process.env.NEXT_PUBLIC_API_KEY,
              "Accept-Language": lang,
            },
          }
        );
        setRoles(rolesResponse.data.data.data);

        // Fetch admin data
        const adminResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "api-key": process.env.NEXT_PUBLIC_API_KEY,
              "Accept-Language": lang,
            },
          }
        );
        const adminData = adminResponse.data.data.Admin.user;
        setAdmin(adminData);
        // Pre-fill the form with admin data
        form.setFieldsValue({
          name: adminData.name,
          email: adminData.email,
          mobile: adminData.mobile,
          role_id: adminData.roles.map((role: any) => role.id), // Map roles to role IDs
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [id, lang, form]);

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

      // Send PUT request to update admin
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/${id}`,
        {
          name: values.name,
          email: values.email,
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
        message.success("Admin updated successfully");
        router.push(`/${lang}/admins`); // Redirect to the admins list page
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
        console.error("Failed to update admin:", error);
        message.error("Failed to update admin");
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

  if (!admin) {
    return <div>Loading...</div>; // Show loading state while fetching admin data
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Admin</h1>
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
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditAdmin;