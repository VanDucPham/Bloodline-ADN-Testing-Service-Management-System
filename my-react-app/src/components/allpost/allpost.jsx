import { useState, useEffect } from "react";

import ArticleList from "./article-list.jsx";
import Pagination from "./pagination.jsx";
import "./allpost.css";

import Footer from "../Footer.jsx";
import apiService from "../../service/api";
import heroBg from "/images/backgroup-2-scaled.jpg";



export default function AllPost() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryCounts, setCategoryCounts] = useState({});
  const articlesPerPage = 5;

  // Lấy số lượng blog từng loại từ BE
  const fetchCategoryCounts = () => {
    apiService.get("/blog/category-count")
      .then(res => {
        setCategoryCounts(res.data || {});
      })
      .catch(error => {
        console.error("Lỗi khi lấy số lượng blog theo danh mục:", error);
        setCategoryCounts({});
      });
  };
  
  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  // Gọi lại khi articles thay đổi (sau khi thêm/xóa/cập nhật blog)
  useEffect(() => {
    if (articles.length > 0) {
      fetchCategoryCounts();
    }
  }, [articles]);

  const categories = [
    { id: "all", name: "Tất cả", icon: "🧬", count: articles.length },
    { id: "NEWS", name: "Tin tức", icon: "📰", count: categoryCounts["NEWS"] || 0 },
    { id: "GUIDE", name: "Hướng dẫn", icon: "🧑‍🔬", count: categoryCounts["GUIDE"] || 0 },
    { id: "POLICY", name: "Chính sách", icon: "📜", count: categoryCounts["POLICY"] || 0 },
    { id: "PROMOTION", name: "Khuyến mãi", icon: "💡", count: categoryCounts["PROMOTION"] || 0 },
    { id: "OTHER", name: "Khác", icon: "🔬", count: categoryCounts["OTHER"] || 0 },
  ];

  useEffect(() => {
    apiService.get("/blog/all")
      .then(res => {
        // Map dữ liệu từ BE sang đúng định dạng FE cần
        const mapped = (res.data || [])
          .filter(blog => blog.status === 'PUBLISHED')
          .map(blog => ({
            id: blog.blogId,
            title: blog.title,
            shortDescription: blog.content, // hoặc tạo trường mô tả ngắn nếu muốn
            image: blog.imageUrl,
            publishDate: blog.createdAt || blog.publishDate,
            author: blog.authorName,
            comments: 0, // BE chưa có, tạm để 0
            tags: blog.blogType ? [blog.blogType] : [],
          }));
        setArticles(mapped);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy danh sách blog:", error);
        setArticles([]);
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sửa logic lọc danh mục: chỉ hiển thị blog đúng loại
    const matchesCategory =
      selectedCategory === "all" ||
      (article.tags.length > 0 && article.tags[0] === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Hàm lấy 4 bài viết liên quan ngẫu nhiên
  function getRandomRelated(articles, selectedCategory) {
    let pool = articles;
    if (selectedCategory !== "all") {
      pool = articles.filter(a => a.tags.includes(selectedCategory));
    }
    // Shuffle và lấy 4 bài
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }

  const relatedBlogs = getRandomRelated(articles, selectedCategory);

  return (
    <div>


      <section
        className="hero-section"
        
      >
        <div style={{
          maxWidth: "1280px",
          width: "100%",
          color: "#ce4d4dff",
          textAlign: "center"
        }}>
          <h2 style={{
            color: "#f59e0b",
            fontSize: "1.3rem",
            fontWeight: "600",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            CHUYÊN MỤC XÉT NGHIỆM ADN
          </h2>
          <h1 style={{
            fontSize: "2.8rem",
            fontWeight: "800",
            margin: "0 0 24px 0",
            lineHeight: "1.2",
            letterSpacing: "1px"
          }}>
            TIN TỨC & <span style={{ color: "#f59e0b", fontWeight: "800" }}>BÀI VIẾT KHOA HỌC</span>
          </h1>
          <p style={{
            fontSize: "1.1rem",
            margin: "0 0 24px 0",
            color: "#e0e7ef",
            fontWeight: "500"
          }}>
            Khám phá kiến thức mới nhất về xét nghiệm ADN, di truyền học, sức khỏe và công nghệ sinh học hiện đại.
          </p>
        </div>
      </section>


      <div className="blog-content-container">
        {/* Main Content Container */}
        <div className="main-content-wrapper">
          {/* Left - Articles Section */}
          <div className="articles-column">
            <div className="articles-section">
              {/* Articles Header */}
              <div className="articles-header">
                <div className="articles-title-section">
                  <h2 className="articles-main-title">
                    {selectedCategory === "all" ? "Tất cả bài viết" :
                      categories.find(cat => cat.id === selectedCategory)?.name}
                  </h2>
                  <p className="articles-subtitle">
                    {filteredArticles.length} bài viết được tìm thấy
                    {searchTerm && ` cho "${searchTerm}"`}
                  </p>
                </div>

                {/* Filter Buttons */}
                <div className="filter-buttons">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="category-select"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải bài viết...</p>
                </div>
              ) : (
                <ArticleList articles={currentArticles} />
              )}

              {/* Pagination */}
              {!loading && filteredArticles.length > 0 && (
                <div className="pagination-wrapper">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right - Beautiful Sidebar */}
          <div className="sidebar-column">
            <div className="sidebar-section">
              {/* Search Box */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Tìm kiếm bài viết</h3>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Featured Categories */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Danh mục nổi bật</h3>
                <div className="category-list">
                  {categories.slice(1).map((category) => (
                    <div
                      key={category.id}
                      className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Bài viết liên quan</h3>
                <div className="related-blogs-section" style={{
                  marginTop: 40,
                  background: '#f6f8fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: 12,
                  padding: 24,
                  maxWidth: 500,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: '#222', letterSpacing: 0, textAlign: 'left' }}>Bài viết liên quan</h3>
                  {relatedBlogs.length === 0 ? (
                    <div style={{ color: '#888', textAlign: 'center' }}>Không có bài viết liên quan.</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {relatedBlogs.map(rb => (
                        <li key={rb.id} style={{
                          marginBottom: 18,
                          padding: '12px 16px',
                          borderRadius: 8,
                          background: '#fff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#e6f4ff'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <span style={{ fontSize: 20, marginRight: 12 }}>📝</span>
                          <div style={{ flex: 1 }}>
                            <a href={`/post-detail/${rb.id}`} style={{ color: '#1677ff', fontWeight: 600, fontSize: 16, textDecoration: 'none', transition: 'color 0.2s' }}
                              onMouseOver={e => e.currentTarget.style.color = '#faad14'}
                              onMouseOut={e => e.currentTarget.style.color = '#1677ff'}
                            >{rb.title}</a>
                            <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{rb.publishDate ? new Date(rb.publishDate).toLocaleDateString('vi-VN') : ''}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Newsletter Signup */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>

  );
}
