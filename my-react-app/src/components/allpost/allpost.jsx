import { useState, useEffect } from "react";

import ArticleList from "./article-list.jsx";
import Pagination from "./pagination.jsx";
import "./allpost.css";

import Footer from "../Footer.jsx";



  // ...rest giữ nguyên...

// Mock data
const mockArticles = [
  {
    id: 1,
    title: "5 Điều Bất Ngờ ADN Có Thể Tiết Lộ Về Bạn",
    shortDescription:
      "Trong thời đại mà công nghệ gen đang mở ra những khám phá không ngờ về chính chúng ta, xét nghiệm ADN đã trở thành một công cụ vô cùng mạnh mẽ giúp 'đọc' thông tin di truyền của mỗi cá nhân. Không chỉ cho biết nguồn gốc, cội nguồn hay xác minh quan hệ huyết thống, ADN còn hé lộ những điều bất ngờ về bản thân bạn – từ tính cách, sở thích, khả năng thể thao, nguy cơ bệnh lý cho đến tiềm năng trí tuệ. Bài viết này sẽ đưa bạn khám phá 5 điều bất ngờ mà kết quả xét nghiệm ADN có thể tiết lộ, giúp bạn hiểu rõ hơn về bản thân và từ đó có những quyết định chăm sóc sức khỏe cũng như phát triển cá nhân phù hợp.",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2025/02/5-Dieu-Bat-Ngo-ADN-Co-The-Tiet-Lo-Ve-Ban-thumb.jpg.webp",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "Xét nghiệm ADN",
      "Sức khỏe",
      "Di truyền",
      "Y học cá nhân",
      "Vietcare"
    ],
  },
  {
    id: 2,
    title: "Làm Thế Nào ADN Ảnh Hưởng Đến Chế Độ Ăn Của Bạn?",
    shortDescription:
      "Chế độ ăn uống phù hợp không chỉ dựa vào sở thích hay xu hướng, mà còn chịu ảnh hưởng mạnh mẽ bởi yếu tố di truyền. Các xét nghiệm ADN ngày nay có thể chỉ ra cách cơ thể bạn chuyển hóa chất béo, đường, caffeine hay gluten – từ đó giúp cá nhân hóa dinh dưỡng để sống khỏe mạnh hơn.",
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/che_do_an_kieng_dna_la_gi_2_ab941cecb8.png",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN",
      "Dinh dưỡng",
      "Chế độ ăn",
      "Sức khỏe",
      "Y học cá nhân"
    ],
  },
  {
    id: 3,
    title: "Khám Phá Nguồn Gốc Tổ Tiên Qua Xét Nghiệm ADN",
    shortDescription:
      "Bạn có bao giờ tự hỏi mình đến từ đâu? Dòng máu của bạn mang trong mình những dấu tích di truyền nào? Với công nghệ phân tích ADN hiện đại, bạn có thể khám phá lịch sử tổ tiên hàng trăm năm trước, từ đó hiểu hơn về cội nguồn và bản sắc của chính mình.",
    image:
      "https://genplus.vn/wp-content/uploads/2022/11/xet-nghiem-adn-quang-binh-7.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "Nguồn gốc",
      "Tổ tiên",
      "Xét nghiệm ADN",
      "Bản đồ di truyền",
      "Haplogroup"
    ],
  },
  {
    id: 4,
    title: "Xét Nghiệm ADN Cho Trẻ Em  Nền Tảng Phát Triển Toàn Diện",
    shortDescription:
      "Xét nghiệm ADN cho trẻ em mở ra cánh cửa hiểu biết sâu sắc về tiềm năng và đặc điểm bẩm sinh của con bạn. Từ việc phát hiện tài năng thiên bẩm, đánh giá nguy cơ sức khỏe đến thiết kế chương trình giáo dục phù hợp...",
    image:
      "https://api.genetica.asia/storage/xet-nghiem-gene-dinh-huong-phat-trien-cho-tre-55-1635327429wi8GH.jpg?width=680",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: ["ADN trẻ em", "Tài năng bẩm sinh", "Giáo dục cá nhân hóa", "Sức khỏe trẻ em", "Phát triển trẻ em"],
  },
  {
    id: 5,
    title: "ADN Và Khả Năng Đề Kháng - Di Truyền Quyết Định Sức Mạnh Của Hệ Miễn Dịch",
    shortDescription:
      "Bạn có bao giờ tự hỏi tại sao một số người có khả năng miễn dịch tốt hơn hoặc ít bị bệnh hơn so với những người khác? Câu trả lời nằm ở hệ miễn dịch và ADN. ADN không chỉ quy định đặc điểm hình thái mà còn tác động mạnh mẽ đến cách cơ thể chúng ta chống lại bệnh tật. Trong bài viết này, chúng ta sẽ cùng khám phá vai trò của ADN trong hệ miễn dịch, cách di truyền ảnh hưởng đến khả năng phòng bệnh, và cách công nghệ phân tích ADN đang mở ra những cơ hội mới trong y học.",
    image:
      "https://vpgdadnnghean.com/wp-content/uploads/2018/01/xet-nghiem-adn-nghe-an.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: ["Hệ miễn dịch",
      "Gene HLA",
      "Sức khỏe cá nhân",
      "Vaccine",
      "Phòng bệnh"
    ],
  },
  {
    id: 6,
    title: "Xét Nghiệm ADN Trong Thể Thao - Khám Phá Tiềm Năng Vận Động Của Bạn",
    shortDescription:
      "Không có chế độ ăn nào phù hợp với tất cả mọi người. Xét nghiệm ADN dinh dưỡng giúp bạn hiểu cách cơ thể chuyển hóa các chất dinh dưỡng, phản ứng với thực phẩm và nhu cầu vitamin cá nhân...",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2024/12/xet-nghiem-adn-trong-the-thao-phat-hien-gen-nang-khieu.jpg.webp",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: ["Thể thao di truyền",
      "Gene ACTN3",
      "Phát triển thể lực",
      "Tối ưu tập luyện",
      "Thể hình cá nhân hóa"],
  },
  {
    id: 7,
    title: "ADN Và Giấc Ngủ - Vì Sao Có Người Dễ Ngủ Và Người Thức Trắng?",
    shortDescription:
      "Mỗi người phản ứng khác nhau với cùng một loại thuốc do sự khác biệt về gene. Xét nghiệm ADN dược phẩm (pharmacogenomics) giúp dự đoán hiệu quả và tác dụng phụ của thuốc trước khi sử dụng...",
    image:
      "https://www.prudential.com.vn/export/sites/prudential-vn/vi/.thu-vien/hinh-anh/pulse-nhip-song-khoe/song-khoe/2020/suc-khoe-tinh-than/bai-viet-10-bi-quyet-vang-de-co-giac-ngu-sau-desktop-1366x560.png",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [  "Giấc ngủ",
            "Gene CLOCK",
            "Mất ngủ",
            "Sức khỏe tinh thần",
            "Chronotype"],
  },
  {
    id: 8,
    title: "Xét Nghiệm ADN Trong Dinh Dưỡng – Ăn Theo Gen Để Khỏe Mạnh Hơn",
    shortDescription:
      "Tâm lý và hành vi của chúng ta không chỉ được hình thành bởi môi trường mà còn chịu ảnh hưởng mạnh mẽ từ yếu tố di truyền. Xét nghiệm ADN tâm lý giúp bạn hiểu rõ về đặc điểm tính cách bẩm sinh, khả năng quản lý cảm xúc...",
    image:
      "https://genplus.vn/wp-content/uploads/2022/07/xet-nghiem-adn-bang-nuoc-bot-4.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [  "Dinh dưỡng cá nhân hóa",
            "Gene và thực phẩm",
            "Ăn theo ADN",
            "Sức khỏe tiêu hóa",
            "Vitamin và gen"],
  },
  {
    id: 9,
    title: "ADN Và Thuốc  Liệu Trình Cá Nhân Hóa Dựa Trên Gene",
    shortDescription:
      "Giấc ngủ chất lượng là nền tảng của sức khỏe tổng thể, nhưng không phải ai cũng có thể ngủ ngon tự nhiên. Xét nghiệm ADN giấc ngủ giúp bạn hiểu rõ đồng hồ sinh học cá nhân, khuynh hướng chronotype và các yếu tố di truyền ảnh hưởng đến chất lượng giấc ngủ...",
    image:
      "https://trungtamadn.com/wp-content/uploads/2024/05/Giai-trinh-tu-gen-4.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [  "ADN và thuốc",
            "Cá nhân hóa điều trị",
            "Dược di truyền",
            "Tác dụng phụ thuốc",
            "CYP gene"],
  },
  {
    id: 10,
    title: "ADN Và Tâm Lý – Hiểu Bản Thân Từ Di Truyền Cảm Xúc",
    shortDescription:
      "Quá trình lão hóa không chỉ phụ thuộc vào thời gian mà còn bị ảnh hưởng mạnh mẽ bởi yếu tố di truyền. Xét nghiệm ADN lão hóa giúp bạn hiểu rõ tốc độ lão hóa cá nhân, khả năng chống oxy hóa, độ dài telomere và các yếu tố di truyền khác ảnh hưởng đến tuổi thọ...",
    image:
      "https://th.bing.com/th/id/OIP.7OOnsGlwLRKYNKMpL3BAIQHaGJ?r=0&o=7rm=3&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [    "Sức khỏe tinh thần",
            "Gen tâm lý",
            "Trầm cảm di truyền",
            "Tính cách di truyền",
            "Stress và ADN"],
  }

];



