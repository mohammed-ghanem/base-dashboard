"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Space,
  Table,
  Pagination,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

interface ReusableTableProps {
  dataSource: any[]; // Data for the table
  columns: any[]; // Columns configuration
  pagination?: boolean; // Enable/disable pagination
  searchable?: boolean; // Enable/disable global search
  showFirstLast?: boolean; // Show first/last page buttons
  pageSizeOptions?: number[]; // Custom page size options
  defaultPageSize?: number; // Default page size
  actions?: {
    // Optional action buttons
    show?: boolean; // Show button
    edit?: boolean; // Edit button
    delete?: boolean; // Delete button
    custom?: (record: any) => React.ReactNode; // Custom button(s)
  };
  checkStrictly?: boolean; // Enable/disable CheckStrictly for row selection
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  dataSource,
  columns,
  pagination = true,
  searchable = true,
  showFirstLast = true,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  actions = { show: true, edit: true, delete: true }, // Default actions
  checkStrictly = false, // Default CheckStrictly
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // Selected rows for CheckStrictly

  // Handle global search
  const handleGlobalSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Handle column-specific search
  const handleColumnSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Reset search
  const handleResetSearch = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  // Add search functionality to columns
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleColumnSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleResetSearch(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  // Add search props to columns
  const enhancedColumns = columns.map((col) => ({
    ...col,
    ...(col.searchable ? getColumnSearchProps(col.dataIndex) : {}),
  }));

  // Add loop iteration column
  const iterationColumn = {
    title: "#", // Column header
    key: "iteration",
    render: (text: string, record: any, index: number) => {
      // Calculate the iteration number based on the current page and page size
      const iterationNumber = (currentPage - 1) * pageSize + index + 1;
      return iterationNumber;
    },
  };

  // Insert the iteration column at the beginning of the columns array
  enhancedColumns.unshift(iterationColumn);

  // Add action column if actions are enabled
  if (actions.show || actions.edit || actions.delete || actions.custom) {
    enhancedColumns.push({
      title: "Actions",
      key: "actions",
      render: (text: string, record: any) => (
        <Space size="middle">
          {actions.show && (
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleShow(record)}
            ></Button>
          )}
          {actions.edit && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            ></Button>
          )}
          {actions.delete && (
            <Popconfirm
              title="Are you sure you want to delete this record?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<DeleteOutlined />} danger></Button>
            </Popconfirm>
          )}
          {actions.custom && actions.custom(record)}
        </Space>
      ),
    });
  }

  // Handle actions
  const handleShow = (record: any) => {
    message.info(`Show record with key: ${record.key}`);
    // Add your logic to handle "Show" action
  };

  const handleEdit = (record: any) => {
    message.info(`Edit record with key: ${record.key}`);
    // Add your logic to handle "Edit" action
  };

  const handleDelete = (record: any) => {
    message.success(`Deleted record with key: ${record.key}`);
    // Add your logic to handle "Delete" action
  };

  // Handle row selection
  const onSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    checkStrictly, // Enable/disable CheckStrictly
  };

  // Filter data based on search text
  const filteredData = dataSource.filter((item) =>
    Object.keys(item).some((key) =>
      item[key].toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="text-end">
      {/* Global Search */}
      {searchable && (
        <Input
          className="w-80 mb-5 rounded"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleGlobalSearch(e.target.value)}
          style={{
            width: 300, // Custom width
            border: "1px solid #398AB7", // Custom border
            padding: "8px 16px", // Custom padding
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", // Add shadow
          }}
          prefix={<SearchOutlined style={{ color: "#398AB7" }} />} // Custom icon color
        />
      )}

      {/* Table */}
      <Table
        columns={enhancedColumns}
        dataSource={paginatedData}
        pagination={false}
        rowKey="key"
        rowSelection={checkStrictly ? rowSelection : undefined} // Enable row selection if CheckStrictly is true
      />

      {/* Pagination */}
      {pagination && (
        <div className=" flex justify-center my-5 text-right">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            // showQuickJumper
            pageSizeOptions={pageSizeOptions}
            // showTotal={(total) => `Total ${total} items`}
            showLessItems={!showFirstLast}
            nextIcon={<LeftOutlined style={{ fontSize: "12px", color: "#398AB7" }} />} // Custom next icon
            prevIcon={<RightOutlined style={{ fontSize: "12px", color: "#398AB7" }} />} // Custom previous icon
          />
        </div>
      )}
    </div>
  );
};

export default ReusableTable;