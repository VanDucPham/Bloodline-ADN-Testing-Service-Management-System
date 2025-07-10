import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './BlogList.css';
// Sử dụng ảnh fallback local để tránh lỗi mạng hoặc bị chặn
const fallbackImg = "/images/no-image.png";

function BlogCard({ blog }) {
  const [showFull, setShowFull] = React.useState(false);
  try {
    if (!blog) return null;
    // Đảm bảo các trường không bị undefined/null
    const title = blog.title || "Không có tiêu đề";
    const content = blog.content || "";
    let cleanImageUrl = '';
    if (typeof blog.imageUrl === 'string') {
      cleanImageUrl = blog.imageUrl.replace(/["',]/g, '').trim();
    }
    let imgSrc = fallbackImg;
    if (cleanImageUrl) {
      //lấy ảnh từ internet
      if (cleanImageUrl.startsWith('http')) {
        imgSrc = cleanImageUrl;
      } else {
        // lấy ảnh từ local public/images
        imgSrc = cleanImageUrl.startsWith('/images')
          ? cleanImageUrl
          : '/images/' + cleanImageUrl;
      }
    }
    // Thêm hiển thị trạng thái
    const statusColor = {
      DRAFT: '#faad14',
      PUBLISHED: '#52c41a',
      ARCHIVED: '#bfbfbf'
    };
    return (
      <div className="blog-card">
        <img
          className="blog-card-img"
          src={imgSrc}
          alt={title}
          onError={e => {
            if (e.target.src !== fallbackImg) e.target.src = fallbackImg;
          }}
        />
        <div className="blog-card-body">
          <div className="blog-card-meta">
            { <span className="blog-card-date">
              {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('vi-VN') : ''}
            </span> }
            <span className="blog-card-author">Vietcare</span>
            <span className="blog-card-comments">0 Comments</span>
            <span className="blog-card-publishDate">
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}
            </span>
            {/* Hiển thị trạng thái */}
            <span className="blog-card-status" style={{ background: statusColor[blog.status] || '#d9d9d9', color: '#fff', borderRadius: 4, padding: '2px 8px', marginLeft: 8, fontSize: 12 }}>
              {blog.status === 'DRAFT' ? 'Nháp' : blog.status === 'PUBLISHED' ? 'Xuất bản' : blog.status === 'ARCHIVED' ? 'Lưu trữ' : blog.status}
            </span>
          </div>
          <h2 className="blog-card-title">{title}</h2>
          <div className="blog-card-desc">
            {showFull ? content : (content.length > 180 ? content.slice(0, 180) + ' [...]' : content)}
          </div>
          <button className="blog-card-btn" onClick={() => setShowFull(s => !s)}>
            {showFull ? 'ẨN BỚT' : 'CHI TIẾT'}
          </button>
        </div>
      </div>
    );
  } catch {
    return <div className="blog-card-error">Lỗi hiển thị bài viết</div>;
  }
}

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setError("");
        const res = await apiService.get('/blog/page', { page, size });
        setBlogs(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (e) {
        setBlogs([]);
        setTotalPages(1);
        setError(e?.response?.data?.message || "Lỗi tải danh sách blog");
      }
    };
    fetchBlogs();
  }, [page, size]);

  return (
    <div>
      {error && <div className="blog-list-error">{error}</div>}
      {blogs.filter(Boolean).map(blog => <BlogCard key={blog.blogId} blog={blog} />)}
      <div className="blog-list-pagination">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Trước</button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
      </div>
    </div>
  );
}

export default BlogList;
