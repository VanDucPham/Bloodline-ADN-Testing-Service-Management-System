import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import apiService from "../../service/api";
 // Đường dẫn này sẽ hoạt động đúng





export default function AdminDashboard() {

    const [account, setAccount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            setStatus('Đang tải dữ liệu ......');
            try {
                const response = await apiService.admin.getAllUser(); 
                setAccount(response);
                console.log(response)
                setStatus('');
                if(response==0){
                  setStatus("Không có user nào được tạo")
                }
            } catch (error) {
                console.log(error, "Lỗi dữ liệu tải lên acc");
                setStatus('Lỗi khi tải dữ liệu người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []); // Chỉ gọi 1 lần khi load page

    const getRoleClass = (role) => {
        switch (role) {
            case 'Quản trị viên': return 'role admin';
            case 'Quản lý': return 'role manager';
            case 'Nhân viên': return 'role staff';
            default: return 'role user';
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await apiService.admin.deleteUser(id);
                setAccount(account.filter(u => u.user_id !== id));
                alert('Đã xóa người dùng thành công');
            } catch (error) {
                console.error('Lỗi khi xóa người dùng:', error);
                setStatus('Lỗi khi xóa người dùng');
            }
        }
    }

    return (
        <div className="container">
            <aside className="sidebar">
                <h2>Admin</h2>
                <a className="back" href="/">Quay về</a>
                <ul>
                    <li>🏠 Trang chủ</li>
                    <li className="active">👤 Quản lý người dùng</li>
                    <li>🔐 Phân quyền</li>
                    <li>🛠️ Quản lý dịch vụ</li>
                    <li>📊 Thống kê tổng quan</li>
                    <li>⚙️ Quản trị hệ thống</li>
                </ul>
            </aside>

            <main className="main-content">
                <div className="topbar">
                    <div className="title">Quản lý người dùng</div>
                    <button className="add-btn">+ Thêm người dùng</button>
                </div>

                <div className="filters">
                    <input type="text" placeholder="Tìm kiếm người dùng..." />
                    <select>
                        <option>Tất cả vai trò</option>
                        <option>Người dùng</option>
                        <option>Nhân viên</option>
                        <option>Quản lý</option>
                        <option>Quản trị viên</option>
                    </select>
                    <button>📂 Lọc</button>
                </div>

                {status && (
                    <div className="status-message">{status}</div>
                )}

                {!loading && !status && (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Người dùng</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.map((u, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="avatar">{u.name ? u.name[0] : '?'}</div>

                                        <div>
                                            <div>{u.name}</div>
                                            <div className="email">{u.email}</div>
                                        </div>
                                    </td>
                                    <td><span className={getRoleClass(u.role)}>{u.role}</span></td>
                                    <td><span className="status active">{u.status}</span></td>
                                    
                                    <td>
                                        <button className="action edit">✏️</button>
                                        <button className="action delete" onClick={() => handleDelete(u.user_id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}