const relatedArticles = [
  {
    id: 7,
    title: "5 Điều Bất Ngờ ADN Có Thể Tiết Lộ Về Bạn",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2025/02/5-Dieu-Bat-Ngo-ADN-Co-The-Tiet-Lo-Ve-Ban-thumb-80x80.jpg.webp",
    publishDate: "2024-01-14",
  },
  {
    id: 8,
    title: "Top 5 Loại Xét Nghiệm ADN Thú Cưng Đang Được Yêu Thích",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2025/02/Top-5-Loai-Xet-Nghiem-ADN-Thu-Cung-Dang-Duoc-Yeu-Thich-80x80.jpg.webp",
    publishDate: "2024-01-13",
  },
  {
    id: 9,
    title: "10 Lời Khuyên Sống Khỏe Dựa Trên Kết Quả Xét Nghiệm ADN",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2025/02/10-Loi-Khuyen-Song-Khoe-Dua-Tren-Ket-Qua-Xet-Nghiem-ADN-thumb-80x80.jpg.webp",
    publishDate: "2024-01-11",
  },
  {
    id: 10,
    title: "5 Sai Lầm Thường Gặp Khi Chọn Trung Tâm Xét Nghiệm ADN",
    image:
      "https://vietcarelab.vn/wp-content/smush-webp/2025/02/5-Sai-Lam-Thuong-Gap-Khi-Chon-Trung-Tam-Xet-Nghiem-ADN-thumb-80x80.jpg.webp",
    publishDate: "2024-01-09",
  },
];

const allTags = [
  "ADN",
  "Di truyền",
  "Sức khỏe",
  "Xét nghiệm",
  "Công nghệ",
  "Khám phá",
  "Thú cưng",
  "Tính cách",
  "Hướng dẫn",
  "So sánh",
  "Dinh dưỡng",
  "Bảo mật",
  "Quyền riêng tư",
  "Phòng ngừa",
  "Quản lý",
];

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
    apiService.getBlogCategoryCount && apiService.getBlogCategoryCount().then(res => {
      setCategoryCounts(res.data || {});
    });
  };
  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  // Gọi lại khi articles thay đổi (sau khi thêm/xóa/cập nhật blog)
  useEffect(() => {
    fetchCategoryCounts();
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
      .catch(() => {
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
        style={{
          height: "48vh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          backgroundImage: "linear-gradient(rgba(0, 32, 96, 0.55), rgba(0, 32, 96, 0.55)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          position: "relative",
        }}
      >
        <div style={{
          maxWidth: "1280px",
          width: "100%",
          color: "#ffffff",
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
