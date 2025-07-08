import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít hơn hoặc bằng maxVisiblePages, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp hơn để hiển thị pagination thông minh
      if (currentPage <= 3) {
        // Nếu đang ở gần đầu
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Nếu đang ở gần cuối
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Nếu đang ở giữa
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Trang <strong>{currentPage}</strong> của <strong>{totalPages}</strong>
        </span>
      </div>
      
      <nav className="pagination-nav" aria-label="Pagination Navigation">
        <div className="pagination-buttons">
          {/* Previous Button */}
          <button
            className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="btn-text">Trước</span>
          </button>

          {/* Page Numbers */}
          <div className="pagination-numbers">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Trang ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Trang tiếp"
          >
            <span className="btn-text">Tiếp</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Quick Jump */}
      {totalPages > 10 && (
        <div className="pagination-jump">
          <span className="jump-label">Chuyển đến:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Trang"
            className="jump-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                  e.target.value = '';
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
