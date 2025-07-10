import { useState, useEffect } from "react";

import ArticleList from "./article-list.jsx";
import Pagination from "./pagination.jsx";
import "./dnapost.css";

import Footer from "../Footer.jsx";

// Mock data
const mockArticles = [
  {
    id: 1,
    title: "Xét Nghiệm ADN Toàn Diện - Giải Mã Bí Mật Di Truyền Của Bạn",
    shortDescription:
      "Xét nghiệm ADN toàn diện là phương pháp phân tích gen hiện đại nhất, giúp khám phá những thông tin quý giá về sức khỏe, nguồn gốc và đặc điểm cá nhân của bạn. Từ việc dự đoán nguy cơ bệnh lý di truyền đến tối ưu hóa chế độ ăn uống và luyện tập, xét nghiệm ADN mang đến cái nhìn sâu sắc về bản thân để bạn có thể đưa ra những quyết định sáng suốt cho cuộc sống.",
    image:
      "https://th.bing.com/th/id/OIP.cNWCRe9etioYb-OCXPIaKQHaEM?r=0&o=7rm=3&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "Xét nghiệm ADN",
      "Sức khỏe cá nhân hóa",
      "Y học chính xác",
      "Phân tích gen",
      "Vietcare"
    ],
  },
  {
    id: 2,
    title: "Xét Nghiệm ADN Nguồn Gốc - Tìm Hiểu Tổ Tiên Của Bạn",
    shortDescription:
      "Chế độ ăn uống phù hợp không chỉ dựa vào sở thích hay xu hướng, mà còn chịu ảnh hưởng mạnh mẽ bởi yếu tố di truyền. Các xét nghiệm ADN ngày nay có thể chỉ ra cách cơ thể bạn chuyển hóa chất béo, đường, caffeine hay gluten – từ đó giúp cá nhân hóa dinh dưỡng để sống khỏe mạnh hơn.",
    image:
      "https://wikigiaidap.net/wp-content/uploads/2022/09/xet-nghiem-adn.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN nguồn gốc",
      "Tổ tiên",
      "Haplogroup",
      "Dân tộc học",
      "Lịch sử gia đình"
    ],
  },
  {
    id: 3,
    title: "Xét Nghiệm ADN Sức Khỏe - Phòng Ngừa Bệnh Từ Sớm",
    shortDescription:
      "Phòng bệnh hơn chữa bệnh - nguyên tắc vàng của y học hiện đại. Xét nghiệm ADN sức khỏe giúp bạn phát hiện sớm nguy cơ mắc các bệnh lý di truyền, từ đó có kế hoạch phòng ngừa và theo dõi sức khỏe phù hợp. Đây là bước đi thông minh trong việc chăm sóc sức khỏe chủ động, giúp bạn sống lâu hơn và khỏe mạnh hơn.",
    image:
      "https://genplus.vn/wp-content/uploads/2022/11/xet-nghiem-adn-quang-binh-7.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN sức khỏe",
      "Phòng ngừa bệnh",
      "Y học dự đoán",
      "Sàng lọc gen",
      "Chăm sóc sức khỏe"
    ],
  },
  {
    id: 4,
    title: "Xét Nghiệm ADN Cho Trẻ Em - Định Hướng Phát Triển Từ Sớm",
    shortDescription:
      "Xét nghiệm ADN cho trẻ em mở ra cánh cửa hiểu biết sâu sắc về tiềm năng và đặc điểm bẩm sinh của con bạn. Từ việc phát hiện tài năng thiên bẩm, đánh giá nguy cơ sức khỏe đến thiết kế chương trình giáo dục phù hợp...",
    image:
      "https://vinmec-prod.s3.amazonaws.com/images/20190822_085237_833968_xet-nghiem-gen.max-1800x1800.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: ["ADN trẻ em",
      "Tài năng bẩm sinh",
      "Giáo dục cá nhân hóa",
      "Sức khỏe trẻ em",
      "Phát triển trẻ em"
    ],
  },
  {
    id: 5,
    title: "Xét Nghiệm ADN Thể Thao - Khám Phá Tiềm Năng Vận Động",
    shortDescription:
      "Mỗi người sinh ra đều có những ưu thế thể chất khác nhau được quy định bởi gene. Xét nghiệm ADN thể thao giúp bạn hiểu rõ khả năng vận động bẩm sinh, từ sức mạnh, sức bền đến tốc độ phục hồi và nguy cơ chấn thương. Với thông tin này, bạn có thể lựa chọn môn thể thao phù hợp, thiết kế chương trình tập luyện hiệu quả và đạt được thành tích tối ưu nhất.",
    image:
      "https://vpgdadnnghean.com/wp-content/uploads/2018/01/xet-nghiem-adn-nghe-an.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN thể thao",
      "Gene ACTN3",
      "Hiệu suất vận động",
      "Huấn luyện cá nhân hóa",
      "Phòng chấn thương"
    ],
  },
  {
    id: 6,
    title: "Xét Nghiệm ADN Dinh Dưỡng - Ăn Uống Thông Minh",
    shortDescription:
      "Không có chế độ ăn nào phù hợp với tất cả mọi người. Xét nghiệm ADN dinh dưỡng giúp bạn hiểu cách cơ thể chuyển hóa các chất dinh dưỡng, phản ứng với thực phẩm và nhu cầu vitamin cá nhân...",
    image:
      "https://ihs.org.vn/wp-content/uploads/2020/05/xet-nghiem-adn-2.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN dinh dưỡng",
      "Nutrigenomics",
      "Chế độ ăn cá nhân hóa",
      "Kiểm soát cân nặng",
      "Sức khỏe tiêu hóa"
    ],
  },
  {
    id: 7,
    title: "Xét Nghiệm ADN Dược Phẩm - An Toàn Trong Điều Trị",
    shortDescription:
      "Mỗi người phản ứng khác nhau với cùng một loại thuốc do sự khác biệt về gene. Xét nghiệm ADN dược phẩm (pharmacogenomics) giúp dự đoán hiệu quả và tác dụng phụ của thuốc trước khi sử dụng...",
    image:
      "https://genplus.vn/wp-content/uploads/2022/11/xet-nghiem-adn-ha-tinh-4.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN dược phẩm",
      "Pharmacogenomics",
      "An toàn thuốc",
      "Y học cá nhân hóa",
      "Gene CYP450"
    ],
  },
  {
    id: 8,
    title: "Xét Nghiệm ADN Tâm Lý - Hiểu Bản Thân Từ Gen",
    shortDescription:
      "Tâm lý và hành vi của chúng ta không chỉ được hình thành bởi môi trường mà còn chịu ảnh hưởng mạnh mẽ từ yếu tố di truyền. Xét nghiệm ADN tâm lý giúp bạn hiểu rõ về đặc điểm tính cách bẩm sinh, khả năng quản lý cảm xúc...",
    image:
      "https://vinmec-prod.s3.amazonaws.com/images/20190906_123020_267744_mau-xet-nghiem-adn-2.max-800x800.jpg",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN tâm lý",
      "Tính cách di truyền",
      "Quản lý stress",
      "Phát triển cá nhân",
      "Sức khỏe tinh thần"
    ],
  },
  {
    id: 9,
    title: "Xét Nghiệm ADN Giấc Ngủ - Tối Ưu Hóa Giấc Ngủ",
    shortDescription:
      "Giấc ngủ chất lượng là nền tảng của sức khỏe tổng thể, nhưng không phải ai cũng có thể ngủ ngon tự nhiên. Xét nghiệm ADN giấc ngủ giúp bạn hiểu rõ đồng hồ sinh học cá nhân, khuynh hướng chronotype và các yếu tố di truyền ảnh hưởng đến chất lượng giấc ngủ...",
    image:
      "https://gentis.vn/wp-content/uploads/2021/01/di-xet-nghiem-adn-645x421-1-613x400.png",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: ["ADN giấc ngủ",
      "Circadian rhythm",
      "Chronotype",
      "Chất lượng giấc ngủ",
      "Đồng hồ sinh học"
    ],
  },
  {
    id: 10,
    title: "Xét Nghiệm ADN Lão Hóa - Duy Trì Tuổi Xuân",
    shortDescription:
      "Quá trình lão hóa không chỉ phụ thuộc vào thời gian mà còn bị ảnh hưởng mạnh mẽ bởi yếu tố di truyền. Xét nghiệm ADN lão hóa giúp bạn hiểu rõ tốc độ lão hóa cá nhân, khả năng chống oxy hóa, độ dài telomere và các yếu tố di truyền khác ảnh hưởng đến tuổi thọ...",
    image:
      "https://th.bing.com/th/id/OIP.AJ0fesf-0nIZ-CQkysu9bwHaE2?r=0&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3",
    publishDate: "2025-06-27",
    author: "Vietcare",
    comments: 0,
    tags: [
      "ADN lão hóa",
      "Chống lão hóa",
      "Telomere",
      "Tuổi thọ",
      "Sức khỏe tuổi già"
    ],
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const articlesPerPage = 5;

  const categories = [
    { id: "all", name: "Tất cả", icon: "📋", count: mockArticles.length },
    { id: "adn", name: "Xét nghiệm ADN", icon: "🧬", count: 8 },
    { id: "health", name: "Sức khỏe", icon: "💊", count: 5 },
    { id: "tech", name: "Công nghệ", icon: "🔬", count: 6 },
    { id: "guide", name: "Hướng dẫn", icon: "📚", count: 4 },
  ];

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" ||
      article.tags.some(tag => {
        switch (selectedCategory) {
          case "adn": return tag.toLowerCase().includes("adn") || tag.toLowerCase().includes("gen");
          case "health": return tag.toLowerCase().includes("sức khỏe") || tag.toLowerCase().includes("bệnh");
          case "tech": return tag.toLowerCase().includes("công nghệ") || tag.toLowerCase().includes("phân tích");
          case "guide": return tag.toLowerCase().includes("hướng dẫn") || tag.toLowerCase().includes("cách");
          default: return true;
        }
      });

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handleCategoryChange = (categoryId) => {
    setIsLoading(true);
    setSelectedCategory(categoryId);
    setCurrentPage(1);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div>
   

      <section
        className="hero-section"
        style={{
          height: "50vh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://vietcarelab.vn/wp-content/uploads/2023/03/3.jpg)",
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
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            KIẾN THỨC CHUYÊN MÔN
          </h2>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 24px 0",
            lineHeight: "1.2"
          }}>
            TIN TỨC & <span style={{ color: "#f59e0b", fontWeight: "800" }}>BÀI VIẾT</span>
          </h1>
          <p style={{
            fontSize: "1.2rem",
            margin: "0 0 24px 0",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "500"
          }}>
            Khám phá những kiến thức mới nhất về xét nghiệm ADN và di truyền học
          </p>
          {/* <Breadcrumb /> */}
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
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải bài viết...</p>
                </div>
              ) : (
                <ArticleList articles={currentArticles} />
              )}

              {/* Pagination */}
              {!isLoading && filteredArticles.length > 0 && (
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
                <div className="related-articles-list">
                  {relatedArticles.map((article, index) => (
                    <div key={article.id} className="related-article-item">
                      <div className="related-article-image">
                        <img src={article.image} alt={article.title} />
                      </div>
                      <div className="related-article-content">
                        <h4 className="related-article-title">{article.title}</h4>
                        <span className="related-article-date">{article.publishDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Thẻ phổ biến</h3>
                <div className="tags-cloud">
                  {allTags.slice(0, 10).map((tag, index) => (
                    <button
                      key={index}
                      className="tag-button"
                      onClick={() => handleSearchChange(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="sidebar-widget newsletter-widget" style={{ padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)", marginTop: "24px" }}>
                <h3 className="widget-title">Đăng ký nhận tin</h3>
                <p className="newsletter-description">
                  Nhận những tin tức mới nhất về xét nghiệm ADN và sức khỏe
                </p>
                <div className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="newsletter-input"
                  />
                  <button className="newsletter-button">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>

  );
}
