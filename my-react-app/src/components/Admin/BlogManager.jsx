import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Tooltip, Select, Tag, Upload, Image } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import apiService from '../../service/api';
import "./BlogManager.css";



const BLOG_TYPES = [
  { value: "NEWS", label: "Tin tức" },
  { value: "GUIDE", label: "Hướng dẫn" },
  { value: "POLICY", label: "Chính sách" },
  { value: "PROMOTION", label: "Khuyến mãi" },
  { value: "OTHER", label: "Khác" },
];
const BLOG_STATUS = [
  { value: "DRAFT", label: "Nháp" },
  { value: "PUBLISHED", label: "Xuất bản" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];
const typeColor = {
  NEWS: "blue",
  GUIDE: "green",
  POLICY: "gold",
  PROMOTION: "red",
  OTHER: "default"
};

const BlogManager = () => {

  

  
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [uploadingImage, setUploadingImage] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState();
  const [typeFilter, setTypeFilter] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null); // Thêm state để xác định blog nào đang cập nhật trạng thái
  const [saveLoading, setSaveLoading] = useState(false); // Thêm state loading cho nút cập nhật
  const [archivedEditModal, setArchivedEditModal] = useState({ visible: false, record: null, action: null });

  // Lấy danh sách blog từ BE
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      setError("");
      const params = { page, size };
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await apiService.get('/admin/blog/page', params);
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      setBlogs([]);
      setTotalPages(1);
      setError(e?.response?.data?.message || "Lỗi tải danh sách blog");
    }
    setLoading(false);
  }, [page, size, statusFilter, typeFilter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  // Mở modal tạo mới hoặc chỉnh sửa
  const openModal = (blog = null) => {
    if (blog && blog.status === 'ARCHIVED') {
      setArchivedEditModal({ visible: true, record: blog, action: 'edit' });
      return;
    }
    setEditingBlog(blog);
    setIsModalOpen(true);
    if (blog) {
      form.setFieldsValue({ ...blog, type: blog.blogType, status: blog.status });
      setUploadingImage(blog.imageUrl ? [{ url: blog.imageUrl, name: "Ảnh hiện tại" }] : []);
    } else {
      form.resetFields();
      setUploadingImage([]);
    }
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    form.resetFields();
    setUploadingImage([]);
  };
  
  // Lưu bài viết (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const values = await form.validateFields();
      const imageUrl = uploadingImage?.[0]?.url || "";
      // Lấy user hiện tại từ localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const authorId = userInfo.userId || userInfo.id || userInfo.authorId || userInfo.user_Id;
      console.log('DEBUG: Form values:', values);
      console.log('DEBUG: userInfo from localStorage:', userInfo);
      console.log('DEBUG: authorId:', authorId);
      if (!authorId) {
        message.error("Không xác định được người tạo blog (authorId). Hãy đăng nhập lại.");
        setSaveLoading(false);
        return;
      }
      const payload = {
        ...values,
        imageUrl,
        blogType: values.type,
        status: values.status,
        authorId, // BỔ SUNG authorId
      };
      console.log('DEBUG: Payload gửi lên BE:', payload);
      if (editingBlog) {
        const res = await apiService.put(`/admin/blog/update/${editingBlog.blogId}`, payload);
        console.log("RESPONSE cập nhật blog:", res);
        message.success("Đã cập nhật bài viết!");
      } else {
        try {
          const res = await apiService.post('/admin/blog/create', payload);
          console.log("RESPONSE tạo blog:", res);
          message.success("Đã thêm bài viết mới!");
        } catch (e) {
          console.error('Lỗi tạo blog:', e, payload);
          message.error(e?.response?.data?.message || "Lỗi lưu bài viết (API)");
          // Không throw e nữa vì đã được catch ở ngoài
          return; // Thoát khỏi function để tránh thực hiện code tiếp theo
        }
      }
      await fetchBlogs(); // Đảm bảo fetch xong mới đóng modal
      closeModal();
    } catch (e) {
      console.error('Lỗi JS khi tạo/sửa blog:', e);
      message.error(e?.message || "Lỗi validate hoặc JS khi lưu bài viết");
    }
    setSaveLoading(false);
  };

  // Xóa bài viết
  const handleDelete = async (id, status) => {
    if (status === 'ARCHIVED') {
      setArchivedEditModal({ visible: true, record: { blogId: id }, action: 'delete' });
      return;
    }
    try {
      await apiService.delete(`/admin/blog/delete/${id}`);
      message.success("Đã xóa bài viết!");
      fetchBlogs();
    } catch (e) {
      message.error(e?.response?.data?.message || "Lỗi xóa bài viết");
    }
  };

  // Cập nhật trạng thái
  const handleStatusChange = async (blog, status) => {
    setStatusLoadingId(blog.blogId); // Bắt đầu loading cho blog này
    try {
      await apiService.put(`/admin/blog/status/${blog.blogId}?status=${status}`);
      message.success("Đã cập nhật trạng thái!");
      await fetchBlogs(); // Đảm bảo fetch xong mới tắt loading
    } catch (e) {
      message.error(e?.response?.data?.message || "Lỗi cập nhật trạng thái");
    }
    setStatusLoadingId(null); // Kết thúc loading
  };

  // Xử lý upload ảnh thực tế lên server
  const handleImageUpload = async ({ file }) => {
    try {
      const res = await apiService.admin.uploadImage(file);
      console.log("Uploaded image URL:", url);

      const url = res.url;
      setUploadingImage([{ url, name: file.name }]);
      message.success('Upload ảnh thành công!');
    } catch (e) {
      message.error(e?.response?.data?.message || 'Lỗi upload ảnh');
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (img) =>
        img ? (
          <Image src={img} alt="blog" width={80} height={54} style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          <span style={{ color: "#aaa" }}>Không có ảnh</span>
        ),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Tác giả", dataIndex: "authorName", key: "authorName" },
    {
      title: "Loại blog",
      dataIndex: "blogType",
      key: "blogType",
      render: (type) => {
        const found = BLOG_TYPES.find(t => t.value === type);
        return (
          <Tag color={typeColor[type] || "default"}>
            {found ? found.label : type}
          </Tag>
        );
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={val => handleStatusChange(record, val)}
          options={BLOG_STATUS}
          loading={statusLoadingId === record.blogId}
          disabled={statusLoadingId === record.blogId}
        />
      )
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 200, display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {text}
          </span>
        </Tooltip>
      )
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: val => val ? dayjs(val).format("DD/MM/YYYY") : ""
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.blogId, record.status)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-manager-container">
      <div className="blog-manager-header">
        <span className="blog-manager-title">Quản lý Blog</span>
        <Input.Search
          placeholder="Tìm kiếm tiêu đề, tác giả hoặc loại blog"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(0);
          }}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          placeholder="Lọc trạng thái"
          value={statusFilter}
          onChange={val => {
            setStatusFilter(val);
            setPage(0);
          }}
          allowClear
          style={{ width: 140, marginLeft: 8 }}
          options={BLOG_STATUS}
        />
        <Select
          placeholder="Lọc loại blog"
          value={typeFilter}
          onChange={val => {
            setTypeFilter(val);
            setPage(0);
          }}
          allowClear
          style={{ width: 140, marginLeft: 8 }}
          options={BLOG_TYPES}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Thêm mới</Button>
      </div>
      {error && <div className="blog-manager-error">{error}</div>}
      <Table
        columns={columns}
        dataSource={blogs.filter(b => {
          if (!search) return true;
          return (
            (b.title && b.title.toLowerCase().includes(search.toLowerCase())) ||
            (b.authorId && String(b.authorId).toLowerCase().includes(search.toLowerCase())) ||
            (b.blogType && BLOG_TYPES.find(t => t.value === b.blogType)?.label.toLowerCase().includes(search.toLowerCase()))
          );
        })}
        rowKey="blogId"
        loading={loading}
        pagination={false}
      />
      <div className="blog-manager-pagination">
        <Button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Trước</Button>
        <span>Trang {page + 1} / {totalPages}</span>
        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</Button>
      </div>
      <Modal
        title={editingBlog ? "Chỉnh sửa Blog" : "Thêm Blog mới"}
        open={isModalOpen}
        onCancel={closeModal}
        okText={editingBlog ? "Cập nhật" : "Thêm mới"}
        destroyOnHidden
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="type" label="Loại blog" rules={[{ required: true, message: "Chọn loại blog" }]}>
            <Select options={BLOG_TYPES} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}>
            <Select options={BLOG_STATUS} />
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            <Upload
              customRequest={handleImageUpload}
              fileList={uploadingImage}
              onRemove={() => setUploadingImage([])}
              listType="picture"
              maxCount={1}
              showUploadList={{ showPreviewIcon: false }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saveLoading} style={{ width: '100%' }}>
              {editingBlog ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal cảnh báo khi thao tác với blog ARCHIVED */}
      <Modal
        open={archivedEditModal.visible}
        onCancel={() => setArchivedEditModal({ visible: false, record: null, action: null })}
        onOk={() => {
          if (archivedEditModal.action === 'edit') {
            setEditingBlog(archivedEditModal.record);
            setIsModalOpen(true);
            if (archivedEditModal.record) {
              form.setFieldsValue({ ...archivedEditModal.record, type: archivedEditModal.record.blogType, status: archivedEditModal.record.status });
              setUploadingImage(archivedEditModal.record.imageUrl ? [{ url: archivedEditModal.record.imageUrl, name: "Ảnh hiện tại" }] : []);
            }
          } else if (archivedEditModal.action === 'delete') {
            handleDelete(archivedEditModal.record.blogId);
          }
          setArchivedEditModal({ visible: false, record: null, action: null });
        }}
        okText={archivedEditModal.action === 'edit' ? 'Tiếp tục sửa' : 'Tiếp tục xóa'}
        cancelText="Hủy"
        title="Cảnh báo thao tác với blog Lưu trữ"
      >
        <p>Bạn đang thao tác với một blog ở trạng thái <b>Lưu trữ</b>.<br/>Hãy chắc chắn bạn muốn {archivedEditModal.action === 'edit' ? 'chỉnh sửa' : 'xóa'} blog này để tránh nhầm lẫn với blog thông thường.</p>
      </Modal>
    </div>
  );
};

export default BlogManager;

