import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './BlogList.css';
// Sử dụng ảnh fallback online để tránh dựt và lỗi local
const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

function BlogCard({ blog }) {
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
    const [showFull, setShowFull] = React.useState(false);
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
  } catch (err) {
    console.error('BlogCard render error:', err, blog);
    return <div className="blog-card-error">Lỗi hiển thị bài viết</div>;
  }
}

function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await apiService.auth.getBlog();
        setBlogs(res);
      } catch (e) {
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      {blogs.filter(Boolean).map(blog => <BlogCard key={blog.blogId} blog={blog} />)}
    </div>
  );
}

export default BlogList;
