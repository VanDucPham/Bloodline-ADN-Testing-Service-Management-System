import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ComTable from "../../../Components/ComTable/ComTable";
import useColumnSearch from "../../../components/ComTable/utils";
import { useTableState } from "../../../hook/useTableState";
import { Image } from "antd";
// import { getData } from "../../../api/api";

export const Tables = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const { getColumnSearchProps, getColumnApprox } = useColumnSearch();
  const table = useTableState();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    table.handleOpenLoading();
    // getData("/users")
    //   .then((response) => {
    //     setData(response?.data);
    //     table.setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
        table.handleCloseLoading();
    //   });
  };

  useImperativeHandle(ref, () => ({
    reloadData,
  }));

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      width: 100,
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
        <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
          {record?.avatarUrl ? (
            <Image
              wrapperClassName="object-cover w-full h-full object-cover object-center flex items-center justify-center"
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
      width: 100,
      dataIndex: "roles",
      key: "roles",
      filters: [
        { text: "Khách hàng", value: "Customer" },
        { text: "Y tá", value: "Nurse" },
        { text: "Nhân viên", value: "Staff" },
        { text: "Giám đốc", value: "Director" },
      ],
      onFilter: (value, record) => record?.roles[0]?.name === value,
      sorter: (a, b) => a?.roles[0]?.name?.localeCompare(b?.roles[0]?.name),
      render: (_, render) => render?.roles?.[0]?.name || "",
    },
    {
      title: "Giới tính",
      width: 100,
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Nam", value: "Male" },
        { text: "Nữ", value: "Female" },
      ],
      onFilter: (value, record) => record.gender === value,
      sorter: (a, b) => a?.gender?.localeCompare(b?.gender),
      render: (_, record) => record?.gender || "",
    },
    {
      title: "Năm sinh",
      width: 100,
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (_, record) => record?.dateOfBirth || "",
      sorter: (a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth),
      ...getColumnApprox("dateOfBirth"),
    },
    {
      title: "Số điện thoại",
      width: 100,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber", "Số điện thoại"),
      sorter: (a, b) => a.phoneNumber - b.phoneNumber,
      render: (phone) => phone || "",
    },
    {
      title: "CMND/CCCD",
      width: 100,
      dataIndex: "cccd",
      key: "cccd",
      sorter: (a, b) => a.cccd - b.cccd,
      ...getColumnSearchProps("cccd", "CMND/CCCD"),
      render: (cccd) => cccd || "",
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a?.email?.localeCompare(b?.email),
      ...getColumnSearchProps("email", "Gmail"),
    },
    {
      title: "Địa chỉ",
      width: 100,
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a?.address?.localeCompare(b?.address),
      ...getColumnSearchProps("address", "Địa chỉ"),
    }
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
