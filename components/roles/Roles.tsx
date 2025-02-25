"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { message, Popconfirm } from "antd"; // Import Popconfirm for delete confirmation
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"; // Import delete and edit icons
import ReusableTable from "../table/ReusableTable";
import Cookies from "js-cookie";
import Link from "next/link";
import LangUseParams from "../translate/LangUseParams";
import TranslateHook from "../translate/TranslateHook";

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
            "Accept-Language": "ar",
          },
          withCredentials: true,
        }
      );

      const formattedData = response.data.data.map((item: any, index: number) => ({
        key: item.id || index, // Unique key for each row
        name: item.name, // Assuming API returns 'name'
        description: item.description || "N/A", // Handle missing descriptions
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Failed to fetch permissions");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete permission
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
            "Accept-Language": "ar",
          },
          withCredentials: true,
        }
      );

      // Remove the deleted permission from the table
      setData((prevData) => prevData.filter((item) => item.key !== id));
      message.success("Permission deleted successfully");
    } catch (error) {
      message.error("Failed to delete permission");
      console.error("Delete Error:", error);
    }
  };

  // Define Table Columns
  const columns = [
    {
      title: "Permission Name",
      dataIndex: "name",
      key: "name",
      searchable: true,
    },
    {
      title: "Status",
      dataIndex: "description",
      key: "description",
      searchable: false,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <div>
          <Link href={`/${lang}/roles/edit/${record.key}`}>
            <EditOutlined
              style={{ color: "blue", cursor: "pointer", marginRight: 8 }}
              title="Edit Permission"
            />
          </Link>
          <Popconfirm
            title="Are you sure you want to delete this permission?"
            onConfirm={() => handleDelete(record.key)} // Call handleDelete with the permission ID
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              title="Delete Permission"
            />
          </Popconfirm>
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
      <ReusableTable
        dataSource={data}
        columns={columns}
        pagination={true}
        searchable={true}
        showFirstLast={true}
        defaultPageSize={10}
        actions={{
          show: false,
          edit: false,
          delete: false,
        }}
      />
    </div>
  );
};

export default Roles;




// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { message, Popconfirm } from "antd"; // Import Popconfirm for delete confirmation
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons"; // Import delete icon
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

//       const formattedData = response.data.data.map((item: any, index: number) => ({
//         key: item.id || index, // Unique key for each row
//         name: item.name, // Assuming API returns 'name'
//         description: item.description || "N/A", // Handle missing descriptions
//       }));
//       setData(formattedData);
//     } catch (error) {
//       message.error("Failed to fetch permissions");
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle delete permission
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

//       // Remove the deleted permission from the table
//       setData((prevData) => prevData.filter((item) => item.key !== id));
//       message.success("Permission deleted successfully");
//     } catch (error) {
//       message.error("Failed to delete permission");
//       console.error("Delete Error:", error);
//     }
//   };

//  // Handle edit permission
//  const handleEdit = (id: number) => {
//   // Navigate to the edit page or open a modal
//   window.location.href = `/${lang}/roles/edit/${id}`;
// };


//   // Define Table Columns
//   const columns = [
//     {
//       title: "Permission Name",
//       dataIndex: "name",
//       key: "name",
//       searchable: true,
//     },
//     {
//       title: "Status",
//       dataIndex: "description",
//       key: "description",
//       searchable: false,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (text: string, record: any) => (
//         <div>
//           <EditOutlined
//             style={{ color: "blue", cursor: "pointer", marginRight: 8 }}
//             onClick={() => handleEdit(record.key)}
//             title="Edit Permission"
//           />
//           <Popconfirm
//             title="Are you sure you want to delete this permission?"
//             onConfirm={() => handleDelete(record.key)} // Call handleDelete with the permission ID
//             okText="Yes"
//             cancelText="No"
//           >
//             <DeleteOutlined
//               style={{ color: "red", cursor: "pointer" }}
//               title="Delete Permission"
//             />
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];


//   // const columns = [
//   //   {
//   //     title: "Permission Name",
//   //     dataIndex: "name",
//   //     key: "name",
//   //     searchable: true,
//   //   },
//   //   {
//   //     title: "Status",
//   //     dataIndex: "description",
//   //     key: "description",
//   //     searchable: false,
//   //   },
//   //   {
//   //     title: "Actions",
//   //     key: "actions",
//   //     render: (text: string, record: any) => (
//   //       <Popconfirm
//   //         title="Are you sure you want to delete this permission?"
//   //         onConfirm={() => handleDelete(record.key)} // Call handleDelete with the permission ID
//   //         okText="Yes"
//   //         cancelText="No"
//   //       >
//   //         <DeleteOutlined
//   //           style={{ color: "red", cursor: "pointer" }}
//   //           title="Delete Permission"
//   //         />
//   //       </Popconfirm>
//   //     ),
//   //   },
//   // ];

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
//         actions={{
//           show: false,
//           edit: false,
//           delete: false,
//         }}
//       />
//     </div>
//   );
// };

// export default Roles;





// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { message } from "antd";
// import ReusableTable from "../table/ReusableTable";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import LangUseParams from "../translate/LangUseParams";
// import TranslateHook from "../translate/TranslateHook";


// const Roles = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//     // lang param (ar Or en)
//     const lang = LangUseParams() // Access dynamic [lang] parameter
//     const translate = TranslateHook();

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       setLoading(true);
//       try {
//         const token = Cookies.get("access_token"); // Get the access token from cookies

//         await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
//           withCredentials: true,
//         });
//         const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))
//           ?.split('=')[1];

//         const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`, {
//           headers: {
//             'X-XSRF-TOKEN': csrfToken,
//             Authorization: `Bearer ${token}`,
//             "Accept-Language": 'ar',
//           },
//           withCredentials: true,
//         });
//         const formattedData = response.data.data.map((item: any, index: number) => ({
//           key: item.id || index, // Unique key for each row
//           name: item.name, // Assuming API returns 'name'
//           description: item.description || "N/A", // Handle missing descriptions
//         }));
//         setData(formattedData);
        
//       } catch (error) {
//         message.error("Failed to fetch permissions");
//         console.error("API Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   // Define Table Columns
//   const columns = [
//     {
//       title: "Permission Name",
//       dataIndex: "name",
//       key: "name",
//       searchable: true,
//     },
//     {
//       title: "status",
//       dataIndex: "description",
//       key: "description",
//       searchable: false,
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-8">المهام والصلاحيات</h2>
//       <Link href={`/${lang}/roles/create`} className="titleBox"> اضافة صلاحية</Link>
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
