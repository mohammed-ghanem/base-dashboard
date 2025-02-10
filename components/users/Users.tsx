"use client"
import ReusableTable from '../table/ReusableTable'
import { message, Switch } from "antd";
import { useState } from 'react';

interface User {
    key: string;
    name: string;
    age: number;
    address: string;
    mobile: string;
    verified: boolean;
}

const initialData: User[] = [
    { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park", mobile: "123-456-7890", verified: true },
    { key: "2", name: "Joe Black", age: 42, address: "London No. 1 Lake Park", mobile: "987-654-3210", verified: false },
    { key: "3", name: "Jim Green", age: 32, address: "Sydney No. 1 Lake Park", mobile: "555-555-5555", verified: true },
    { key: "4", name: "Jim Red", age: 32, address: "London No. 2 Lake Park", mobile: "111-222-3333", verified: false },
];

const Users = () => {
    const [data, setData] = useState<User[]>(initialData);

    const handleToggleVerify = (key: string, checked: boolean) => {
        const newData = data.map(item => {
            if (item.key === key) {
                return { ...item, verified: checked };
            }
            return item;
        });
        setData(newData);
        message.success(`User verification status updated to ${checked ? 'verified' : 'unverified'}`);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            searchable: true,
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
            searchable: true,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            searchable: true,
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            searchable: true,
        },
        {
            title: "Verified",
            dataIndex: "verified",
            key: "verified",
            render: (verified: boolean, record: User) => (
                <Switch
                    checked={verified}
                    onChange={(checked: boolean) => handleToggleVerify(record.key, checked)}
                />
            ),
        },
    ];

    return (
        <div>
            <h1 className='titleBox'>العملاء</h1>
            <ReusableTable
                dataSource={data}
                columns={columns}
                pagination={true}
                searchable={true}
                showFirstLast={true}
                pageSizeOptions={[10, 20, 50]}
                defaultPageSize={10}
                checkStrictly={false} // Enable CheckStrictly
            />
        </div>
    )
}

export default Users;