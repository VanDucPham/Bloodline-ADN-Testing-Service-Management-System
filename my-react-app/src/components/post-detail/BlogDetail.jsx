
import './BlogDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import apiService from '../../service/api';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setError("");
        const res = await apiService.get(`/blog/${id}`);
        setBlog(res.data);
      } catch (e) {
        setBlog(null);
        setError(e?.response?.data?.message || "Bài viết không tồn tại hoặc chưa được xuất bản");
      }
    };
    fetchBlog();
  }, [id]);

  // Gọi API lấy bài viết liên quan
  useEffect(() => {
    if (id) {
      apiService.get('/blog/related', { blogId: id, limit: 4 })
        .then(res => setRelatedBlogs(res.data || []))
        .catch(() => setRelatedBlogs([]));
    }
  }, [id]);

  if (error) return <div className="blog-detail-error">{error}</div>;
  if (!blog) return <div>Đang tải bài viết...</div>;

  return (
    <div className="blog-detail">
      <main className="main-content">
        <div className="container">
          {/* Nút quay lại */}
          <button
            style={{
              margin: '16px 0',
              padding: '8px 20px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,32,96,0.07)'
            }}
            onClick={() => navigate('/allpost')}
          >
            ← Quay lại tất cả bài viết
          </button>
          <article className="article">
            <header className="article-header">
              <h1 className="article-title">{blog.title}</h1>
              <div className="article-meta">
                <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                <span>•</span>
                <span>{blog.authorName || 'Vietcare'}</span>
                {/* Hiển thị trạng thái */}
                <span style={{ background: blog.status === 'DRAFT' ? '#faad14' : blog.status === 'PUBLISHED' ? '#52c41a' : blog.status === 'ARCHIVED' ? '#bfbfbf' : '#d9d9d9', color: '#fff', borderRadius: 4, padding: '2px 8px', marginLeft: 8, fontSize: 12 }}>
                  {blog.status === 'DRAFT' ? 'Nháp' : blog.status === 'PUBLISHED' ? 'Xuất bản' : blog.status === 'ARCHIVED' ? 'Lưu trữ' : blog.status}
                </span>
              </div>
            </header>
            <div className="article-content">
              <div className="intro-text">
                <p>{blog.content}</p>
              </div>
              {blog.imageUrl && (
                <div className="featured-image">
                  <img src={blog.imageUrl} alt={blog.title} className="image" />
                </div>
              )}
            </div>
          </article>

          {/* Bài viết liên quan */}
          <section className="related-blogs-section" style={{ marginTop: 40 }}>
            <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Bài viết liên quan</h3>
            {relatedBlogs.length === 0 ? (
              <div style={{ color: '#888' }}>Không có bài viết liên quan.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {relatedBlogs.map(rb => (
                  <li key={rb.blogId} style={{ marginBottom: 12 }}>
                    <span
                      style={{ color: '#1677ff', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' }}
                      onClick={() => navigate(`/post-detail/${rb.blogId}`)}
                    >
                      {rb.title}
                    </span>
                    <span style={{ marginLeft: 8, color: '#888', fontSize: 13 }}>{rb.createdAt ? new Date(rb.createdAt).toLocaleDateString('vi-VN') : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BlogDetail; 