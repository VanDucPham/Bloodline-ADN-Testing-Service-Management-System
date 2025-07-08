import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Tooltip, Select, Tag, Upload, Image } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./BlogManager.css";

const BLOG_TYPES = [
  { value: "news", label: "Tin tức" },
  { value: "guide", label: "Hướng dẫn" },
  { value: "policy", label: "Chính sách" },
  { value: "promotion", label: "Khuyến mãi" },
  { value: "other", label: "Khác" },
];

const typeColor = {
  news: "blue",
  guide: "green",
  policy: "gold",
  promotion: "red",
  other: "default"
};

const initialBlogs = [
  {
    id: 1,
    title: "Giới thiệu về xét nghiệm ADN",
    author: "Admin",
    content: "Bài viết giới thiệu tổng quan về dịch vụ xét nghiệm ADN.",
    type: "news",
    image: "https://via.placeholder.com/120x80?text=Blog+1",
    createdAt: "2024-07-01"
  },
  {
    id: 2,
    title: "Các bước thực hiện xét nghiệm ADN",
    author: "Admin",
    content: "Hướng dẫn chi tiết từng bước trong quy trình xét nghiệm ADN.",
    type: "guide",
    image: "https://via.placeholder.com/120x80?text=Blog+2",
    createdAt: "2024-07-02"
  },
];

const BlogManager = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [uploadingImage, setUploadingImage] = useState(null);

  // Mở modal tạo mới hoặc chỉnh sửa
  const openModal = (blog = null) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
    if (blog) {
      form.setFieldsValue(blog);
      setUploadingImage(blog.image ? [{ url: blog.image, name: "Ảnh hiện tại" }] : []);
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
  const handleSave = () => {
    form.validateFields().then(values => {
      const imageUrl = uploadingImage?.[0]?.url || uploadingImage?.[0]?.thumbUrl || "";
      if (editingBlog) {
        setBlogs(blogs.map(b => (b.id === editingBlog.id ? { ...editingBlog, ...values, image: imageUrl } : b)));
        message.success("Đã cập nhật bài viết!");
      } else {
        const newBlog = {
          ...values,
          id: Date.now(),
          author: "Admin",
          image: imageUrl,
          createdAt: dayjs().format("YYYY-MM-DD")
        };
        setBlogs([newBlog, ...blogs]);
        message.success("Đã thêm bài viết mới!");
      }
      closeModal();
    });
  };

  // Xóa bài viết
  const handleDelete = (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
    message.success("Đã xóa bài viết!");
  };

  // Lọc theo tìm kiếm và loại blog
  const filteredBlogs = blogs.filter(
    b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      (b.type && BLOG_TYPES.find(t => t.value === b.type)?.label.toLowerCase().includes(search.toLowerCase()))
  );

  // Xử lý upload ảnh (giả lập, chỉ lưu local preview)
  const beforeUpload = (file) => {
    const isImg = file.type.startsWith("image/");
    if (!isImg) {
      message.error("Chỉ cho phép file ảnh!");
      return false;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setUploadingImage([{ url: e.target.result, name: file.name }]);
    };
    reader.readAsDataURL(file);
    return false; // Không upload lên server
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (img) =>
        img ? (
          <Image src={img} alt="blog" width={80} height={54} style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          <span style={{ color: "#aaa" }}>Không có ảnh</span>
        ),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Tác giả", dataIndex: "author", key: "author" },
    {
      title: "Loại blog",
      dataIndex: "type",
      key: "type",
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
      key: "createdAt"
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
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
          onChange={e => setSearch(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
      </div>
      <p>Danh sách bài viết, tạo mới, chỉnh sửa hoặc xóa bài viết.</p>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        + Thêm bài viết
      </Button>
      <Table
        className="blog-manager-table"
        dataSource={filteredBlogs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={editingBlog ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại blog"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại blog!" }]}
          >
            <Select options={BLOG_TYPES} placeholder="Chọn loại blog" />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              accept="image/*"
            >
              {uploadingImage && uploadingImage.length > 0 ? (
                <img
                  src={uploadingImage[0].url}
                  alt="Ảnh blog"
                  style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6 }}
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8, fontSize: 12 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManager;
