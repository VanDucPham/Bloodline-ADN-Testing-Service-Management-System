import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../service/api';
import '../role/AdminPage.css';

function BlogForm() {
  // State cho danh sách blog và blog đang chỉnh sửa
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Lấy tất cả blog khi mount
  React.useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await apiService.admin.getAllBlog();
        setBlogs(res);
      } catch (e) {
        // Có thể xử lý lỗi nếu cần
      }
    };
    fetchBlogs();
  }, []);

  // Xem chi tiết blog (đổ dữ liệu vào form để sửa)
  const handleEdit = async (id) => {
    try {
      const blog = await apiService.admin.getBlogById(id);
      setForm({
        title: blog.title || '',
        content: blog.content || '',
        imageUrl: blog.imageUrl || '',
        status: blog.status || 'DRAFT',
        authorId: blog.authorId || '',
      });
      setEditingId(id);
      setError('');
      setSuccess('');
    } catch (e) {
      setError('Không lấy được thông tin blog!');
    }
  };

  // Xóa blog
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa blog này?')) return;
    try {
      await apiService.admin.deleteBlog(id);
      setSuccess('Đã xóa blog!');
      setBlogs(blogs.filter(b => b.blogId !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ title: '', content: '', imageUrl: '', status: 'DRAFT', authorId: form.authorId });
      }
    } catch (e) {
      setError('Xóa blog thất bại!');
    }
  };

  // Cập nhật hoặc tạo mới blog
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    status: 'DRAFT',
    authorId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staffInfo, setStaffInfo] = useState(null);
  const navigate = useNavigate();

  // Lấy userId từ API profile
  React.useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const res = await apiService.staff.getStaffProfile();
        console.log('Staff profile:', res);
        setStaffInfo(res);
        setForm(f => ({ ...f, authorId: res.userId })); // tự động lấy userId
      } catch (e) {
        setStaffInfo(null);
      }
    };
    fetchStaffProfile();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title || !form.content) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }
    if (!form.authorId) {
      setError('Không tìm thấy thông tin tác giả. Vui lòng đăng nhập lại.');
      return;
    }
    try {
      const payload = { ...form };
      console.log('Payload gửi lên:', payload);
      if (editingId) {
        await apiService.admin.updateBlog(editingId, payload);
        setSuccess('Cập nhật blog thành công!');
        setBlogs(blogs.map(b => (b.blogId === editingId ? { ...b, ...payload } : b)));
      } else {
        await apiService.admin.createBlog(payload);
        setSuccess('Tạo blog thành công!');
        // Reload lại danh sách
        const res = await apiService.admin.getAllBlog();
        setBlogs(res);
      }
      setTimeout(() => {
        setEditingId(null);
        setForm({ title: '', content: '', imageUrl: '', status: 'DRAFT', authorId: form.authorId });
      }, 1200);
    } catch (e) {
      setError(editingId ? 'Cập nhật blog thất bại!' : 'Tạo blog thất bại!');
    }
  };

  return (
    <div className="admin-page">
      <h2>Danh sách blog</h2>
      <button className="admin-btn" onClick={() => setShowAdd(v => !v)}>
        {showAdd ? 'Đóng form thêm blog' : '+ Thêm blog'}
      </button>
      {showAdd && (
        <form className="admin-form" onSubmit={handleSubmit} style={{marginTop: 12, marginBottom: 12, background: '#f8fafd', padding: 16, borderRadius: 8}}>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Tiêu đề:</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Ảnh (URL):</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Trạng thái:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="DRAFT">Nháp</option>
              <option value="PUBLISHED">Công khai</option>
              <option value="ARCHIVED">Lưu trữ</option>
            </select>
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>authId:</label>
            <input name="authorId" value={form.authorId || ''} readOnly style={{ background: '#f5f5f5' }} />
          </div>
          <div style={{marginBottom: 8}}>
            <label style={{marginRight: 8}}>Nội dung:</label>
            <textarea name="content" value={form.content} onChange={handleChange} rows={8} required />
          </div>
          <button className="admin-btn" type="submit">{editingId ? 'Cập nhật blog' : 'Tạo blog'}</button>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </form>
      )}
      <h3 style={{marginTop:32}}>Danh sách blog</h3>
      <table className="admin-table" style={{width:'100%'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Tác giả</th>
            <th colSpan={2}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.blogId}>
              <td>{blog.blogId}</td>
              <td>{blog.title}</td>
              <td>{blog.status}</td>
              <td>{blog.authorId}</td>
              <td><button type="button" onClick={() => handleEdit(blog.blogId)}>Sửa</button></td>
              <td><button type="button" onClick={() => handleDelete(blog.blogId)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogForm;
