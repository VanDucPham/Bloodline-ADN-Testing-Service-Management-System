import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function ArticleList({ articles }) {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="articles-grid">
      {articles.length === 0 ? (
        <div className="no-articles">
          <div className="no-articles-icon">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3>Không tìm thấy bài viết nào</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc xem tất cả bài viết</p>
        </div>
      ) : (
        articles.map((article, index) => (
          <article key={article.id} className="blog-card">
            {/* Card Image */}
            <div className="card-image-wrapper">
              <img 
                src={article.image} 
                alt={article.title}
                className="card-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x250/f1f5f9/64748b?text=No+Image';
                }}
              />
              <div className="card-overlay">
                <div className="card-category-badge">
                  {article.tags[0]}
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              {/* Meta Info */}
              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-date">{formatDate(article.publishDate)}</span>
                </div>
                <div className="meta-item">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>{article.author}</span>
                </div>
                <div className="meta-item">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span>{article.comments} Comments</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="card-title">
                {article.title}
              </h3>

              {/* Description */}
              <p className="card-description">
                {truncateText(article.shortDescription, 150)}
              </p>

              {/* Action Button */}
              <div className="card-actions">
                <button onClick={()=>navigate(`/post-detail/post/${article.id}`)} className="detail-button">
                  <span >CHI TIẾT</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
