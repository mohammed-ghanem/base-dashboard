"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { message, Modal } from 'antd'; // Import Ant Design components
import { ExclamationCircleFilled } from '@ant-design/icons'; // Import error icon
import {  useRouter } from 'next/navigation'; // Use next/navigation for App Router

interface Control {
  id: number;
  name: string;
  key: string;
}

interface Permission {
  name: string;
  controls: Control[];
}

const CreateRole = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roleNameAr, setRoleNameAr] = useState<string>(''); // Arabic name
  const [roleNameEn, setRoleNameEn] = useState<string>(''); // English name
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected control IDs
    const router = useRouter();

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      const accessToken = Cookies.get('access_token');

      if (!accessToken) {
        setError('Access token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/permissions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "api-key": process.env.NEXT_PUBLIC_API_KEY,
              'Accept-Language': 'ar',
              
            },
          }
        );

        setPermissions(response.data.data);
      } catch (err) {
        setError('Failed to fetch permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (controlId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(controlId)
        ? prev.filter((id) => id !== controlId) // Uncheck
        : [...prev, controlId] // Check
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = Cookies.get('access_token');

    if (!accessToken) {
      setError('Access token not found');
      return;
    }

    // Check if no permissions are selected
    if (selectedPermissions.length === 0) {
      setError('You must select at least one role.');
      showErrorModal('You must select at least one role.'); // Show Ant Design modal
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
        {
          name: {
            ar: roleNameAr, // Arabic name
            en: roleNameEn, // English name
          },
          role_permissions: selectedPermissions, // Selected control IDs
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "api-key": process.env.NEXT_PUBLIC_API_KEY,
            'Accept-Language': 'ar',
          },
        }
      );

      console.log('Role created successfully:', response.data);
      message.success('Role created successfully!'); // Show success message
      router.push('/roles'); // Navigate back to the roles page
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError('You must select at least one role.');
        showErrorModal('You must select at least one role.'); // Show Ant Design modal
      } else {
        setError('Failed to create role');
        message.error('Failed to create role'); // Show error message
      }
    }
  };

  // Function to show Ant Design error modal
  const showErrorModal = (errorMessage: string) => {
    Modal.error({
      title: 'Error',
      content: errorMessage,
      icon: <ExclamationCircleFilled />, // Add error icon
      okText: 'OK', // Customize the OK button text
      onOk: () => setError(null), // Clear error state on OK
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 titleBox">انشاء صلاحية</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 w-[80%] mx-auto">
          {/* Arabic Role Name Input */}
          <div className="mb-4">
            <label htmlFor="roleNameAr" className="block text-sm font-medium mb-2">
              اسم الصلاحية (باللغة العربية)
            </label>
            <input
              type="text"
              id="roleNameAr"
              value={roleNameAr}
              onChange={(e) => setRoleNameAr(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
              required
            />
          </div>

          {/* English Role Name Input */}
          <div className="mb-4">
            <label htmlFor="roleNameEn" className="block text-sm font-medium mb-2">
              اسم الصلاحية (باللغة الانجليزية)
            </label>
            <input
              type="text"
              id="roleNameEn"
              value={roleNameEn}
              onChange={(e) => setRoleNameEn(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
              required
            />
          </div>
        </div>

        {/* Permissions and Controls */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">اختر الصلاحيات</h2>
          <ul className="w-[95%] mx-auto bg-white custom_shadow grid grid-cols-2 gap-4 p-8">
            {permissions.map((permission) => (
              <li key={permission.name} className="mb-4 custom_shadow">
                <div>
                  <h6 className="font-medium mx-auto titleBox">{permission.name}</h6>
                  <ul className="ml-4 grid grid-cols-3 my-5">
                    {permission.controls.map((control) => (
                      <li key={control.id} className="text-sm bold mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            value={control.id}
                            checked={selectedPermissions.includes(control.id)}
                            onChange={() => handleCheckboxChange(control.id)}
                            className="ms-2 ml-2 accent-green-600"
                          />
                          {control.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn_success block mx-auto">
          انشاء الصلاحية
        </button>
      </form>
    </div>
  );
};

export default CreateRole;




// "use client";

// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useEffect, useState } from 'react';

// interface Control {
//   id: number;
//   name: string;
//   key: string;
// }

// interface Permission {
//   name: string;
//   controls: Control[];
// }

// const CreateRole = () => {
//   const [permissions, setPermissions] = useState<Permission[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [roleNameAr, setRoleNameAr] = useState<string>(''); // Arabic name
//   const [roleNameEn, setRoleNameEn] = useState<string>(''); // English name
//   const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]); // Track selected control IDs

//   // Fetch permissions
//   useEffect(() => {
//     const fetchPermissions = async () => {
//       const accessToken = Cookies.get('access_token');

//       if (!accessToken) {
//         setError('Access token not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/permissions`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               'Accept-Language': 'ar',
//             },
//           }
//         );

//         setPermissions(response.data.permissions);
//       } catch (err) {
//         setError('Failed to fetch permissions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   // Handle checkbox change
//   const handleCheckboxChange = (controlId: number) => {
//     setSelectedPermissions((prev) =>
//       prev.includes(controlId)
//         ? prev.filter((id) => id !== controlId) // Uncheck
//         : [...prev, controlId] // Check
//     );
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const accessToken = Cookies.get('access_token');

//     if (!accessToken) {
//       setError('Access token not found');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/roles`,
//         {
//           name: {
//             ar: roleNameAr, // Arabic name
//             en: roleNameEn, // English name
//           },
//           role_permissions: selectedPermissions, // Selected control IDs
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Accept-Language': 'ar',
//           },
//         }
//       );

//       console.log('Role created successfully:', response.data);
//       alert('Role created successfully!');
//     } catch (err) {
//       console.error('Failed to create role:', err);
//       setError('Failed to create role');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className=" mb-4 titleBox">انشاء صلاحية</h1>
//       <form onSubmit={handleSubmit}>
//         <div className='grid grid-cols-2 gap-2 w-[80%] mx-auto '>
//           {/* Arabic Role Name Input */}
//           <div className="mb-4">
//             <label htmlFor="roleNameAr" className="block text-sm font-medium mb-2">
//               اسم الصلاحية (باللغة العربية)
//             </label>
//             <input
//               type="text"
//               id="roleNameAr"
//               value={roleNameAr}
//               onChange={(e) => setRoleNameAr(e.target.value)}
//               className="w-full p-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
//               required
//             />
//           </div>

//           {/* English Role Name Input */}
//           <div className="mb-4">
//             <label htmlFor="roleNameEn" className="block text-sm font-medium mb-2">
//               اسم الصلاحية (باللغة الانجليزية)
//             </label>
//             <input
//               type="text"
//               id="roleNameEn"
//               value={roleNameEn}
//               onChange={(e) => setRoleNameEn(e.target.value)}
//               className="w-full p-2 border rounded focus:outline-none shadow-[0_1px_8px_#398ab729]"
//               required
//             />
//           </div>
//         </div>

//         {/* Permissions and Controls */}
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold mb-4">اختر الصلاحيات</h2>
//           <ul className='w-[95%] mx-auto bg-white custom_shadow grid grid-cols-2 gap-4 p-8'>
//             {permissions.map((permission) => (
//               <li key={permission.name} className="mb-4 custom_shadow">
//                 <div>
//                   <h6 className="font-medium mx-auto titleBox">{permission.name}</h6>
//                   <ul className="ml-4 grid grid-cols-3 my-5">
//                     {permission.controls.map((control) => (
//                       <li key={control.id} className="text-sm bold mt-2">
//                         <label className="flex items-center">
//                           <input
//                             type="checkbox"
                            
//                             value={control.id}
//                             checked={selectedPermissions.includes(control.id)}
//                             onChange={() => handleCheckboxChange(control.id)}
//                             className="ms-2 ml-2 accent-green-600"
//                           />
//                           {control.name}
//                         </label>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="btn_success block mx-auto"
//         >
//           انشاء الصلاحية
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateRole;