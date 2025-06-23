import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnSearch from "../../../components/ComTable/utils";
import { useTableState } from "../../../hook/useTableState";
import { Image, Switch, Space, Button } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

export const Tables = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const { getColumnSearchProps, getColumnApprox } = useColumnSearch();
  const table = useTableState();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    table.handleOpenLoading();
    // API call will go here
    table.handleCloseLoading();
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      width: 150,
      key: "fullName",
      fixed: "left",
      sorter: (a, b) => a.fullName?.localeCompare(b.fullName),
      ...getColumnSearchProps("fullName", "Họ và tên"),
    },
    {
      title: "Ảnh",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 100,
      render: (_, record) => (
        <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
          {record?.avatarUrl ? (
            <Image
              wrapperClassName="object-cover w-full h-full"
              src={record?.avatarUrl}
              alt={record?.avatarUrl}
              preview={{ mask: "Xem ảnh" }}
            />
          ) : (
            <></>
          )}
        </div>
      ),
    },
    {
      title: "Chức vụ",
      width: 120,
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Y tá", value: "Nurse" },
        { text: "Nhân viên", value: "Staff" },
        { text: "Quản lý", value: "Manager" },
      ],
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a?.role?.localeCompare(b?.role),
    },
    {
      title: "Email",
      width: 200,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
      ...getColumnSearchProps("email", "Email"),
    },
    {
      title: "Số điện thoại",
      width: 120,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber", "Số điện thoại"),
    },
    {
      title: "Trạng thái",
      width: 120,
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={(checked) => {
            // Handle status change
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              // View staff details
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // Edit staff
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ComTable
        columns={columns}
        dataSource={data}
        y={"60vh"}
        loading={table.loading}
      />
    </div>
  );
}); 