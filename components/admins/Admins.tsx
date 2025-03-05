"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReusableTable from '../table/ReusableTable'; // Adjust the import path as needed
import { message, Modal, Space, Switch } from 'antd'; // Import Switch from Ant Design
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons
import Swal from 'sweetalert2'; // Import SweetAlert2
import Link from 'next/link';
import LangUseParams from '../translate/LangUseParams';

// Define the type for admin data
interface Admin {
    key: number; // Unique identifier for each row
    name: string;
    email: string;
    roles: string;
    is_active: number; // 0 or 1
}

const Admins = () => {
    const [admins, setAdmins] = useState<Admin[]>([]); // State to store admin data with type
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null); // State to store the selected admin for viewing
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const lang = LangUseParams(); // Access dynamic [lang] parameter


    // Fetch admin data from the API
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = Cookies.get('access_token'); // Get the access token from cookies
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the access token in the request headers
                    'api-key': process.env.NEXT_PUBLIC_API_KEY, // Include the API key if required
                    'Accept-Language': 'ar', // Include the language header
                },
            });

            // Transform the API response to match the expected structure
            const transformedData: Admin[] = response.data.data.data.map((item: any) => ({
                key: item.user.id, // Add a unique key for each row
                name: item.user.name,
                email: item.user.email,
                roles: item.user.roles.map((role: any) => role.name).join(', '),
                is_active: item.user.is_active, // Use the `is_active` field from the API
            }));

            setAdmins(transformedData); // Set the transformed admin data in the state
            console.log('Transformed Data:', transformedData); // Debugging
        } catch (error) {
            message.error("Failed to fetch admins");
            console.error("API Error:", error);
        } finally {
            setLoading(false); // Set loading to false when the request is complete
        }
    };

    // Handle status toggle
    const handleStatusToggle = async (id: number, checked: boolean) => {
        try {
            const token = Cookies.get('access_token'); // Get the access token from cookies

            // Fetch CSRF token
            await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });

            // Extract CSRF token from cookies
            const csrfToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            // Send a POST request to update the admin's status
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/status/${id}`,
                { is_active: checked }, // Send the new status in the request body
                {
                    headers: {
                        'X-XSRF-TOKEN': csrfToken, // Include the CSRF token
                        Authorization: `Bearer ${token}`, // Include the access token
                        'api-key': process.env.NEXT_PUBLIC_API_KEY, // Include the API key
                        'Accept-Language': 'ar', // Include the language header
                    },
                    withCredentials: true, // Include credentials
                }
            );

            // Update the admin's status in the local state
            setAdmins((prevAdmins) =>
                prevAdmins.map((admin) =>
                    admin.key === id ? { ...admin, is_active: checked ? 1 : 0 } : admin
                )
            );

            message.success('Status updated successfully');
        } catch (error) {
            message.error('Failed to update status');
            console.error('Toggle Error:', error);
        }
    };

    // Handle view action
    const handleView = (record: Admin) => {
        setSelectedAdmin(record); // Set the selected admin
        setIsModalVisible(true); // Show the modal
    };

    // Close the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedAdmin(null); // Reset the selected admin
    };

    // Handle delete action
    const handleDelete = async (record: Admin) => {
        try {
            const token = Cookies.get('access_token'); // Get the access token from cookies
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/admins/${record.key}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the access token in the request headers
                    'api-key': process.env.NEXT_PUBLIC_API_KEY, // Include the API key if required
                },
            });

            // Remove the deleted admin from the state
            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.key !== record.key));

            message.success('Admin deleted successfully');
        } catch (error) {
            message.error('Failed to delete admin');
            console.error('Delete Error:', error);
        }
    };

    // Show SweetAlert2 confirmation before deleting
    const confirmDelete = (record: Admin) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(record); // Call the delete function if confirmed
            }
        });
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            searchable: true, // Enable search for this column
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            searchable: true, // Enable search for this column
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            searchable: true, // Enable search for this column
        },
        {
            title: 'Status',
            key: 'status',
            render: (text: string, record: Admin) => (
                <Switch
                    checked={record.is_active === 1} // Convert 0/1 to boolean
                    onChange={(checked) => handleStatusToggle(record.key, checked)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Admin) => (
                <Space size="middle">
                    {/* View Icon */}
                    <EyeOutlined
                        className='text-xl cursor-pointer'
                        onClick={() => handleView(record)}
                        style={{ color: '#1890ff' }}
                    />
                    {/* Delete Icon */}
                    <DeleteOutlined
                        className='text-xl cursor-pointer'
                        onClick={() => confirmDelete(record)}
                        style={{ color: '#f5222d' }}
                    />
                </Space>
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div className='p-4'>
            <h2 className="text-xl font-semibold mb-8">المدراء</h2>
            <Link href={`/${lang}/admins/create`} className="titleBox">
                اضافة مدير للنظام
            </Link>
            <div className='w-[95%] container mx-auto'>
                <ReusableTable
                    dataSource={admins}
                    columns={columns}
                    pagination={true} // Enable pagination
                    searchable={true} // Enable global search
                    showFirstLast={true} // Show first/last page buttons
                    pageSizeOptions={[10, 20, 50, 100]} // Custom page size options
                    defaultPageSize={10} // Default page size
                    checkStrictly={false} // Disable CheckStrictly for row selection
                />
            </div>

            {/* Modal for Viewing Admin Details */}
            <Modal
                title="Admin Details"
                open={isModalVisible} // Use `open` instead of `visible`
                onCancel={handleModalClose}
                footer={null}
            >
                {selectedAdmin && (
                    <div>
                        <p><strong>Name:</strong> {selectedAdmin.name}</p>
                        <p><strong>Email:</strong> {selectedAdmin.email}</p>
                        <p><strong>Role:</strong> {selectedAdmin.roles}</p>
                        <p><strong>Status:</strong> {selectedAdmin.is_active === 1 ? 'Active' : 'Inactive'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Admins;