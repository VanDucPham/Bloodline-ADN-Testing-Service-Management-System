import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
   DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  AppstoreAddOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.jpg";
import "./AdminLayout.css";

const { Header, Sider, Content } = Layout;

const ComHeaderAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

const menuItems = [
      { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/accounts", icon: <UserOutlined />, label: "Tài khoản" },
    { key: "/admin/services", icon: <AppstoreAddOutlined />, label: "Dịch vụ" },
    { key: "/admin/schedules", icon: <CalendarOutlined />, label: "Lịch làm việc" },
    { key: "/admin/feedbacks", icon: <MessageOutlined />, label: "Phản hồi" },
    { key: "/admin/blogs", icon: <FileTextOutlined />, label: "Blog" },
    { key: "/admin/settings", icon: <SettingOutlined />, label: "Cài đặt" },
];






  return (
    <Layout style={{ minHeight: "100vh" ,width: "100vw" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        className="admin-sider"
      >
        <div className="admin-logo">
          <img
            src={logo}
            alt="logo"
            className="logo-img"
            onError={e => (e.target.src = "")}
          />
          {!collapsed && <h2>Xét Nghiệm ADN</h2>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
        />
      </Sider>
     <Layout>
  <Header className="admin-header">
     <div className="admin-header-left">
    {/* <button
      className="collapse-btn"
      onClick={() => setCollapsed(!collapsed)}
      aria-label={collapsed ? "Mở sidebar" : "Thu nhỏ sidebar"}
    >
      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </button> */}

    {/* Nút Home */}
    <button
      className="home-btn"
      onClick={() => navigate('/')}
      style={{ marginLeft: 16, fontWeight: 'bold', fontSize: '16px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
    >
      Trang chủ
    </button>
  </div>
  </Header>
  <Content className="admin-content">
    <Outlet />
  </Content>
</Layout>

    </Layout>
  );
};

export default ComHeaderAdmin;
