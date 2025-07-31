import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreAddOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./ManagerLayout.css";

const { Header, Sider, Content } = Layout;

const ManagerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = user?.fullName || "Manager";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { key: "/manager/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/manager/employees", icon: <TeamOutlined />, label: "Danh sách nhân viên" },
     { key: "/manager/services", icon: <AppstoreAddOutlined />, label: "Dịch vụ" },
    { key: "/manager/schedules", icon: <CalendarOutlined />, label: "Lịch làm việc" },
    { key: "/manager/areas", icon: <EnvironmentOutlined />, label: "Quản lý khu vực" },
    { key: "/manager/tracking", icon: <BarChartOutlined />, label: "Theo dõi hồ sơ" },
    { key: "/manager/blogs", icon: <FileTextOutlined />, label: "Blog" },
    { key: "/manager/report", icon: <BarChartOutlined />, label: "Phản hổi khách hàng" },

  ];

  return (
    <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo">👨‍💼 Manager</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="manager-header">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
            style={{ marginRight: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <button
      className="home-btn"
      onClick={() => navigate('/')}
      style={{ marginLeft: 16, fontWeight: 'bold', fontSize: '16px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
    >
      Trang chủ
    </button>
          <div className="manager-info">
            <UserOutlined style={{ marginRight: 8 }} />
            {userName}
            <LogoutOutlined
              style={{ marginLeft: 20, cursor: "pointer" }}
              onClick={handleLogout}
              title="Đăng xuất"
            />
          </div>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
