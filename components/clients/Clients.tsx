
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReusableTable from '../table/ReusableTable'; // Adjust the import path as needed
import { message, Modal, Space, Switch } from 'antd'; // Import Switch from Ant Design
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons
import Swal from 'sweetalert2'; // Import SweetAlert2

// Define the type for client data
interface Client {
    key: number; // Unique identifier for each row
    name: string;
    email: string;
    phone: string;
    is_active: number; // 0 or 1
}

const Clients = () => {
    const [clients, setClients] = useState<Client[]>([]); // State to store client data with type
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [selectedClient, setSelectedClient] = useState<Client | null>(null); // State to store the selected client for viewing
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

    // Fetch client data from the API
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = Cookies.get('access_token'); // Get the access token from cookies
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/clients`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the access token in the request headers
                    'api-key': process.env.NEXT_PUBLIC_API_KEY, // Include the API key if required
                },
            });

            // Transform the API response to match the expected structure
            const transformedData: Client[] = response.data.data.data.map((item: any) => ({
                key: item.user.id, // Add a unique key for each row
                name: item.user.name,
                email: item.user.email,
                phone: item.user.mobile,
                is_active: item.user.is_active, // Use the `is_active` field from the API
            }));

            setClients(transformedData); // Set the transformed client data in the state
            console.log('Transformed Data:', transformedData); // Debugging
        } catch (error) {
            message.error("Failed to fetch clients");
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

            // Send a POST request to update the client's status
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/clients/status/${id}`,
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

            // Update the client's status in the local state
            setClients((prevClients) =>
                prevClients.map((client) =>
                    client.key === id ? { ...client, is_active: checked ? 1 : 0 } : client
                )
            );

            message.success('Status updated successfully');
        } catch (error) {
            message.error('Failed to update status');
            console.error('Toggle Error:', error);
        }
    };

    // Handle view action
    const handleView = (record: Client) => {
        setSelectedClient(record); // Set the selected client
        setIsModalVisible(true); // Show the modal
    };

    // Close the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedClient(null); // Reset the selected client
    };

    // Handle delete action
    const handleDelete = async (record: Client) => {
        try {
            const token = Cookies.get('access_token'); // Get the access token from cookies
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-api/v1/clients/${record.key}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the access token in the request headers
                    'api-key': process.env.NEXT_PUBLIC_API_KEY, // Include the API key if required
                },
            });

            // Remove the deleted client from the state
            setClients((prevClients) => prevClients.filter((client) => client.key !== record.key));

            message.success('Client deleted successfully');
        } catch (error) {
            message.error('Failed to delete client');
            console.error('Delete Error:', error);
        }
    };

    // Show SweetAlert2 confirmation before deleting
    const confirmDelete = (record: Client) => {
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
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            searchable: true, // Enable search for this column
        },
        {
            title: 'Status',
            key: 'status',
            render: (text: string, record: Client) => (
                <Switch
                    checked={record.is_active === 1} // Convert 0/1 to boolean
                    onChange={(checked) => handleStatusToggle(record.key, checked)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Client) => (
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
        <div>
            <h1>Clients</h1>
            <div className='w-[95%] container mx-auto'>
                <ReusableTable
                    dataSource={clients}
                    columns={columns}
                    pagination={true} // Enable pagination
                    searchable={true} // Enable global search
                    showFirstLast={true} // Show first/last page buttons
                    pageSizeOptions={[10, 20, 50, 100]} // Custom page size options
                    defaultPageSize={10} // Default page size
                    checkStrictly={false} // Disable CheckStrictly for row selection
                />
            </div>

            {/* Modal for Viewing Client Details */}
            <Modal
                title="Client Details"
                open={isModalVisible} // Use `open` instead of `visible`
                onCancel={handleModalClose}
                footer={null}
            >
                {selectedClient && (
                    <div>
                        <p><strong>Name:</strong> {selectedClient.name}</p>
                        <p><strong>Email:</strong> {selectedClient.email}</p>
                        <p><strong>Phone:</strong> {selectedClient.phone}</p>
                        <p><strong>Status:</strong> {selectedClient.is_active === 1 ? 'Active' : 'Inactive'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Clients;