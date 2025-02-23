"use client";

import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

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
              'Accept-Language': 'ar',
            },
          }
        );

        setPermissions(response.data.permissions);
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
            'Accept-Language': 'ar',
          },
        }
      );

      console.log('Role created successfully:', response.data);
      alert('Role created successfully!');
    } catch (err) {
      console.error('Failed to create role:', err);
      setError('Failed to create role');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Role</h1>
      <form onSubmit={handleSubmit}>
        {/* Arabic Role Name Input */}
        <div className="mb-4">
          <label htmlFor="roleNameAr" className="block text-sm font-medium mb-2">
            Role Name (Arabic)
          </label>
          <input
            type="text"
            id="roleNameAr"
            value={roleNameAr}
            onChange={(e) => setRoleNameAr(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* English Role Name Input */}
        <div className="mb-4">
          <label htmlFor="roleNameEn" className="block text-sm font-medium mb-2">
            Role Name (English)
          </label>
          <input
            type="text"
            id="roleNameEn"
            value={roleNameEn}
            onChange={(e) => setRoleNameEn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Permissions and Controls */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Permissions</h2>
          <ul>
            {permissions.map((permission) => (
              <li key={permission.name} className="mb-4">
                <div className="font-medium">{permission.name}</div>
                <ul className="ml-4">
                  {permission.controls.map((control) => (
                    <li key={control.id} className="text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value={control.id}
                          checked={selectedPermissions.includes(control.id)}
                          onChange={() => handleCheckboxChange(control.id)}
                          className="mr-2"
                        />
                        {control.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Role
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

//   useEffect(() => {
//     const fetchPermissions = async () => {
//       const accessToken = Cookies.get('access_token');

//       if (!accessToken) {
//         setError('Access token not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Fetch permissions with controls
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/permissions`,
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//               'Accept-Language': 'ar',
//             },
//           }
//         );

//         // Set permissions with their controls
//         setPermissions(response.data.permissions);
//       } catch (err) {
//         setError('Failed to fetch permissions');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPermissions();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Create Role</h1>
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Permissions</h2>
//         <ul>
//           {permissions.map((permission) => (
//             <li key={permission.name} className="mb-4">
//               <div className="font-medium">{permission.name}</div>
//               {permission.controls && permission.controls.length > 0 && (
//                 <ul className="ml-4">
//                   {permission.controls.map((control) => (
//                     <li key={control.id} className="text-sm">
//                       {control.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CreateRole;