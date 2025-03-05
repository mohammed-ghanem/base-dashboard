"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { message, Switch } from "antd"; // Import Switch from Ant Design
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"; // Import delete, edit, and lock icons
import ReusableTable from "../table/ReusableTable";
import Cookies from "js-cookie";
import Link from "next/link";
import LangUseParams from "../translate/LangUseParams";
import TranslateHook from "../translate/TranslateHook";
import Swal from "sweetalert2"; // Import SweetAlert2

const Roles = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const lang = LangUseParams(); // Access dynamic [lang] parameter
  const translate = TranslateHook();

  // Fetch permissions
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token"); // Get the access token from cookies

      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
        {
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${token}`,
            "api-key": process.env.NEXT_PUBLIC_API_KEY,
            "Accept-Language": "ar",
          },
          withCredentials: true,
        }
      );

      // Map the API response to include the `is_active` field
      const formattedData = response.data.data.data.map((item: any, index: number) => ({
        key: item.id || index, // Unique key for each row
        name: item.name, // Role name
        description: item.description || "N/A", // Handle missing descriptions
        is_active: item.is_active, // Use the `is_active` field from the API
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Failed to fetch roles");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete role
  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("access_token");

      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles/${id}`,
        {
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${token}`,
            "api-key": process.env.NEXT_PUBLIC_API_KEY,
            "Accept-Language": "ar",
          },
          withCredentials: true,
        }
      );

      // Remove the deleted role from the table
      setData((prevData) => prevData.filter((item) => item.key !== id));
      message.success("Role deleted successfully");
    } catch (error) {
      message.error("Failed to delete role");
      console.error("Delete Error:", error);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: number, checked: boolean) => {
    try {
      const token = Cookies.get("access_token");

      await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      // Send a post request to update the status
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles/toggle-role/${id}`,
        { is_active: checked }, // Send the new status in the request body
        {
          headers: {
            "X-XSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${token}`,
            "api-key": process.env.NEXT_PUBLIC_API_KEY,
            "Accept-Language": "ar",
          },
          withCredentials: true,
        }
      );

      // Update the status in the local state
      setData((prevData) =>
        prevData.map((item) =>
          item.key === id ? { ...item, is_active: checked } : item
        )
      );
      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
      console.error("Toggle Error:", error);
    }
  };

  // Define Table Columns
  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      searchable: true,
      render: (name: string) => (
        <span className={"text-blue-600 font-bold text-lg"}>{name}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean, record: any) => (
        <>
          {record.name === "Admin" || record.name === "ادمن" ? (
            <LockOutlined
              className="text-gray-500 text-2xl"
              style={{ color: "gray" }}
              title="Locked"
            />
          ) : (
            <Switch
              checked={is_active}
              onChange={(checked: boolean) => handleToggleStatus(record.key, checked)}
            />
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div>
          {record.name !== "Admin" && record.name !== "ادمن" && (
            <Link href={`/${lang}/roles/edit/${record.key}`}>
              <EditOutlined
                className="text-blue-500 me-3 cursor-pointer text-xl"
                title="Edit Role"
              />
            </Link>
          )}
          {record.name !== "Admin" && record.name !== "ادمن" && (
            <DeleteOutlined
              className="cursor-pointer text-xl"
              style={{ color: "red" }}
              title="Delete Role"
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(record.key);
                  }
                });
              }}
            />
          )}
          {(record.name === "Admin" || record.name === "ادمن") && (
            <span style={{ marginLeft: 8 }}>
              <LockOutlined
                className="text-gray-500 text-2xl"
                style={{ color: "gray" }}
                title="Locked"
              />
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-8">المهام والصلاحيات</h2>
      <Link href={`/${lang}/roles/create`} className="titleBox">
        اضافة صلاحية
      </Link>
      <div className='w-[95%] container mx-auto'>
        <ReusableTable
          dataSource={data}
          columns={columns}
          pagination={true}
          searchable={true}
          showFirstLast={true}
          defaultPageSize={10}
        />
      </div>

    </div>
  );
};

export default Roles;




// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { message, Popconfirm, Switch } from "antd"; // Import Switch from Ant Design
// import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"; // Import delete, edit, and lock icons
// import ReusableTable from "../table/ReusableTable";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import LangUseParams from "../translate/LangUseParams";
// import TranslateHook from "../translate/TranslateHook";

// const Roles = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const lang = LangUseParams(); // Access dynamic [lang] parameter
//   const translate = TranslateHook();

//   // Fetch permissions
//   useEffect(() => {
//     fetchPermissions();
//   }, []);

//   const fetchPermissions = async () => {
//     setLoading(true);
//     try {
//       const token = Cookies.get("access_token"); // Get the access token from cookies

//       await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//         withCredentials: true,
//       });
//       const csrfToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1];

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
//         {
//           headers: {
//             "X-XSRF-TOKEN": csrfToken,
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": "ar",
//           },
//           withCredentials: true,
//         }
//       );

//       // Map the API response to include the `is_active` field
//       const formattedData = response.data.data.map((item: any, index: number) => ({
//         key: item.id || index, // Unique key for each row
//         name: item.name, // Role name
//         description: item.description || "N/A", // Handle missing descriptions
//         is_active: item.is_active, // Use the `is_active` field from the API
//       }));
//       setData(formattedData);
//     } catch (error) {
//       message.error("Failed to fetch roles");
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete role
//   const handleDelete = async (id: number) => {
//     try {
//       const token = Cookies.get("access_token");

//       await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//         withCredentials: true,
//       });
//       const csrfToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1];

//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles/${id}`,
//         {
//           headers: {
//             "X-XSRF-TOKEN": csrfToken,
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": "ar",
//           },
//           withCredentials: true,
//         }
//       );

//       // Remove the deleted role from the table
//       setData((prevData) => prevData.filter((item) => item.key !== id));
//       message.success("Role deleted successfully");
//     } catch (error) {
//       message.error("Failed to delete role");
//       console.error("Delete Error:", error);
//     }
//   };

//   // Handle toggle status
//   const handleToggleStatus = async (id: number, checked: boolean) => {
//     try {
//       const token = Cookies.get("access_token");

//       await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//         withCredentials: true,
//       });
//       const csrfToken = document.cookie
//         .split("; ")
//         .find((row) => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1];

//       // Send a PUT request to update the status
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles/${id}/status`,
//         { is_active: checked }, // Send the new status in the request body
//         {
//           headers: {
//             "X-XSRF-TOKEN": csrfToken,
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": "ar",
//           },
//           withCredentials: true,
//         }
//       );

//       // Update the status in the local state
//       setData((prevData) =>
//         prevData.map((item) =>
//           item.key === id ? { ...item, is_active: checked } : item
//         )
//       );
//       message.success("Status updated successfully");
//     } catch (error) {
//       message.error("Failed to update status");
//       console.error("Toggle Error:", error);
//     }
//   };

//   // Define Table Columns
//   const columns = [
//     {
//       title: "Role Name",
//       dataIndex: "name",
//       key: "name",
//       searchable: true,
//       render: (name: string) => (
//         <span className={"text-blue-600 font-bold text-lg"}>{name}</span>

//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (is_active: boolean, record: any) => (
//         <>
//           {record.name === "Admin" || record.name === "ادمن" ? (
//             <LockOutlined
//               className="text-gray-500 text-2xl"
//               style={{ color: "gray" }}
//               title="Locked"
//             />
//           ) : (
//             <Switch
//               checked={is_active}
//               onChange={(checked: boolean) => handleToggleStatus(record.key, checked)}
//             />
//           )}
//         </>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (text: string, record: any) => (
//         <div>
//           {record.name !== "Admin" && record.name !== "ادمن" && (
//             <Link href={`/${lang}/roles/edit/${record.key}`}>
//               <EditOutlined
//                 className="text-blue-500 me-3 cursor-pointer text-xl"
//                 title="Edit Role"
//               />
//             </Link>
//           )}
//           {record.name !== "Admin" && record.name !== "ادمن" && (
//             <Popconfirm
//               title="Are you sure you want to delete this role?"
//               onConfirm={() => handleDelete(record.key)} // Call handleDelete with the role ID
//               okText="Yes"
//               cancelText="No"
//             >
//               <DeleteOutlined
//                 className="cursor-pointer text-xl"
//                 style={{ color: "red" }}
//                 title="Delete Role"
//               />
//             </Popconfirm>
//           )}
//           {(record.name === "Admin" || record.name === "ادمن") && (
//             <span style={{ marginLeft: 8 }}>
//               <LockOutlined
//                 className="text-gray-500 text-2xl"
//                 style={{ color: "gray" }}
//                 title="Locked"
//               />
//             </span>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-8">المهام والصلاحيات</h2>
//       <Link href={`/${lang}/roles/create`} className="titleBox">
//         اضافة صلاحية
//       </Link>
//       <ReusableTable
//         dataSource={data}
//         columns={columns}
//         pagination={true}
//         searchable={true}
//         showFirstLast={true}
//         defaultPageSize={10}
//       />
//     </div>
//   );
// };

// export default Roles;

