import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';
import './BlogList.css';
import noImage from '../../assets/no-image.png';

function BlogCard({ blog }) {
  
  const fallbackImg = noImage;
  // Làm sạch imageUrl nếu có ký tự thừa
  let cleanImageUrl = '';
  if (typeof blog.imageUrl === 'string') {
    cleanImageUrl = blog.imageUrl.replace(/["',]/g, '').trim();
  }
  const imgSrc = cleanImageUrl !== '' ? cleanImageUrl : fallbackImg;
  const [showFull, setShowFull] = React.useState(false);
  return (
    <div className="blog-card">
      <img className="blog-card-img" src={imgSrc} alt={blog.title}
        onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
      />
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-date">
            {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('vi-VN') : ''}
          </span>
          <span className="blog-card-author">Vietcare</span>
          <span className="blog-card-comments">0 Comments</span>
          <span className="blog-card-publishDate">
            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
        <h2 className="blog-card-title">{blog.title}</h2>
        <div className="blog-card-desc">
          {showFull ? blog.content : (blog.content?.length > 180 ? blog.content.slice(0, 180) + ' [...]' : blog.content)}
        </div>
        <button className="blog-card-btn" onClick={() => setShowFull(s => !s)}>
          {showFull ? 'ẨN BỚT' : 'CHI TIẾT'}
        </button>
      </div>
    </div>
  );
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
    <div className="blog-list-container">
      {blogs.map(blog => <BlogCard key={blog.blogId} blog={blog} />)}
    </div>
  );
}

export default BlogList;
