"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import ReusableTable from "../table/ReusableTable";
import Cookies from "js-cookie";


const Roles = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token"); // Get the access token from cookies

        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
          withCredentials: true,
        });
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1];

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`, {
          headers: {
            'X-XSRF-TOKEN': csrfToken,
            Authorization: `Bearer ${token}`,
            "Accept-Language": 'ar',
          },
          withCredentials: true,
        });
        const formattedData = response.data.data.map((item: any, index: number) => ({
          key: item.id || index, // Unique key for each row
          name: item.name, // Assuming API returns 'name'
          description: item.description || "N/A", // Handle missing descriptions
        }));
        setData(formattedData);
        console.log(data)
      } catch (error) {
        message.error("Failed to fetch permissions");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [data]);

  // Define Table Columns
  const columns = [
    {
      title: "Permission Name",
      dataIndex: "name",
      key: "name",
      searchable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      searchable: false,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
      <ReusableTable
        dataSource={data}
        columns={columns}
        pagination={true}
        searchable={true}
        showFirstLast={true}
        defaultPageSize={10}
      />
    </div>
  );
};

export default Roles;
